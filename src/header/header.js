import { NavElement, html } from "../nav-element";
import { backToMainMenu, infoScheda, setGameContent } from "../utils";
import { tokenUtente, mailUtente } from "../main";

export class HeaderTalentree extends NavElement {
    constructor() {
        super();
        //quando premo login cambio schermata
        this.vaiALogin = function(){
            setGameContent("login-register");
        }
        //quando premo logout
        this.effettuaLogout = function () {
            firebase.auth().signOut();
        }

        //stringa contenente l'html per far comparire il tasto login
        this.loginButton = html`
        <p class="subtitle">Non sei connesso!</p>
        <a class="button is-link is-pulled-right" @click=${(e) => this.vaiALogin()}>Vai al login</a>
        `
    }

    render() {
        //console.log("renderizzo con ",tokenUtente)
        //contiene o tasto login o tasto logout
        let displayAutenticazione = this.loginButton;
        //se sono connesso mostro il tasto logout
        if (tokenUtente) {
            displayAutenticazione = html`
            <p class="subtitle">Benvenuto ${mailUtente}!!</p>
            <a class="button is-link is-pulled-right" @click=${(e) => this.effettuaLogout()}>Logout</a>
            `
        }
        return html`
            <section class="hero is-primary">
                <div class="hero-body columns">
                    <div class="column">
                        <h1 class="title">
                            Progetto Talentsea / Navigator
                        </h1>
                        <h2 class="subtitle">
                            mostra valore infoScheda
                        </h2>
                        <a class="button is-link" @click=${(e) => backToMainMenu()}>Main menu</a>
                    </div>
                    <div class="column">
                        <div class="is-pulled-right">
                            <!--Mostro il tasto corretto-->
                            ${displayAutenticazione}
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
}