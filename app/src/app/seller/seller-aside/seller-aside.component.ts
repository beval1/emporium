import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seller-aside',
  templateUrl: './seller-aside.component.html',
  styleUrls: ['./seller-aside.component.scss']
})
export class SellerAsideComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  getCurrentRoute() {
    return this.router.url
  }

}
