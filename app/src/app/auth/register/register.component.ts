import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { hasFieldError, validateAllFormFields, passwordMissmatch, isFieldTouched, hasAnyError } from 'src/app/shared/utils/validate';
import { validateEmail } from 'src/app/shared/validators/emailValidator';
import { validatePhone } from 'src/app/shared/validators/mobilephoneValidator';
import { samePasswordValidator } from 'src/app/shared/validators/samePasswordValidator';
import { AuthService } from '../auth.service';
import { faUser, faPhone, faEnvelope, faKey} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../auth-components.scss']
})
export class RegisterComponent implements OnInit {
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

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group(
      {
        personalName: ['', [Validators.required, Validators.minLength(3)]],
        mobilePhone: ['', [Validators.required, validatePhone]],
        email: ['', [Validators.required, validateEmail]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: samePasswordValidator }
    );
    this.serviceError = '';
  }

  ngOnInit(): void {}

  registerHandler() {
    if (this.registerForm.invalid || this.registerForm.pending) {
      validateAllFormFields(this.registerForm);
      return;
    }

    this.serviceError = '';

    const email = this.registerForm.get('email')?.value;
    const password = this.registerForm.get('password')?.value;

    this.authService
      .signUp(email, password)
      .catch((error) => {
        this.serviceError = error.message;
        console.log(error.message)
      });
  }
  

}
