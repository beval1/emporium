import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";


export const samePasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const pass = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  console.log(pass)
  console.log(confirmPassword)

  return pass === confirmPassword ? null: { notSame: true };
};