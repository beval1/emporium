import { ICategory } from '../../../shared/interfaces/ICategory';
import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private categories: AngularFirestoreCollection<ICategory>;

  constructor(
    private fireStore: AngularFirestore,
    private fireStorage: AngularFireStorage
  ) {
    this.categories = fireStore.collection<ICategory>('categories');
  }

  getCategoryById(categoryId: string): Observable<ICategory | undefined> {
    return this.categories.doc(categoryId).valueChanges();
  }

  getAllCategories(): Observable<ICategory[]> {
    return this.categories.valueChanges();
  }

  async createCategory(categoryName: string, picture?: File | null) {
    const categoryId = this.fireStore.createId();

    let pictureUrl: string = '';
    if (picture != null) {
      const filePath = `categories/${categoryId}`;
      const fileRef = this.fireStorage.ref(filePath);
      //upload the picture
      const upload = await this.fireStorage.upload(filePath, picture)
      pictureUrl = await firstValueFrom(fileRef.getDownloadURL());
    }

    const category: ICategory = {
      name: categoryName,
      uid: categoryId,
      subcategories: [],
      picture: pictureUrl || null,
    };

    await this.categories.doc(categoryId).set(category);
  }

  async deleteCategoryById(categoryId: string) {
    await this.categories.doc(categoryId).delete();
  }
}
