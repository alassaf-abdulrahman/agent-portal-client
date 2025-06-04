import { Component, inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RegistrationService } from '../../services/registration.service';
import { Validators } from '@angular/forms';
import { RegistrationApiService } from '../../services/registration-api.service';

import countriesEn from '../../../assets/countries-en.json';
import countriesAr from '../../../assets/countries-ar.json';
import nationalitiesEn from '../../../assets/nationalities-en.json';
import nationalitiesAr from '../../../assets/nationalities-ar.json';

@Component({
  selector: 'app-registration-form',
  standalone: false,
  templateUrl: './registration-form.component.html',
  styleUrl: './registration-form.component.css'
})
export class RegistrationFormComponent implements OnInit {
  registrationService = inject(RegistrationService);
  registrationApiService = inject(RegistrationApiService);
  translate = inject(TranslateService);
  registrationFrom = this.registrationService.createForm();
  nationalities = nationalitiesEn;
  countries = countriesEn;
  passwordMismatch = false;
  selectedFiles: File[] = [];
  showSummary = false;
  fileErrorMessage = '';
  formData = new FormData();
  termsAccepted = false;
  minDate = new Date().toISOString().split('T')[0];

  ngOnInit(): void {
    this.registrationFrom.get('agentType')?.valueChanges.subscribe(value => {
      const companyName = this.registrationFrom.get('companyName');
      const personInCharge = this.registrationFrom.get('personInCharge');

      if (value === 'Company') {
        companyName?.setValidators([Validators.required, Validators.maxLength(255)]);
        personInCharge?.setValidators([Validators.required, Validators.maxLength(255)]);
      } else {
        companyName?.clearValidators();
        personInCharge?.clearValidators();
      }

      companyName?.updateValueAndValidity();
      personInCharge?.updateValueAndValidity();
    });

    this.registrationFrom.get('isForeignerInMalaysia')?.valueChanges.subscribe(value => {
      const visaType = this.registrationFrom.get('visaType');
      const visaExpiryDate = this.registrationFrom.get('visaExpiryDate');
      const lastArrivalDate = this.registrationFrom.get('lastArrivalDate');

      if (value === 'true') {
        visaType?.setValidators([Validators.required]);
        visaExpiryDate?.setValidators([Validators.required]);
        lastArrivalDate?.setValidators([this.registrationService.noFutureDateValidator, Validators.required]);
      } else {
        visaType?.clearValidators();
        visaExpiryDate?.clearValidators();
        lastArrivalDate?.clearValidators();
      }

      visaType?.updateValueAndValidity();
      visaExpiryDate?.updateValueAndValidity();
      lastArrivalDate?.updateValueAndValidity();
    });

    const currentLang = this.translate.currentLang || this.translate.getDefaultLang();
    this.updateLocalizedLists(currentLang);

    this.translate.onLangChange.subscribe(event => {
      this.updateLocalizedLists(event.lang);
    });
  }

  updateLocalizedLists(lang: string) {
    this.countries = lang === 'ar' ? countriesAr : countriesEn;
    this.nationalities = lang === 'ar' ? nationalitiesAr : nationalitiesEn;
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);
      const invalidFiles = files.filter(file => file.name.length > 100);
      if (invalidFiles.length > 0) {
        this.fileErrorMessage = this.translate.instant('registration.errors.filename_too_long');
        this.selectedFiles = [];
        return;
      }

      const allowedExtensions = ['doc', 'docx', 'xls', 'xlsx', 'pdf', 'jpg', 'jpeg', 'gif', 'png', 'ppt', 'bmp', 'zip'];
      const invalidExtensionFiles = files.filter(file => {
        const extension = file.name.split('.').pop()?.toLowerCase();
        return !extension || !allowedExtensions.includes(extension);
      });

      if (invalidExtensionFiles.length > 0) {
        this.fileErrorMessage = this.translate.instant('registration.errors.invalid_file_type');
        this.selectedFiles = [];
        return;
      }

      this.selectedFiles = files;
      this.fileErrorMessage = '';
    } else {
      this.selectedFiles = [];
      this.fileErrorMessage = this.translate.instant('registration.errors.no_files_selected');
    }
  }

  onNext(): void {
    // Now mark all as touched
    this.registrationFrom.markAllAsTouched();

    if (this.selectedFiles.length === 0) {
      this.fileErrorMessage = this.translate.instant('registration.errors.no_files_selected');
      return;
    }

    if (this.registrationFrom.invalid) return;

    Object.entries(this.registrationFrom.value).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        this.formData.append(key, String(value));
      }
    });

    this.selectedFiles.forEach(file => {
      this.formData.append('documents[]', file);
    });

    this.showSummary = true;
  }


  getError(controlName: string): string | null {
    const control = this.registrationFrom.get(controlName);
    if (!control || !control.errors || !control.touched) return null;

    if (control.errors['required']) return this.translate.instant('registration.errors.required');
    if (control.errors['maxlength']) return this.translate.instant('registration.errors.maxlength');
    if (control.errors['email']) return this.translate.instant('registration.errors.email_invalid');
    if (control.errors['minlength']) return this.translate.instant('registration.errors.password_min');
    if (control.errors['dateInPast']) return this.translate.instant('registration.errors.visa_expiry_past');
    if (control.errors['dateInFuture']) return this.translate.instant('registration.errors.date_in_future');

    return null;
  }

  getSummaryFields(): { label: string; value: any }[] {
    const controls = this.registrationFrom.controls;

    const fieldLabels: { [key: string]: string } = {
      agentType: 'registration.agent_type',
      name: 'registration.name',
      companyName: 'registration.company_name',
      personInCharge: 'registration.person_in_charge',
      nationality: 'registration.nationality',
      residenceCountry: 'registration.residence_country',
      isForeignerInMalaysia: 'registration.foreigner_in_malaysia',
      visaType: 'registration.visa_type',
      visaExpiryDate: 'registration.visa_expiry_date',
      lastArrivalDate: 'registration.last_arrival_date',
      address: 'registration.address',
      icNumber: 'registration.ic_number',
      mobileNumber: 'registration.mobile_number',
      phoneNumber: 'registration.phone_number',
      email: 'registration.email',
      bankAccountNumber: 'registration.bank_account_number',
      bankName: 'registration.bank_name',
      swiftCode: 'registration.swift_code'
    };

    return Object.keys(controls)
      .filter(key => key !== 'password' && key !== 'confirmedPassword')
      .filter(key => controls[key]?.value)
      .map(key => {
        let value = controls[key]?.value;

        if (key === 'nationality') {
          const item = this.nationalities.find(n => n.countryCode === value);
          value = item?.nationalityName || value;
        } else if (key === 'residenceCountry') {
          const item = this.countries.find(c => c.countryCode === value);
          value = item?.countryName || value;
        } else if (key === 'agentType') {
          value = this.translate.instant(`registration.${value.toLowerCase()}_agent_type`);
        } else if (key === 'isForeignerInMalaysia') {
          value = this.translate.instant(value === 'true' ? 'registration.yes' : 'registration.no');
        } else if (key === 'visaType') {
          value = this.translate.instant(`registration.visa_types.${value}`);
        }

        return {
          label: this.translate.instant(fieldLabels[key] || key),
          value
        };
      });
  }


  onBack(): void {
    this.showSummary = false;
  }

  onSubmit(): void {
    this.registrationApiService.submitForm(this.formData);
  }
}
