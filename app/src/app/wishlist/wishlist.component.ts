import { Component, OnDestroy, OnInit } from '@angular/core';
import { firstValueFrom, Subscription } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';
import { IProduct } from '../shared/interfaces/IProduct';
import { IUser } from '../shared/interfaces/IUser';
import { ProductService } from '../shared/services/product/product.service';
import { WishlistService } from '../shared/services/wishlist/wishlist.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
})
export class WishlistComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  likedProductIds: string[] = [];
  likedProducts: IProduct[] = [];
  user: IUser | null = null;

  constructor(
    private wishlistService: WishlistService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUserObject();
    // this.wishlistService.getWishlistProductIds(this.user).then((productIds) => {
    //   if (productIds) {
    //     this.subscriptions.push(
    //       this.wishlistService
    //         .getWishlistProductObjects(productIds)
    //         .subscribe((products: IProduct[]) => {
    //           this.likedProducts = products;
    //         })
    //     );
    //   }
    // });
    this.subscriptions.push(
      this.wishlistService
        .getWishlistProductIds(this.user)
        .subscribe((productIds: any[]) => {
          this.likedProductIds = productIds;
          console.log(`ProductIds: ${productIds}`);

          this.wishlistService
            .getWishlistProductObjects(this.likedProductIds)
            .then((products: IProduct[]) => {
              this.likedProducts = products;
              console.log(this.likedProducts);
            });
        })
    );
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  onDelete(product: IProduct) {
    this.wishlistService.deleteFromWishlist(this.user, product.uid);
  }
}
