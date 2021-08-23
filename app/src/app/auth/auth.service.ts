import { Injectable, NgZone } from '@angular/core';
import { IUser } from "../shared/interfaces/IUser";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from "@angular/router";
import { Observable } from 'rxjs';
//import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  user: firebase.default.User | null = null; 
  userRole: string | undefined | null

  constructor(
    public fireStore: AngularFirestore,   // Inject Firestore service
    public fireAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,  
  ) {    
    /* Saving user data in localstorage when logged in */
    this.fireAuth.authState.subscribe(user => {
      //logged in
      if (user) {
          this.user = user;
          this.updateUserRole(this.user)
      }})
  }

  // Sign in with email/password
  signIn(email: string, password: string) {
    return this.fireAuth.signInWithEmailAndPassword(email, password)
  }

  // Sign up with email/password
  private signUp(email:string, password:string, mobilePhone: string, personalName: string, userRole: string) {
    return this.fireAuth.createUserWithEmailAndPassword(email, password)
      
      .then(async (result) => {
        //Send Verification email?
        //this.SendVerificationMail();
        this.setUserData(result.user, userRole, mobilePhone, personalName);
        this.userRole = userRole;

        console.log(result.user)
      })
  }

  signUpUser(email:string, password:string, mobilePhone: string, personalName: string){
    return this.signUp(email, password, mobilePhone, personalName, 'user')
  }

  signUpSeller(email:string, password:string, mobilePhone: string, personalName: string){
    return this.signUp(email, password, mobilePhone, personalName, 'seller')
  }


  //Sets user role in the firestore cuz it's not possible to add as property to the user object in firebase;
  setUserData(user: firebase.default.User | null, userRole: string, mobilePhone: string, personalName: string) {
    if (!user) {
      return;
    }

    const userRef: AngularFirestoreDocument<any> = this.fireStore.doc(`users/${user.uid}`);
    const userData: IUser = {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      displayName: personalName,
      photoURL: user.photoURL,
      phoneNumber: mobilePhone,
      userRole: userRole
    }
    // const userData: IUser = {
    //   userRole: userRole
    // }

    return userRef.set(userData, {
      merge: true
    })
  }

  //TO DO: implement for future use
  // getUserData(): Observable {

  // }

  updateUserRole(user: firebase.default.User | null){
    if (!user) {
      return;
    }

    const userRef: AngularFirestoreDocument<any> = this.fireStore.doc(`users/${user.uid}`);
    userRef.valueChanges().subscribe((userData: IUser) => {
      console.log(userData);
      this.userRole = userData?.userRole;
    });
  }

  // Sign out 
  signOut() {
    return this.fireAuth.signOut().then(() => {
      this.user= null;
      this.userRole = null;
      this.router.navigateByUrl('login');
    })
  }

  get getCurrentUser(){
    return this.user;
  }
  get getUserRole(){
    return this.userRole
  }

}