import PlantaConfig from "./PlantaConfig.js";

export default class Planta {
    constructor(tipo, dificultad, herramientas, inicio = null) {
        this.tipo = tipo;
        let config = PlantaConfig.get(tipo, dificultad);
        let tiempoMod = herramientas.regadera.efectoTiempo();
        this.tiempoTotal = config.tiempo * tiempoMod;
        this.precioBase = config.precio;

        this.inicio = inicio || Date.now();
    }

    tiempoRestante() {
        let transcurrido = Date.now() - this.inicio;
        let t = this.tiempoTotal - transcurrido;
        return Math.max(0, Math.ceil(t / 1000));
    }

    estaMaduro() {
        return Date.now() - this.inicio >= this.tiempoTotal;
    }
}
