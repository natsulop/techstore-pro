// ================================================
// MENÚ HAMBURGUESA
// ================================================

const botonMenu = document.querySelector('#menu-toggle');
const navMenu = document.querySelector('#nav-menu');

if (botonMenu && navMenu) {
  botonMenu.addEventListener('click', function() {
    navMenu.classList.toggle('open');
    const estaAbierto = navMenu.classList.contains('open');
    botonMenu.setAttribute('aria-expanded', estaAbierto);
  });

  const enlaces = navMenu.querySelectorAll('a');
  enlaces.forEach(function(enlace) {
    enlace.addEventListener('click', function() {
      navMenu.classList.remove('open');
      botonMenu.setAttribute('aria-expanded', 'false');
    });
  });
}

// ================================================
// VALIDAR FORMULARIO DE CONTACTO
// ================================================

const formulario = document.querySelector('#form-contacto');

if (formulario) {
  function mostrarError(idCampo, mensaje) {
    const campo = document.querySelector('#' + idCampo);
    const spanError = document.querySelector('#error-' + idCampo);
    if (campo && spanError) {
      campo.closest('.campo').classList.add('tiene-error');
      spanError.textContent = mensaje;
    }
  }

  function limpiarError(idCampo) {
    const campo = document.querySelector('#' + idCampo);
    const spanError = document.querySelector('#error-' + idCampo);
    if (campo && spanError) {
      campo.closest('.campo').classList.remove('tiene-error');
      spanError.textContent = '';
    }
  }

  formulario.addEventListener('submit', function(evento) {
    evento.preventDefault();

    let hayErrores = false;

    const valorNombre = document.querySelector('#nombre').value.trim();
    if (valorNombre.length < 3) {
      mostrarError('nombre', 'Escribe tu nombre completo (mínimo 3 caracteres)');
      hayErrores = true;
    } else {
      limpiarError('nombre');
    }

    const valorEmail = document.querySelector('#email').value.trim();
    if (!valorEmail.includes('@') || valorEmail.length < 5) {
      mostrarError('email', 'Ingresa un correo válido (debe tener @)');
      hayErrores = true;
    } else {
      limpiarError('email');
    }

    const valorAsunto = document.querySelector('#asunto').value;
    if (valorAsunto === '') {
      mostrarError('asunto', 'Selecciona un asunto');
      hayErrores = true;
    } else {
      limpiarError('asunto');
    }

    const valorMensaje = document.querySelector('#mensaje').value.trim();
    if (valorMensaje.length < 10) {
      mostrarError('mensaje', 'El mensaje debe tener al menos 10 caracteres');
      hayErrores = true;
    } else {
      limpiarError('mensaje');
    }

    if (!hayErrores) {
      const exito = document.querySelector('#form-exito');
      if (exito) exito.style.display = 'block';
      formulario.reset();
    }
  });
}

// ================================================
// TARJETAS DINÁMICAS DESDE ARRAY
// ================================================



function crearTarjeta(producto) {
  return `
    <article class="tarjeta"
      data-id="${producto.id}"
      data-icono="${producto.icono || '📦'}"
      data-nombre="${producto.nombre}"
      data-desc="${producto.descripcion}"
      data-precio="${producto.precio}">
      <span class="badge-disponible">✓ Disponible</span>
      <img src="${producto.imagen}" alt="${producto.nombre}" class="tarjeta-img">
      <div class="tarjeta-info">
        <h3 class="tarjeta-nombre">${producto.nombre}</h3>
        <p class="tarjeta-desc">${producto.descripcion}</p>
        <div class="tarjeta-pie">
          <span class="tarjeta-precio">${producto.precio}</span>
          <button class="btn-accion">Ver más</button>
        </div>
      </div>
    </article>
  `;
}

// ================================================
// S08: CARGAR PRODUCTOS DESDE JSON
// Reemplaza el array hardcodeado de S03.
// Funciona en: productos.html (donde existe #grid-tarjetas)
// Requiere: data/productos.json con el array de productos
// ================================================

