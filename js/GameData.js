export default class GameData {
    static cargarJuego() {
        let data = localStorage.getItem("granjaSave");
        if (!data) return null;
        return JSON.parse(data);
    }

    static guardarJuego(juego) {
        localStorage.setItem("granjaSave", JSON.stringify(juego));
    }

    static actualizarDineroUI() {
        let juego = cargarJuego();
        if (!juego) return;

        let dineroUI = document.getElementById("infoDinero");
        if (dineroUI) {
            dineroUI.innerText = "Dinero: " + juego.dinero;
        }
    }

    static eliminarPartida() {
        localStorage.removeItem("granjaSave");

        alert("Partida eliminada");

        location.reload();
    }
}
