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
import { CreateEditProductComponent } from './seller/create-edit-product/create-edit-product.component';
import { AllProductsComponent } from './seller/all-products/all-products.component';
import { SellerDashboardComponent } from './seller/seller-dashboard/seller-dashboard.component';
import { AdminGuard } from './shared/guards/admin.guard';
import { GuestGuard } from './shared/guards/guest.guard';
import { LoggedGuard } from './shared/guards/logged.guard';
import { SellerGuard } from './shared/guards/seller.guard';
import { UserGuard } from './shared/guards/user.guard';
import { ProfileComponent } from './user/profile/profile.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { SubcategoriesComponent } from './pages/subcategories/subcategories.component';
import { RegisterSellerComponent } from './auth/register-seller/register-seller.component';
import { SubcategoryProductsComponent } from './pages/subcategory-products/subcategory-products.component';
import { ManageProductsComponent } from './admin/manage-products/manage-products.component';
import { PendingOrdersComponent } from './seller/pending-orders/pending-orders.component';
import { ArchivedOrdersComponent } from './seller/archived-orders/archived-orders.component';
import { ManagePromoCodesComponent } from './seller/manage-promocodes/manage-promocodes.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'categories', component: CategoriesComponent },
  { path: 'categories/:categoryId', component: SubcategoriesComponent, },
  { path: 'subcategories/:subcategoryId', component: SubcategoryProductsComponent, },
  //Auth
  { path: 'login', component: LoginComponent, canActivate: [GuestGuard]},
  { path: 'register', component: RegisterComponent, canActivate: [GuestGuard]},
  { path: 'register-seller', component: RegisterSellerComponent, canActivate: [GuestGuard]},
  { path: 'registration-completed', component: RegistrationCompletedComponent},
  //User
  { path: 'user/profile', component: ProfileComponent, canActivate: [LoggedGuard, UserGuard]},
  { path: 'user/favourites', component: WishlistComponent}, //no guard for the whishlist
  //{ path: 'cart', component: CartComponent}, //no guard for the cart
  //Admin
  { path: 'admin/dashboard', component: DashboardComponent, canActivate: [LoggedGuard, AdminGuard]},
  { path: 'admin/manage-categories', component: ManageCategoriesComponent, canActivate: [LoggedGuard, AdminGuard]},
  { path: 'admin/manage-subcategories', component: ManageSubcategoriesComponent, canActivate: [LoggedGuard, AdminGuard]},
  { path: 'admin/manage-specifications', component: ManageSpecificationsComponent, canActivate: [LoggedGuard, AdminGuard]},
  { path: 'admin/manage-sellers', component: ManageSellersComponent, canActivate: [LoggedGuard, AdminGuard]},
  { path: 'admin/manage-products', component: ManageProductsComponent, canActivate: [LoggedGuard, AdminGuard]},
  //Seller
  { path: 'seller/dashboard', component: SellerDashboardComponent, canActivate: [LoggedGuard, SellerGuard]},
  { path: 'seller/add-product', component: CreateEditProductComponent, canActivate: [LoggedGuard, SellerGuard]},
  { path: 'seller/edit-product/:productId', component: CreateEditProductComponent, canActivate: [LoggedGuard, SellerGuard]},
  { path: 'seller/all-products', component: AllProductsComponent, canActivate: [LoggedGuard, SellerGuard]},
  { path: 'seller/pending-orders', component: PendingOrdersComponent, canActivate: [LoggedGuard, SellerGuard]},
  { path: 'seller/archived-orders', component: ArchivedOrdersComponent, canActivate: [LoggedGuard, SellerGuard]},
  { path: 'seller/manage-promo-codes', component: ManagePromoCodesComponent, canActivate: [LoggedGuard, SellerGuard]},
  { path: '404', component: NotFoundComponent, pathMatch: 'full' },
  { path: '**', redirectTo: '404' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
