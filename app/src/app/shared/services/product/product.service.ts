import { Injectable } from '@angular/core';
import { AngularFirestore, Query } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { IProduct } from 'src/app/shared/interfaces/IProduct';
import { IProductSpecification } from 'src/app/shared/interfaces/IProductSpecification';
import { firstValueFrom, Observable } from 'rxjs';
import { NotificationsService } from 'src/app/notification/services/notifications.service';
import { LoaderService } from '../loader/loader.service';
import { IUser } from '../../interfaces/IUser';

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
    seller: IUser,
    quantity: number,
    status: string,
  ): Promise<boolean> {
    if (seller.status!='active'){
      this.notificationsService.showError("Your seller account is not active! You can't create new products.")
      return false;
    }

    this.loaderService.show();

    const id = this.fireStore.createId();

    let images: string[] = [];

    if (filesToUpload != null) {
      for (let i = 0; i < filesToUpload.length; i++) {
        const filePath = `products/${id}/${i}`;
        //upload the image
        await this.fireStorage.upload(filePath, filesToUpload[i]);

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
      sellerId: seller.uid,
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

      return true;
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
    seller: IUser,
    quantity: number,
  ): Promise<boolean> {

    this.loaderService.show()
    let images: string[] = [];

    if (filesToUpload != null) {
      for (let i = 0; i < filesToUpload.length; i++) {
        const filePath = `products/${id}/${i}`;
        //upload the image
        await this.fireStorage.upload(filePath, filesToUpload[i]);

        const downloadUrl = await firstValueFrom(
          this.fireStorage.ref(filePath).getDownloadURL()
        );
        images.push(downloadUrl);
      }
    }

    let editableProduct: IProduct | undefined;
    await firstValueFrom(this.getProductById(id)).then((product: IProduct | undefined) => {
      editableProduct = product;
    })
    if (!editableProduct){
      this.notificationsService.showError('No such product!')
      return false;
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
      sellerId: seller.uid,
      quantity: quantity,
      status: editableProduct.status,
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

      return true;
  }

  async updateProductStatus(productId: string, status: string) {
    this.loaderService.show();

    await this.fireStore
      .collection(
        `products`
      )
      .doc(productId)
      .set({status: status}, {merge: true})
      .then(() =>
        this.notificationsService.showSuccess(`Product status changed to '${status}'`)
      )
      .catch((error) => this.notificationsService.showError(error))
      .finally(() => this.loaderService.hide());
  }

  async deleteProductById(productId: string) {
    this.loaderService.show()
    await this.fireStore
      .collection<IProduct>(
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

  async getMultipleProductsById(productIds: string[]): Promise<IProduct[]> {
    if (productIds.length > 0){
    return await firstValueFrom(this.fireStore
      .collection<IProduct>(`products`, (ref) =>
        ref.where('uid', 'in', productIds)
      )
      .valueChanges());
    } else {
      return [];
    }
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
