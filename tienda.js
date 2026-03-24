import GameData from "./js/GameData.js";
import Juego from "./js/Juego.js";

let juego = null;

function cargar() {
    juego = new Juego(GameData.cargarJuego());

    if (!juego) {
        alert("No hay partida");
        location.href = "index.html";
        return;
    }

    document.getElementById("dinero").innerText = "Dinero disponible: " + juego.dinero;
}

function comprar(tipo, precio) {
    if (juego.dinero < precio) {
        alert("No tienes suficiente dinero");
        return;
    }

    juego.dinero -= precio;

    if (!juego.inventario[tipo]) juego.inventario[tipo] = 0;

    juego.inventario[tipo]++;

    GameData.guardarJuego(juego);

    document.getElementById("dinero").innerText = "Dinero disponible: " + juego.dinero;
}

function volver() {
    if (juego) {
        juego.guardar();
    }

    localStorage.setItem("vinoDeTienda", "true");
    location.href = "index.html";
}

window.comprar = comprar;
window.volver = volver;
cargar();
