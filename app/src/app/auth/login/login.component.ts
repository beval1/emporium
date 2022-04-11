import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { hasFieldError, validateAllFormFields } from 'src/app/shared/utils/validate';
import { faKey, faUser } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';


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
  closeResult = '';
  @ViewChild('content') private content: any;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private modalService: NgbModal) {
    this.serviceError = '';
    this.loginForm = this.fb.group({
        email: ['', [Validators.required]], //no need for email validation here... 
        password: ['', [Validators.required]]
      });
      
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.open(this.content);
  }

  loginHandler() {
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
      })   
    this.modalService.dismissAll()
  }

  open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'log-in', windowClass: 'login-modal', centered: true}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
