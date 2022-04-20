import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
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

  constructor(
    private productsService: ProductService,
    private route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe((params) => {
      let subcategoryId = params.get('subcategoryId');

      if (subcategoryId) {
        this.subscriptions.push(
          productsService
            .getAllProductsForSubcategory(subcategoryId)
            .subscribe((products: IProduct[]) => { this.products = products; })
        );
      }
    });
  }

  ngOnInit() {}
  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
