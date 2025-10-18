import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from './../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [CommonModule, FormsModule, RouterModule]
})
export class Login {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  message: string = '';
  messageType: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  async onSubmit(event: Event) {
    event.preventDefault();
    
    if (!this.email || !this.password) {
      this.showMessage('Por favor completa todos los campos', 'error');
      return;
    }

    this.isLoading = true;

    try {
      const response = await fetch('https://c6vix0f64k.execute-api.us-east-1.amazonaws.com/v1/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email: this.email, password: this.password})
      });
      
      const result = await response.json();
      
      if (result.isSuccess) {
        this.showMessage('¡Login exitoso!', 'success');
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('userEmail', this.email);
        
        this.authService.login();
        setTimeout(() => {
          this.router.navigate(['/carrito']);
        }, 1000);
        
      } else {
        this.showMessage(result.errorMessage, 'error');
      }
      
    } catch (error) {
      this.showMessage('Error de conexión', 'error');
    } finally {
      this.isLoading = false;
    }
  }

  onForgotPassword(event: Event) {
    event.preventDefault();
    alert('Recuperación de contraseña próximamente');
  }

  private showMessage(message: string, type: string) {
    this.message = message;
    this.messageType = type;
    
    setTimeout(() => {
      this.message = '';
      this.messageType = '';
    }, 5000);
  }
}