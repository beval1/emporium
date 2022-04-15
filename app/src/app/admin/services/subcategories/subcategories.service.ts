import { Injectable } from '@angular/core';
import { AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument 
} from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, firstValueFrom, first } from 'rxjs';
import { ISubcategory } from 'src/app/shared/interfaces/ISubcategory';
import { ICategory } from 'src/app/shared/interfaces/ICategory';
import { CategoriesService } from '../categories/categories.service';

@Injectable({
  providedIn: 'root',
})
export class SubcategoriesService {
  constructor(
    private fireStore: AngularFirestore,
    private fireStorage: AngularFireStorage,
    private categoriesService: CategoriesService,
  ) {}

  getSubcategoryById(
    categoryId: string,
    subcategoryId: string
  ): Observable<ISubcategory | undefined> {
    return this.fireStore
      .collection<ISubcategory>(`categories/${categoryId}/subcategories`)
      .doc(subcategoryId)
      .valueChanges();
  }

  getAllSubcategoriesForCategory(
    categoryId: string
  ): Observable<ISubcategory[]> {
    return this.fireStore
      .collection<ISubcategory>(`categories/${categoryId}/subcategories`)
      .valueChanges();
  }

  async createSubcategory(
    categoryName: string,
    categoryId: string,
    picture?: File | null
  ) {
    const subcategoryId = this.fireStore.createId();

    let pictureUrl: string = '';
    if (picture != null) {
      const filePath = `subcategories/${subcategoryId}`;
      const fileRef = this.fireStorage.ref(filePath);
      //upload the picture
      const upload = await this.fireStorage.upload(filePath, picture);
      pictureUrl = await firstValueFrom(fileRef.getDownloadURL());
    }

    const subcategory: ISubcategory = {
      name: categoryName,
      uid: subcategoryId,
      parentCategory: categoryId,
      picture: pictureUrl || null,
      specifications: [],
    };

    await this.fireStore
      .collection<ISubcategory>(`categories/${categoryId}/subcategories`)
      .doc(subcategoryId)
      .set(subcategory);

    this.categoriesService
      .getCategoryById(categoryId)
      .pipe(first())
      .subscribe((category) => {
        const categoryRef: AngularFirestoreDocument<ICategory> =
          this.fireStore.doc(`categories/${categoryId}`);
        const updatedCategory: ICategory = {
          uid: categoryId,
          name: category!.name,
          subcategories: [...category!.subcategories, subcategoryId],
          picture: category?.picture || null,
        };
        categoryRef.set(updatedCategory, {
          merge: true,
        });
      });
  }

  async deleteSubCategoryById(categoryId: string, subcategoryId: string) {
    await this.fireStore
      .collection<ISubcategory>(`categories/${categoryId}/subcategories`)
      .doc(subcategoryId)
      .delete();
  }
}
