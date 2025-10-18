import { Routes } from '@angular/router';
import { Inicio } from './pages/inicio/inicio';
import { Productos } from './pages/productos/productos';
import { Promociones } from './pages/promociones/promociones';
import { Carrito } from './pages/carrito/carrito';
import { Cuidadopersonal } from './pages/cuidadopersonal/cuidadopersonal';
import { Bienestar } from './pages/bienestar/bienestar';
import { Mamabebe } from './pages/mamabebe/mamabebe';
import { Vitaminas } from './pages/vitaminas/vitaminas'; 
import { Login } from './pages/login/login';  

export const routes: Routes = [
    {path: '', redirectTo: '/inicio', pathMatch: 'full'},
    {path: 'inicio', component: Inicio},
    {path: 'productos', component: Productos},
    {path: 'promociones', component: Promociones},
    {path: 'carrito', component: Carrito},
    {path: 'cuidadopersonal', component: Cuidadopersonal},
    {path: 'bienestar', component: Bienestar},
    {path: 'mamabebe', component: Mamabebe},
    {path: 'vitaminas', component: Vitaminas},
    {path: 'login', component: Login},

];
