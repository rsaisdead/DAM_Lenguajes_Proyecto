import Dificultad from './Dificultad.js';

export default class PlantaConfig {
    static semillas = {
        trigo: { tiempo: 5000, precio: 20 },
        maiz: { tiempo: 8000, precio: 34 },
    };

    static get(tipo, dificultad) {
        let base = this.semillas[tipo];
        let mod = Dificultad.get(dificultad);

        return {
            tiempo: base.tiempo * mod.tiempo,
            precio: base.precio * mod.precio,
        };
    }
}