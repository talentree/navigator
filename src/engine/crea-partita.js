import { NavElement, html } from "../nav-element";
import { setGameContent } from "../utils";

export class SchermataCreaPartita extends NavElement {

    static get properties() {
        //elenco delle proprietà che causano l'update quando cambiano valore
        return {
            numeroSquadre: { type: Number }
        }
    }
    constructor() {
        super();
        this.db = firebase.firestore();
        //true se il nome partita non esiste già su firebase
        this.partitaValida = false;
        //numero di squadre e array con dati delle squadre
        this.numeroSquadre = 2;
        this.squadre = [];
        this.nomePartita = "";
        //se true blocca aggiornamento del nome partita
        this.stoCaricandoSuFirebase = false;
        //la reference serve a renderlo loading quandi si carica su firebase
        this.pulsanteCreaPartita = "";
        //incrementa il numero di squadre e causa l'upload
        this.aggiungiSquadra = function () {
            this.numeroSquadre++;
        }

        //aggiunge bordi rossi se il campo è vuoto
        this.controllaValiditaCampo = function (target) {
            if (!target.value) {
                target.classList.add("is-danger");
            }
            else {
                target.classList.remove("is-danger");
            }
        }
    }

    render() {
        return html`
            <h1 class="title is-4">Dati generali</h1>
            <div class="field">
                <label class="label">Inserisci nome della partita <b id="partitaGiaPresente" style="color: red"></b></label>
                <div class="control">
                    <input type="text" class="input" placeholder="Inserisci nome della partita" @input=${(e)=>{
                    if(!this.stoCaricandoSuFirebase){
                        this.controllaNomePartita(e.target)
                    }}}>
                </div>
            </div>
            <div id="elencoPartite" class="field"></div>
            <div class="field">
                <div class="control">
                    <a id="pulsanteCreaPartita" class="button is-primary" @click=${(e)=> this.creaPartita()}>Crea partita!</a>
                    <a class="button is-primary" @click=${(e)=> this.aggiungiSquadra()}>Aggiungi squadra+</a>
                </div>
            </div>
            `;
    }

    creaPartita() {
        let campiInseriti = true;
        //controllo che tuti i campi siano presenti
        this.squadre.forEach(squadra => {
            if (!squadra.nome || !squadra.codice) {
                campiInseriti = false;
            }
        })

        if (this.partitaValida && campiInseriti) {
            //completo le info (isUsed e reference)
            this.completaInfoSquadre();
            //procedo ai caricamenti
            this.caricamentoNaviSuFirebase();
        }
        else {
            console.log("mancano dati!");
        }
    }

    controllaNomePartita(target) {
        this.partitaValida = false;
        //ottengo la reference per far comparire eventuale messaggio di partita duplicata
        let labelPartitaGiaPresente = document.querySelector("#partitaGiaPresente");
        this.nomePartita = target.value;
        //se ho inserito un nome
        if (this.nomePartita) {
            this.db.collection("partite").where("nomePartita", "==", this.nomePartita).get()
                .catch(err => {
                    console.log("Errore nel recupero delle partite", err);
                })
                .then(res => {
                    if (res.size == 0) {
                        //allora non esiste nessuna partita con questo nome
                        target.classList.remove("is-danger");
                        labelPartitaGiaPresente.innerText = "";
                        this.partitaValida = true;
                    }
                    else {
                        //segnalo che esiste già una partita con questo nome
                        target.classList.add("is-danger");
                        labelPartitaGiaPresente.innerText = "(partita già presente! Scegli un altro nome)";
                        this.partitaValida = false;
                    }

                })
        }
        else {
            //non ho inserito niente nel campo, la partita deve avere un nome
            this.partitaValida = false;
            target.classList.add("is-danger");
        }
    }

