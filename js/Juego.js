import Herramienta from "./Herramienta.js";
import Planta from "./Planta.js";
import GameData from "./GameData.js";

export default class Juego {
    constructor(data) {
        this.nombre = data.nombre;
        this.granja = data.granja;
        this.dificultad = data.dificultad;
        this.dinero = data.dinero;
        this.inventario = data.inventario || {};
        this.logro = data.logro;
        this.dineroTotal = data.dineroTotal;

        this.herramientas = {
            azada: new Herramienta("azada", data.herramientas?.azada || 1, data.herramientasRotas?.azada || false),
            regadera: new Herramienta("regadera", data.herramientas?.regadera || 1, data.herramientasRotas?.regadera || false),
            hoz: new Herramienta("hoz", data.herramientas?.hoz || 1, data.herramientasRotas?.hoz || false),
        };

        this.campo = data.campo.map((c) => (c ? new Planta(c.tipo, this.dificultad, this.herramientas, c.inicio) : null));
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

        if (!this.herramientas.regadera.rota) {
            let numero = Math.random();

            if (numero < 0.1) {
                alert("Se ha roto tu Regadera")
                this.herramientas.regadera.rota = true;
            }
        }

        return true;
    }

    recolectar(index) {
        let cultivo = this.campo[index];

        if (!cultivo) return;

        if (!cultivo.estaMaduro()) {
            this.campo[index] = null;
            return;
        }

        let precio = cultivo.precioBase;
        precio *= this.herramientas.azada.efectoPrecio();
        precio *= this.herramientas.hoz.efectoCantidad();

        this.dinero += Math.floor(precio);
        this.dineroTotal += this.dinero;

        if (this.dineroTotal > 100 && !this.logro) {
            this.logro = true;
            alert("Logro conseguido! Ve a la tienda para verlo");
        }

        if (!this.herramientas.azada.rota) {
            let numero = Math.random();

            if (numero < 0.1) {
                alert("Se ha roto tu Azada")
                this.herramientas.azada.rota = true;
            }
        }

        if (!this.herramientas.hoz.rota) {
            let numero = Math.random();

            if (numero < 0.1) {
                alert("Se ha roto tu Hoz")
                this.herramientas.hoz.rota = true;
            }
        }

        this.campo[index] = null;

        this.guardar();
        return true;
    }

    guardar() {
        let data = {
            nombre: this.nombre,
            granja: this.granja,
            dificultad: this.dificultad,
            dinero: this.dinero,
            inventario: this.inventario,
            logro: this.logro,
            dineroTotal: this.dineroTotal,
            herramientas: {
                azada: this.herramientas.azada.nivel,
                regadera: this.herramientas.regadera.nivel,
                hoz: this.herramientas.hoz.nivel,
            },
            herramientasRotas: {
                azada: this.herramientas.azada.rota,
                regadera: this.herramientas.regadera.rota,
                hoz: this.herramientas.hoz.rota,
            },
            campo: this.campo.map((c) => (c ? { tipo: c.tipo, inicio: c.inicio } : null)),
        };

        GameData.guardarJuego(data);
    }
}
