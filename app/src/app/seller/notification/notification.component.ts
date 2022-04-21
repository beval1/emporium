import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { IUser } from 'src/app/shared/interfaces/IUser';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  seller: IUser | null = null;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.seller = this.authService.getCurrentUserObject();
    // console.log(this.seller)
  }

}
