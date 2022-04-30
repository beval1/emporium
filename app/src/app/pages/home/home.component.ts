import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IProduct } from 'src/app/shared/interfaces/IProduct';
import { ProductService } from 'src/app/shared/services/product/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  carouselImages = [
    'https://firebasestorage.googleapis.com/v0/b/emporium-1710b.appspot.com/o/home%2Fcarousel%2Fshop-accessories-allienware.png?alt=media&token=2fb4471f-a4cf-40e4-8364-83483a57398f',
    'https://firebasestorage.googleapis.com/v0/b/emporium-1710b.appspot.com/o/home%2Fcarousel%2Fallienware.png?alt=media&token=b189184c-3801-4c0d-b6f0-ce042e2a10dc',
    'https://firebasestorage.googleapis.com/v0/b/emporium-1710b.appspot.com/o/home%2Fcarousel%2Fallienware-cyrotech.png?alt=media&token=8e9431e5-8b4e-4034-a22d-3ea13194d5d6',
    'https://firebasestorage.googleapis.com/v0/b/emporium-1710b.appspot.com/o/home%2Fcarousel%2Fx-series-allienware.png?alt=media&token=e1ce84e7-942b-409e-8f1b-c4042360f1d6',
  ];
  popularProductsIds: string[] = [
    '0dst2EyCVM3DQbLu5utX',
    '4SUFWJoPFFfXVicpE0nC',
    'Awy6DR2Jmle36E75UOxr',
    'CVXpAOoNBZsq7Xo2Gqwj',
    'PY3AEqT276WlVuHFvmvL',
  ];
  newProductsIds: string[] = [
    'ukbiguaBeal0pHSzwF2e',
    'y27rPMYZgeTazfUptJe5',
    'zE1UYZ7an7Webwme4jVe',
    'zhNegNlDSZ0aigTe8sem',
    'Awy6DR2Jmle36E75UOxr',
  ];

  popularProducts: IProduct[] = [];
  newProducts: IProduct[] = [];

  constructor(private productService: ProductService, private router: Router) {
    productService
      .getMultipleProductsById(this.popularProductsIds)
      .then((products: IProduct[]) => (this.popularProducts = products));
    productService
      .getMultipleProductsById(this.newProductsIds)
      .then((products: IProduct[]) => (this.newProducts = products));
  }

  ngOnInit(): void {}

  onBecomeSeller() {
    this.router.navigateByUrl('/register-seller')
  }
}
