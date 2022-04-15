import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ICategory } from 'src/app/shared/interfaces/ICategory';
import { ISubcategory } from 'src/app/shared/interfaces/ISubcategory';
import { resetForm } from 'src/app/shared/utils/forms';
import {
  hasAnyError,
  hasFieldError,
  validateAllFormFields,
} from 'src/app/shared/utils/validate';
import { CategoriesService } from '../services/categories/categories.service';
import { SubcategoriesService } from '../services/subcategories/subcategories.service';
import { NotificationsService } from 'src/app/notification/services/notifications.service';

@Component({
  selector: 'app-manage-subcategories',
  templateUrl: './manage-subcategories.component.html',
  styleUrls: ['./manage-subcategories.component.scss'],
})
export class ManageSubcategoriesComponent implements OnInit {
  categoriesSubscription: Subscription;
  subcategoriesSubscription: Subscription = new Subscription;
  subcategoryForm: FormGroup;
  categories: ICategory[] | undefined;
  subcategories: ISubcategory[] | undefined;
  selectedCategory: string = '';
  fileToUpload: File | null | undefined = null;
  hasFieldError = hasFieldError;
  hasAnyError = hasAnyError;
  

  constructor(
    private fb: FormBuilder,
    private categoriesService: CategoriesService,
    private subcategoriesService: SubcategoriesService,
    private notificationsService: NotificationsService
  ) {
    this.subcategoryForm = this.fb.group({
      subcategoryName: ['', [Validators.required]],
      // parentCategory: ['', Validators.required],
    });

    this.categoriesSubscription = this.categoriesService
      .getAllCategories()
      .subscribe((categories: ICategory[]) => {
        this.categories = categories;
      });
  }

  ngOnInit(): void {}

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
    // const parentCategory = this.subcategoryForm.get('parentCategory')?.value;
    const parentCategory = this.selectedCategory;

    this.subcategoriesService
      .createSubcategory(subcategoryName, parentCategory, this.fileToUpload)
      .then(() =>
        this.notificationsService.showSuccess(
          'Subcategory created successfully!'
        )
      )
      .catch((error) => {
        this.notificationsService.showError(`Error: ${error.message}`);
      });

    resetForm(this.subcategoryForm);
    this.fileToUpload = null;
  }

  onCategoryChange() {
    resetForm(this.subcategoryForm);
    this.subcategories = [];

    this.subcategoriesSubscription = this.subcategoriesService
    .getAllSubcategoriesForCategory(this.selectedCategory)
    .subscribe((subcategories: ISubcategory[]) => {
      this.subcategories = subcategories;
    });
  }

  onUpload(e: EventTarget | null) {
    const eventAsElement = e as HTMLInputElement;

    if (eventAsElement == null) {
      return;
    }

    this.fileToUpload = eventAsElement.files?.item(0)
  }

  onDelete(subcategoryId: string, subcategoryName: string){
    if (confirm(`Are you sure, you want to delete ${subcategoryName}?`)){
      this.subcategoriesService.deleteSubCategoryById(this.selectedCategory, subcategoryId)
      .then(() => this.notificationsService.showSuccess(`Deleted "${subcategoryName}" successfully!`))
      .catch(error => this.notificationsService.showError(`Error: ${error.message}`));
    }
  }

  isCategorySelected() {
      if (this.selectedCategory === ''){
        return false;
      }
      return true;
  }
}
