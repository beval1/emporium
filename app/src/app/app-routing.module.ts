import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { ManageCategoriesComponent } from './admin/manage-categories/manage-categories.component';
import { ManageSellersComponent } from './admin/manage-sellers/manage-sellers.component';
import { ManageSpecificationsComponent } from './admin/manage-specifications/manage-specifications.component';
import { ManageSubcategoriesComponent } from './admin/manage-subcategories/manage-subcategories.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { RegistrationCompletedComponent } from './pages/registration-completed/registration-completed.component';
import { AddProductComponent } from './seller/add-product/add-product.component';
import { AllProductsComponent } from './seller/all-products/all-products.component';
import { SellerDashboardComponent } from './seller/seller-dashboard/seller-dashboard.component';
import { AdminGuard } from './shared/guards/admin.guard';
import { GuestGuard } from './shared/guards/guest.guard';
import { LoggedGuard } from './shared/guards/logged.guard';
import { SellerGuard } from './shared/guards/seller.guard';
import { UserGuard } from './shared/guards/user.guard';
import { ProfileComponent } from './user/profile/profile.component';
import { WishlistComponent } from './wishlist/wishlist.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [GuestGuard]},
  { path: 'register', component: RegisterComponent, canActivate: [GuestGuard]},
  //User
  { path: 'user/profile', component: ProfileComponent, canActivate: [LoggedGuard, UserGuard]},
  { path: 'user/favourites', component: WishlistComponent}, //no guard for the whishlist
  //{ path: 'cart', component: CartComponent}, //no guard for the cart
  //Admin
  { path: 'admin', component: DashboardComponent, canActivate: [LoggedGuard, AdminGuard]},
  { path: 'admin/manage-categories', component: ManageCategoriesComponent, canActivate: [LoggedGuard, AdminGuard]},
  { path: 'admin/manage-subcategories', component: ManageSubcategoriesComponent, canActivate: [LoggedGuard, AdminGuard]},
  { path: 'admin/manage-specifications', component: ManageSpecificationsComponent, canActivate: [LoggedGuard, AdminGuard]},
  { path: 'admin/manage-sellers', component: ManageSellersComponent, canActivate: [LoggedGuard, AdminGuard]},
  //Seller
  { path: 'seller/dashboard', component: SellerDashboardComponent, canActivate: [LoggedGuard, SellerGuard]},
  { path: 'seller/add-product', component: AddProductComponent, canActivate: [LoggedGuard, SellerGuard]},
  { path: 'seller/all-products', component: AllProductsComponent, canActivate: [LoggedGuard, SellerGuard]},
  { path: 'registration-completed', component: RegistrationCompletedComponent},
  { path: '404', component: NotFoundComponent, pathMatch: 'full' },
  { path: '**', redirectTo: '404' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
