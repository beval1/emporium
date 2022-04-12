import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ICategory } from 'src/app/shared/interfaces/ICategory';
import { ISubcategory } from 'src/app/shared/interfaces/ISubcategory';
import { resetForm } from 'src/app/shared/utils/forms';
import { hasAnyError, hasFieldError, validateAllFormFields } from 'src/app/shared/utils/validate';
import { CategoriesService } from '../services/categories/categories.service';
import { SubcategoriesService } from '../services/subcategories/subcategories.service';
import { NotificationsService } from 'src/app/notification/services/notifications.service';

@Component({
  selector: 'app-manage-subcategories',
  templateUrl: './manage-subcategories.component.html',
  styleUrls: ['./manage-subcategories.component.scss']
})
export class ManageSubcategoriesComponent implements OnInit {
  categoriesSubscription: Subscription;
  subcategoriesSubscription: Subscription;
  subcategoryForm: FormGroup;
  categories: ICategory[] | undefined;
  subcategories: ISubcategory[] | undefined;
  hasFieldError = hasFieldError;
  hasAnyError = hasAnyError;

  constructor(
    private fb: FormBuilder,
    private categoriesService: CategoriesService,
    private subcategoriesService: SubcategoriesService,
    private notificationsService: NotificationsService,
  ) {
    this.subcategoryForm = this.fb.group({
      subcategoryName: ['', [Validators.required]],
      parentCategory: ['', Validators.required]
    });

    this.categoriesSubscription = this.categoriesService
      .getAllCategories()
      .subscribe((categories: ICategory[]) => {
        this.categories = categories;
      });
    this.subcategoriesSubscription = this.subcategoriesService
      .getAllSubCategories()
      .subscribe((subcategories: ISubcategory[]) => {
        this.subcategories = subcategories;
      });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subcategoriesSubscription.unsubscribe();
    this.categoriesSubscription.unsubscribe();
  }

  onSubmit() {
    if (this.subcategoryForm.invalid || this.subcategoryForm.pending) {
      validateAllFormFields(this.subcategoryForm);
      return;
    }

    const subcategoryName = this.subcategoryForm.get('subcategoryName')?.value;
    const parentCategory = this.subcategoryForm.get('parentCategory')?.value

    try {
      this.subcategoriesService.createSubCategory(subcategoryName, parentCategory);
      this.notificationsService.showSuccess('Subcategory created successfully!')
    } catch (error: any) {
      this.notificationsService.showError(`Error: ${error.message}`)
    }

    resetForm(this.subcategoryForm)
  }

}
