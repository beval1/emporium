import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { first, take, tap } from 'rxjs/operators';
import { ICategory } from 'src/app/shared/interfaces/ICategory';
import { ISubcategory } from 'src/app/shared/interfaces/ISubcategory';
import { CategoriesService } from '../categories/categories.service';

@Injectable({
  providedIn: 'root'
})
export class SubcategoriesService {

  private subcategories: AngularFirestoreCollection<ISubcategory>;

  constructor(private fireStore: AngularFirestore, private categoriesService: CategoriesService) { 
    this.subcategories = fireStore.collection<ISubcategory>('subcategories');
  }

  getSubCategoryById(categoryId: string): Observable<ISubcategory | undefined> {
    return this.subcategories.doc(categoryId).valueChanges();
  }

  getAllSubCategories(): Observable<ISubcategory[]>
  {
    return this.subcategories.valueChanges();
  }

  async createSubCategory(categoryName: string, parentId: string) {
    const subcategoryId = this.fireStore.createId();

    const subcategory: ISubcategory = 
    {
      name: categoryName,
      uid: subcategoryId,
      parentCategory: parentId,
    }

    await this.subcategories.doc(subcategoryId).set(subcategory);

    this.categoriesService.getCategoryById(parentId).pipe(first()).subscribe((category) => {
      const categoryRef: AngularFirestoreDocument<ICategory> = this.fireStore.doc(`categories/${parentId}`)
      const updatedCategory: ICategory = {
        uid: parentId,
        name: category?.name,
        subcategories: [...category!.subcategories, subcategoryId],
        categoryPicture: category?.categoryPicture
      }
      categoryRef.set(updatedCategory, {
        merge: true,
      });
    })

    // const categoryRef: AngularFirestoreDocument<ICategory> = this.fireStore.doc(`categories/${parent}`)
    //   const updatedCategory: ICategory = {
    //     uid: parentId,
    //     name: parentName,
    //     subcategories: [...parentSubcategories, subcategoryId]
    //   }
    //   categoryRef.set(updatedCategory, {
    //     merge: true,
    //   });
    
  }

  async deleteSubCategoryById(categoryId: string) {
    await this.subcategories.doc(categoryId).delete();
  }
}
