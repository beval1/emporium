import { ICategory } from '../../../shared/interfaces/ICategory';
import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private categories: AngularFirestoreCollection<ICategory>;

  constructor(private fireStore: AngularFirestore) { 
    this.categories = fireStore.collection<ICategory>('categories');
  }

  getCategoryById(categoryId: string): Observable<ICategory | undefined> {
    return this.categories.doc(categoryId).valueChanges();
  }

  getAllCategories(): Observable<ICategory[]>
  {
    return this.categories.valueChanges();
  }

  async createCategory(categoryName: string) {
    const categoryId = this.fireStore.createId();

    const category: ICategory = 
    {
      name: categoryName,
      uid: categoryId,
      subcategories: [],
      categoryPicture: ''
    }

    await this.categories.doc(categoryId).set(category);
  }

  async deleteCategoryById(categoryId: string) {
    await this.categories.doc(categoryId).delete();
  }


}