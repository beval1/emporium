import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-aside',
  templateUrl: './admin-aside.component.html',
  styleUrls: ['./admin-aside.component.scss']
})
export class AdminAsideComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  getCurrentRoute() {
    return this.router.url
  }
}
