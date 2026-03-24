import GameData from "./js/GameData.js";
import Juego from "./js/Juego.js";
import HerramientaConfig from "./js/HerramientaConfig.js";

let juego = null;

function cargar() {
    const datos = GameData.cargarJuego();
    if (!datos) {
        alert("No hay partida");
        location.href = "index.html";
        return;
    }

    juego = new Juego(datos);
    actualizarInterfaz();
}

function comprar(tipo, precio) {
    if (juego.dinero < precio) {
        alert("No tienes suficiente dinero");
        return;
    }

    juego.dinero -= precio;

    if (!juego.inventario[tipo]) juego.inventario[tipo] = 0;
    juego.inventario[tipo]++;

    juego.guardar();
    actualizarInterfaz();
}

function comprarHerramienta(tipo) {
    const herramienta = juego.herramientas[tipo];
    const precioMejora = HerramientaConfig.getCostoMejora(tipo, juego.dificultad, herramienta.nivel);

    if (juego.dinero < precioMejora) {
        alert("No tienes dinero suficiente para la mejora");
        return;
    }

    juego.dinero -= precioMejora;
    herramienta.nivel++;

    juego.guardar();
    actualizarInterfaz();
}

function actualizarInterfaz() {
    document.getElementById("dinero").innerText = "Dinero disponible: " + Math.floor(juego.dinero);

    const tipos = ["regadera", "azada", "hoz"];
    tipos.forEach((tipo) => {
        const h = juego.herramientas[tipo];
        const precio = HerramientaConfig.getCostoMejora(tipo, juego.dificultad, h.nivel);

        const lvlElem = document.getElementById(`lvl-${tipo}`);
        const precioElem = document.getElementById(`precio-${tipo}`);

        if (lvlElem) lvlElem.innerText = h.nivel;
        if (precioElem) precioElem.innerText = precio;
    });
}

function volver() {
    if (juego) {
        juego.guardar();
    }

    localStorage.setItem("vinoDeTienda", "true");
    location.href = "index.html";
}

window.comprar = comprar;
window.comprarHerramienta = comprarHerramienta;
window.volver = volver;

cargar();
