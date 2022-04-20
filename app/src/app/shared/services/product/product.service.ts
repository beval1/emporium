import { Injectable } from '@angular/core';
import { AngularFirestore, Query } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { IProduct } from 'src/app/shared/interfaces/IProduct';
import { IProductSpecification } from 'src/app/shared/interfaces/IProductSpecification';
import { firstValueFrom, Observable } from 'rxjs';
import { NotificationsService } from 'src/app/notification/services/notifications.service';
import { LoaderService } from '../loader/loader.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(
    private fireStore: AngularFirestore,
    private fireStorage: AngularFireStorage,
    private notificationsService: NotificationsService,
    private loaderService: LoaderService,
  ) {}

  async addProduct(
    categoryId: string,
    subcategoryId: string,
    name: string,
    description: string,
    price: number,
    specifications: IProductSpecification[],
    filesToUpload: FileList | null,
    sellerId: string,
    quantity: number,
    status: string,
  ) {
    this.loaderService.show();

    const id = this.fireStore.createId();

    let images: string[] = [];

    if (filesToUpload != null) {
      for (let i = 0; i < filesToUpload.length; i++) {
        const filePath = `products/${id}/${i}`;
        //upload the image
        await await this.fireStorage.upload(filePath, filesToUpload[i]);

        const downloadUrl = await firstValueFrom(
          this.fireStorage.ref(filePath).getDownloadURL()
        );
        images.push(downloadUrl);
      }
    }

    const product: IProduct = {
      uid: id,
      name: name,
      desc: description,
      price: price,
      images: images,
      specifications: specifications || null,
      categoryId: categoryId,
      subcategoryId: subcategoryId,
      sellerId: sellerId,
      quantity: quantity,
      status: status,
    };

    console.log(product);

    await this.fireStore
      .collection<IProduct>(
        // `categories/${categoryId}/subcategories/${subcategoryId}/products`
        `products`
      )
      .doc(id)
      .set(product)
      .then(() =>
        this.notificationsService.showSuccess('Product CREATED successfully!')
      )
      .catch((error) => this.notificationsService.showError(error))
      .finally(() => this.loaderService.hide());
  }

  async updateProduct(
    id: string,
    categoryId: string,
    subcategoryId: string,
    name: string,
    description: string,
    price: number,
    specifications: IProductSpecification[],
    filesToUpload: FileList | null,
    sellerId: string,
    quantity: number,
  ) {

    this.loaderService.show()
    let images: string[] = [];

    if (filesToUpload != null) {
      for (let i = 0; i < filesToUpload.length; i++) {
        const filePath = `products/${id}/${i}`;
        //upload the image
        await await this.fireStorage.upload(filePath, filesToUpload[i]);

        const downloadUrl = await firstValueFrom(
          this.fireStorage.ref(filePath).getDownloadURL()
        );
        images.push(downloadUrl);
      }
    }

    let product: IProduct | undefined;
    firstValueFrom(this.getProductById(id)).then((product: IProduct | undefined) => {
      product = product;
    })
    if (!product){
      this.notificationsService.showError('No such product!')
      return;
    }

    const newProduct: IProduct = {
      uid: id,
      name: name,
      desc: description,
      price: price,
      images: images,
      specifications: specifications || null,
      categoryId: categoryId,
      subcategoryId: subcategoryId,
      sellerId: sellerId,
      quantity: quantity,
      status: product.status,
    };

    console.log(newProduct);

    await this.fireStore
      .collection<IProduct>(
        `products`
      )
      .doc(id)
      .set(newProduct, {merge: true})
      .then(() =>
        this.notificationsService.showSuccess('Product UPDATED successfully!')
      )
      .catch((error) => this.notificationsService.showError(error))
      .finally(() => this.loaderService.hide());
  }

  async deleteProductById(productId: string) {
    this.loaderService.show()
    await this.fireStore
      .collection<IProduct>(
        // `categories/${categoryId}/subcategories/${subcategoryId}/products`
        `products`
      )
      .doc(productId)
      .delete()
      .then(() =>
        this.notificationsService.showSuccess('Product DELETED successfully!')
      )
      .catch((error) => this.notificationsService.showError(error))
      .finally(() => this.loaderService.hide());
  }

  getProductById(productId: string): Observable<IProduct | undefined> {
    return this.fireStore
      .collection<IProduct>(
        // `categories/${categoryId}/subcategories/${subcategoryId}/products`
        `products`
      )
      .doc(productId)
      .valueChanges();
  }

  getAllProductsForSubcategory(subcategoryId: string): Observable<IProduct[]> {
    return this.fireStore
      .collection<IProduct>('products', (ref) =>
        ref.where('subcategoryId', '==', subcategoryId)
      )
      .valueChanges();
  }

  //doesn't work as expected - firebase has limited functionality, the search is CASE SENSITIVE and it works only if
  //the word starts with {searchValue}
  getAllProductsForSeller(
    sellerId: string,
    searchValue: string
  ): Observable<IProduct[]> {
    return this.fireStore
      .collection<IProduct>('products', (ref) => {
        const query: Query = ref.where('sellerId', '==', sellerId);
        if (searchValue) {
          return query
            .orderBy('name')
            .startAt(searchValue)
            .endAt(searchValue + '\uf8ff');
        }
        return query;
      })
      .valueChanges();
  }
}
