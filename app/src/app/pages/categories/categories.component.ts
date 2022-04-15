import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CategoriesService } from 'src/app/admin/services/categories/categories.service';
import { SubcategoriesService } from 'src/app/admin/services/subcategories/subcategories.service';
import { ICategory } from 'src/app/shared/interfaces/ICategory';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit, OnDestroy {
  categoriesSubscription: Subscription = new Subscription;
  categories: ICategory[] | undefined;

  constructor(private categoriesService: CategoriesService, private subcategoriesCategores: SubcategoriesService) {
    this.categoriesSubscription = this.categoriesService
      .getAllCategories()
      .subscribe((categories: ICategory[]) => {
        this.categories = categories;
    });
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.categoriesSubscription.unsubscribe();
  }

}
