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

    document.getElementById("infoNombre").innerText = "Granjero: " + juego.nombre;
    actualizarInterfazDinero();
    renderInventario();
    renderCampo();

    if (window.gameInterval) clearInterval(window.gameInterval);
    window.gameInterval = setInterval(actualizarCultivos, 1000);
}

function actualizarInterfazDinero() {
    document.getElementById("infoDinero").innerText = "Dinero: " + juego.dinero;
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
        btn.innerText = `${semilla} (${cantidad})`;

        if (semillaSeleccionada === semilla) btn.style.border = "2px solid yellow";
        
        btn.onclick = () => {
            semillaSeleccionada = semilla;
            renderInventario();
        };
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
                if (juego.plantar(i, semillaSeleccionada)) {
                    renderCampo();
                    renderInventario();
                }
            };
        } else {
            if (parcela.estaMaduro()) {
                div.classList.add("maduro");
                div.innerText = "¡Listo!";
                div.onclick = () => {
                    juego.recolectar(i);
                    actualizarInterfazDinero();
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

function continuarPartida() {
    const dataString = GameData.cargarJuego();
    if (dataString) {
        juego = new Juego(dataString);
        iniciarJuego();
    } else {
        alert("No hay partida guardada");
    }
}

function irTienda() {
    if(juego) juego.guardar();
    location.href = "tienda.html";
}

const vinoDeTienda = localStorage.getItem('vinoDeTienda');
if (vinoDeTienda === 'true') {
    localStorage.removeItem('vinoDeTienda');
    const datosGuardados = GameData.cargarJuego();
    if (datosGuardados) {
        juego = new Juego(datosGuardados);
        iniciarJuego();
    } else {
        alert('Error, vuelves de la tienda pero no hay datos guardados?');
        mostrar("menu");
    }
}

window.nuevaPartida = nuevaPartida;
window.continuarPartida = continuarPartida;
window.crearPartida = crearPartida;
window.eliminarPartida = () => GameData.eliminarPartida();
window.irTienda = irTienda;
