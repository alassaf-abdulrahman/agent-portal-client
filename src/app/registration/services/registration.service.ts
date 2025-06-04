import { Injectable } from '@angular/core';
import { FormBuilder, Validators, AbstractControl, ValidationErrors, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  constructor(private fb: FormBuilder) { }

  futureDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate < today ? { dateInPast: true } : null;
  }

  noFutureDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const selected = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selected > today ? { dateInFuture: true } : null;
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmedPassword = control.get('confirmedPassword')?.value;
    if (password && confirmedPassword && password !== confirmedPassword) {
      return { passwordMissmatch: true };
    }
    return null;
  }

  createForm(): FormGroup {
    return this.fb.group({
      agentType: ['', Validators.required],
      name: ['', [Validators.required, Validators.maxLength(255)]],
      companyName: ['', Validators.maxLength(255)],
      personInCharge: ['', Validators.maxLength(255)],
      nationality: ['', Validators.required],
      residenceCountry: ['', Validators.required],
      isForeignerInMalaysia: ['', Validators.required],
      visaType: [''],
      visaExpiryDate: [''],
      lastArrivalDate: ['', [this.noFutureDateValidator]],
      address: ['', [Validators.required, Validators.maxLength(255)]],
      icNumber: ['', [Validators.required, Validators.maxLength(255)]],
      mobileNumber: ['', [Validators.required, Validators.maxLength(255)]],
      phoneNumber: ['', [Validators.required, Validators.maxLength(255)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      bankAccountNumber: ['', [Validators.required, Validators.maxLength(255)]],
      bankName: ['', [Validators.required, Validators.maxLength(255)]],
      swiftCode: ['', [Validators.required, Validators.maxLength(500)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(255)]],
      confirmedPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(255)]],
    }, {
      validators: this.passwordMatchValidator
    });
  }
}
