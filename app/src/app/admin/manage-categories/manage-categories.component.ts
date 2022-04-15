import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ICategory } from 'src/app/shared/interfaces/ICategory';
import { resetForm } from 'src/app/shared/utils/forms';
import {
  hasAnyError,
  hasFieldError,
  validateAllFormFields,
} from 'src/app/shared/utils/validate';
import { CategoriesService } from '../services/categories/categories.service';
import { NotificationsService } from 'src/app/notification/services/notifications.service';

@Component({
  selector: 'app-manage-categories',
  templateUrl: './manage-categories.component.html',
  styleUrls: ['./manage-categories.component.scss'],
})
export class ManageCategoriesComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  categoryForm: FormGroup;
  categories: ICategory[] | undefined;
  fileToUpload: File | null | undefined = null;
  hasFieldError = hasFieldError;
  hasAnyError = hasAnyError;

  constructor(
    private fb: FormBuilder,
    private categoriesService: CategoriesService,
    private notificationsService: NotificationsService
  ) {
    this.categoryForm = this.fb.group({
      categoryName: ['', [Validators.required]],
    });

    this.subscription = this.categoriesService
      .getAllCategories()
      .subscribe((categories: ICategory[]) => {
        this.categories = categories;
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSubmit() {
    if (this.categoryForm.invalid || this.categoryForm.pending) {
      validateAllFormFields(this.categoryForm);
      return;
    }

    const categoryName = this.categoryForm.get('categoryName')?.value;

    this.categoriesService.createCategory(categoryName, this.fileToUpload).then(
      () => this.notificationsService.showSuccess('Category created successfully!')).catch((error) => {
      this.notificationsService.showError(`Error: ${error.message}`);
    })
    resetForm(this.categoryForm);
    this.fileToUpload = null;
  }

  onDelete(categoryId: string, categoryName: string){
    if (confirm(`Are you sure, you want to delete ${categoryName}?`)){
      this.categoriesService.deleteCategoryById(categoryId)
      .then(() => this.notificationsService.showSuccess(`Deleted "${categoryName}" successfully!`))
      .catch(error => this.notificationsService.showError(`Error: ${error.message}`));
    }
  }

  onUpload(e: EventTarget | null) {
    const eventAsElement = e as HTMLInputElement;

    if (eventAsElement == null) {
      return;
    }

    this.fileToUpload = eventAsElement.files?.item(0)
  }
}
