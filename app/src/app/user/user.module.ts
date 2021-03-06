import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { WishlistComponent } from '../wishlist/wishlist.component';
import { WarrantiesComponent } from './warranties/warranties.component';
import { UserAsideComponent } from './user-aside/user-aside.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddressesComponent } from './addresses/addresses.component';



@NgModule({
  declarations: [
    ProfileComponent,
    WarrantiesComponent,
    UserAsideComponent,
    AddressesComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class UserModule { }
