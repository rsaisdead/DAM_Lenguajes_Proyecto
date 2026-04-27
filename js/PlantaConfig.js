import Dificultad from "./Dificultad.js";
import XMLManager from "./XMLManager.js";

export default class PlantaConfig {
    static xml = new XMLManager("datos.xml");

    static semillas = [];

    static async inicializar() {
        this.semillas = await this.xml.obtenerSemillas();
    }

    static get(tipo, dificultad) {
        let base = this.semillas.find((semilla) => semilla.tipo === tipo);

        if (!base) {
            console.error("Semilla no encontrada:", tipo);
            return null;
        }

        let mod = Dificultad.get(dificultad);

        return {
            tiempo: base.tiempo * mod.tiempo,
            precio: base.beneficio * mod.precio,
        };
    }
}
