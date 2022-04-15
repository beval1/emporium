import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ISubcategory } from 'src/app/shared/interfaces/ISubcategory';
import { resetForm } from 'src/app/shared/utils/forms';
import {
  hasAnyError,
  hasFieldError,
  validateAllFormFields,
} from 'src/app/shared/utils/validate';
import { SubcategoriesService } from '../services/subcategories/subcategories.service';
import { SpecificationsService } from '../services/specifications/specifications.service';
import { ISpecification } from 'src/app/shared/interfaces/ISpecification';
import { SpecificationType } from 'src/app/shared/enums/SpecificationTypeEnum';
import { NotificationsService } from 'src/app/notification/services/notifications.service';
import { ICategory } from 'src/app/shared/interfaces/ICategory';
import { CategoriesService } from '../services/categories/categories.service';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-manage-specifications',
  templateUrl: './manage-specifications.component.html',
  styleUrls: ['./manage-specifications.component.scss'],
})
export class ManageSpecificationsComponent implements OnInit {
  specificationType = SpecificationType;
  categoriesSubscription: Subscription = new Subscription();
  subcategoriesSubscription: Subscription = new Subscription();
  specificationsSubscription: Subscription = new Subscription();
  specificationForm: FormGroup;
  categories: ICategory[] | undefined;
  subcategories: ISubcategory[] | undefined;
  specifications: ISpecification[] | undefined;
  selectedCategory: string = '';
  selectedSubcategory: string = '';
  selectedType: string = '';
  faXmark = faXmark;
  hasFieldError = hasFieldError;
  hasAnyError = hasAnyError;

  constructor(
    private fb: FormBuilder,
    private specificationsService: SpecificationsService,
    private categoriesService: CategoriesService,
    private subcategoriesService: SubcategoriesService,
    private notificationsService: NotificationsService
  ) {
    this.specificationForm = this.fb.group({
      specificationName: ['', [Validators.required]],
      specificationMinTextSize: [],
      specificationMaxTextSize: [],
      specificationMinNumber: [],
      specificationMaxNumber: [],
    });

    this.categoriesSubscription = this.categoriesService
      .getAllCategories()
      .subscribe((categories: ICategory[]) => {
        this.categories = categories;
      });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.specificationsSubscription.unsubscribe();
    this.subcategoriesSubscription.unsubscribe();
    this.categoriesSubscription.unsubscribe();
  }

  onSubmit() {
    if (this.specificationForm.invalid || this.specificationForm.pending) {
      validateAllFormFields(this.specificationForm);
      return;
    }

    const specificationName =
      this.specificationForm.get('specificationName')?.value;
    const specificationMinTextSize = this.specificationForm.get(
      'specificationMinTextSize'
    )?.value;
    const specificationManTextSize = this.specificationForm.get(
      'specificationMaxTextSize'
    )?.value;
    const specificationMinNumber = this.specificationForm.get(
      'specificationMinNumber'
    )?.value;
    const specificationMaxNumber = this.specificationForm.get(
      'specificationMaxNumber'
    )?.value;

    this.specificationsService
      .createSpecification(
        specificationName,
        this.selectedCategory,
        this.selectedSubcategory,
        this.selectedType,
        specificationMinTextSize,
        specificationManTextSize,
        specificationMinNumber,
        specificationMaxNumber,
      )
      .then(() =>
        this.notificationsService.showSuccess(
          'Specification created successfully!'
        )
      )
      .catch((error) => {
        this.notificationsService.showError(`Error: ${error.message}`);
      });

    resetForm(this.specificationForm);
  }

  onSubcategoryChange() {
    resetForm(this.specificationForm);
    this.specifications = [];

    this.specificationsSubscription = this.specificationsService
      .getAllSpecificationsForSubcategory(
        this.selectedCategory,
        this.selectedSubcategory
      )
      .subscribe((specifications: ISpecification[]) => {
        this.specifications = specifications;
      });
  }

  onCategoryChange() {
    resetForm(this.specificationForm);
    this.subcategories = [];
    this.selectedSubcategory = '';

    this.subcategoriesSubscription = this.subcategoriesService
      .getAllSubcategoriesForCategory(this.selectedCategory)
      .subscribe((subcategories: ISubcategory[]) => {
        this.subcategories = subcategories;
      });
  }

  onChangeType(){
    console.log(this.selectedType)
  }

  onDelete(specificationId: string, specificationName: string) {
    if (confirm(`Are you sure, you want to delete ${specificationName}?`)) {
      this.specificationsService
        .deleteSpecificationById(
          this.selectedCategory,
          this.selectedSubcategory,
          specificationId
        )
        .then(() =>
          this.notificationsService.showSuccess(
            `Deleted "${specificationName}" successfully!`
          )
        )
        .catch((error) =>
          this.notificationsService.showError(`Error: ${error.message}`)
        );
    }
  }
}
