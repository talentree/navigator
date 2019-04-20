import { NavElement, html } from "../nav-element";
import { tokenUtente } from "../main";
import { setGameContent, backToMainMenu } from "../utils";

export class ControlloPartitaEsistente extends NavElement {
    constructor() {
        super();
        this.db = firebase.firestore();
        this.referenceSquadre = [];
        this.pulsanteEliminaPartita = null;
        this.pulsanteVaiAEngine = null;
    }

    render() {
        return html`
        <h1 class="title is-4" id="attendiTitolo">Attendi, controllo se hai una partita attiva...</h1>
        <div id="opzioniPartita" class="box"></div>
        `;
    }

    updated() {
        //controllo se il giocatore ha già una partita
        this.db.collection("partite").doc(tokenUtente).get()
            .catch(err => {
                console.log("Errore controllo della partita", err);
            })
            .then(res => {
                if (res.exists) {
                    //esiste, mostro qualche info
                    document.querySelector("#attendiTitolo").innerHTML = "Hai la seguente partita attiva";
                    let infoDiv = document.querySelector("#opzioniPartita");
                    let infoSquadre = "";
                    let squadre = res.data().squadre;
                    //per ogni squadra aggiungo il nome alle info da mostrare e salvo la reference nel caso si voglia cancellare
                    squadre = Object.values(squadre);
                    squadre.forEach(squadra => {
                        infoSquadre += (squadra.nome + " ");
                        this.referenceSquadre.push(squadra.reference);
                    })
                    //correggo "blabla " spazio vuoto
                    infoSquadre = infoSquadre.slice(0, infoSquadre.length - 1);
                    infoDiv.innerHTML = `
                        <p>
                            Nome: <strong>${res.data().nomePartita}</strong>
                        </p>
                        <p>
                            Squadre partecipanti: <strong>${squadre.length} (${infoSquadre})</strong>
                        </p>
                        <p>
                            Tempo di gioco: <strong>${res.data().datigenerali.gametime}</strong>
                        </p>
                        <br>
                        <a class="button is-primary" id="vaiAEngine">Vai all'engine</a>
                        <a class="button is-primary" id="eliminaPartita">Elimina partita</a>
                    `

                    this.pulsanteVaiAEngine = document.querySelector("#vaiAEngine");
                    this.pulsanteVaiAEngine.addEventListener("click", (e) => {
                        //vado all'engine
                        setGameContent("schermata-engine");
                    });

                    this.pulsanteEliminaPartita = document.querySelector("#eliminaPartita");
                    this.pulsanteEliminaPartita.addEventListener("click", (e) => {
                        //elimino navi e partite
                        this.eliminaNavi();
                    });

                }
                else {
                    //se non esiste vado alla creazione partita
                    setGameContent("schermata-crea-partita");
                }
            })
    }

    eliminaNavi() {
        //disattivo i pulsanti
        this.pulsanteEliminaPartita.classList.add("is-loading");
        this.pulsanteVaiAEngine.classList.add("is-loading");
        //elimino prima le navi
        let naviEliminate = 0;
        this.referenceSquadre.forEach(squadra => {
            this.db.collection("navi").doc(squadra).delete()
                .catch(err => {
                    console.log("Errore nell'eliminazione di una nave", err);
                })
                .then(res => {
                    naviEliminate++;
                    //se tutte le navi sono eliminate procedo con l'eliminazione della partita
                    if (naviEliminate == this.referenceSquadre.length) {
                        this.eliminaPartita();
                    }
                })
        })
    }

    eliminaPartita() {
        this.db.collection("partite").doc(tokenUtente).delete()
            .catch(err => {
                console.log("Errore nell'eliminaione della partita", err);
                this.pulsanteEliminaPartita.classList.remove("is-loading");
                this.pulsanteVaiAEngine.classList.remove("is-loading");
            })
            .then(res => {
                console.log("Partita eliminata correttamente");
                //quando la partita è eliminata vado al menù principale
                backToMainMenu();
            })
    }
}