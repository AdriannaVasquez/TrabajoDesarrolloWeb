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
}

@Component({
  selector: 'app-bienestar',
  imports: [CommonModule],
  templateUrl: './bienestar.html'
})
export class Bienestar implements OnInit {
  productosCategoria3: Producto[] = [];
  cargando: boolean = true;
  error: string = ''; 

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.http.get<any>('https://c6vix0f64k.execute-api.us-east-1.amazonaws.com/v1/categorias')
      .subscribe({
        next: (data) => {
          this.cargando = false;
          if (data.isSuccess) {
            this.productosCategoria3 = data.data.filter((p: Producto) => p.id_categoria === 3);
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
}