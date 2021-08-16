import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { WarrantiesComponent } from './warranties/warranties.component';



@NgModule({
  declarations: [
    ProfileComponent,
    WishlistComponent,
    WarrantiesComponent
  ],
  imports: [
    CommonModule
  ]
})
export class UserModule { }
