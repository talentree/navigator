import { NavElement, html } from "../nav-element";

export class LoginRegistrazione extends NavElement{
    constructor(){
        super();
        //dati per il login
        this.mail = "roveroniandrea@gmail.com";
        this.password = "123456";
        //quando premo il tasto per login
        this.effettuaLogin = function () {
            firebase.auth().signInWithEmailAndPassword(this.mail, this.password);
        }

    }

    render(){
        return html`
            <p class="subtitle">Da fare</p>
            <a class="button is-link" @click=${(e) => this.effettuaLogin()}>Effettua login di prova</a>
            <!--Qui inserire input per login o registrazione-->
        `;
    }
}