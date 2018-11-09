import { NavElement, html } from "../nav-element";


export class SchermataCreaPartita extends NavElement{

    constructor(){
        super();
    }

    render(){
        return html`
            <h1 class="title is-4">Creazione partita</h1>
        `;
    }
}