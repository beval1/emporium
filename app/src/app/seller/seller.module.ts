import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateEditProductComponent } from './create-edit-product/create-edit-product.component';
import { AllProductsComponent } from './all-products/all-products.component';
import { SellerDashboardComponent } from './seller-dashboard/seller-dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SellerAsideComponent } from './seller-aside/seller-aside.component';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



@NgModule({
  declarations: [
    CreateEditProductComponent,
    AllProductsComponent,
    SellerDashboardComponent,
    SellerAsideComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule,
  ]
})
export class SellerModule { }
