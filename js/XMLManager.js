export default class XMLManager {
    constructor(rutaXML) {
        this.rutaXML = rutaXML;
        this.xmlData = null;
    }

    async cargarXML() {
        if (this.xmlData) {
            return this.xmlData;
        }

        const response = await fetch(this.rutaXML);

        if (!response.ok) {
            throw new Error("No se pudo cargar el XML");
        }

        const texto = await response.text();

        const parser = new DOMParser();

        this.xmlData = parser.parseFromString(texto, "text/xml");

        return this.xmlData;
    }

    async obtenerSemillas() {
        await this.cargarXML();

        let lista = [];
        let semillas = this.xmlData.getElementsByTagName("semilla");

        for (let semilla of semillas) {
            lista.push({
                tipo: semilla.getAttribute("tipo"),
                precio: parseInt(semilla.getElementsByTagName("precio")[0].textContent),
                tiempo: parseInt(semilla.getElementsByTagName("tiempo")[0].textContent),
                beneficio: parseInt(semilla.getElementsByTagName("beneficio")[0].textContent),
            });
        }

        return lista;
    }

    async obtenerHerramientas() {
        await this.cargarXML();

        let lista = [];
        let herramientas = this.xmlData.getElementsByTagName("herramienta");

        for (let h of herramientas) {
            lista.push({
                nombre: h.getAttribute("nombre"),
                nivel: parseInt(h.getElementsByTagName("nivel")[0].textContent),
                mejora: parseInt(h.getElementsByTagName("mejora")[0].textContent),
                coste: parseInt(h.getElementsByTagName("coste")[0].textContent),
            });
        }

        return lista;
    }

    async filtrarXPath(xpath) {
        await this.cargarXML();

        let resultado = this.xmlData.evaluate(xpath, this.xmlData, null, XPathResult.ANY_TYPE, null);

        let lista = [];
        let nodo;

        while ((nodo = resultado.iterateNext())) {
            lista.push({
                tipo: nodo.getAttribute("tipo"),
                precio: parseInt(nodo.getElementsByTagName("precio")[0].textContent),
                tiempo: parseInt(nodo.getElementsByTagName("tiempo")[0].textContent),
                beneficio: parseInt(nodo.getElementsByTagName("beneficio")[0].textContent),
            });
        }

        return lista;
    }
}
