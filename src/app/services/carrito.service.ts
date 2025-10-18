import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ProductoCarrito {
  id_producto: number;
  nombre: string;
  precio: number;
  ruta: string;
  descripcion: string;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carritoSubject = new BehaviorSubject<ProductoCarrito[]>([]);
  public carrito$ = this.carritoSubject.asObservable();

  constructor() {
    this.cargarCarrito();
  }

   getCantidadProducto(id_producto: number): number {  
    const producto = this.carritoSubject.value.find(item => item.id_producto === id_producto);
    return producto ? producto.cantidad : 0;
  }

  agregarAlCarrito(producto: any) {
    const carritoActual = [...this.carritoSubject.value];
    const productoExistente = carritoActual.find(item => item.id_producto === producto.id_producto); 
    
    if (productoExistente) {
      productoExistente.cantidad++;
    } else {
      carritoActual.push({
        id_producto: producto.id_producto,  
        nombre: producto.nombre,
        precio: producto.precio,
        ruta: producto.ruta,
        descripcion: producto.descripcion || '',
        cantidad: 1
      });
    }
    
    this.actualizarCarrito(carritoActual);
  }

  eliminarDelCarrito(id_producto: number) {  
    const carritoActual = this.carritoSubject.value.filter(item => item.id_producto !== id_producto);
    this.actualizarCarrito(carritoActual);
  }

  // Actualizar cantidad - CORREGIDO
  actualizarCantidad(id_producto: number, cantidad: number) {  
    if (cantidad <= 0) {
      this.eliminarDelCarrito(id_producto);
      return;
    }

    const carritoActual = this.carritoSubject.value.map(item => {
      if (item.id_producto === id_producto) {  
        return { ...item, cantidad: cantidad };
      }
      return item;
    });
    
    this.actualizarCarrito(carritoActual);
  }

  getCantidadTotal(): number {
    return this.carritoSubject.value.reduce((total, item) => total + item.cantidad, 0);
  }

  getTotal(): number {
    return this.carritoSubject.value.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  }

  limpiarCarrito() {
    this.actualizarCarrito([]);
  }

  private cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      this.carritoSubject.next(JSON.parse(carritoGuardado));
    }
  }

  private actualizarCarrito(carrito: ProductoCarrito[]) {
    this.carritoSubject.next(carrito);
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }
}