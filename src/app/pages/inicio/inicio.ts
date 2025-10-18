import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.css'],
  imports: [CommonModule, HttpClientModule]
})
export class Inicio implements OnInit {
  productos: any[] = [];
  productosOferta: any[] = []; 
  cargando: boolean = true;
  cargandoOfertas: boolean = true; 
  error: string = '';
  datosCrudos: any;
  mensajeExito: string = '';
  mostrarMensaje: boolean = false;

  constructor(
    private http: HttpClient,
    private carritoService: CarritoService
  ) {}

  ngOnInit() {
    this.cargarProductos();
    this.cargarProductosOferta(); 
  }

  cargarProductos() {
    this.cargando = true;
    
    this.http.get<any>('https://c6vix0f64k.execute-api.us-east-1.amazonaws.com/v1/categorias')
      .subscribe({
        next: (data) => {
          console.log('📦 DATOS CRUDOS DE LA API:', data);
          this.datosCrudos = data;
          this.productos = this.extraerProductos(data);
          console.log('🛍️ PRODUCTOS EXTRAÍDOS:', this.productos);
          this.cargando = false;
        },
        error: (error) => {
          console.error('❌ ERROR:', error);
          this.error = 'Error al cargar los productos';
          this.cargando = false;
        }
      });
  }

    cargarProductosOferta() {
    this.cargandoOfertas = true;
    
    this.http.get<any>('https://c6vix0f64k.execute-api.us-east-1.amazonaws.com/v1/categorias')
      .subscribe({
        next: (data) => {
          if (data.isSuccess && data.data) {        
            this.productosOferta = data.data
              .filter((producto: any) => producto.id_categoria === 1) 
              .slice(0, 6) 
              .map((producto: any) => {
                 const porcentajeDescuento = 5;
                const precioConDescuento = this.calcularPrecioConDescuento(producto.precio, porcentajeDescuento);             
                return {
                  ...producto,
                  precio_original: producto.precio,
                  tiene_descuento: true,
                  porcentaje_descuento: porcentajeDescuento,
                  precio: precioConDescuento
                };
              });
          }
          this.cargandoOfertas = false;
        },
        error: (error) => {
          console.error('❌ ERROR al cargar ofertas:', error);
          this.cargandoOfertas = false;
        }
      });
  }

  calcularPrecioConDescuento(precioOriginal: number, porcentajeDescuento: number): number {
    const descuento = precioOriginal * (porcentajeDescuento / 100);
    return Number((precioOriginal - descuento).toFixed(2));
  }

  private extraerProductos(data: any): any[] {
    if (Array.isArray(data)) {
      console.log('✅ La data es un array directamente');
      return data;
    }
    
    if (data.productos && Array.isArray(data.productos)) {
      console.log('✅ Productos en propiedad "productos"');
      return data.productos;
    }
    
    if (data.data && Array.isArray(data.data)) {
      console.log('✅ Productos en propiedad "data"');
      return data.data;
    }
    
    if (data.items && Array.isArray(data.items)) {
      console.log('✅ Productos en propiedad "items"');
      return data.items;
    }
    
    if (data.categorias && Array.isArray(data.categorias)) {
      console.log('✅ La data viene en "categorias", buscando productos dentro...');
      return this.extraerDeCategorias(data.categorias);
    }
    
    console.log('❓ Estructura no reconocida, revisando propiedades:', Object.keys(data));
    return [];
  }

  private extraerDeCategorias(categorias: any[]): any[] {
    const productos: any[] = [];
    
    categorias.forEach((categoria, index) => {
      console.log(`📂 Categoría ${index}:`, categoria);
      
      if (categoria.productos && Array.isArray(categoria.productos)) {
        console.log(`   🛍️ Encontré ${categoria.productos.length} productos en esta categoría`);
        productos.push(...categoria.productos);
      }
      
      if (categoria.items && Array.isArray(categoria.items)) {
        console.log(`   🛍️ Encontré ${categoria.items.length} items en esta categoría`);
        productos.push(...categoria.items);
      }
    });
    
    return productos;
  }

  scrollLeft() {
    const container = document.querySelector('.products-scroll-container') as HTMLElement;
    if (container) {
      container.scrollBy({
        left: -350,
        behavior: 'smooth'
      });
    }
  }

  scrollRight() {
    const container = document.querySelector('.products-scroll-container') as HTMLElement;
    if (container) {
      container.scrollBy({
        left: 350,
        behavior: 'smooth'
      });
    }
  }

  agregarAlCarrito(producto: any) {
    console.log('Agregando al carrito:', producto);
    
    try {
      const productoCarrito = {
        id: producto.id || producto.id_producto || Date.now(),
        nombre: producto.nombre || producto.title || producto.name || 'Producto',
        precio: producto.precio || producto.price || producto.valor || 0,
        ruta: producto.ruta || producto.imagen || producto.image || producto.url,
        descripcion: producto.descripcion || producto.description || '',
        cantidad: 1
      };

      if (this.carritoService && typeof this.carritoService.agregarAlCarrito === 'function') {
        this.carritoService.agregarAlCarrito(productoCarrito);
        console.log('✅ Producto agregado al carrito via servicio');
      } else {
        this.agregarAlCarritoLocalStorage(productoCarrito);
        console.log('✅ Producto agregado al carrito via localStorage');
      }

      this.mostrarMensajeExito(productoCarrito.nombre);

    } catch (error) {
      console.error('❌ Error al agregar al carrito:', error);
      this.agregarAlCarritoLocalStorage(producto);
      this.mostrarMensajeExito(producto.nombre || 'Producto');
    }
  }

  private agregarAlCarritoLocalStorage(producto: any) {
    try {
      const carritoActual = JSON.parse(localStorage.getItem('carrito') || '[]');
      const productoExistente = carritoActual.find((item: any) => item.id === producto.id);
      
      if (productoExistente) {
        productoExistente.cantidad++;
      } else {
        carritoActual.push({
          ...producto,
          cantidad: 1
        });
      }
      
      localStorage.setItem('carrito', JSON.stringify(carritoActual));
      console.log('🛒 Carrito actualizado en localStorage:', carritoActual);
      
    } catch (error) {
      console.error('❌ Error con localStorage:', error);
      throw error;
    }
  }

  private mostrarMensajeExito(nombreProducto: string) {
    this.mensajeExito = `¡${nombreProducto} agregado al carrito! 🛒`;
    this.mostrarMensaje = true;

    setTimeout(() => {
      this.mostrarMensaje = false;
      this.mensajeExito = '';
    }, 3000);
  }
}