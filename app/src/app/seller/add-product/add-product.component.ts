import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CategoriesService } from 'src/app/admin/services/categories/categories.service';
import { SubcategoriesService } from 'src/app/admin/services/subcategories/subcategories.service';
import { ICategory } from 'src/app/shared/interfaces/ICategory';
import { resetForm } from 'src/app/shared/utils/forms';
import { ISubcategory } from 'src/app/shared/interfaces/ISubcategory';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ISpecification } from 'src/app/shared/interfaces/ISpecification';
import { SpecificationsService } from 'src/app/admin/services/specifications/specifications.service';
import {
  hasAnyError,
  hasFieldError,
  validateAllFormFields,
} from 'src/app/shared/utils/validate';
import { ProductService } from '../services/product.service';
import { IProductSpecification } from 'src/app/shared/interfaces/IProductSpecification';
import { AuthService } from 'src/app/auth/services/auth.service';
import { NotificationsService } from 'src/app/notification/services/notifications.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit, OnDestroy {
  productForm: FormGroup;
  subscriptions: Subscription[] = [];
  categories: ICategory[] | undefined;
  subcategories: ISubcategory[] | undefined;
  specifications: ISpecification[] | undefined;
  selectedCategory: string = '';
  selectedSubcategory: string = '';
  filesToUpload: FileList | null = null;
  hasFieldError = hasFieldError;
  hasAnyError = hasAnyError;

  constructor(
    private fb: FormBuilder,
    private subcategoriesService: SubcategoriesService,
    private categoriesService: CategoriesService,
    private specificationsService: SpecificationsService,
    private productsService: ProductService,
    private notificationsService: NotificationsService // private authService: AuthService,
  ) {
    this.productForm = this.fb.group({
      productName: ['', [Validators.required]],
      productDescription: ['', [Validators.maxLength(4096)]],
      productPrice: ['', [Validators.required, Validators.min(0)]],
    });

    this.subscriptions.push(
      this.categoriesService
        .getAllCategories()
        .subscribe((categories: ICategory[]) => {
          this.categories = categories;
        })
    );
  }

  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  onSubcategoryChange() {
    resetForm(this.productForm);
    this.removeAllFormControls();
    this.specifications = [];

    this.subscriptions.push(
      this.specificationsService
        .getAllSpecificationsForSubcategory(
          this.selectedCategory,
          this.selectedSubcategory
        )
        .subscribe((specifications: ISpecification[]) => {
          this.specifications = specifications;
          this.specifications.forEach((s) => this.addFormControl(s));
        })
    );
  }

  onCategoryChange() {
    resetForm(this.productForm);
    this.subcategories = [];
    this.selectedSubcategory = '';
    this.specifications = [];

    this.subscriptions.push(
      this.subcategoriesService
        .getAllSubcategoriesForCategory(this.selectedCategory)
        .subscribe((subcategories: ISubcategory[]) => {
          this.subcategories = subcategories;
        })
    );
  }

  onSubmit() {
    if (this.productForm.invalid || this.productForm.pending) {
      validateAllFormFields(this.productForm);
      return;
    }

    const {
      productName,
      productDescription,
      productPrice,
      ...specificationValues
    } = this.productForm.value;

    let productSpecifications: IProductSpecification[] = [];
    if (this.specifications != undefined && this.specifications.length > 0) {
      for (let i = 0; i < this.specifications.length; i++) {
        let value = specificationValues[this.specifications[i].uid]
        let productSpecification: IProductSpecification = {
          specificationName: this.specifications[i].name,
          specificationType: this.specifications[i].type,
          value: value,
        };
        productSpecifications.push(productSpecification);
      }
    }

    let user = localStorage.getItem('user');
    let sellerId: string = '';
    if (user) {
      sellerId = JSON.parse(user).uid;
    } else {
      this.notificationsService.showError('Not logged in!');
      return;
    }

    this.productsService
      .addProduct(
        this.selectedCategory,
        this.selectedSubcategory,
        productName,
        productDescription,
        productPrice,
        productSpecifications,
        this.filesToUpload,
        sellerId
      )
      .then(() =>
        this.notificationsService.showSuccess('Product added successfully!')
      )
      .catch((error) => this.notificationsService.showError(error));

    this.productForm.reset();
    this.selectedCategory = '';
    this.selectedSubcategory = '';
  }

  onUpload(e: EventTarget | null) {
    if (e == null) {
      return;
    }

    this.filesToUpload = (e as HTMLInputElement).files;
  }

  addFormControl(specification: ISpecification) {
    const control = this.fb.control('', Validators.required);

    if (specification.type == 'Number') {
      if (specification.minNumber) {
        control.addValidators([
          Validators.min(Number(specification.minNumber)),
        ]);
      }
      if (specification.maxNumber) {
        control.addValidators([
          Validators.max(Number(specification.maxNumber)),
        ]);
      }
    } else if (
      specification.type == 'SmallText' ||
      specification.type == 'BigText'
    ) {
      if (specification.minTextSize) {
        control.addValidators([
          Validators.minLength(Number(specification.minTextSize)),
        ]);
      }
      if (specification.maxTextSize) {
        control.addValidators([
          Validators.maxLength(Number(specification.maxTextSize)),
        ]);
      }
    }
    console.log(specification);

    this.productForm.addControl(specification.uid, control);
  }

  removeAllFormControls() {
    if (this.specifications == undefined) {
      return;
    }

    this.specifications.forEach((s) => this.productForm.removeControl(s.uid));
  }
}
