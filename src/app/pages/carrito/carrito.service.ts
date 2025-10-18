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

  // ✅ MÉTODO PARA ACTUALIZAR CANTIDAD
  updateQuantity(productId: number, quantity: number) {
    const item = this.cartItems.find(item => item.id_producto === productId);
    if (item) {
      item.cantidad = quantity;
      if (item.cantidad <= 0) {
        this.removeFromCart(productId);
      } else {
        this.saveCart();
      }
    }
  }

  // ✅ MÉTODO PARA ELIMINAR PRODUCTO
  removeFromCart(productId: number) {
    this.cartItems = this.cartItems.filter(item => item.id_producto !== productId);
    this.saveCart();
  }

  getCartCount(): number {
    return this.cartItems.reduce((total, item) => total + item.cantidad, 0);
  }

  getCartItems(): CartItem[] {
    return [...this.cartItems];
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + (item.precio * item.cantidad), 0);
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