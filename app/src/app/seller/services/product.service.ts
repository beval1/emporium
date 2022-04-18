import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { IProduct } from 'src/app/shared/interfaces/IProduct';
import { IProductSpecification } from 'src/app/shared/interfaces/IProductSpecification';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(
    private fireStore: AngularFirestore,
    private fireStorage: AngularFireStorage
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
  ) {
    const id = this.fireStore.createId();

    let images: string[] = [];

    if (filesToUpload != null) {
      for (let i = 0; i < filesToUpload.length; i++) {
        const filePath = `products/${id}/${i}`;
        //upload the image
        await (await this.fireStorage.upload(filePath, filesToUpload[i]));

        const downloadUrl = await firstValueFrom(this.fireStorage.ref(filePath).getDownloadURL());
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
      sellerId: sellerId
    };

    console.log(product)

    await this.fireStore
      .collection<IProduct>(
        `categories/${categoryId}/subcategories/${subcategoryId}/products`
      )
      .doc(id)
      .set(product);
  }

  async deleteProductById(
    categoryId: string,
    subcategoryId: string,
    productId: string
  ) {
    await this.fireStore
      .collection<IProduct>(
        `categories/${categoryId}/subcategories/${subcategoryId}/products`
      )
      .doc(productId)
      .delete();
  }

  getProductById(
    categoryId: string,
    subcategoryId: string,
    productId: string
  ): Observable<IProduct | undefined> {
    return this.fireStore
      .collection<IProduct>(
        `categories/${categoryId}/subcategories/${subcategoryId}/products`
      )
      .doc(productId)
      .valueChanges();
  }

  getAllProductsForSubcategory(
    categoryId: string,
    subcategoryId: string
  ): Observable<IProduct[]> {
    return this.fireStore
      .collection<IProduct>(
        `categories/${categoryId}/subcategories/${subcategoryId}/products`
      )
      .valueChanges();
  }
}
