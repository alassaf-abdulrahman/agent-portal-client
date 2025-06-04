import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegistrationApiService {

  constructor() { }

  submitForm(formData: FormData): void {
    console.log('Submitting form data: ');
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }
  }
}
