import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageCategoriesComponent } from './manage-categories/manage-categories.component';
import { ManageSubcategoriesComponent } from './manage-subcategories/manage-subcategories.component';
import { ManageSpecificationsComponent } from './manage-specifications/manage-specifications.component';
import { ManageSellersComponent } from './manage-sellers/manage-sellers.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { AdminAsideComponent } from './admin-aside/admin-aside.component';
import { RouterModule } from '@angular/router';




@NgModule({
  declarations: [
    DashboardComponent,
    ManageCategoriesComponent,
    ManageSubcategoriesComponent,
    ManageSpecificationsComponent,
    ManageSellersComponent,
    ManageUsersComponent,
    AdminAsideComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
  ]
})
export class AdminModule { }
