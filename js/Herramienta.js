export default class Herramienta {
    constructor(nombre, nivel = 1) {
        this.nombre = nombre;
        this.nivel = nivel;
    }

    efectoTiempo() {
        if (this.nombre === "regadera") {
            return 1 - 0.1 * this.nivel;
        }
        return 1;
    }

    efectoPrecio() {
        if (this.nombre === "azada") {
            return 1 + 0.2 * this.nivel;
        }
        return 1;
    }

    efectoCantidad() {
        if (this.nombre === "hoz") {
            return 1 + this.nivel;
        }
        return 1;
    }
}
