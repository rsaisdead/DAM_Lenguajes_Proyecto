import Dificultad from "./Dificultad.js";

export default class HerramientaConfig {
    static herramientasBase = {
        regadera: { precioBase: 1000 },
        azada: { precioBase: 1000 },
        hoz: { precioBase: 1000 },
    };

    static getCostoMejora(tipo, dificultad, nivelActual) {
        const config = this.herramientasBase[tipo];
        if (!config) return null;

        const modDificultad = Dificultad.get(dificultad);

        const precioEscalado = config.precioBase * Math.pow(1.5, nivelActual);

        return Math.round(precioEscalado * modDificultad.precio);
    }
}