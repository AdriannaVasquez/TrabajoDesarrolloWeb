import { Component, signal, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from './services/cart';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('PaginaWeb');
  cartItemCount = 0;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    // Suscribirse a los cambios del carrito
    this.cartService.cartCount$.subscribe(count => {
      this.cartItemCount = count;
    });
  }
}