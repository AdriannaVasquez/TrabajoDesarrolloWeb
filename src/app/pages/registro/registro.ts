import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class Registro {
  nombre = '';
  email = '';
  password = '';
  confirmPassword = '';
  mensaje = '';

  constructor(private http: HttpClient) {}

  async registrar() {
    if (this.password !== this.confirmPassword) {
      this.mensaje = 'Las contraseñas no coinciden ❌';
      return;
    }

    const data = {
      username: this.nombre,
      email: this.email,
      password: this.password
    };

    try {
      const response = await this.http.post('https://c6vix0f64k.execute-api.us-east-1.amazonaws.com/v1/registro', data).toPromise();
      this.mensaje = '✅ Registro exitoso';
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err: any) {
      this.mensaje = '❌ Error al registrar usuario';
      console.error(err);
    }
  }
}
