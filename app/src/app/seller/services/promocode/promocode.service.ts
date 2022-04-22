import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { firstValueFrom, Observable } from 'rxjs';
import { NotificationsService } from 'src/app/notification/services/notifications.service';
import { IPromocode } from 'src/app/shared/interfaces/IPromocode';
import { IUser } from 'src/app/shared/interfaces/IUser';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';

@Injectable({
  providedIn: 'root',
})
export class PromocodeService {
  constructor(
    private fireStore: AngularFirestore,
    private fireStorage: AngularFireStorage,
    private loaderService: LoaderService,
    private notificationsService: NotificationsService
  ) {}

  async createPromocode(
    seller: IUser,
    code: string,
    type: string,
    subjectIds: string[],
    subjectNames: string[],
    discountType: string,
    discountValue: number
  ): Promise<boolean> {

    if (seller.status != 'active') {
      this.notificationsService.showError(
        "Your seller account is not active! You can't create new promocodes."
      );
      return false;
    }
    code = code.toUpperCase();
    let codeExists: boolean = await firstValueFrom(this.getPromocodeByName(code)).then((promocodes: IPromocode[]) => {
      if(promocodes.length > 0){
        return true;
      }
      return false;
    })
    if (codeExists){
      this.notificationsService.showError(`Promocode with code ${code} already exists!`)
      return false;
    }

    this.loaderService.show();
    const id = this.fireStore.createId();

    const promocode: IPromocode = {
      uid: id,
      type: type,
      code: code,
      subjectIds: subjectIds,
      subjectNames: subjectNames,
      discountType: discountType,
      discountValue: discountValue,
      sellerId: seller.uid,
      status: 'active',
    };

    await this.fireStore
      .collection<IPromocode>(`promocodes`)
      .doc(id)
      .set(promocode)
      .then(() =>
        this.notificationsService.showSuccess('Promocode CREATED successfully!')
      )
      .catch((error) => this.notificationsService.showError(error))
      .finally(() => this.loaderService.hide());

    return true;
  }

  async updatePromocodeStatus(promocodeId: string, status: string) {
    this.loaderService.show();

    await this.fireStore
      .collection(`promocodes`)
      .doc(promocodeId)
      .set({ status: status }, { merge: true })
      .then(() =>
        this.notificationsService.showSuccess(
          `Promocode status changed to '${status}'`
        )
      )
      .catch((error) => this.notificationsService.showError(error))
      .finally(() => this.loaderService.hide());
  }

  async deletePromocodeById(promocodeId: string) {
    this.loaderService.show();
    await this.fireStore
      .collection<IPromocode>(`promocodes`)
      .doc(promocodeId)
      .delete()
      .then(() =>
        this.notificationsService.showSuccess('Promocode DELETED successfully!')
      )
      .catch((error) => this.notificationsService.showError(error))
      .finally(() => this.loaderService.hide());
  }

  getAllPromocodesForSeller(sellerId: string): Observable<IPromocode[]> {
    return this.fireStore
      .collection<IPromocode>('promocodes', (ref) =>
        ref.where('sellerId', '==', sellerId)
      )
      .valueChanges();
  }

  getPromocodeByName(promocodeName: string): Observable<IPromocode[]>{
    return this.fireStore
      .collection<IPromocode>('promocodes', (ref) =>
        ref.where('code', '==', promocodeName)
      )
      .valueChanges();
  }
}
