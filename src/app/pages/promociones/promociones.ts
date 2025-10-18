import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface Producto {
  id_producto: number;
  nombre: string;
  precio: number;
  precio_original?: number;
  tiene_descuento?: boolean;
  porcentaje_descuento?: number;
  id_categoria: number;
  ruta: string;
  presentacion: string;
  marca: string;
  cantidad?: number;
}

@Component({
  selector: 'app-promociones',
  imports: [CommonModule],
  templateUrl: './promociones.html'
})
export class Promociones implements OnInit {
  productosCategoria1: Producto[] = [];
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
          this.productosCategoria1 = data.data.filter((p: Producto) => p.id_categoria === 1);
          
          this.productosCategoria1 = this.productosCategoria1.map(producto => {
            return {
              ...producto,
              precio_original: producto.precio,
              tiene_descuento: true, 
              porcentaje_descuento: 5, 
              precio: this.calcularPrecioConDescuento(producto.precio, 5) 
            };
          });
          
          this.productosFiltrados = [...this.productosCategoria1];
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

  calcularPrecioConDescuento(precioOriginal: number, porcentajeDescuento: number): number {
    const descuento = precioOriginal * (porcentajeDescuento / 100);
    return Number((precioOriginal - descuento).toFixed(2));
  }

  cargarMarcas() {
    const marcasSet = new Set<string>();
    this.productosCategoria1.forEach((producto) => {
      if (producto.marca) marcasSet.add(producto.marca);
    });
    this.marcas = Array.from(marcasSet).sort();
  }

  aplicarFiltros() {
    let productosFiltrados = [...this.productosCategoria1];

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
    this.productosFiltrados = [...this.productosCategoria1];
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