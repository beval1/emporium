import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateEditProductComponent } from './create-edit-product/create-edit-product.component';
import { AllProductsComponent } from './all-products/all-products.component';
import { SellerDashboardComponent } from './seller-dashboard/seller-dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SellerAsideComponent } from './seller-aside/seller-aside.component';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NotificationComponent } from './notification/notification.component';
import { ArchivedOrdersComponent } from './archived-orders/archived-orders.component';
import { PendingOrdersComponent } from './pending-orders/pending-orders.component';
import { ManagePromoCodesComponent } from './manage-promocodes/manage-promocodes.component';
import { NgbDropdown, NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    CreateEditProductComponent,
    AllProductsComponent,
    SellerDashboardComponent,
    SellerAsideComponent,
    NotificationComponent,
    ArchivedOrdersComponent,
    PendingOrdersComponent,
    ManagePromoCodesComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule,
    NgbModule,
  ]
})
export class SellerModule { }
