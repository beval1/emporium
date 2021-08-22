import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { hasFieldError, validateAllFormFields } from 'src/app/shared/utils/validate';
import { faKey, faUser } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../auth-components.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  serviceError: string;
  hasFieldError = hasFieldError;
  faUser = faUser;
  faKey = faKey;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.serviceError = '';
    this.loginForm = this.fb.group({
        email: ['', [Validators.required]], //no need for email validation here... 
        password: ['', [Validators.required]]
      });
  }

  ngOnInit(): void {}

  loginHandler(): void {
    if (this.loginForm.invalid || this.loginForm.pending) {
      validateAllFormFields(this.loginForm);
      return;
    }

    console.log("submitted login")

    this.serviceError = '';

    const { email, password } = this.loginForm.value;

    this.authService
      .signIn(email, password)
      .catch((error) => {
        console.log(error.message)
        this.serviceError = error.message
      });
  }
}
