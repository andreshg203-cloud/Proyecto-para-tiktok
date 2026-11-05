/* ============================================================
   EMBER - funciones.js
   ============================================================ */

// Cambia este número por el real (código de país + número, sin + ni espacios)
const NUMERO_WHATSAPP = '573000000000';

/* ---------- DATOS DEL MENÚ ----------
   Para agregar un plato, añade un objeto más a este arreglo.
   Si "img" está vacío (o falla), se muestra el emoji. */
const productos = [
    {
        nombre: 'Ember Burger',
        descripcion: 'Carne artesanal, queso cheddar y salsa especial.',
        precio: 32000,
        categoria: 'hamburguesas',
        img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
        emoji: '🍔'
    },
    {
        nombre: 'Double Fire',
        descripcion: 'Doble carne, queso y cebolla caramelizada.',
        precio: 39000,
        categoria: 'hamburguesas',
        img: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800',
        emoji: '🍔'
    },
    {
        nombre: 'Golden Fries',
        descripcion: 'Papas crujientes con nuestra salsa de la casa.',
        precio: 15000,
        categoria: 'acompanantes',
        img: 'https://images.unsplash.com/photo-1579751626657-72bc17010498?w=800',
        emoji: '🍟'
    },
    {
        nombre: 'Aros de cebolla',
        descripcion: 'Empanizados al momento, dorados y crocantes.',
        precio: 14000,
        categoria: 'acompanantes',
        img: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=800',
        emoji: '🧅'
    },
    {
        nombre: 'Limonada de coco',
        descripcion: 'Fría, cremosa y con un toque de hierbabuena.',
        precio: 12000,
        categoria: 'bebidas',
        img: 'https://images.unsplash.com/photo-1634976245495-443328555f70?w=800',
        emoji: '🥥'
    },
    {
        nombre: 'Cerveza artesanal',
        descripcion: 'Rubia suave, ideal para acompañar la parrilla.',
        precio: 16000,
        categoria: 'bebidas',
        img: 'https://images.unsplash.com/photo-1615332579037-3c44b3660b53?w=800',
        emoji: '🍺'
    }
];

/* ---------- ELEMENTOS ---------- */
const navbar = document.querySelector('.navbar');
const toggle = document.querySelector('.menu-toggle');
const enlaces = document.querySelectorAll('nav a');
const contenedor = document.getElementById('productos');
const botonesFiltro = document.querySelectorAll('.filtro');

/* ---------- ANIMACIÓN DE ENTRADA ---------- */
const observerReveal = new IntersectionObserver((entradas) => {
    entradas.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            observerReveal.unobserve(e.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => observerReveal.observe(el));

/* ---------- MENÚ: TARJETAS GENERADAS ---------- */
const formatoPesos = (n) => '$' + n.toLocaleString('es-CO');

function crearPlaceholder(emoji) {
    const div = document.createElement('div');
    div.className = 'sin-imagen';
    div.textContent = emoji;
    return div;
}

function crearTarjeta(p) {
    const tarjeta = document.createElement('article');
    tarjeta.className = 'producto reveal';
    tarjeta.innerHTML = `
        <h3>${p.nombre}</h3>
        <p>${p.descripcion}</p>
        <strong>${formatoPesos(p.precio)}</strong>
    `;

    let media;
    if (p.img) {
        media = document.createElement('img');
        media.src = p.img;
        media.alt = p.nombre;
        media.loading = 'lazy';
        // Si la imagen falla, mostramos el emoji
        media.addEventListener('error', () => media.replaceWith(crearPlaceholder(p.emoji)));
    } else {
        media = crearPlaceholder(p.emoji);
    }
    tarjeta.prepend(media);

    return tarjeta;
}

function mostrarProductos(filtro = 'todos') {
    contenedor.innerHTML = '';

    const lista = filtro === 'todos'
        ? productos
        : productos.filter(p => p.categoria === filtro);

    lista.forEach(p => {
        const tarjeta = crearTarjeta(p);
        contenedor.appendChild(tarjeta);
        observerReveal.observe(tarjeta);
    });
}

botonesFiltro.forEach(boton => {
    boton.addEventListener('click', () => {
        botonesFiltro.forEach(b => b.classList.remove('activo'));
        boton.classList.add('activo');
        mostrarProductos(boton.dataset.filtro);
    });
});

mostrarProductos();

/* ---------- NAVBAR ---------- */
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
});