async function cargarProductos() {
  const grid = document.querySelector('#grid-tarjetas');
  if (!grid) return; // solo correr en páginas que tienen el grid

  try {
    // PASO 1 — Pedir el archivo JSON al servidor
    // await pausa aquí hasta que llegue la respuesta (el sobre)
    const respuesta = await fetch('data/productos.json');

    // PASO 2 — Leer el contenido del JSON como array JavaScript
    // .json() también es asíncrono → necesita su propio await
    const productos = await respuesta.json();

    // PASO 3 — Renderizar las tarjetas en el grid
    // productos.map(crearTarjeta) convierte cada objeto en HTML
    grid.innerHTML = productos.map(crearTarjeta).join('');

    registrarBotonesModal();
    registrarBadgeHover();   // ← agregar
    registrarBuscador();     // ← agregar

  } catch (error) {
    // Si fetch falla: muestra mensaje visible en la página
    grid.innerHTML = `
      <div class="error-fetch">
        <p>⚠️ No se pudieron cargar los productos.</p>
        <button onclick="cargarProductos()" class="btn btn-primario">Reintentar</button>
      </div>
    `;
    console.error('Error al cargar productos:', error);
  }
}

cargarProductos(); // ejecutar al cargar la página

// ================================================
// MODAL PRODUCTO
// ================================================

const modal = document.querySelector('#modal-producto');

if (modal) {
  const btnCerrar = document.querySelector('#modal-cerrar');

  // Llena el modal con los datos del producto y lo hace visible
  // tarjeta.dataset lee los atributos data-* del <article class="tarjeta">
  function abrirModal(tarjeta) {
    document.querySelector('#modal-icono').textContent  = tarjeta.dataset.icono  || '📦';
    document.querySelector('#modal-titulo').textContent = tarjeta.dataset.nombre || 'Producto';
    document.querySelector('#modal-desc').textContent   = tarjeta.dataset.desc   || '';
    document.querySelector('#modal-precio').textContent = tarjeta.dataset.precio || '';
    modal.classList.add('visible');
  }

  // Se llama desde cargarProductos() DESPUÉS de grid.innerHTML
  // porque los botones .btn-accion los crea crearTarjeta() dinámicamente
  function registrarBotonesModal() {
    document.querySelectorAll('.btn-accion').forEach(function(boton) {
      boton.addEventListener('click', function() {
        abrirModal(boton.closest('.tarjeta'));
      });
    });
  }

  // Cerrar con el botón ×
  btnCerrar.addEventListener('click', function() {
    modal.classList.remove('visible');
  });

  // Cerrar al hacer clic fuera del modal
  modal.addEventListener('click', function(e) {
    if (e.target === modal) modal.classList.remove('visible');
  });

  // Cerrar con la tecla Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') modal.classList.remove('visible');
  });
}

// ================================================
// BARRA DE PROGRESO SCROLL
// ================================================

const barraScroll = document.querySelector('#barra-scroll');
if (barraScroll) {
  window.addEventListener('scroll', function() {
    const totalDesplazamiento = document.body.scrollHeight - window.innerHeight;
    const porcentaje = (window.scrollY / totalDesplazamiento) * 100;
    barraScroll.style.width = porcentaje + '%';
  });
}

// ================================================
// BADGE HOVER EN TARJETAS
// ================================================

// Muestra el badge "✓ Disponible" al pasar el mouse por una tarjeta
// Se llama desde cargarProductos() — las tarjetas deben existir primero
function registrarBadgeHover() {
  document.querySelectorAll('.tarjeta').forEach(function(tarjeta) {
    const badge = tarjeta.querySelector('.badge-disponible');
    if (badge) {
      tarjeta.addEventListener('mouseover', function() { badge.classList.add('visible'); });
      tarjeta.addEventListener('mouseout',  function() { badge.classList.remove('visible'); });
    }
  });
}

// Filtra las tarjetas en tiempo real según lo que escribe el usuario
// Se llama desde cargarProductos() — las tarjetas deben existir primero
function registrarBuscador() {
  const buscador = document.querySelector('#buscador');
  if (!buscador) return; // solo correr en páginas con buscador
  buscador.addEventListener('input', function() {
    // .toLowerCase() para que "macbook" encuentre "MacBook"
    const termino = buscador.value.toLowerCase();
    document.querySelectorAll('.tarjeta').forEach(function(tarjeta) {
      const nombre = tarjeta.dataset.nombre.toLowerCase();
      // muestra u oculta según si el nombre incluye el término buscado
      tarjeta.style.display = nombre.includes(termino) ? 'block' : 'none';
    });
  });
}

// ================================================
// BÚSQUEDA EN TIEMPO REAL
// ================================================

