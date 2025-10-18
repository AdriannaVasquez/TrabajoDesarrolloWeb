import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  id_producto: number;
  nombre: string;
  precio: number;
  cantidad: number;
  ruta: string;
  presentacion: string;
  marca: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<number>(0);
  
  public cartCount$ = this.cartSubject.asObservable();

  constructor() {
    this.loadCartFromStorage();
  }

  private loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.updateCartCount();
    }
  }

  addToCart(producto: any) {
    const existingItem = this.cartItems.find(item => item.id_producto === producto.id_producto);
    
    if (existingItem) {
      existingItem.cantidad += 1;
    } else {
      this.cartItems.push({
        id_producto: producto.id_producto,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: 1,
        ruta: producto.ruta,
        presentacion: producto.presentacion,
        marca: producto.marca
      });
    }
    
    this.saveCart();
  }

  getCartCount(): number {
    return this.cartItems.reduce((total, item) => total + item.cantidad, 0);
  }

  getCartItems(): CartItem[] {
    return [...this.cartItems];
  }

  clearCart() {
    this.cartItems = [];
    this.saveCart();
  }

  private saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
    this.updateCartCount();
  }

  private updateCartCount() {
    const totalItems = this.getCartCount();
    this.cartSubject.next(totalItems);
  }
}