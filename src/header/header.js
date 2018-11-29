import { NavElement, html } from "../nav-element";
import { backToMainMenu, infoScheda } from "../utils";
import { tokenUtente, mailUtente } from "../main";

export class HeaderTalentree extends NavElement {
    constructor() {
        super();

        //quando premo il tasto per login
        this.effettuaLogin = function(){
            firebase.auth().signInWithEmailAndPassword("roveroniandrea@gmail.com", "123456");
        }

        //quando premo logout
        this.effettuaLogout = function(){
            firebase.auth().signOut();
        }

        //stringa contenente l'html per far comparire il tasto login
        this.loginButton = html`
        <p>Non sei connesso!</p>
        <a class="button is-link" @click=${(e) => this.effettuaLogin()}>Login</a>
        `
    }

    render() {
        //console.log("renderizzo con ",tokenUtente)
        //contiene o tasto login o tasto logout
        let displayAutenticazione = this.loginButton;
        //se sono connesso mostro il tasto logout
        if(tokenUtente){
            displayAutenticazione = html`
            <p>Benvenuto ${mailUtente}!!</p>
            <a class="button is-link" @click=${(e) => this.effettuaLogout()}>Logout</a>
            `
        }
        return html`
            <section class="hero is-primary">
                <div class="hero-body">
                    <div class="container">
                        <h1 class="title">
                            Progetto Talentsea / Navigator
                        </h1>
                        <h2 class="subtitle">
                            mostra valore infoScheda
                        </h2>
                        <a class="button is-link" @click=${(e) => backToMainMenu()}>Main menu</a>
                        <!--Mostro il tasto corretto-->
                        ${displayAutenticazione}
                    </div>
                </div>
            </section>
        `;
    }
}