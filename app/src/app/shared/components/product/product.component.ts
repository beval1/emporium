import { Component, Input, OnInit } from '@angular/core';
import { IProduct } from '../../interfaces/IProduct';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-solid-svg-icons';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  @Input('product') product: IProduct | null = null;
  currentRating: number = 0;
  averageRating = 0;
  faHeart = faHeart;
  faHeartRegular = faHeartRegular;
  faCartPlus = faCartPlus;
  productPrice: String[] | undefined = [];
  quantityString: string = '';

  constructor() {}

  ngOnInit() {
    if (this.product?.rating) {
      this.currentRating = Math.round(this.product?.rating);
    } else {
      this.currentRating = 5;
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
    this.productPrice = this.product?.price.toString().split('.');
  }
}
