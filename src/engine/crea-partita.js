import { NavElement, html } from "../nav-element";
import { setGameContent } from "../utils";

export class SchermataCreaPartita extends NavElement {

    static get properties() {
        return {
            prop: { type: Number },
            numeroSquadre: { type: Number }
        }
    }
    constructor() {
        super();
        this.db = firebase.firestore();
        this.partitaValida = false;
        this.numeroSquadre = 2;
        this.ciao = function () {
            this.prop = 55;
            //this.requestUpdate("prop",45);
        }
        //console.log("reload");
    }

    render() {
        return html`
            <h1 class="title is-4">Creazione partita</h1>
            <div class="field">
                <label class="label">Inserisci nome della partita <b id="partitaGiaPresente" style="color: red"></b></label>
                <div class="control">
                    <input type="text" class="input" placeholder="Inserisci nome della partita" @input=${(e)=>
                    this.controllaNomePartita(e.target)}>
                </div>
            </div>
            <div id="elencoPartite"></div>
            <div class="field">
                <div class="control">
                    <a class="button is-primary" @click=${(e)=> this.creaPartita()}>Crea partita!</a>
                    <a class="button is-primary" @click=${(e)=> this.ciao()}>reload</a>
                </div>
            </div>
            `;
    }



    creaPartita() {
        //ottengo i dati

        //passo alla schermata dell'engine
        setGameContent("schermata-engine");
    }

    controllaNomePartita(target) {
        this.partitaValida = false;
        var labelPartitaGiaPresente = document.querySelector("#partitaGiaPresente")
        if (target.value) {
            this.db.collection("partite").where("nomePartita", "==", target.value).get()
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
                        target.classList.add("is-danger");
                        labelPartitaGiaPresente.innerText = "(partita già presente! Scegli un altro nome)";
                        this.partitaValida = false;
                    }

                })
        }
        else {
            //non ho inserito niente nel campo, la partita deve avere un nome
            this.partitaValida = false;
        }
    }

    updated() {
        console.log("ciaoo", this.prop)
    }

    firstUpdated() {
        this.inserireInput = document.querySelector("#elencoPartite");
        for (var i = 0; i < this.numeroSquadre; i++) {
            this.inserireInput.innerHTML += `<div class="field">
            <label class="label">Codice squadra 1</label>
            <div class="control">
                <input type="text" class="input" placeholder="Mantienilo segreto!" @input=${(e) => this.cod1 = e.target.value}>
            </div>
        </div>`
        };
    }
}