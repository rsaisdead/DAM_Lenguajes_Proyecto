// guardado

function cargarJuego() {
    let data = localStorage.getItem("granjaSave");
    if (!data) return null;
    return JSON.parse(data);
}

function guardarJuego(juego) {
    localStorage.setItem("granjaSave", JSON.stringify(juego));
}

function actualizarDineroUI() {
    let juego = cargarJuego();
    if (!juego) return;

    let dineroUI = document.getElementById("infoDinero");
    if (dineroUI) {
        dineroUI.innerText = "Dinero: " + juego.dinero;
    }
}

function eliminarPartida() {
    localStorage.removeItem("granjaSave");

    alert("Partida eliminada");

    location.reload();
}
