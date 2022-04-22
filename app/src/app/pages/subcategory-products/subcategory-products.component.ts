import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { min, Subscription } from 'rxjs';
import { IProduct } from 'src/app/shared/interfaces/IProduct';
import { ProductService } from 'src/app/shared/services/product/product.service';

@Component({
  selector: 'app-subcategory-products',
  templateUrl: './subcategory-products.component.html',
  styleUrls: ['./subcategory-products.component.scss'],
})
export class SubcategoryProductsComponent implements OnInit, OnDestroy {
  products: IProduct[] = [];
  subscriptions: Subscription[] = [];
  minProductPrice = 0;
  maxProductPrice = 0;

  constructor(
    private productsService: ProductService,
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
              this.products = products;
              this.minProductPrice = this.getMinProductPrice();
              this.maxProductPrice = this.getMaxProductPrice();
            })
        );
      }
    });
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  private getMinProductPrice() {
    return this.products.sort((a, b) => {
      if (a.price > b.price) {
        return 1;
      } else if (a.price < b.price) {
        return -1;
      }
      return 0;
    })[0].price;
  }
  private getMaxProductPrice() {
    return this.products.sort((a, b) => {
      if (a.price > b.price) {
        return 1;
      } else if (a.price < b.price) {
        return -1;
      }
      return 0;
    })[this.products.length - 1].price;
  }
  private orderAscending() {
    this.products = this.products.sort((a, b) => {
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
    this.products = this.products.sort((a, b) => {
      if (a.price > b.price) {
        return -1;
      }
      if (a.price < b.price) {
        return 1;
      }
      return 0;
    });
  }
}
