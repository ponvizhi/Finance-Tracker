import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth : AngularFireAuth, private router : Router) { }

  // Sign Up
  async signUp(email: string, password: string): Promise<void> {
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const uid = result.user?.uid;
      if(uid){
        localStorage.setItem('User Id', uid);
      }
    } catch (error) {
      throw error;
    }
  }

  // Login  
  async login(email: string, password: string): Promise<void> {
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(email, password);
      const uid = result.user?.uid;
      if(uid){
        localStorage.setItem('User Id', uid);
      }
    } catch (error) {
      throw error; // Propagate the error to the caller
    }
  }  

  // Logout
  async logout() {
    this.router.navigate(['/login']);
    localStorage.removeItem('User Id');
  }

  // Get Current User
  getUser(){
    return this.afAuth.authState;
  }

}
