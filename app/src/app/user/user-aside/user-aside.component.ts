import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-aside',
  templateUrl: './user-aside.component.html',
  styleUrls: ['./user-aside.component.scss']
})
export class UserAsideComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) {

  }

  ngOnInit() {}

  signOut(): void {
    this.authService.signOut();
  }

  getCurrentRoute() {
    return this.router.url
  }
}
