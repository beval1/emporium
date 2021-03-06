import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module'

import { AngularFireModule } from '@angular/fire/compat'
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment.prod';

import { HomeComponent } from './pages/home/home.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { RegistrationCompletedComponent } from './pages/registration-completed/registration-completed.component';
import { AdminModule } from './admin/admin.module';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { NotificationModule } from './notification/notification.module';
import { CategoriesComponent } from './pages/categories/categories.component';
import { SubcategoriesComponent } from './pages/subcategories/subcategories.component';
import { SellerModule } from './seller/seller.module';

import { LoaderService } from './shared/services/loader/loader.service';
import { LoaderInterceptor } from './shared/interceptors/loader/loader.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SubcategoryProductsComponent } from './pages/subcategory-products/subcategory-products.component';
import { UserModule } from './user/user.module';
import { CartComponent } from './cart/cart.component';


@NgModule({
  declarations: [	
    AppComponent,
    HomeComponent,
    NotFoundComponent,
    RegistrationCompletedComponent,
    ProductDetailsComponent,
    WishlistComponent,
    CategoriesComponent,
    SubcategoriesComponent,
    SubcategoryProductsComponent,
      CartComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CoreModule,
    AuthModule,
    AdminModule,
    SellerModule,
    UserModule,
    SharedModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    NgbModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    NotificationModule
  ],
  providers: [LoaderService, { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