const buscador = document.querySelector('#buscador');
if (buscador) {
  buscador.addEventListener('input', function() {
    const termino = buscador.value.toLowerCase().trim();
    todasLasTarjetas.forEach(function(tarjeta) {
      const nombre = tarjeta.dataset.nombre.toLowerCase();
      if (nombre.includes(termino) || termino === '') {
        tarjeta.style.display = 'block';
      } else {
        tarjeta.style.display = 'none';
      }
    });
  });
}

// ================================================
// TEMA OSCURO
// ================================================

function aplicarTemaGuardado() {
  const tema = localStorage.getItem('tema');
  if (tema === 'oscuro') {
    document.body.classList.add('tema-oscuro');
    const btn = document.getElementById('btn-tema');
    if (btn) btn.textContent = '☀️';
  }
}

function toggleTema() {
  const esOscuro = document.body.classList.toggle('tema-oscuro');
  const btn = document.getElementById('btn-tema');
  if (esOscuro) {
    localStorage.setItem('tema', 'oscuro');
    if (btn) btn.textContent = '☀️';
  } else {
    localStorage.setItem('tema', 'claro');
    if (btn) btn.textContent = '🌙';
  }
}

const btnTema = document.getElementById('btn-tema');
if (btnTema) {
  btnTema.addEventListener('click', toggleTema);
}

aplicarTemaGuardado();

// ================================================
// CARRITO DE COMPRAS
// ================================================

function leerCarrito() {
  const guardado = localStorage.getItem('carrito');
  return guardado ? JSON.parse(guardado) : [];
}

function guardarCarrito(carrito) {
  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarBadge();
}

function actualizarBadge() {
  const badge = document.getElementById('carrito-badge');
  if (!badge) return;
  const carrito = leerCarrito();
  badge.textContent = carrito.length;
}

function agregarAlCarrito(producto) {
  const carrito = leerCarrito();
  carrito.push(producto);
  guardarCarrito(carrito);
  alert(`✅ ${producto.nombre} agregado al carrito`);
}

const btnModalCarrito = document.querySelector('.modal-btn-carrito');
if (btnModalCarrito) {
  btnModalCarrito.addEventListener('click', function() {
    const producto = {
      nombre: document.getElementById('modal-titulo').textContent,
      precio: document.getElementById('modal-precio').textContent,
      icono: document.getElementById('modal-icono').textContent,
      fecha: new Date().toLocaleDateString('es-CO')
    };
    agregarAlCarrito(producto);
    const modal = document.getElementById('modal-producto');
    if (modal) modal.classList.remove('visible');
  });
}

actualizarBadge();

// ================================================
// PÁGINA CARRITO - Solo se ejecuta en carrito.html
// ================================================

function mostrarPaginaCarrito() {
  const lista = document.getElementById('lista-carrito');
  const resumen = document.getElementById('carrito-resumen');
  if (!lista) return;

  const carrito = leerCarrito();

  if (carrito.length === 0) {
    if (resumen) resumen.textContent = 'Tu carrito está vacío';
    lista.innerHTML = '<p class="carrito-vacio">No hay productos en el carrito. <a href="index.html">Ver productos →</a></p>';
    return;
  }

  if (resumen) resumen.textContent = `${carrito.length} producto(s) en el carrito`;
  lista.innerHTML = '';

  carrito.forEach(function(producto, indice) {
    const item = document.createElement('div');
    item.classList.add('carrito-item');
    item.innerHTML = `
      <span class="carrito-item-icono">${producto.icono || '📦'}</span>
      <div class="carrito-item-info">
        <div class="carrito-item-nombre">${producto.nombre}</div>
        <div class="carrito-item-precio">${producto.precio}</div>
        <div class="carrito-item-fecha">Agregado: ${producto.fecha || 'Hoy'}</div>
      </div>
      <button class="btn-eliminar" data-indice="${indice}">Eliminar</button>
    `;
    lista.appendChild(item);
  });

  document.querySelectorAll('.btn-eliminar').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const indice = parseInt(this.dataset.indice);
      const carritoActual = leerCarrito();
      carritoActual.splice(indice, 1);
      guardarCarrito(carritoActual);
      mostrarPaginaCarrito();
    });
  });
}

const btnVaciar = document.getElementById('btn-vaciar');
if (btnVaciar) {
  btnVaciar.addEventListener('click', function() {
    if (confirm('¿Seguro que quieres vaciar el carrito?')) {
      localStorage.removeItem('carrito');
      actualizarBadge();
      mostrarPaginaCarrito();
    }
  });
}

mostrarPaginaCarrito();
