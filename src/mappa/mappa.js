import { NavElement, html } from '../nav-element';


export class SchermataMappa extends NavElement {
    constructor() {
        super();

    }

    render() {
        return html`
            <h1 class="title is-4">Qui verrà mostrata la mappa del gioco creato dall'utente</h1>
        `;
    }
}