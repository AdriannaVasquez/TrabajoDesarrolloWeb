// Datos de ejemplo de productos
const productos = [
    {
        id: 1,
        nombre: "Laptop Gaming",
        precio: 1200,
        imagen: "https://via.placeholder.com/300x200?text=Laptop+Gaming",
        descripcion: "Laptop potente para gaming y trabajo"
    },
    {
        id: 2,
        nombre: "Smartphone",
        precio: 800,
        imagen: "https://via.placeholder.com/300x200?text=Smartphone",
        descripcion: "Teléfono inteligente de última generación"
    },
    {
        id: 3,
        nombre: "Auriculares Bluetooth",
        precio: 150,
        imagen: "https://via.placeholder.com/300x200?text=Auriculares",
        descripcion: "Auriculares inalámbricos con cancelación de ruido"
    },
    {
        id: 4,
        nombre: "Tablet",
        precio: 450,
        imagen: "https://via.placeholder.com/300x200?text=Tablet",
        descripcion: "Tablet ideal para trabajo y entretenimiento"
    },
    {
        id: 5,
        nombre: "Smartwatch",
        precio: 250,
        imagen: "https://via.placeholder.com/300x200?text=Smartwatch",
        descripcion: "Reloj inteligente con seguimiento de actividad"
    },
    {
        id: 6,
        nombre: "Cámara DSLR",
        precio: 900,
        imagen: "https://via.placeholder.com/300x200?text=Cámara",
        descripcion: "Cámara profesional para fotografía"
    }
];

let carrito = [];

const listaProductos = document.querySelector('.lista-productos');
const modalCarrito = document.getElementById('modal-carrito');
const listaCarrito = document.getElementById('lista-carrito');
const totalCarrito = document.getElementById('total-carrito');
const contadorCarrito = document.getElementById('contador-carrito');
const btnVerCarrito = document.getElementById('btn-ver-carrito');
const btnFinalizarCompra = document.getElementById('btn-finalizar-compra');
const cerrarModal = document.querySelector('.cerrar');

function cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarCarrito();
    }
}

function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function mostrarProductos() {
    listaProductos.innerHTML = '';
    
    productos.forEach(producto => {
        const productoElemento = document.createElement('div');
        productoElemento.classList.add('producto');
        productoElemento.innerHTML = `
            <img src="${producto.ruta}" alt="${producto.nombre}">
            <div class="producto-info">
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion}</p>
                <div class="producto-precio">$${producto.precio.toFixed(2)}</div>
                <button class="btn-agregar" data-id="${producto.id}">Agregar al Carrito</button>
            </div>
        `;
        listaProductos.appendChild(productoElemento);
    });
    
    document.querySelectorAll('.btn-agregar').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            agregarAlCarrito(id);
        });
    });
}

function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    
    if (producto) {
        const itemExistente = carrito.find(item => item.id === id);
        
        if (itemExistente) {
            itemExistente.cantidad++;
        } else {
            carrito.push({
                ...producto,
                cantidad: 1
            });
        }
        
        actualizarCarrito();
        guardarCarrito();
        
        mostrarMensaje(`${producto.nombre} agregado al carrito`);
    }
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);
    actualizarCarrito();
    guardarCarrito();
}

function actualizarCantidad(id, nuevaCantidad) {
    if (nuevaCantidad <= 0) {
        eliminarDelCarrito(id);
        return;
    }
    
    const item = carrito.find(item => item.id === id);
    if (item) {
        item.cantidad = nuevaCantidad;
        actualizarCarrito();
        guardarCarrito();
    }
}


function actualizarCarrito() {

    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    contadorCarrito.textContent = totalItems;
    
    listaCarrito.innerHTML = '';
    
    if (carrito.length === 0) {
        listaCarrito.innerHTML = '<div class="carrito-vacio">Tu carrito está vacío</div>';
        totalCarrito.textContent = '0.00';
        return;
    }
    
    let total = 0;
    
    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        
        const itemElemento = document.createElement('div');
        itemElemento.classList.add('item-carrito');
        itemElemento.innerHTML = `
            <div class="item-info">
                <h4>${item.nombre}</h4>
                <div class="item-precio">$${item.precio.toFixed(2)} c/u</div>
            </div>
            <div class="item-cantidad">
                <button class="btn-cantidad btn-restar" data-id="${item.id}">-</button>
                <span>${item.cantidad}</span>
                <button class="btn-cantidad btn-sumar" data-id="${item.id}">+</button>
            </div>
            <div class="item-subtotal">$${subtotal.toFixed(2)}</div>
            <button class="btn-eliminar" data-id="${item.id}">Eliminar</button>
        `;
        listaCarrito.appendChild(itemElemento);
    });
    
    totalCarrito.textContent = total.toFixed(2);
    
    document.querySelectorAll('.btn-restar').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            const item = carrito.find(item => item.id === id);
            if (item) {
                actualizarCantidad(id, item.cantidad - 1);
            }
        });
    });
    
    document.querySelectorAll('.btn-sumar').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            const item = carrito.find(item => item.id === id);
            if (item) {
                actualizarCantidad(id, item.cantidad + 1);
            }
        });
    });
    
    document.querySelectorAll('.btn-eliminar').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            eliminarDelCarrito(id);
        });
    });
}

function mostrarMensaje(mensaje) {
    const mensajeElemento = document.createElement('div');
    mensajeElemento.textContent = mensaje;
    mensajeElemento.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #27ae60;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 4px;
        z-index: 1001;
        box-shadow: 0 3px 10px rgba(0,0,0,0.2);
        animation: slideInRight 0.3s, fadeOut 0.3s 2.7s;
    `;
    
    document.body.appendChild(mensajeElemento);
    
    setTimeout(() => {
        document.body.removeChild(mensajeElemento);
    }, 3000);
}

btnVerCarrito.addEventListener('click', () => {
    modalCarrito.style.display = 'block';
});

cerrarModal.addEventListener('click', () => {
    modalCarrito.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modalCarrito) {
        modalCarrito.style.display = 'none';
    }
});

btnFinalizarCompra.addEventListener('click', () => {
    if (carrito.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    const confirmar = confirm(`¿Estás seguro de que quieres finalizar tu compra por $${totalCarrito.textContent}?`);
    if (confirmar) {
        alert('¡Compra realizada con éxito! Gracias por tu compra.');
        carrito = [];
        actualizarCarrito();
        guardarCarrito();
        modalCarrito.style.display = 'none';
    }
});

function init() {
    cargarCarrito();
    mostrarProductos();
}

document.addEventListener('DOMContentLoaded', init);