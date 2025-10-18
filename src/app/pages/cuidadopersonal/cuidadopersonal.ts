import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface Producto {
  id_producto: number;
  nombre: string;
  precio: number;
  id_categoria: number;
  ruta: string;
  presentacion: string;
  marca: string;
  cantidad?: number;
}

@Component({
  selector: 'app-cuidadopersonal',
  imports: [CommonModule],
  templateUrl: './cuidadopersonal.html'
})
export class Cuidadopersonal implements OnInit {
  productosCategoria2: Producto[] = [];
  productosFiltrados: Producto[] = [];
  marcas: string[] = [];
  marcaSeleccionada: string = '';
  rangoPrecioSeleccionado: string = '';
  cargando: boolean = true;
  error: string = '';

  private apiUrl = 'https://c6vix0f64k.execute-api.us-east-1.amazonaws.com/v1/categorias';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.cargando = true;
    this.http.get<any>(this.apiUrl).subscribe({
      next: (data) => {
        this.cargando = false;
        if (data.isSuccess) {
          this.productosCategoria2 = data.data.filter((p: Producto) => p.id_categoria === 2);
          this.productosFiltrados = [...this.productosCategoria2];
          this.cargarMarcas();
        } else {
          this.error = 'Error en la respuesta del servidor';
        }
      },
      error: () => {
        this.cargando = false;
        this.error = 'Error al cargar los productos';
      }
    });
  }

  cargarMarcas() {
    const marcasSet = new Set<string>();
    this.productosCategoria2.forEach((producto) => {
      if (producto.marca) marcasSet.add(producto.marca);
    });
    this.marcas = Array.from(marcasSet).sort();
  }

  aplicarFiltros() {
    let productosFiltrados = [...this.productosCategoria2];

    if (this.marcaSeleccionada) {
      productosFiltrados = productosFiltrados.filter(p => p.marca === this.marcaSeleccionada);
    }

    if (this.rangoPrecioSeleccionado) {
      switch(this.rangoPrecioSeleccionado) {
        case '20-50':
          productosFiltrados = productosFiltrados.filter(p => p.precio >= 20 && p.precio <= 50);
          break;
        case '51-100':
          productosFiltrados = productosFiltrados.filter(p => p.precio >= 51 && p.precio <= 100);
          break;
        case '101-150':
          productosFiltrados = productosFiltrados.filter(p => p.precio >= 101 && p.precio <= 150);
          break;
      }
    }

    this.productosFiltrados = productosFiltrados;
  }

  borrarFiltros() {
    this.marcaSeleccionada = '';
    this.rangoPrecioSeleccionado = '';
    this.productosFiltrados = [...this.productosCategoria2];
  }

  agregarAlCarrito(producto: Producto) {
    const carrito: Producto[] = JSON.parse(localStorage.getItem('carrito') || '[]');

    const index = carrito.findIndex(p => p.id_producto === producto.id_producto);
    if (index !== -1) {
      carrito[index].cantidad = (carrito[index].cantidad || 1) + 1;
    } else {
      carrito.push({ ...producto, cantidad: 1 });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    alert(`${producto.nombre} agregado al carrito`);
  }
}
