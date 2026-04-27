import Dificultad from "./Dificultad.js";
import XMLManager from "./XMLManager.js";

export default class HerramientaConfig {
    static xml = new XMLManager("datos.xml");

    static herramientas = [];

    static async inicializar() {
        this.herramientas = await this.xml.obtenerHerramientas();
    }

    static get(nombre, dificultad) {
        let base = this.herramientas.find((h) => h.nombre === nombre);

        if (!base) {
            console.error("Herramienta no encontrada:", nombre);
            return null;
        }

        let mod = Dificultad.get(dificultad);

        return {
            nivel: base.nivel,
            mejora: base.mejora * mod.precio,
            coste: base.coste * mod.precio,
        };
    }

    static getCostoMejora(nombre, dificultad, nivelActual) {
        let base = this.herramientas.find((h) => h.nombre === nombre);

        if (!base) {
            console.error("Herramienta no encontrada:", nombre);
            return null;
        }

        let mod = Dificultad.get(dificultad);

        let precioEscalado = base.coste * Math.pow(1.5, nivelActual);

        return Math.round(precioEscalado * mod.precio);
    }
}
