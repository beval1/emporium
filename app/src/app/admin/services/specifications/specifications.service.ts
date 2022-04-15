import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/compat/firestore';
import { Observable, first } from 'rxjs';
import { SubcategoriesService } from '../subcategories/subcategories.service';
import { ISpecification } from 'src/app/shared/interfaces/ISpecification';
import { ISubcategory } from 'src/app/shared/interfaces/ISubcategory';

@Injectable({
  providedIn: 'root',
})
export class SpecificationsService {
  constructor(
    private fireStore: AngularFirestore,
    private subcategoriesService: SubcategoriesService
  ) {}

  // getSpecificationById(
  //   categoryId: string
  // ): Observable<ISpecification | undefined> {
  //   return this.specifications.doc(categoryId).valueChanges();
  // }

  getAllSpecificationsForSubcategory(categoryId: string, subcategoryId: string): Observable<ISpecification[]> {
    return this.fireStore.collection<ISpecification>(`categories/${categoryId}/subcategories/${subcategoryId}/specifications`).valueChanges()
  }

  async createSpecification(
    specificationName: string,
    categoryId: string,
    subcategoryId: string,
    type: string,
    minTextSize?: Number | null,
    maxTextSize?: Number | null,
    minNumber?: Number | null,
    maxNumber?: Number | null,
  ) {

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

    await this.fireStore.collection<ISpecification>(`categories/${categoryId}/subcategories/${subcategoryId}/specifications`).doc(specificationId).set(specification);

    this.subcategoriesService
      .getSubcategoryById(categoryId, subcategoryId)
      .pipe(first())
      .subscribe((subcategory) => {
        const subcategoryRef: AngularFirestoreDocument<ISubcategory> =
          this.fireStore.doc(`categories/${categoryId}/subcategories/${subcategoryId}`);
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
  }

  async deleteSpecificationById(categoryId: string, subcategoryId: string, specificationId: string) {
    await this.fireStore
      .collection<ISpecification>(`categories/${categoryId}/subcategories/${subcategoryId}/specifications`)
      .doc(specificationId)
      .delete();
  }
}
