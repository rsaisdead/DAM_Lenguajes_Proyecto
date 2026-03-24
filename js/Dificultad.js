export default class Dificultad {
    static settings = {
        facil: { tiempo: 0.7, precio: 1.2 },
        normal: { tiempo: 1, precio: 1 },
        dificil: { tiempo: 1.5, precio: 0.8 },
    };

    static get(dif) {
        return this.settings[dif] || this.settings.normal;
    }
}
