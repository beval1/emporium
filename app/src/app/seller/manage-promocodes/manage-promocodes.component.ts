import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { IPromocode } from 'src/app/shared/interfaces/IPromocode';
import { PromocodeService } from '../services/promocode/promocode.service';
import { PromocodeTypeEnum } from 'src/app/shared/enums/PromocodeTypeEnum.enum';
import { ICategory } from 'src/app/shared/interfaces/ICategory';
import { CategoriesService } from 'src/app/admin/services/categories/categories.service';
import { SubcategoriesService } from 'src/app/admin/services/subcategories/subcategories.service';
import { ISubcategory } from 'src/app/shared/interfaces/ISubcategory';
import { IProduct } from 'src/app/shared/interfaces/IProduct';
import { ProductService } from 'src/app/shared/services/product/product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { validateAllFormFields } from 'src/app/shared/utils/validate';
import { hasAnyError, hasFieldError } from 'src/app/shared/utils/validate';
import { IUser } from 'src/app/shared/interfaces/IUser';

@Component({
  selector: 'app-manage-promo-codes',
  templateUrl: './manage-promocodes.component.html',
  styleUrls: ['./manage-promocodes.component.scss'],
})
export class ManagePromoCodesComponent implements OnInit, OnDestroy {
  promocodes: IPromocode[] = [];
  subscriptions: Subscription[] = [];
  promocodeTypes = PromocodeTypeEnum;
  selectedType: string = '';
  selectedCategories: string[] = [];
  selectedSubcategories: string[] = [];
  selectedProducts: string[] = [];
  categories: ICategory[] = [];
  subcategories: ISubcategory[] = [];
  products: IProduct[] = [];
  promocodeForm: FormGroup;
  discountType: string = '';
  discountValueError = false;
  hasAnyError = hasAnyError;
  hasFieldError = hasFieldError;
  currentSeller: IUser | null = null;

  constructor(
    private authService: AuthService,
    private promocodeService: PromocodeService,
    private categoriesService: CategoriesService,
    private subcategoriesService: SubcategoriesService,
    private productsService: ProductService,
    private fb: FormBuilder
  ) {
    this.currentSeller = authService.getCurrentUserObject();
    if (this.currentSeller) {
      this.subscriptions.push(
        promocodeService
          .getAllPromocodesForSeller(this.currentSeller.uid)
          .subscribe((promocodes: IPromocode[]) => {
            this.promocodes = promocodes;
          })
      );
      this.subscriptions.push(
        categoriesService
          .getAllCategories()
          .subscribe((categories: ICategory[]) => {
            this.categories = categories;
          })
      );
      this.subscriptions.push(
        productsService
          .getAllProductsForSeller(this.currentSeller.uid, '')
          .subscribe((products: IProduct[]) => {
            this.products = products;
          })
      );
      this.subcategoriesService
        .getAllSubcategories()
        .then((subcategories: ISubcategory[]) => {
          this.subcategories = subcategories;
        });
    }
    this.promocodeForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(5)]],
      discountValue: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit() {}
  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  onSubmit() {
    if (this.promocodeForm.invalid || this.promocodeForm.pending) {
      validateAllFormFields(this.promocodeForm);
      return;
    }

    const { code, discountValue } = this.promocodeForm.value;
    if (this.discountType == 'percent' && discountValue > 100) {
      this.discountValueError = true;
      return;
    }

    let subjectIds: string[] = [];
    let subjectNames: string[] = [];
    if (this.selectedCategories.length > 0) {
      subjectIds = this.selectedCategories;
      this.categories
        .filter((c: ICategory) => subjectIds.includes(c.uid))
        .forEach((c) => {
          subjectNames.push(c.name);
        });
    } else if (this.selectedSubcategories.length > 0) {
      subjectIds = this.selectedSubcategories;
      this.subcategories
        .filter((sub: ISubcategory) => subjectIds.includes(sub.uid))
        .forEach((sub) => {
          subjectNames.push(sub.name);
        });
    } else if (this.products.length > 0) {
      subjectIds = this.selectedProducts;
      this.products
        .filter((p: IProduct) => subjectIds.includes(p.uid))
        .forEach((p) => {
          subjectNames.push(p.name);
        });
    } else {
      console.log('Nothing selected');
      return;
    }

    if (this.currentSeller) {
      this.promocodeService
        .createPromocode(
          this.currentSeller,
          code,
          this.selectedType,
          subjectIds,
          subjectNames,
          this.discountType,
          discountValue
        )
        .then((result) => {
          if (result) {
            this.promocodeForm.reset();
            this.selectedCategories = [];
            this.selectedProducts = [];
            this.selectedSubcategories = [];
            this.selectedType = '';
            this.discountType = '';
          }
        });
    }
  }

  onDisable(promocode: IPromocode) {
    this.promocodeService.updatePromocodeStatus(promocode.uid, 'disabled')
  }

  onActivate(promocode: IPromocode) {
    this.promocodeService.updatePromocodeStatus(promocode.uid, 'active')
  }

  onDelete(promocode: IPromocode) {
    this.promocodeService.deletePromocodeById(promocode.uid);
  }

  onChangeType() {
    console.log(this.selectedType);
  }

  onCategoryChange() {
    console.log(this.selectedCategories);
  }

  onSubcategoryChange() {
    console.log(this.selectedSubcategories);
  }
}
