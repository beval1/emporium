import { Component, OnInit } from '@angular/core';
import { faFacebookSquare, faTwitterSquare, faInstagramSquare, faYoutubeSquare} from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  faFacebook = faFacebookSquare;
  faTwitter = faTwitterSquare;
  faInstagram = faInstagramSquare;
  faYoutube = faYoutubeSquare;

  constructor() { }

  ngOnInit(): void {
  }

}
