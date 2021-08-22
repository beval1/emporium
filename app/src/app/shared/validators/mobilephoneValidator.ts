import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const validatePhone: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const regularExpression = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  const validPhone = regularExpression.test(control.value);
  return validPhone ? null : { invalidPhone: true };
}
