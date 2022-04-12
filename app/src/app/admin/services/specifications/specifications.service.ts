import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { SubcategoriesService } from '../subcategories/subcategories.service';
import { ISpecification } from 'src/app/shared/interfaces/ISpecification';
import { ISubcategory } from 'src/app/shared/interfaces/ISubcategory';
import { SpecificationType } from 'src/app/shared/enums/SpecificationTypeEnum';

@Injectable({
  providedIn: 'root',
})
export class SpecificationsService {
  private specifications: AngularFirestoreCollection<ISpecification>;

  constructor(
    private fireStore: AngularFirestore,
    private subcategoriesService: SubcategoriesService
  ) {
    this.specifications =
      fireStore.collection<ISpecification>('specifications');
  }

  getSpecificationById(
    categoryId: string
  ): Observable<ISpecification | undefined> {
    return this.specifications.doc(categoryId).valueChanges();
  }

  getAllSpecifications(): Observable<ISpecification[]> {
    return this.specifications.valueChanges();
  }

  async createSpecification(
    categoryName: string,
    parentId: string,
    type: SpecificationType,
    minTextSize?: Number | null,
    maxTextSize?: Number | null,
    minNumber?: Number | null,
    maxNumber?: Number | null,
  ) {
    // minTextSize = undefined ? null : minTextSize;
    // maxTextSize = undefined ? null : maxTextSize;
    // minNumber = undefined ? null : minNumber;
    // maxNumber = undefined ? null : maxNumber;

    const specificationId = this.fireStore.createId();

    const specification: ISpecification = {
      name: categoryName,
      uid: specificationId,
      parentSubcategory: parentId,
      type: type,
      minTextSize: minTextSize || null,
      maxTextSize: maxTextSize || null,
      minNumber: minNumber || null,
      maxNumber: maxNumber || null,
    };

    await this.specifications.doc(specificationId).set(specification);

    this.subcategoriesService
      .getSubCategoryById(parentId)
      .pipe(first())
      .subscribe((subcategory) => {
        const subcategoryRef: AngularFirestoreDocument<ISubcategory> =
          this.fireStore.doc(`subcategories/${parentId}`);
        const updatedSubcategory: ISubcategory = {
          uid: parentId,
          name: subcategory!.name,
          parentCategory: subcategory!.parentCategory,
          specifications: [...subcategory!.specifications, specificationId],
          picture: subcategory?.picture || null,
        };
        subcategoryRef.set(updatedSubcategory, {
          merge: true,
        });
      });
  }

  async deletespecificationById(subcategoryId: string) {
    await this.specifications.doc(subcategoryId).delete();
  }
}
