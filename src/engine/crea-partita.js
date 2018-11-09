import { NavElement, html } from "../nav-element";
import { setGameContent } from "../utils";

export class SchermataCreaPartita extends NavElement {

    constructor() {
        super();
    }

    render() {
        return html`
            <h1 class="title is-4">Creazione partita</h1>
            <div class="field">
                <label class="label">Inserisci nome della partita</label>
                <div class="control">
                    <input type="text" class="input" placeholder="Inserisci nome della partita">
                </div>
            </div>
            <div class="field">
                <label class="label">Codice squadra 1</label>
                <div class="control">
                    <input type="text" class="input" placeholder="Mantienilo segreto!">
                </div>
            </div>
            <div class="field">
                <label class="label">Codice squadra 2</label>
                <div class="control">
                    <input type="text" class="input" placeholder="Mantienilo segreto!">
                </div>
            </div>
            <div class="field is-grouped">
                <div class="control">
                    <a class="button is-primary" @click=${(e)=> this.creaPartita()}>Crea partita!</a>
                </div>
            </div>
        `;
    }

        
    creaPartita(){
        //ottengo i dati
        console.log("cambio");
        //passo alla schermata dell'engine
        setGameContent("schermata-engine");
    }
}