import Herramienta from './Herramienta.js';
import Planta from './Planta.js';
import GameData from './GameData.js';

export default class Juego {
    constructor(data) {
        this.nombre = data.nombre;
        this.granja = data.granja;
        this.dificultad = data.dificultad;
        this.dinero = data.dinero;
        this.inventario = data.inventario || {};

        this.herramientas = {
            azada: new Herramienta("azada", data.herramientas?.azada || 1),
            regadera: new Herramienta("regadera", data.herramientas?.regadera || 1),
            hoz: new Herramienta("hoz", data.herramientas?.hoz || 1)
        };

        this.campo = data.campo.map((c) =>
            c ? new Planta(c.tipo, this.dificultad, this.herramientas) : null
        );
    }

    plantar(index, semilla) {
        if (!semilla) {
            alert("Selecciona una semilla primero");
            return false;
        }

        if ((this.inventario[semilla] || 0) <= 0) {
            alert("No tienes semillas");
            return false;
        }

        this.inventario[semilla]--;
        this.campo[index] = new Planta(semilla, this.dificultad, this.herramientas);
        this.guardar();
        return true;
    }

    recolectar(index) {
        let cultivo = this.campo[index];
        if (!cultivo) return;

        let precio = cultivo.precioBase;
        precio *= this.herramientas.azada.efectoPrecio();
        precio *= this.herramientas.hoz.efectoCantidad();

        this.dinero += Math.floor(precio);
        this.campo[index] = null;
        this.guardar();
    }

    guardar() {
        let data = {
            nombre: this.nombre,
            granja: this.granja,
            dificultad: this.dificultad,
            dinero: this.dinero,
            inventario: this.inventario,
            herramientas: {
                azada: this.herramientas.azada.nivel,
                regadera: this.herramientas.regadera.nivel,
                hoz: this.herramientas.hoz.nivel
            },
            campo: this.campo.map((c) => (c ? { tipo: c.tipo } : null)),
        };

        GameData.guardarJuego(data);
    }
}
