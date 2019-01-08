import { NavElement, html } from "../nav-element";

export class LoginRegistrazione extends NavElement {
    constructor() {
        super();
        //questa modifica l'ha fatta Andrea
        //dati per il login
        this.mail = "roveroniandrea@gmail.com";
        this.password = "123456";
        //quando premo il tasto per login
        this.effettuaLogin = function (e) {
                //rendo il pulsante in stato di caricamento AUTOMATICAMENTE NON RILEVERA' IL CLICK!
                e.target.classList.add("is-loading");

                //efettuo il login
                firebase.auth().signInWithEmailAndPassword(this.mail, this.password)
                    .catch(err => {
                        console.log("Errore nel login", err);
                    })
                    .then(res => {
                        //rimuovo lo stato di loading indipendentemente dal successo del login
                        e.target.classList.remove("is-loading");
                    });
            }
        }

    render() {
        return html`
            <p class="subtitle">Da fare</p>
            <a class="button is-link" @click=${(e)=> this.effettuaLogin(e)}>Effettua login di prova</a>
            <!--Qui inserire input per login o registrazione-->
        `;
    }
}