export default class GameData {
    static cargarJuego() {
        let data = localStorage.getItem("granjaSave");
        if (!data) return null;
        try {
            return JSON.parse(data);
        } catch (e) {
            console.error("Error al parsear datos guardados", e);
            return null;
        }
    }

    static guardarJuego(data) {
        localStorage.setItem("granjaSave", JSON.stringify(data));
    }

    static actualizarDineroUI() {
        let data = this.cargarJuego();
        if (!data) return;

        let dineroUI = document.getElementById("infoDinero");
        if (dineroUI) {
            dineroUI.innerText = "Dinero: " + data.dinero;
        }
    }

    static eliminarPartida() {
        if (confirm("seguro de que quieres borrar tu granja?")) {
            localStorage.removeItem("granjaSave");
            alert("Partida eliminada");
            location.reload();
        }
    }
}
