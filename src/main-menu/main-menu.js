import { NavElement, html } from '../nav-element';
import { setGameContent, setReferenceNaveDaControllare } from "../utils";
import { tokenUtente } from '../main'

export class MainMenu extends NavElement {
    constructor() {
        super();
        //imposto cosa deve visualizzare l'utente per poter accedere alla creazione della partita
        this.accediACreazionePartita = html`
        <a class="button is-primary" @click=${(e) => setGameContent("schermata-crea-partita")}>
        Crea una nuova partita</a>`

        //creo reference a firebase
        this.db = firebase.firestore();

        //resetto il path della nave da controllare nella console
        setReferenceNaveDaControllare("");

        //quando clicco su "vai alla mappa"
        this.connettiMappa = function (e) {
            //disabilito il pulsante
            e.target.classList.add("is-loading");
            //contatto il database
            this.db.collection("partite").doc(tokenUtente).get()
                .catch(err => {
                    console.log("impossibile connettersi alla mappa", err);
                    e.target.classList.remove("is-loading");
                })
                .then(res => {
                    //controllo se esiste
                    if (res.exists) {
                        setGameContent("schermata-mappa");
                    }
                    else {
                        console.log("Non hai nessuna partita attiva!")
                    }
                    //abilito il pulsante
                    e.target.classList.remove("is-loading");
                })
        }
    }

    render() {
        /*pannelloMappa conterrà l'html visualizzato dall'utente nel box creazione partita
        Inizialmente informa l'utente di non essere connesso*/
        this.pannelloMappa = html`
        <p>Effettua l'accesso per poter creare una tua partita!</p>`

        //controllo che l'utente abbia fatto il login
        if(tokenUtente){
            //l'utente ha fatto il login. Qui gestisco l'accesso alle schermate riservate agli utenti connessi
            //mostro all'utente il pulsante per accedere alla partita
            this.pannelloMappa = this.accediACreazionePartita;
        }
        return html`
        <div class="tile is-ancestor">
            <div class="tile is-4 is-parent">
                <div class="tile box is-child">
                    <login-console></login-console>
                </div>
            </div>
            <div class="tile is-4 is-parent">
                <div class="tile box is-child">
                    <p>TODO gestire quando l'utente non ha fatto login</p>
                    <a class="button is-primary" @click=${(e) => this.connettiMappa(e)}>Vai alla mappa</a>
                </div>
            </div>
            <div class="tile is-4 is-parent">
                <div class="tile box is-child">
                    ${this.pannelloMappa}
                </div>
            </div>
        </div>
        `;
    }
}