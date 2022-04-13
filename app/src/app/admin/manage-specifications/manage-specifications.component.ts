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

@Component({
  selector: 'app-manage-specifications',
  templateUrl: './manage-specifications.component.html',
  styleUrls: ['./manage-specifications.component.scss'],
})
export class ManageSpecificationsComponent implements OnInit {
  specificationType = SpecificationType;
  subcategoriesSubscription: Subscription;
  specificationsSubscription: Subscription;
  specificationForm: FormGroup;
  subcategories: ISubcategory[] | undefined;
  specifications: ISpecification[] | undefined;
  hasFieldError = hasFieldError;
  hasAnyError = hasAnyError;

  constructor(
    private fb: FormBuilder,
    private subcategoriesService: SubcategoriesService,
    private specificationsService: SpecificationsService,
    private notificationsService: NotificationsService
  ) {
    this.specificationForm = this.fb.group({
      specificationName: ['', [Validators.required]],
      parentSubcategory: ['', Validators.required],
      specificationType: ['', Validators.required],
    });

    this.subcategoriesSubscription = this.subcategoriesService
      .getAllSubCategories()
      .subscribe((subcategories: ISubcategory[]) => {
        this.subcategories = subcategories;
      });
    this.specificationsSubscription = this.specificationsService
      .getAllSpecifications()
      .subscribe((specifications: ISpecification[]) => {
        this.specifications = specifications;
      });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.specificationsSubscription.unsubscribe();
    this.subcategoriesSubscription.unsubscribe();
  }

  onSubmit() {
    if (this.specificationForm.invalid || this.specificationForm.pending) {
      validateAllFormFields(this.specificationForm);
      return;
    }

    const specificationName =
      this.specificationForm.get('specificationName')?.value;
    const parentSubcategory =
      this.specificationForm.get('parentSubcategory')?.value;
    const specificationType =
      this.specificationForm.get('specificationType')?.value;

    this.specificationsService
      .createSpecification(
        specificationName,
        parentSubcategory,
        specificationType
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
    
  }
}
