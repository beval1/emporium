import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddProductComponent } from './add-product/add-product.component';
import { AllProductsComponent } from './all-products/all-products.component';
import { SellerDashboardComponent } from './seller-dashboard/seller-dashboard.component';



@NgModule({
  declarations: [
    AddProductComponent,
    AllProductsComponent,
    SellerDashboardComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SellerModule { }
