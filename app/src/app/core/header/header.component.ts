import { Component, OnInit } from '@angular/core';
import { faHeart, faShoppingCart, faUser} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {


  faHeart = faHeart;
  faShoppingCart = faShoppingCart;
  faUser = faUser;
  
  constructor() { }

  ngOnInit(): void {
  }

}
