import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  constructor() {}

  isEmpty(control: AbstractControl): ValidationErrors | null {
    const value = control.value?.toString().trim(); // Ensure it's a trimmed string
    return !value ? { InvalidValue: true } : null;
  }

  noSpace(control: AbstractControl): ValidationErrors | null {
    const value = control.value?.toString(); // Ensure it's a string
    const regex = /^[^\s].*$/; // Matches strings that do not start with a space
    return value && !regex.test(value) ? { hasSpace: true } : null;
  }

  isEmail(control: AbstractControl){
    const value = control.value;
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!value.match(regex)){
      return { invalidEmail: true }
    }
    return null;
  };
}
