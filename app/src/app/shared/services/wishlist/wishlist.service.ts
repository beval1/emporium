import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { firstValueFrom, Observable, of, map } from 'rxjs';
import { NotificationsService } from 'src/app/notification/services/notifications.service';
import { IProduct } from '../../interfaces/IProduct';
import { IUser } from '../../interfaces/IUser';
import { LoaderService } from '../loader/loader.service';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  wishlist: string[] = [];

  constructor(
    private fireStore: AngularFirestore,
    private notificationService: NotificationsService,
    private loaderService: LoaderService
  ) {
    let wishlist = localStorage.getItem('wishlist');
    if (wishlist) {
      this.wishlist = JSON.parse(wishlist);
    }
  }

  async addToWishlist(user: IUser | null, productId: string) {
    this.loaderService.show();
    console.log(`user: ${user}`);
    if (user) {
      await this.fireStore
        .collection(`users/${user?.uid}/wishlist`)
        .doc(productId)
        .set({ productId: productId })
        .then(() =>
          this.notificationService.showSuccess('Product Added to Favourites!')
        )
        .catch((error) => this.notificationService.showError(error));
    } else {
      let alreadyAdded = this.wishlist.some((pId) => pId == productId);
      console.log(`already added ${alreadyAdded}`);
      if (!alreadyAdded) {
        this.wishlist.push(productId);
        localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
        this.notificationService.showSuccess('Product Added to Favourites!');
      }
    }
    this.loaderService.hide();
  }

  async deleteFromWishlist(user: IUser | null, productId: string) {
    this.loaderService.show();
    if (user) {
      await this.fireStore
        .collection(`users/${user?.uid}/wishlist`)
        .doc(productId)
        .delete()
        .catch((error) => this.notificationService.showError(error));
    } else {
      let product = this.wishlist.filter((pId) => pId == productId);
      if (product[0]) {
        this.wishlist.splice(this.wishlist.indexOf(product[0]), 1);
        localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
      }
    }
    this.loaderService.hide();
  }

  getWishlistProductIds(user: IUser | null): Observable<string[]> {
    if (user) {
      let productIds: string[] = [];
      return this.fireStore
        .collection<any>(`users/${user?.uid}/wishlist`)
        .valueChanges()
        .pipe(
          map((products: any[]) => {
            // console.log(products)
            return Array.from(products.map((p: any) => p.productId))
          })
        );
    } else {
      // console.log(this.wishlist);
      return of(this.wishlist);
    }
  }

  async getWishlistProductObjects(productIds: string[]): Promise<IProduct[]> {
    if (productIds.length > 0){
    console.log(`Favourites: ${productIds}`);
    return await firstValueFrom(this.fireStore
      .collection<IProduct>(`products`, (ref) =>
        ref.where('uid', 'in', productIds)
      )
      .valueChanges());
    } else {
      return [];
    }
  }

}
