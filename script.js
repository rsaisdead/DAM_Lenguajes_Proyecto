let juego = null;
let semillaSeleccionada = null;

class Difficulty {
    static settings = {
        facil: { tiempo: 0.7, precio: 1.2 },
        normal: { tiempo: 1, precio: 1 },
        dificil: { tiempo: 1.5, precio: 0.8 },
    };

    static get(dif) {
        return this.settings[dif] || this.settings.normal;
    }
}

class CropConfig {
    static semillas = {
        trigo: { tiempo: 5000, precio: 20 },
        maiz: { tiempo: 8000, precio: 34 },
    };

    static get(tipo, dificultad) {
        let base = this.semillas[tipo];
        let mod = Difficulty.get(dificultad);

        return {
            tiempo: base.tiempo * mod.tiempo,
            precio: base.precio * mod.precio,
        };
    }
}

class Crop {
    constructor(tipo, dificultad) {
        this.tipo = tipo;
        this.config = CropConfig.get(tipo, dificultad);

        this.inicio = Date.now();
        this.tiempoTotal = this.config.tiempo;
    }

    tiempoRestante() {
        let t = this.tiempoTotal - (Date.now() - this.inicio);
        return Math.max(0, Math.ceil(t / 1000));
    }

    estaMaduro() {
        return Date.now() - this.inicio >= this.tiempoTotal;
    }
}

class Game {
    constructor(data) {
        this.nombre = data.nombre;
        this.granja = data.granja;
        this.dificultad = data.dificultad;
        this.dinero = data.dinero;

        this.inventario = data.inventario || {};
        this.campo = data.campo.map((c) => (c ? new Crop(c.tipo, data.dificultad) : null));
    }

    plantar(index) {
        if (!semillaSeleccionada) {
            alert("Selecciona una semilla primero");
            return;
        }

        if ((this.inventario[semillaSeleccionada] || 0) <= 0) {
            alert("No tienes semillas");
            return;
        }

        this.inventario[semillaSeleccionada]--;

        this.campo[index] = new Crop(semillaSeleccionada, this.dificultad);

        this.guardar();
    }

    recolectar(index) {
        let cultivo = this.campo[index];

        let precio = CropConfig.get(cultivo.tipo, this.dificultad).precio;

        this.dinero += precio;

        this.campo[index] = null;

        this.guardar();
    }

    guardar() {
        let data = {
            nombre: this.nombre,
            granja: this.granja,
            dificultad: this.dificultad,
            dinero: this.dinero,
            inventario: this.inventario,
            campo: this.campo.map((c) => (c ? { tipo: c.tipo } : null)),
        };

        guardarJuego(data);
    }
}

function mostrar(id) {
    document.getElementById("menu").classList.add("hidden");
    document.getElementById("config").classList.add("hidden");
    document.getElementById("juego").classList.add("hidden");

    document.getElementById(id).classList.remove("hidden");
}

function nuevaPartida() {
    mostrar("config");
}

function crearPartida() {
    let nombre = document.getElementById("nombre").value;
    let granja = document.getElementById("granja").value;
    let dificultad = document.getElementById("dificultad").value;

    if (!nombre || !granja) {
        alert("Campos vacios");
        return;
    }

    let data = {
        nombre,
        granja,
        dificultad,
        dinero: 500,
        inventario: {},
        campo: Array(25).fill(null),
    };

    juego = new Game(data);

    juego.guardar();

    iniciarJuego();
}

function iniciarJuego() {
    mostrar("juego");

    document.getElementById("infoNombre").innerText = "Granjero: " + juego.nombre;

    renderInventario();
    renderCampo();

    setInterval(actualizarCultivos, 250);
}

function actualizarCultivos() {
    renderCampo();
}

function renderInventario() {
    let inv = document.getElementById("inventario");

    if (!inv) return;

    inv.innerHTML = "";

    for (let semilla in juego.inventario) {
        let cantidad = juego.inventario[semilla];

        if (cantidad <= 0) continue;

        let btn = document.createElement("button");

        btn.innerText = semilla + " (" + cantidad + ")";

        btn.onclick = () => (semillaSeleccionada = semilla);

        inv.appendChild(btn);
    }
}

function renderCampo() {
    let campo = document.getElementById("campo");

    campo.innerHTML = "";

    juego.campo.forEach((parcela, i) => {
        let div = document.createElement("div");

        div.classList.add("parcela");

        if (!parcela) {
            div.classList.add("vacio");

            div.onclick = () => {
                juego.plantar(i);
                renderCampo();
                renderInventario();
            };
        } else {
            if (parcela.estaMaduro()) {
                div.classList.add("maduro");

                div.onclick = () => {
                    juego.recolectar(i);
                    renderCampo();
                };
            } else {
                div.classList.add("plantado");

                div.innerText = parcela.tiempoRestante() + "s";
            }
        }

        campo.appendChild(div);
    });
}

function irTienda() {
    location.href = "tienda.html";
}

window.onload = function () {
    let data = cargarJuego();

    if (data) {
        juego = new Game(data);

        iniciarJuego();
    }
};
