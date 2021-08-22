import { Injectable, NgZone } from '@angular/core';
import { User } from "../shared/interfaces/user";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from "@angular/router";
import { Observable } from 'rxjs';
//import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  user: firebase.default.User | null = null; // Save logged in user data

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
      }
      //if local storage is empty, user is NOT logged IN
      localStorage.setItem('user', JSON.stringify(this.user));
    })
  }

  // Sign in with email/password
  signIn(email: string, password: string) {
    return this.fireAuth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        console.log(result)
        localStorage.setItem('user', JSON.stringify(result));
        //this.setUserData(result.user); //update user data
      })
  }

  // Sign up with email/password
  signUp(email:string, password:string) {
    return this.fireAuth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        //Send Verification email?
        //this.SendVerificationMail();
        //this.setUserData(result.user);
        console.log(result)
      })
  }

  //Update user Data
  setUserData(user: firebase.default.User | null) {
    if (!user) {
      return;
    }

    const userRef: AngularFirestoreDocument<any> = this.fireStore.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    }
    return userRef.set(userData, {
      merge: true
    })
  }

  // Sign out 
  signOut() {
    return this.fireAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigateByUrl('login');
    })
  }

  isUserLogged(){
    if(localStorage.getItem('user')){
      return true;
    } 
    return false;
  }

}