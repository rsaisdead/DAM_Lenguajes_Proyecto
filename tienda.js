import GameData from "./js/GameData.js";
import Juego from "./js/Juego.js";
import HerramientaConfig from "./js/HerramientaConfig.js";
import PlantaConfig from "./js/PlantaConfig.js";

let juego = null;

async function cargar() {
    const datos = GameData.cargarJuego();

    await PlantaConfig.inicializar();
    await HerramientaConfig.inicializar();

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

function arreglar(tipo) {
    const herramienta = juego.herramientas[tipo];
    const precioReparar = HerramientaConfig.getCostoMejora(tipo, juego.dificultad, herramienta.nivel) * 0.4;    

    if (!herramienta.rota) { return; }

    if (juego.dinero < precioReparar) {
        alert("No tienes suficiente dinero");
        return;
    }

    juego.dinero -= precioReparar;

    herramienta.arreglar();
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
    if (juego.logro) {
        document.getElementById("logro").classList.remove("hidden");
    }

    document.getElementById("dinero").innerText = "Dinero disponible: " + Math.floor(juego.dinero);

    Object.values(juego.herramientas).forEach((h) => {
        const precio = HerramientaConfig.getCostoMejora(h.nombre, juego.dificultad, h.nivel);

        const lvlElem = document.getElementById(`lvl-${h.nombre}`);
        const precioElem = document.getElementById(`precio-${h.nombre}`);
        const arreglarElem = document.getElementById(`precio-arreglar-${h.nombre}`)
        const botonElem = document.getElementById(`arreglar-boton-${h.nombre}`)

        arreglarElem.innerText = precio * 0.4 ?? "-";

        if (h.rota) {
            arreglarElem.classList.remove("hidden");
            botonElem.classList.remove("hidden");
        } else {
            arreglarElem.classList.add("hidden");
            botonElem.classList.add("hidden");
        }

        if (lvlElem) {
            lvlElem.innerText = h.nivel;
        }

        if (precioElem) {
            precioElem.innerText = precio ?? "-";
        }
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
window.arreglar = arreglar;
window.volver = volver;

cargar();
