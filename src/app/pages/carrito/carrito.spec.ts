import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface CartItem {
  id_producto: number;
  nombre: string;
  precio: number;
  cantidad: number;
  ruta: string;
  presentacion: string;
  marca: string;
}

@Component({
  selector: 'app-carrito',
  imports: [CommonModule, RouterLink],
  templateUrl: './carrito.html'
})
export class CarritoComponent implements OnInit {
  cartItems: CartItem[] = [];
  total = 0;

  constructor() {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.calculateTotal();
    }
  }

  calculateTotal() {
    this.total = this.cartItems.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  }

  aumentarCantidad(item: CartItem) {
    item.cantidad += 1;
    this.saveCart();
  }

  disminuirCantidad(item: CartItem) {
    if (item.cantidad > 1) {
      item.cantidad -= 1;
      this.saveCart();
    }
  }

  eliminarProducto(idProducto: number) {
    this.cartItems = this.cartItems.filter(item => item.id_producto !== idProducto);
    this.saveCart();
  }

  limpiarCarrito() {
    this.cartItems = [];
    localStorage.removeItem('cart');
    this.calculateTotal();
  }

  private saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
    this.calculateTotal();
    
    // Forzar actualización del contador en el navbar
    window.dispatchEvent(new Event('storage'));
  }
}