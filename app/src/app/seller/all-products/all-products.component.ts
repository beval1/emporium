import { Component, OnDestroy, OnInit } from '@angular/core';
import { first, firstValueFrom, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { IProduct } from 'src/app/shared/interfaces/IProduct';
import { ProductService } from '../../shared/services/product/product.service';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { IUser } from 'src/app/shared/interfaces/IUser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.scss'],
})
export class AllProductsComponent implements OnInit, OnDestroy {
  sellerProducts: IProduct[] = [];
  productsSubscription: Subscription = new Subscription();
  faTrash = faTrash;
  faPenToSquare = faPenToSquare;
  searchValue: string = '';
  user: IUser | null = null;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.user = authService.getCurrentUserObject();
    console.log(`SellerId: ${this.user?.uid}`);
    if (this.user) {
      // firstValueFrom(
      //   this.productService.getAllProductsForSeller(
      //     this.user.uid,
      //     this.searchValue
      //   )
      // ).then((products: IProduct[]) => {
      //   this.sellerProducts = products;
      // });
      this.productsSubscription = this.productService
      .getAllProductsForSeller(this.user.uid, this.searchValue)
      .subscribe((products: IProduct[]) => {
        this.sellerProducts = products;
      });
    }
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.productsSubscription.unsubscribe();
  }

  onEdit(product: IProduct) {
    this.router.navigateByUrl(`seller/edit-product/${product.uid}`)
  }

  onDelete(product: IProduct) {
    if (confirm(`Are you sure that you want to delete ${product.name}?`)) {
      this.productService.deleteProductById(product.uid);
    }
  }

  onChange() {
    console.log(this.searchValue);

    if (!this.user) {
      return;
    }

    this.productsSubscription = this.productService
    .getAllProductsForSeller(this.user.uid, this.searchValue)
    .subscribe((products: IProduct[]) => {
      this.sellerProducts = products;
    });
  }
}
