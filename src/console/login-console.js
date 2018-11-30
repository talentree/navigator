import { NavElement, html } from '../nav-element';
import { setGameContent } from '../utils';

export class LoginConsole extends NavElement {

  constructor() {
    super();
    this.game = 'PartitaProva';
    this.player = 'SQUADRA';
    this.db = firebase.firestore();
  }

  login(e) {
    //disattivo il pulsante
    e.target.classList.add("is-loading");
    //contatto firestore
    this.db.collection("partite").doc(this.game).get()
      .catch(err => {
        console.log("WOOOPS, qualcosa è andato storto!", err);
      })
      .then(res => {
        //se la partita esiste
        if (res && res.exists) {
          //controllo che la squadra inserita sia giusta
          var squadre = res.data().squadre;

          for (var i = 0; i < squadre.length; i++) {
            if (squadre[i].nomeSquadra === this.player) {
              //una squadra corrisponde, cambio schermata
              setGameContent('schermata-console');
            }
          }
        }
        //mostro che le credenziali sono sbagliate (LO DICE ANCHE SE IL LOGIN E' CORRETTO, NON CAMBIA SU ITO SCHERMATA)
        console.log("Partita inesistente o squadra errata");
        //riabilito il pulsante
        e.target.classList.remove("is-loading");
      })
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
          <input class="input" type="text" .value=${this.player} @input=${e => this.player = e.target.value}/>
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
