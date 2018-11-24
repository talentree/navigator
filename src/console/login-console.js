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
    //controllo che il pulsante non sia disabilitato
    if (!e.target.hasAttribute("disabled")) {
      //disattivo il pulsante
      e.target.toggleAttribute("disabled", true);

      //contatto firestore
      this.db.collection("partite").doc(this.game).get()
        .then(res => {
          console.log("la partita esiste? " + res.exists);
          if(res.exists){
            //controllo che la squadra inserita sia giusta
            var squadre = res.data().squadre;
            console.log(squadre);
            for(var i=0; i< squadre.length; i++){
              if(squadre[i].nomeSquadra === this.player){
                //cambio schermata
                setGameContent('schermata-console');
              }
            }
          }
          console.log("Partita inesistente o squadra errata");
          //riabilito il pulsante
          e.target.toggleAttribute("disabled", false);
        })
    }
  }

  render() {
    return html`
      <div class="field">
        <label class="label">Nome del gioco:</label>
        <div class="control">
          <input class="input" type="text" .value=${this.game} @input=${e=> this.game = e.target.value}/>
        </div>
      </div>
      <div class="field">
        <label class="label">Nome della squadra:</label>
        <div class="control">
          <input class="input" type="text" .value=${this.player} @input=${e=> this.player = e.target.value}/>
        </div>
      </div>
      <div class="field">
        <div class="control">
          <a class="button is-primary" @click=${(e)=> this.login(e)}>Login</a>
        </div>
      </div>
    `;
  }
}
