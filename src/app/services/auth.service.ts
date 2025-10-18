import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    this.initializeAuth();
  }

  login() {
    this.isAuthenticatedSubject.next(true);
    localStorage.setItem('isLoggedIn', 'true');
  }

  // 🔓 NUEVO MÉTODO: Cerrar sesión
  logout() {
    this.isAuthenticatedSubject.next(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    console.log('✅ Sesión cerrada correctamente');
  }

  isLoggedIn(): boolean {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn && !this.isAuthenticatedSubject.value) {
      this.isAuthenticatedSubject.next(true);
    }
    return isLoggedIn;
  }

  private initializeAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    this.isAuthenticatedSubject.next(isLoggedIn);
  }
}