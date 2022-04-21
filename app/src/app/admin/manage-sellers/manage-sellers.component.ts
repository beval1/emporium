import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { IUser } from 'src/app/shared/interfaces/IUser';

@Component({
  selector: 'app-manage-sellers',
  templateUrl: './manage-sellers.component.html',
  styleUrls: ['./manage-sellers.component.scss']
})
export class ManageSellersComponent implements OnInit, OnDestroy {
  sellers: IUser[] = [];
  searchValue: string = '';
  subscriptions: Subscription[] = []

  constructor(private authService: AuthService) {
    this.subscriptions.push(authService.getAllSellers().subscribe((sellers: IUser[]) => {
      this.sellers = sellers;
    }))
  }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onBan(seller: IUser){
    this.authService.updateUserStatus(seller.uid, 'banned')
  }
  onApprove(seller: IUser) {
    this.authService.updateUserStatus(seller.uid, 'active')
  }

  onChange() {
    console.log(this.searchValue);

    this.subscriptions.push(this.authService
    .getAllSellers(this.searchValue)
    .subscribe((sellers: IUser[]) => {
      this.sellers = sellers;
    }));
  }

}
