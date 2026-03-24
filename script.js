import Juego from './js/Juego.js';
import GameData from './js/GameData.js';

let juego = null;
let semillaSeleccionada = null;

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
        herramientas: null,
        campo: Array(25).fill(null),
    };

    juego = new Juego(data);

    juego.guardar();

    iniciarJuego();
}

function iniciarJuego() {
    mostrar("juego");

    document.getElementById("infoNombre").innerText =
        "Granjero: " + juego.nombre;

    document.getElementById("infoDinero").innerText =
        "Dinero: " + juego.dinero;

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

window.nuevaPartida = nuevaPartida;
window.crearPartida = crearPartida;
window.eliminarPartida = () => GameData.eliminarPartida();
window.irTienda = irTienda;