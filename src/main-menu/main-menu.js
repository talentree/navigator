import { NavElement, html } from '../nav-element';
import {setGameContent} from "../utils";

export class MainMenu extends NavElement {
    constructor() {
        super();
    }

    render() {
        return html`
        <div class="tile is-ancestor">
            <div class="tile is-4 is-parent">
                <div class="tile box is-child">
                    <login-console></login-console>
                </div>
            </div>
            <div class="tile is-4 is-parent">
                <div class="tile box is-child">
                    <a class="button is-primary" @click=${(e)=>setGameContent("schermata-mappa")}>Vai alla mappa</a>
                </div>
            </div>
            <div class="tile is-4 is-parent">
                <div class="tile box is-child">
                <a class="button is-primary" @click=${(e)=>setGameContent("schermata-crea-partita")}>Crea una nuova partita</a>
                </div>
            </div>
        </div>
        `;
    }
}