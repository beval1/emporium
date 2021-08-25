import { Component } from '@angular/core';
import { faHeart, faShoppingCart, faUser, faCogs} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/auth/services/auth.service';

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
  isUserAdmin$ = this.authService.isAdmin();
  isSeller$ = this.authService.isSeller();
  isUser$ = this.authService.isUser();
  isLogged$ = this.authService.isLoggedIn();
  
  constructor(private authService: AuthService) { 
  }

  signOut() {
    this.authService.signOut();
  }

}
