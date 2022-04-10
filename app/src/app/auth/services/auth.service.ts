import { Injectable, NgZone } from '@angular/core';
import { IUser } from '../../shared/interfaces/IUser';
// import { AngularFireAuth } from '@angular/fire/auth';
// import {
//   AngularFirestore,
//   AngularFirestoreDocument,
// } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { switchMap, tap, map } from 'rxjs/operators';
import { Observable, of} from 'rxjs';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  user,
} from '@angular/fire/auth';
import { Firestore, doc, DocumentReference, setDoc } from '@angular/fire/firestore';
import {} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user$: Observable<any>;

  constructor(
    // public fireStore: AngularFirestore, // Inject Firestore service
    // public fireAuth: AngularFireAuth, // Inject Firebase auth service
    private auth: Auth,
    private fireStore: Firestore,
    private router: Router
  ) {
    // this.user = this.fireAuth.authState.pipe(
    //   switchMap((user) => {
    //     if (user) {
    //       localStorage.setItem('user', JSON.stringify(user))
    //       return this.fireStore.doc<IUser>(`users/${user.uid}`).valueChanges();
    //     } else {
    //       return of(null);
    //     }
    //   })
    // );
    this.user$ = user(this.auth);
  }

  // Sign in with email/password
  async signIn(email: string, password: string) {
    await signInWithEmailAndPassword(this.auth, email, password)
    this.router.navigateByUrl('/')
  }

  private async signUp(
    email: string,
    password: string,
    mobilePhone: string,
    personalName: string,
    userRole: string
  ) {
    return await createUserWithEmailAndPassword(this.auth, email, password)
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
    user: any,
    userRole: string,
    mobilePhone: string,
    personalName: string
  ) {
    if (!user) {
      return;
    }

    const userRef: DocumentReference<any> = doc(this.fireStore,
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

    return setDoc(userRef, userData, {
      merge: true,
    });
  }

  isLoggedIn(): Observable<boolean>{
    return this.user$.pipe(map((user: IUser | null | undefined) => {
      return user == null ? false : true;
    },
    ));
  }

  isSeller(): Observable<boolean>{
    return this.user$.pipe(map((user: IUser | null | undefined) => {
      return user?.userRole === 'seller' ? true : false;
    },
    ));
  }

  isUser(): Observable<boolean>{
    return this.user$.pipe(map((user: IUser | null | undefined) => {
      return user?.userRole === 'user' ? true : false;
    },
    ));
  }

  isAdmin(): Observable<boolean>{
    return this.user$.pipe(map((user: IUser | null | undefined) => {
      return user?.userRole === 'admin' ? true : false;
    },
    ));
  }

  // Sign out
  async signOut() {
    console.log('logging out');
    await signOut(this.auth);
    this.router.navigateByUrl('/');
  }

  get getCurrentUser() {
    return this.user$;
  }


}
