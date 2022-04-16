import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SubcategoriesService } from 'src/app/admin/services/subcategories/subcategories.service';
import { ISubcategory } from 'src/app/shared/interfaces/ISubcategory';

@Component({
  selector: 'app-subcategories',
  templateUrl: './subcategories.component.html',
  styleUrls: ['./subcategories.component.scss'],
})
export class SubcategoriesComponent implements OnInit, OnDestroy {
  private subcategoriesSubscription: Subscription = new Subscription();
  subcategories: ISubcategory[] | undefined;

  constructor(
    private route: ActivatedRoute,
    private subcategoriesService: SubcategoriesService,
    private router: Router
  ) {

    this.route.paramMap.subscribe((params) => {
      let categoryId = params.get('categoryId');

      if (categoryId) {
          this.subcategoriesSubscription = this.subcategoriesService
          .getAllSubcategoriesForCategory(categoryId)
          .subscribe((subcategory: ISubcategory[]) => {

              if(!subcategory)
              {
                this.router.navigateByUrl('/404')
              }

              this.subcategories = subcategory;
            });
          }
    });
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    this.subcategoriesSubscription.unsubscribe();
  }
}
