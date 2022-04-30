import { Injectable, NgZone } from '@angular/core';
import { IUser } from '../../shared/interfaces/IUser';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  Query,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { switchMap, tap, map } from 'rxjs/operators';
import { firstValueFrom, Observable, of } from 'rxjs';
import { NotificationsService } from 'src/app/notification/services/notifications.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { IAddress } from 'src/app/shared/interfaces/IAddress';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: Observable<IUser | undefined | null>;

  constructor(
    private fireStore: AngularFirestore, // Inject Firestore service
    private fireAuth: AngularFireAuth, // Inject Firebase auth service
    private fireStorage: AngularFireStorage,
    private router: Router,
    private notificationsService: NotificationsService,
    private loaderService: LoaderService
  ) {
    this.user = this.fireAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          firstValueFrom(
            this.fireStore
              .collection<IUser>('users')
              .doc(user.uid)
              .valueChanges()
          ).then((userObject: IUser | undefined) => {
            // console.log(userObject)
            localStorage.setItem('user', JSON.stringify(userObject));
          });
          return this.fireStore.doc<IUser>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  // Sign in with email/password
  async signIn(email: string, password: string) {
    this.loaderService.show();
    await this.fireAuth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.notificationsService.showSuccess('Logged in successfully!');
      })
      .finally(() => this.loaderService.hide()); //no notification on Error because the is ServiceError message in the component
    this.router.navigateByUrl('/');
  }

  // Sign up with email/password
  private async signUp(
    email: string,
    password: string,
    displayName: string,
    userRole: string,
    status: string,
    mobilePhone?: string
  ) {
    this.loaderService.show();
    return await this.fireAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.setUserData(
          result.user,
          userRole,
          displayName,
          status,
          mobilePhone
        );
        console.log(result.user);
        this.router.navigateByUrl('/registration-completed');
      })
      .then(() =>
        this.notificationsService.showSuccess(
          `Registered as ${userRole.toUpperCase()} successfully!`
        )
      ) //no notification on Error because the is ServiceError message in the component
      .finally(() => this.loaderService.hide());
  }

  signUpUser(
    email: string,
    password: string,
    mobilePhone: string,
    displayName: string
  ) {
    return this.signUp(
      email,
      password,
      displayName,
      'user',
      'active',
      mobilePhone
    );
  }

  signUpSeller(
    email: string,
    password: string,
    companyName: string,
    mobilePhone?: string
  ) {
    return this.signUp(
      email,
      password,
      companyName,
      'seller',
      'awaiting approval',
      mobilePhone
    );
  }

  setUserData(
    user: firebase.default.User | null,
    userRole: string,
    displayName: string,
    status: string,
    mobilePhone?: string
  ) {
    if (!user) {
      return;
    }
    if (!user.email) {
      return;
    }
    if (!mobilePhone) {
      mobilePhone = '';
    }

    const userRef: AngularFirestoreDocument<any> = this.fireStore.doc(
      `users/${user.uid}`
    );
    const userData: IUser = {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      displayName: displayName,
      photoURL: user.photoURL,
      phoneNumber: mobilePhone,
      userRole: userRole,
      status: status,
      favourites: [],
      cart: [],
      addresses: [],
    };

    return userRef.set(userData, {
      merge: true,
    });
  }

  async updateUserData(
    user: IUser,
    displayName: string,
    phoneNumber: string,
    photo: File | null | undefined
  ) {
    this.loaderService.show();

    let photoURL = '';
    if (photo) {
      const filePath = `users/${user.uid}`;
      const fileRef = this.fireStorage.ref(filePath);
      //upload the picture
      await this.fireStorage.upload(filePath, photo).then(async () => {
        photoURL = await firstValueFrom(fileRef.getDownloadURL());
      });
    }

    user.displayName = displayName;
    user.phoneNumber = phoneNumber,
    user.photoURL = photoURL;

    localStorage.setItem('user', JSON.stringify(user));

    const userRef: AngularFirestoreDocument<any> = this.fireStore.doc(
      `users/${user.uid}`
    );
    return userRef
      .set(
        user,
        {
          merge: true,
        }
      )
      .then(() => this.notificationsService.showSuccess('Profile Updated!'))
      .catch((error) => this.notificationsService.showError(error))
      .finally(() => this.loaderService.hide());
  }

  isLoggedIn(): Observable<boolean> {
    return this.user.pipe(
      map((user: IUser | null | undefined) => {
        return user == null ? false : true;
      })
    );
  }

  isSeller(): Observable<boolean> {
    return this.user.pipe(
      map((user: IUser | null | undefined) => {
        return user?.userRole === 'seller' ? true : false;
      })
    );
  }

  isUser(): Observable<boolean> {
    return this.user.pipe(
      map((user: IUser | null | undefined) => {
        return user?.userRole === 'user' ? true : false;
      })
    );
  }

  isAdmin(): Observable<boolean> {
    return this.user.pipe(
      map((user: IUser | null | undefined) => {
        return user?.userRole === 'admin' ? true : false;
      })
    );
  }

  // Sign out
  async signOut() {
    this.loaderService.show();
    console.log('logging out');
    localStorage.clear();
    await this.fireAuth
      .signOut()
      .then(() => this.notificationsService.showSuccess('Logged out!'))
      .catch((error) => this.notificationsService.showError(error))
      .finally(() => this.loaderService.hide());
    this.router.navigateByUrl('/');
  }

  get getCurrentUserObservable() {
    return this.user;
  }

  getCurrentUserObject(): IUser | null {
    let user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user);
    } else {
      // this.notificationsService.showError('Not logged in!');
      return null;
    }
  }

  async addUserAddress(user: IUser, name: string, city: string, address: string){
    this.loaderService.show();

    const addressId = this.fireStore.createId();

    const addressObj: IAddress = {
      uid: addressId,
      name: name,
      city: city,
      address: address,
    }

    await this.fireStore.collection(`users/${user.uid}/addresses`)
      .doc(addressId)
      .set(addressObj)
      .then(() =>
        this.notificationsService.showSuccess('Address added successfully!')
      )
      .catch((error) => {
        this.notificationsService.showError(`Error: ${error.message}`);
      })
      .finally(() => this.loaderService.hide());
  }
  async deleteUserAddressById(user: IUser, addressId: string){
    this.loaderService.show();
    // let addressId = '';
    // firstValueFrom(this.fireStore
    //   .collection<IAddress>(`users/${user.uid}/addresses`, (ref) => ref.where('name', '==', addressName)))

    await this.fireStore.collection(`users/${user.uid}/addresses`)
      .doc(addressId)
      .delete()
      .then(() =>
        this.notificationsService.showSuccess('Address deleted successfully!')
      )
      .catch((error) => {
        this.notificationsService.showError(`Error: ${error.message}`);
      })
      .finally(() => this.loaderService.hide());
  }
  getUserAddresses(user: IUser): Observable<IAddress[]>{
    return this.fireStore
      .collection<IAddress>(`users/${user.uid}/addresses`)
      .valueChanges();
  }

  getAllSellers(searchValue?: string): Observable<IUser[]> {
    return this.fireStore
      .collection<IUser>('users', (ref) => {
        const query: Query = ref.where('userRole', '==', 'seller');
        if (searchValue) {
          return query
            .orderBy('displayName')
            .startAt(searchValue)
            .endAt(searchValue + '\uf8ff');
        }
        return query;
      })
      .valueChanges();
  }

  getSellerById(sellerId: string): Observable<IUser | undefined> {
    return this.fireStore
      .collection<IUser>('users', (ref) =>
        ref.where('userRole', '==', 'seller')
      )
      .doc(sellerId)
      .valueChanges();
  }

  async updateUserStatus(sellerId: string, status: string) {
    this.loaderService.show();

    await this.fireStore
      .collection(`users`)
      .doc(sellerId)
      .set({ status: status }, { merge: true })
      .then(() =>
        this.notificationsService.showSuccess(
          `Seller status changed to '${status}'`
        )
      )
      .catch((error) => this.notificationsService.showError(error))
      .finally(() => this.loaderService.hide());
  }
}
