import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddProductComponent } from './add-product/add-product.component';
import { AllProductsComponent } from './all-products/all-products.component';
import { SellerDashboardComponent } from './seller-dashboard/seller-dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SellerAsideComponent } from './seller-aside/seller-aside.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    AddProductComponent,
    AllProductsComponent,
    SellerDashboardComponent,
    SellerAsideComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class SellerModule { }
