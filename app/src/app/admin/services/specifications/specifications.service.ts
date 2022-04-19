import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Observable, first } from 'rxjs';
import { SubcategoriesService } from '../subcategories/subcategories.service';
import { ISpecification } from 'src/app/shared/interfaces/ISpecification';
import { ISubcategory } from 'src/app/shared/interfaces/ISubcategory';
import { NotificationsService } from 'src/app/notification/services/notifications.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';

@Injectable({
  providedIn: 'root',
})
export class SpecificationsService {
  constructor(
    private fireStore: AngularFirestore,
    private subcategoriesService: SubcategoriesService,
    private notificationsService: NotificationsService,
    private loaderService: LoaderService
  ) {}

  // getSpecificationById(
  //   categoryId: string
  // ): Observable<ISpecification | undefined> {
  //   return this.specifications.doc(categoryId).valueChanges();
  // }

  getAllSpecificationsForSubcategory(
    categoryId: string,
    subcategoryId: string
  ): Observable<ISpecification[]> {
    return this.fireStore
      .collection<ISpecification>(
        `categories/${categoryId}/subcategories/${subcategoryId}/specifications`
      )
      .valueChanges();
  }

  async createSpecification(
    specificationName: string,
    categoryId: string,
    subcategoryId: string,
    type: string,
    minTextSize?: Number | null,
    maxTextSize?: Number | null,
    minNumber?: Number | null,
    maxNumber?: Number | null
  ) {
    this.loaderService.show();
    const specificationId = this.fireStore.createId();

    const specification: ISpecification = {
      name: specificationName,
      uid: specificationId,
      parentSubcategory: subcategoryId,
      type: type,
      minTextSize: minTextSize || null,
      maxTextSize: maxTextSize || null,
      minNumber: minNumber || null,
      maxNumber: maxNumber || null,
    };

    this.subcategoriesService
    .getSubcategoryById(categoryId, subcategoryId)
    .pipe(first())
    .subscribe((subcategory) => {
      const subcategoryRef: AngularFirestoreDocument<ISubcategory> =
        this.fireStore.doc(
          `categories/${categoryId}/subcategories/${subcategoryId}`
        );
      const updatedSubcategory: ISubcategory = {
        uid: subcategoryId,
        name: subcategory!.name,
        parentCategory: categoryId,
        specifications: [...subcategory!.specifications, specificationId],
        picture: subcategory?.picture || null,
      };
      subcategoryRef.set(updatedSubcategory, {
        merge: true,
      });
    });

    await this.fireStore
      .collection<ISpecification>(
        `categories/${categoryId}/subcategories/${subcategoryId}/specifications`
      )
      .doc(specificationId)
      .set(specification)
      .then(() =>
        this.notificationsService.showSuccess(
          'Specification created successfully!'
        )
      )
      .catch((error) => {
        this.notificationsService.showError(`Error: ${error.message}`);
      }).finally(() => this.loaderService.hide());


  }

  async deleteSpecificationById(
    categoryId: string,
    subcategoryId: string,
    specificationId: string,
    specificationName: string
  ) {
    this.loaderService.show();
    await this.fireStore
      .collection<ISpecification>(
        `categories/${categoryId}/subcategories/${subcategoryId}/specifications`
      )
      .doc(specificationId)
      .delete()
      .then(() =>
        this.notificationsService.showSuccess(
          `Deleted "${specificationName}" successfully!`
        )
      )
      .catch((error) =>
        this.notificationsService.showError(`Error: ${error.message}`)
      )
      .finally(() => this.loaderService.hide());
  }
}