    updated() {
        this.pulsanteCreaPartita = document.querySelector("#pulsanteCreaPartita");
        //console.log(this.squadre);
        //creo un div per ogni squadra
        this.inserireInput = document.querySelector("#elencoPartite");
        this.inserireInput.innerHTML = "";
        for (let i = 0; i < this.numeroSquadre; i++) {
            this.inserireInput.innerHTML += `
            <h1 class="title is-4">Squadra ${i + 1}</h1>
            <label class="label">Inserisci nome e codice</label>
            <div class="field is-grouped">
                <div class="control">
                    <input id="nomeSquadra${i}" class="input" type="text" placeholder="Nome squadra ${i + 1}">
                </div>
                <div class="control">
                    <input id="codiceSquadra${i}" class="input" type="text" placeholder="Codice squadra ${i + 1}">
                </div>
                <a id="squadra${i}" class="button is-primary">Rimuovi</a>
            </div>`
        };

        for (let i = 0; i < this.numeroSquadre; i++) {
            //se l'elemento dell'array non esiste lo imposto a {}
            this.squadre[i] = this.squadre[i] || {};
            //ottengo reference per gli input di una squadra
            let nomeSquadra = document.querySelector("#nomeSquadra" + i);
            let codiceSquadra = document.querySelector("#codiceSquadra" + i);

            //aggiungo i listener
            nomeSquadra.addEventListener("input", (e) => {
                this.squadre[i].nome = e.target.value;
                //controllo anche se il campo non è vuoto
                this.controllaValiditaCampo(e.target);
            })
            codiceSquadra.addEventListener("input", (e) => {
                this.squadre[i].codice = e.target.value;
                this.controllaValiditaCampo(e.target);
            })

            //imposto ai valori prima dell'update per non perdere dati inseriti precedentemente
            nomeSquadra.value = this.squadre[i].nome || "";
            codiceSquadra.value = this.squadre[i].codice || "";

            //ottengo reference alla squadra e aggiungo l'evento click
            let squadra = document.querySelector("#squadra" + i);
            squadra.addEventListener("click", (e) => {
                //rimuovo la squadra corrispondente
                this.squadre.splice(i, 1);
                //diminuisco il numero di squadre lanciando quindi l'update
                this.numeroSquadre--;
            })
            //elimino il pulsante per rimuovere la squadra in caso ce ne sia una sola
            if (this.numeroSquadre <= 1) {
                squadra.remove();
            }
        }
    }

    completaInfoSquadre() {
        this.squadre.forEach(squadra => {
            squadra.isUsed = false;
            squadra.reference = "";
        });
    }

    caricamentoNaviSuFirebase() {
        //aggiorno lo stato e disabilito pulsante
        this.stoCaricandoSuFirebase = true;
        this.pulsanteCreaPartita.classList.add("is-loading");
        let naviCaricate = 0;
        //per ogni squadra creo la relativa nave
        this.squadre.forEach(squadra => {
            this.db.collection("navi").add({
                posx: "100",
                posy: "100"
            })
                .catch(err => {
                    console.log("Errore nel caricamento della nave: ", err);
                    this.stoCaricandoSuFirebase = false;
                    this.pulsanteCreaPartita.classList.remove("is-loading");
                })
                .then(res => {
                    //recupero id della nave
                    squadra.reference = res.id;
                    //incremento il contatore di navi caricate su firebase
                    naviCaricate++;
                    //se tutte le navi sono caricate procedo
                    if (naviCaricate == this.squadre.length) {
                        console.log("Tutte le navi sono state caricate! Procedo caricando la partita")
                        this.caricamentoPartitaSuFirebase();
                    }
                })
        })
    }

    caricamentoPartitaSuFirebase() {
        //aggiorno gli stati
        this.stoCaricandoSuFirebase = true;
        this.pulsanteCreaPartita.classList.add("is-loading");
        //carico la partita
        this.db.collection("partite").add({
            nomePartita: this.nomePartita,
            squadre: this.squadre
        })
            .catch(err => {
                console.log("errore nel caricamento della partita!", err);
                this.stoCaricandoSuFirebase = false;
                this.pulsanteCreaPartita.classList.remove("is-loading");
            })
            .then(res => {
                console.log("Partita caricata correttamente, cambio schermata");
                this.stoCaricandoSuFirebase = false;
                this.pulsanteCreaPartita.classList.remove("is-loading");
                //carico schermata successiva
                setGameContent("schermata-engine");
            })
    }
}