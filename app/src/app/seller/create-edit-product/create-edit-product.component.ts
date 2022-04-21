import { Component, OnDestroy, OnInit } from '@angular/core';
import { firstValueFrom, Subscription } from 'rxjs';
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
import { ProductService } from '../../shared/services/product/product.service';
import { IProductSpecification } from 'src/app/shared/interfaces/IProductSpecification';
import { AuthService } from 'src/app/auth/services/auth.service';
import { NotificationsService } from 'src/app/notification/services/notifications.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IProduct } from 'src/app/shared/interfaces/IProduct';

@Component({
  selector: 'app-create-edit-product',
  templateUrl: './create-edit-product.component.html',
  styleUrls: ['./create-edit-product.component.scss'],
})
export class CreateEditProductComponent implements OnInit, OnDestroy {
  productForm: FormGroup;
  subscriptions: Subscription[] = [];
  categories: ICategory[] | undefined;
  subcategories: ISubcategory[] | undefined;
  specifications: ISpecification[] = [];
  selectedCategory: string = '';
  selectedSubcategory: string = '';
  filesToUpload: FileList | null = null;
  hasFieldError = hasFieldError;
  hasAnyError = hasAnyError;
  editForm: boolean = false;
  editableProduct: IProduct | null = null;

  constructor(
    private fb: FormBuilder,
    private subcategoriesService: SubcategoriesService,
    private categoriesService: CategoriesService,
    private specificationsService: SpecificationsService,
    private productsService: ProductService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      productName: ['', [Validators.required]],
      productDescription: ['', [Validators.maxLength(4096)]],
      productPrice: ['', [Validators.required, Validators.min(0)]],
      productQuantity: ['', [Validators.required, Validators.min(1)]],
    });

    this.subscriptions.push(
      this.categoriesService
        .getAllCategories()
        .subscribe((categories: ICategory[]) => {
          this.categories = categories;
        })
    );

    if (this.route.snapshot.params.productId) {
      this.route.paramMap.subscribe((params) => {
        const productId = params.get('productId');

        if (productId) {
          this.subscriptions.push(
            productsService
              .getProductById(productId)
              .subscribe((product: IProduct | undefined) => {
                if (product) {
                  this.editForm = true;
                  this.editableProduct = product;
                  this.fillForm();
                }
              })
          );
        }
      });
    }
  }

  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  fillForm() {
    if (this.editableProduct) {
      this.selectedCategory = this.editableProduct.categoryId;
      this.loadSubcategories();
      this.selectedSubcategory = this.editableProduct.subcategoryId;
      this.loadSpecifications();

      this.productForm.patchValue({
        productName: this.editableProduct.name,
        productDescription: this.editableProduct.desc,
        productPrice: this.editableProduct.price,
        productQuantity: this.editableProduct.quantity,
      });

    }
  }

  onCancelEdit() {
    this.router.navigateByUrl(`/seller/all-products`);
  }

  onSubcategoryChange() {
    resetForm(this.productForm);
    this.removeAllFormControls();

    this.loadSpecifications();
  }

  onCategoryChange() {
    resetForm(this.productForm);
    this.subcategories = [];
    this.selectedSubcategory = '';

    this.loadSubcategories();
  }

  private loadSubcategories() {
    this.subscriptions.push(
      this.subcategoriesService
        .getAllSubcategoriesForCategory(this.selectedCategory)
        .subscribe((subcategories: ISubcategory[]) => {
          this.subcategories = subcategories;
        })
    );
  }

  private loadSpecifications() {
    this.subscriptions.push(
      this.specificationsService
        .getAllSpecificationsForSubcategory(
          this.selectedCategory,
          this.selectedSubcategory
        )
        .subscribe((specifications: ISpecification[]) => {
          this.specifications = specifications;
          this.specifications.forEach((s) => this.addFormControl(s));
          if (this.specifications && this.editableProduct && this.editForm) {
            for (let i = 0; i < this.specifications?.length; i++) {
              if (this.editableProduct.specifications) {
                this.productForm.patchValue({
                  [this.specifications[i].uid]:
                    this.editableProduct.specifications[i].value,
                });
              }
            }
          }
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
      productQuantity,
      ...specificationValues
    } = this.productForm.value;

    let productSpecifications: IProductSpecification[] = [];
    if (this.specifications != undefined && this.specifications.length > 0) {
      for (let i = 0; i < this.specifications.length; i++) {
        let value = specificationValues[this.specifications[i].uid];
        let productSpecification: IProductSpecification = {
          specificationName: this.specifications[i].name,
          specificationType: this.specifications[i].type,
          value: value,
        };
        productSpecifications.push(productSpecification);
      }
    }

    let user = this.authService.getCurrentUserObject();
    if (!user) {
      return;
    }
    // let sellerId: string = user.uid;

    let functionResult = false;
    if (this.editForm && this.editableProduct) {
      this.productsService.updateProduct(
        this.editableProduct.uid,
        this.selectedCategory,
        this.selectedSubcategory,
        productName,
        productDescription,
        productPrice,
        productSpecifications,
        this.filesToUpload,
        user,
        productQuantity,
      ).then(result => functionResult=result);
      this.router.navigateByUrl('/seller/all-products');
    } else {
      this.productsService.addProduct(
        this.selectedCategory,
        this.selectedSubcategory,
        productName,
        productDescription,
        productPrice,
        productSpecifications,
        this.filesToUpload,
        user,
        productQuantity,
        'awaiting approval'
      ).then(result => functionResult=result);
    }

    console.log(functionResult)
    if(functionResult){
      this.productForm.reset();
      this.selectedCategory = '';
      this.selectedSubcategory = '';
    }

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

    this.productForm.addControl(specification.uid, control);
  }

  removeAllFormControls() {
    if (this.specifications == undefined) {
      return;
    }

    this.specifications.forEach((s) => this.productForm.removeControl(s.uid));
  }
}
