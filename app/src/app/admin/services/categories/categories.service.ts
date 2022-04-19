import { ICategory } from '../../../shared/interfaces/ICategory';
import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, firstValueFrom } from 'rxjs';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { NotificationsService } from 'src/app/notification/services/notifications.service';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private categories: AngularFirestoreCollection<ICategory>;

  constructor(
    private fireStore: AngularFirestore,
    private fireStorage: AngularFireStorage,
    private loaderService: LoaderService,
    private notificationsService: NotificationsService
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
    this.loaderService.show();

    const categoryId = this.fireStore.createId();

    let pictureUrl: string = '';
    if (picture != null) {
      const filePath = `categories/${categoryId}`;
      const fileRef = this.fireStorage.ref(filePath);
      //upload the picture
      this.fireStorage.upload(filePath, picture).then(async () => {
        pictureUrl = await firstValueFrom(fileRef.getDownloadURL());
      });
    }

    const category: ICategory = {
      name: categoryName,
      uid: categoryId,
      subcategories: [],
      picture: pictureUrl || null,
    };

    await this.categories
      .doc(categoryId)
      .set(category)
      .then(() =>
        this.notificationsService.showSuccess('Category created successfully!')
      )
      .catch((error) => {
        this.notificationsService.showError(`Error: ${error.message}`);
      })
      .finally(() => this.loaderService.hide());
  }

  async deleteCategoryById(categoryId: string, categoryName: string) {
    this.loaderService.show();
    await this.categories
      .doc(categoryId)
      .delete()
      .then(() =>
        this.notificationsService.showSuccess(
          `Deleted "${categoryName}" successfully!`
        )
      )
      .catch((error) =>
        this.notificationsService.showError(`Error: ${error.message}`)
      )
      .finally(() => this.loaderService.hide());
  }
}
