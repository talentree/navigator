import { NavElement, html } from '../nav-element';
import { setGameContent, setReferenceNaveDaControllare } from '../utils';

export class LoginConsole extends NavElement {

  constructor() {
    super();
    this.game = 'PartitaProva';
    this.squadra = 'SQUADRA';
    this.db = firebase.firestore();
  }

  login(e) {
    //disattivo il pulsante
    e.target.classList.add("is-loading");
    //contatto firestore
    this.db.collection("partite").where("nomePartita", "==", this.game).limit(1).get()
      .catch(err => {
        console.log("WOOOPS, qualcosa è andato storto!", err);
      })
      .then(res => {
        //res è un array ma limit(1) fa si che abbia un solo valore
        if (res && res.size) {
          //ottengo l'elenco delle squadre di questa partita
          var squadre = res.docs[0].data().squadre;

          for (var i = 0; i < squadre.length; i++) {
            //controllo se esiste una squadra col nome che ho inserito
            if (squadre[i].nome === this.squadra) {
              //se esiste assegno la reference e cambio schermata
              setReferenceNaveDaControllare(squadre[i].reference.id);
              //una squadra corrisponde, cambio schermata
              setGameContent('schermata-console');
            }
          }
        }
        //mostro che le credenziali sono sbagliate (LO DICE ANCHE SE IL LOGIN E' CORRETTO, NON CAMBIA SUBITO SCHERMATA)
        console.log("Partita inesistente o squadra errata");
        //riabilito il pulsante
        e.target.classList.remove("is-loading");
      });
  }

  render() {
    return html`
      <div class="field">
        <label class="label">Nome del gioco:</label>
        <div class="control">
          <input class="input" type="text" .value=${this.game} @input=${e => this.game = e.target.value}/>
        </div>
      </div>
      <div class="field">
        <label class="label">Nome della squadra:</label>
        <div class="control">
          <input class="input" type="text" .value=${this.squadra} @input=${e => this.squadra = e.target.value}/>
        </div>
      </div>
      <div class="field">
        <div class="control">
          <a class="button is-primary" @click=${(e) => this.login(e)}>Login</a>
        </div>
      </div>
    `;
  }
}
