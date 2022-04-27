import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';
import { IUser } from 'src/app/shared/interfaces/IUser';
import { validateAllFormFields } from 'src/app/shared/utils/validate';
import { resetForm } from 'src/app/shared/utils/forms';
import { hasAnyError, hasFieldError } from 'src/app/shared/utils/validate';
import { validatePhone } from 'src/app/shared/validators/mobilephoneValidator';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user: IUser | null = null;
  editable: boolean = false;
  editForm: FormGroup;
  fileToUpload: File | null | undefined = null;
  hasAnyError = hasAnyError;
  hasFieldError = hasFieldError;

  constructor(private authService: AuthService, private fb: FormBuilder) {
    this.user = authService.getCurrentUserObject()
    this.editForm = fb.group({
      displayName: [{value: this.user?.displayName, disabled: true}, [Validators.required, Validators.minLength(4)]],
      phoneNumber: [{value: this.user?.phoneNumber, disabled: true}, [Validators.required, validatePhone]],
      email: [{value: this.user?.email, disabled: true}]
    })
  }

  ngOnInit(): void {
  }

  private refreshValues(){
    this.editForm.patchValue({
      displayName: this.user?.displayName,
      phoneNumber: this.user?.phoneNumber,
      email: this.user?.email
    })
  }

  onClickEdit(){
    this.editable = true;
    this.editForm.get('displayName')?.enable();
    this.editForm.get('phoneNumber')?.enable();
  }

  onCancel(){
    this.refreshValues();
    this.editable = false;
  }

  onSubmit() {
    if (this.editForm.invalid || this.editForm.pending) {
      validateAllFormFields(this.editForm);
      return;
    }
    if (!this.user){
      return;
    }

    const displayName = this.editForm.get('displayName')?.value;
    const phoneNumber = this.editForm.get('phoneNumber')?.value;

    this.authService.updateUserData(this.user, displayName, phoneNumber, this.fileToUpload)

    // resetForm(this.editForm);
    this.editable = false;
    this.editForm.disable();
    this.fileToUpload = null;
  }

  onUpload(e: EventTarget | null) {
    const eventAsElement = e as HTMLInputElement;

    if (eventAsElement == null) {
      return;
    }

    this.fileToUpload = eventAsElement.files?.item(0)
  }
}
