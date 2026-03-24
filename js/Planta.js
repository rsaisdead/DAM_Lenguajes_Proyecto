import PlantaConfig from './PlantaConfig.js';

export default class Planta {
    constructor(tipo, dificultad, herramientas) {
        this.tipo = tipo;
        let config = PlantaConfig.get(tipo, dificultad);
        let tiempoMod = herramientas.regadera.efectoTiempo();
        this.tiempoTotal = config.tiempo * tiempoMod;
        this.precioBase = config.precio;

        this.inicio = Date.now();
    }

    tiempoRestante() {
        let t = this.tiempoTotal - (Date.now() - this.inicio);
        return Math.max(0, Math.ceil(t / 1000));
    }

    estaMaduro() {
        return Date.now() - this.inicio >= this.tiempoTotal;
    }
}