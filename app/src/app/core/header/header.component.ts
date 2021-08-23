import { Component } from '@angular/core';
import { faHeart, faShoppingCart, faUser, faCogs} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  faCogs = faCogs;
  faHeart = faHeart;
  faShoppingCart = faShoppingCart;
  faUser = faUser;
  
  constructor(private authService: AuthService) { 
  }

  isUserAdmin() {
    console.log(this.authService.getUserRole == 'admin')
    return this.authService.getUserRole == 'admin';
  }

}
