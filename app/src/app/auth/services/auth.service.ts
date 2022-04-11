import { Injectable, NgZone } from '@angular/core';
import { IUser } from '../../shared/interfaces/IUser';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { switchMap, tap, map } from 'rxjs/operators';
import { Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: Observable<IUser  | undefined | null>;

  constructor(
    public fireStore: AngularFirestore, // Inject Firestore service
    public fireAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router
  ) {
    this.user = this.fireAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user))
          return this.fireStore.doc<IUser>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  // Sign in with email/password
  async signIn(email: string, password: string) {
    await this.fireAuth
      .signInWithEmailAndPassword(email, password).then()
    this.router.navigateByUrl('/')
  }

  // Sign up with email/password
  private async signUp(
    email: string,
    password: string,
    mobilePhone: string,
    personalName: string,
    userRole: string
  ) {
    return await this.fireAuth
      .createUserWithEmailAndPassword(email, password)

      .then((result) => {
        this.setUserData(result.user, userRole, mobilePhone, personalName);
        console.log(result.user);
        this.router.navigateByUrl('/registration-completed')
      });
  }

  signUpUser(
    email: string,
    password: string,
    mobilePhone: string,
    personalName: string
  ) {
    return this.signUp(email, password, mobilePhone, personalName, 'user');
  }

  signUpSeller(
    email: string,
    password: string,
    mobilePhone: string,
    personalName: string
  ) {
    return this.signUp(email, password, mobilePhone, personalName, 'seller');
  }

  setUserData(
    user: firebase.default.User | null,
    userRole: string,
    mobilePhone: string,
    personalName: string
  ) {
    if (!user) {
      return;
    }

    const userRef: AngularFirestoreDocument<any> = this.fireStore.doc(
      `users/${user.uid}`
    );
    const userData: IUser = {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      displayName: personalName,
      photoURL: user.photoURL,
      phoneNumber: mobilePhone,
      userRole: userRole,
    };

    return userRef.set(userData, {
      merge: true,
    });
  }

  isLoggedIn(): Observable<boolean>{
    return this.user.pipe(map((user: IUser | null | undefined) => {
      return user == null ? false : true;
    },
    ));
  }

  isSeller(): Observable<boolean>{
    return this.user.pipe(map((user: IUser | null | undefined) => {
      return user?.userRole === 'seller' ? true : false;
    },
    ));
  }

  isUser(): Observable<boolean>{
    return this.user.pipe(map((user: IUser | null | undefined) => {
      return user?.userRole === 'user' ? true : false;
    },
    ));
  }

  isAdmin(): Observable<boolean>{
    return this.user.pipe(map((user: IUser | null | undefined) => {
      return user?.userRole === 'admin' ? true : false;
    },
    ));
  }

  // Sign out
  async signOut() {
    console.log('logging out');
    await this.fireAuth.signOut();
    this.router.navigateByUrl('/');
  }

  get getCurrentUser() {
    return this.user;
  }


}