toggle.addEventListener('click', () => {
    const abierto = navbar.classList.toggle('abierto');
    toggle.setAttribute('aria-expanded', abierto);
});

enlaces.forEach(a => a.addEventListener('click', () => {
    navbar.classList.remove('abierto');
    toggle.setAttribute('aria-expanded', false);
}));

/* ---------- ENLACE ACTIVO SEGÚN LA SECCIÓN ---------- */
const observerNav = new IntersectionObserver((entradas) => {
    entradas.forEach(e => {
        if (e.isIntersecting) {
            enlaces.forEach(a => {
                a.classList.toggle('activo', a.getAttribute('href') === `#${e.target.id}`);
            });
        }
    });
}, { rootMargin: '-50% 0px -50% 0px' });

document.querySelectorAll('section[id]').forEach(s => observerNav.observe(s));

/* ---------- FORMULARIO DE RESERVAS ---------- */
const form = document.getElementById('form-reserva');
const mensajeOk = document.getElementById('form-ok');

// Fecha de hoy en formato AAAA-MM-DD (hora local)
const hoy = new Date();
const hoyISO = [
    hoy.getFullYear(),
    String(hoy.getMonth() + 1).padStart(2, '0'),
    String(hoy.getDate()).padStart(2, '0')
].join('-');

form.fecha.min = hoyISO;

// Cada validador devuelve '' si está bien, o el mensaje de error
const validadores = {
    nombre: (v) => v.trim().length >= 3 ? '' : 'Escribe tu nombre (mínimo 3 letras).',
    personas: (v) => {
        const n = Number(v);
        return Number.isInteger(n) && n >= 1 && n <= 12 ? '' : 'Reservamos de 1 a 12 personas.';
    },
    fecha: (v) => {
        if (!v) return 'Elige una fecha.';
        return v < hoyISO ? 'La fecha no puede ser anterior a hoy.' : '';
    },
    hora: (v) => {
        if (!v) return 'Elige una hora.';
        return v >= '12:00' && v <= '22:00' ? '' : 'Atendemos de 12:00 p. m. a 10:00 p. m.';
    }
};

function validarCampo(nombre) {
    const input = form[nombre];
    const error = validadores[nombre](input.value);
    document.getElementById(`error-${nombre}`).textContent = error;
    input.classList.toggle('invalido', error !== '');
    return error === '';
}

// Validar mientras el usuario escribe o cambia el valor
Object.keys(validadores).forEach(nombre => {
    form[nombre].addEventListener('input', () => {
        validarCampo(nombre);
        mensajeOk.hidden = true;
    });
});

function formatearFecha(iso) {
    const [anio, mes, dia] = iso.split('-');
    return `${dia}/${mes}/${anio}`;
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validamos todos (sin cortar en el primero que falle)
    const resultados = Object.keys(validadores).map(validarCampo);
    if (resultados.includes(false)) {
        form.querySelector('.invalido').focus();
        return;
    }

    const lineas = [
        'Hola, quiero reservar una mesa en EMBER:',
        `Nombre: ${form.nombre.value.trim()}`,
        `Personas: ${form.personas.value}`,
        `Fecha: ${formatearFecha(form.fecha.value)}`,
        `Hora: ${form.hora.value}`
    ];

    const comentarios = form.comentarios.value.trim();
    if (comentarios) lineas.push(`Comentarios: ${comentarios}`);

    const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(lineas.join('\n'))}`;
    window.open(url, '_blank', 'noopener');

    mensajeOk.hidden = false;
    form.reset();
    form.personas.value = 2;
});