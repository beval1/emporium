import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IProduct } from '../../interfaces/IProduct';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Subscription } from 'rxjs';
import { IUser } from '../../interfaces/IUser';
import { WishlistService } from '../../services/wishlist/wishlist.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit, OnDestroy {
  @Input('product') product: IProduct | null = null;
  @Input('liked') liked: boolean = false;
  currentRating: number = 0;
  faHeart = faHeart;
  faHeartSolid = faHeartSolid;
  faCartPlus = faCartPlus;
  productName: string = '';
  productPrice: String[] | undefined = [];
  quantityString: string = '';
  sellerStatus: string = '';
  subscriptions: Subscription[] = [];
  user: IUser | null = null;

  constructor(
    private authService: AuthService,
    private wishlistService: WishlistService
  ) {
    this.user = authService.getCurrentUserObject();
  }

  ngOnInit() {
    if (this.product?.name) {
      if (this.product?.name.length > 63) {
        this.productName = this.product.name.slice(0, 63) + '...';
      } else {
        this.productName = this.product?.name;
      }
    }
    if (this.product?.rating) {
      this.currentRating = Math.round(this.product?.rating);
    } else {
      this.currentRating = 0;
    }
    if (this.product?.quantity) {
      if (this.product?.quantity > 2) {
        this.quantityString = 'In Stock';
      } else if (this.product?.quantity <= 2 && this.product?.quantity > 0) {
        this.quantityString = `Only ${this.product?.quantity} left!`;
      } else {
        this.quantityString = 'Out Of Stock';
      }
    }
    if (this.product?.sellerId) {
      this.authService
        .getSellerById(this.product.sellerId)
        .subscribe((seller: IUser | undefined) => {
          if (seller) {
            this.sellerStatus = seller.status;
          }
        });
    }
    this.productPrice = this.product?.price.toString().split('.');

  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  isActive(): boolean {
    if (
      this.product &&
      this.product.status == 'active' &&
      this.sellerStatus == 'active'
    ) {
      return true;
    }
    return false;
  }

  onLike() {
    if (this.product != undefined) {
      this.wishlistService.addToWishlist(this.user, this.product?.uid);
      this.liked = true;
    }
  }
  onDislike() {
    if (this.product != undefined) {
      this.wishlistService.deleteFromWishlist(this.user, this.product?.uid);
      this.liked = false;
    }
  }
}
