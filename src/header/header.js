import { NavElement, html } from "../nav-element";
import { backToMainMenu, infoScheda } from "../utils";

export class HeaderTalentree extends NavElement {
    constructor() {
        super();
    }

    render() {
        return html`
            <section class="hero is-primary">
                <div class="hero-body">
                    <div class="container">
                        <h1 class="title">
                            Talentsea
                        </h1>
                        <h2 class="subtitle">
                            mostra valore infoScheda
                        </h2>
                        <a class="button is-link" @click=${(e)=>backToMainMenu()}>Main menu</a>
                    </div>
                </div>
            </section>
        `;
    }
}