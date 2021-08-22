import { FormControl, FormGroup, AbstractControl } from "@angular/forms";

function hasFieldError(formGroup: FormGroup | AbstractControl | null | undefined, field: string, error: string): boolean | undefined {
  return formGroup?.get(field)?.hasError(error) && isFieldTouched(formGroup, field)
}

function hasAnyError(formGroup: FormGroup | AbstractControl | null | undefined, field: string){
  return formGroup?.get(field)?.errors == null ? false : true && isFieldTouched(formGroup, field);
}

function passwordMissmatch(formGroup: FormGroup, error: string) {
  return formGroup.errors?.notSame && (formGroup.touched || formGroup.dirty)
}

function validateAllFormFields(formGroup: FormGroup) 
{
  formGroup.markAllAsTouched();
}

function isFieldTouched(formGroup: FormGroup | AbstractControl | null | undefined, field: string){
  return formGroup?.get(field)?.touched || formGroup?.get(field)?.dirty;
}

export
{
hasFieldError,
validateAllFormFields,
passwordMissmatch,
isFieldTouched,
hasAnyError
}

