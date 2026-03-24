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

        this.herramientas = data.herramientas
            ? {
                azada: new Herramienta("azada", data.herramientas.azada),
                regadera: new Herramienta("regadera", data.herramientas.regadera),
                hoz: new Herramienta("hoz", data.herramientas.hoz)
            }
            : {
                azada: new Herramienta("azada", 1),
                regadera: new Herramienta("regadera", 1),
                hoz: new Herramienta("hoz", 1)
            };

        this.campo = data.campo.map((c) =>
            c ? new Planta(c.tipo, data.dificultad, this.herramientas) : null
        );
    }

    plantar(index) {
        if (!semillaSeleccionada) {
            alert("Selecciona una semilla primero");
            return;
        }

        if ((this.inventario[semillaSeleccionada] || 0) <= 0) {
            alert("No tienes semillas");
            return;
        }

        this.inventario[semillaSeleccionada]--;

        this.campo[index] = new Planta(
            semillaSeleccionada,
            this.dificultad,
            this.herramientas
        );

        this.guardar();
    }

    recolectar(index) {
        let cultivo = this.campo[index];

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