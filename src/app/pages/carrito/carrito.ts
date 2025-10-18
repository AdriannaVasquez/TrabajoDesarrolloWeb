import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CarritoService, ProductoCarrito } from './../../services/carrito.service';
import { AuthService } from './../../services/auth.service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.html',
  styleUrls: ['./carrito.css'],
  imports: [CommonModule, RouterModule]
})
export class Carrito implements OnInit {
  productos: ProductoCarrito[] = [];
  total: number = 0;
  isLoggedIn: boolean = false;

  constructor(
    private carritoService: CarritoService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }

    this.carritoService.carrito$.subscribe(carrito => {
      console.log('🔄 Carrito actualizado:', carrito);
      this.productos = carrito;
      this.total = this.carritoService.getTotal();
    });
  }

  eliminarProducto(id_producto: number) {  
    console.log('🗑️ Eliminando producto ID:', id_producto);
    this.carritoService.eliminarDelCarrito(id_producto);  
  }

  // Aumentar cantidad de un producto
  aumentarCantidad(id_producto: number) {  
    const cantidadActual = this.carritoService.getCantidadProducto(id_producto);  
    console.log('🔼 Aumentando producto ID:', id_producto, 'Cantidad actual:', cantidadActual);
    this.carritoService.actualizarCantidad(id_producto, cantidadActual + 1);  
  }

  // Disminuir cantidad de un producto
  disminuirCantidad(id_producto: number) {  
    const cantidadActual = this.carritoService.getCantidadProducto(id_producto); 
    console.log('🔽 Disminuyendo producto ID:', id_producto, 'Cantidad actual:', cantidadActual);
    
    if (cantidadActual > 1) {
      this.carritoService.actualizarCantidad(id_producto, cantidadActual - 1);  
    } else {
      this.carritoService.eliminarDelCarrito(id_producto); 
    }
  }

  finalizarCompra() {
    if (this.productos.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }

    const confirmar = confirm(`¿Estás seguro de que quieres finalizar tu compra por S/.${this.total.toFixed(2)}?`);
    if (confirmar) {
      alert('¡Compra realizada con éxito! Gracias por tu compra.');
      this.carritoService.limpiarCarrito();
    }
  }

  calcularSubtotal(producto: ProductoCarrito): number {
    return producto.precio * producto.cantidad;
  }
}