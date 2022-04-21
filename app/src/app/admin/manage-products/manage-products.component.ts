import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IProduct } from 'src/app/shared/interfaces/IProduct';
import { ProductService } from 'src/app/shared/services/product/product.service';
import { IUser } from 'src/app/shared/interfaces/IUser';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.scss']
})
export class ManageProductsComponent implements OnInit, OnDestroy {
  selectedSeller: string = '';
  subscriptions: Subscription[] = [];
  sellerProducts: IProduct[] = [];
  sellers: IUser[] = [];

  constructor(private productsService: ProductService, private authService: AuthService) {
    this.subscriptions.push(this.authService.getAllSellers().subscribe((sellers: IUser[]) => {
      this.sellers = sellers;
    }))
  }

  ngOnInit() {
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

  onSellerChange() {
    this.subscriptions.push(this.productsService.getAllProductsForSeller(this.selectedSeller, '').subscribe((products: IProduct[]) => {
      this.sellerProducts = products;
    }))
  }

  onHide(product: IProduct){
    this.productsService.updateProductStatus(product.uid, 'hidden')
  }

  onApprove(product: IProduct){
    this.productsService.updateProductStatus(product.uid, 'active')
  }

}
