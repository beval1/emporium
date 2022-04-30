import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { min, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { IProduct } from 'src/app/shared/interfaces/IProduct';
import { IUser } from 'src/app/shared/interfaces/IUser';
import { ProductService } from 'src/app/shared/services/product/product.service';
import { WishlistService } from 'src/app/shared/services/wishlist/wishlist.service';

@Component({
  selector: 'app-subcategory-products',
  templateUrl: './subcategory-products.component.html',
  styleUrls: ['./subcategory-products.component.scss'],
})
export class SubcategoryProductsComponent implements OnInit, OnDestroy {
  filteredProducts: IProduct[] = [];
  allProducts: IProduct[] = []
  subscriptions: Subscription[] = [];
  minProductPrice = 0;
  maxProductPrice = 0;
  userLikedProducts: string[] = [];
  user: IUser | null = null;

  constructor(
    private productsService: ProductService,
    private wishlistService: WishlistService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      let subcategoryId = params.get('subcategoryId');

      if (subcategoryId) {
        this.subscriptions.push(
          this.productsService
            .getAllProductsForSubcategory(subcategoryId)
            .subscribe((products: IProduct[]) => {
              products = products.filter(p => p.status=='active');
              this.filteredProducts = products;
              this.allProducts = products;
              this.minProductPrice = this.getMinProductPrice();
              this.maxProductPrice = this.getMaxProductPrice();
            })
        );
        this.user = this.authService.getCurrentUserObject();
        this.subscriptions.push(
          this.wishlistService
            .getWishlistProductIds(this.user)
            .subscribe((filteredProducts: string[]) => {
              this.userLikedProducts = filteredProducts;
            })
        );
      }
    });
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  isLiked(productId: string): boolean {
    return this.userLikedProducts.includes(productId);
  }

  private getMinProductPrice() {
    if (this.filteredProducts.length == 0){
      return 0;
    }
    return this.filteredProducts.sort((a, b) => {
      if (a.price > b.price) {
        return 1;
      } else if (a.price < b.price) {
        return -1;
      }
      return 0;
    })[0].price;
  }
  private getMaxProductPrice() {
    if (this.filteredProducts.length == 0){
      return 0;
    }
    return this.filteredProducts.sort((a, b) => {
      if (a.price > b.price) {
        return 1;
      } else if (a.price < b.price) {
        return -1;
      }
      return 0;
    })[this.filteredProducts.length - 1].price;
  }
  private orderAscending() {
    this.filteredProducts = this.filteredProducts.sort((a, b) => {
      if (a.price > b.price) {
        return 1;
      }
      if (a.price < b.price) {
        return -1;
      }
      return 0;
    });
  }
  private orderDescending() {
    this.filteredProducts = this.filteredProducts.sort((a, b) => {
      if (a.price > b.price) {
        return -1;
      }
      if (a.price < b.price) {
        return 1;
      }
      return 0;
    });
  }

  onPriceChange(priceRange: number[]) {
    this.filteredProducts = this.allProducts.filter(
      (product: IProduct) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );
  }
  onOrderChange(order: string) {
    if (order == 'Ascending') {
      this.orderAscending();
    } else if (order == 'Descending') {
      this.orderDescending();
    }
  }
}
