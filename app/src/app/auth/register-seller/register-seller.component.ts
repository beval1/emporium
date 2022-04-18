import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  hasFieldError,
  validateAllFormFields,
  passwordMissmatch,
  isFieldTouched,
  hasAnyError,
} from 'src/app/shared/utils/validate';
import { validateEmail } from 'src/app/shared/validators/emailValidator';
import { validatePhone } from 'src/app/shared/validators/mobilephoneValidator';
import { samePasswordValidator } from 'src/app/shared/validators/samePasswordValidator';
import { AuthService } from '../services/auth.service';
import {
  faUser,
  faPhone,
  faEnvelope,
  faKey,
  faBuilding,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-register-seller',
  templateUrl: './register-seller.component.html',
  styleUrls: ['./register-seller.component.scss'],
})
export class RegisterSellerComponent implements OnInit {
  registerForm: FormGroup;
  hasFieldError = hasFieldError;
  passwordMissmatch = passwordMissmatch;
  isFieldTouched = isFieldTouched;
  hasAnyError = hasAnyError;
  serviceError: string;

  faUser = faUser;
  faPhone = faPhone;
  faEnvelope = faEnvelope;
  faKey = faKey;
  faBuilding = faBuilding;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group(
      {
        // displayName: ['', [Validators.required, Validators.minLength(3)]],
        companyName: ['', [Validators.minLength(3)]],
        // mobilePhone: ['', [Validators.required, validatePhone]],
        email: ['', [Validators.required, validateEmail]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: samePasswordValidator }
    );
    this.serviceError = '';
  }

  ngOnInit() {}

  registerHandler() {
    if (this.registerForm.invalid || this.registerForm.pending) {
      validateAllFormFields(this.registerForm);
      return;
    }

    this.serviceError = '';

    const email = this.registerForm.get('email')?.value;
    const password = this.registerForm.get('password')?.value;
    // const mobilePhone = this.registerForm.get('mobilePhone')?.value;
    // const displayName = this.registerForm.get('displayName')?.value;
    const companyName = this.registerForm.get('companyName')?.value;

    this.authService
      .signUpSeller(email, password, companyName)
      .catch((error) => {
        this.serviceError = error.message;
        console.log(error.message);
      });
  }
}
