export default class Herramienta {
    constructor(nombre, nivel = 1) {
        this.nombre = nombre;
        this.nivel = nivel;
    }

    efectoTiempo() {
        if (this.nombre === "regadera") {
            return 1 - 0.05 * this.nivel;
        }
        return 1;
    }

    efectoPrecio() {
        if (this.nombre === "azada") {
            return 1 + 0.05 * this.nivel;
        }
        return 1;
    }

    efectoCantidad() {
    if (this.nombre === "hoz") {
        let probabilidadExito = 0.05 * this.nivel;
        let rudoAleatorio = Math.random();

        if (rudoAleatorio < probabilidadExito) {
            return Math.max(2, this.nivel);
        }
    }
    return 1;
}
}
