import { NavElement, html } from '../nav-element';
import { setGameContent, setReferenceNaveDaControllare, setArraySquadrePartita } from '../utils';


export class LoginConsole extends NavElement {

  constructor() {
    super();
    this.game;
    this.squadra;
    this.codice;
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

          for (var i = 0; i < Object.keys(squadre).length; i++) {
            //controllo se esiste una squadra col nome che ho inserito, che il codice sia corretto
            if (squadre[i].nome == this.squadra && squadre[i].codice == this.codice) {
              //controllo non ci siano altri giocatori già loggati
              if(squadre[i].isUsed == false) {     
                 //se esiste assegno la reference e cambio schermata
                setReferenceNaveDaControllare(squadre[i].reference);
                //aggiorno valeore isUsed
                squadre[i].isUsed=true;
                //passo valori arraySquadre e idPartita
                setArraySquadrePartita(squadre, res.docs[0].id);
                console.log("Sqadra trovata");
                //una squadra corrisponde, cambio schermata
                setGameContent('schermata-console');
              }else {
                console.log("in uso");
              }
            } else
                {
                    console.log("dato sbagliato");
              }
          }
        }
        //riabilito il pulsante
       e.target.classList.remove("is-loading");
      }); 
  }

  updated(){
    
    this.db.collection("partite").get()
      .catch(err => {
        console.log("WOOOPS, qualcosa è andato storto!", err);
      })
      .then(res => {            
          var item="<div class='columns is-multiline is-mobile'> <div class='column is-half'><h2 class='title is-5'>Nome Partita</h2></div> <div class='column is-one-quarter'><h2 class='title is-5'>Squadre</h2></div> <div class='column is-one-quarter'><h2 class='title is-5'>Libere<h2></div>";
          //aggiungo i vari tag alla variabile
          for ( var i = 0; i <res.docs.length; i++ ){
            //controllo il numero di squadre libere
            var libere=0;
            // Object.keys(res.docs[i].data().squadre).length ->utilizzato per avere la lunghezza della mappa che viene considerata come object in firebase
            for(var f=0; f<Object.keys(res.docs[i].data().squadre).length; f++){
              if (res.docs[i].data().squadre[f].isUsed==false)
                 libere++;
             }
             //assegnando alla variabile il codice HTML necessario
            item += `<div class='column is-half'><a id="`+i+`" onclick='document.getElementById("nomePartita").value=document.getElementById("`+i+`").textContent , document.getElementById("modalPartite").style.display="none"'>`+res.docs[i].data().nomePartita+`</a> </div> 
                    <div class='column is-one-quarter'> `+Object.keys(res.docs[i].data().squadre).length+ `</div> 
                    <div class='column is-one-quarter'>`+libere+`</div>`;
          }  
          //inserisco i tag nel posto richiesto
          item+="</div>";
          document.getElementById("partite").innerHTML = item;      
      })
  }

   


  render() {
    return html`
      <div class="field">
        <label class="label">Nome del gioco:</label>
        <div class="control">
          <input class="input" id="nomePartita" type="text"  @input=${e => this.game = e.target.value}/>
        </div>
      </div>
        <div class="field">
          <div class="control">
            <a class="button is-primary" onclick="document.getElementById('modalPartite').style.display='block'" >Lista</a>
          </div>
        </div>
        
        <div class="modal " id="modalPartite" >        
        <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title title is-2 has-text-centered">Lista Partite</p>
            <button class="delete" onclick="document.getElementById('modalPartite').style.display='none'"></button>
          </header>
          <section class="modal-card-body" id="partite"> </section>
          <footer class="modal-card-foot"></footer>
       </div>
      </div>
      </div>

      <div class="field">
        <label class="label">Nome della squadra:</label>
        <div class="control">
          <input class="input" type="text"  @input=${e => this.squadra = e.target.value}/>
        </div>
      </div>
              
      <div class="field">
        <label class="label">Codice segreto:</label>
        <div class="control">
          <input class="input" type="text"  @input=${e => this.codice = e.target.value}/>
        </div>
      </div>
      <div class="field">
        <div class="control">
          <a class="button is-primary" @click=${(e) => {this.game=document.querySelector("#nomePartita").value
                                                  this.login(e)}}>Login</a>
        </div>
      </div>
    `;
  }
}
