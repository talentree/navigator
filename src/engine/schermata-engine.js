import { NavElement, html } from "../nav-element";
import { istanzeP5, Partita, Nave } from '../utils';
import { tokenUtente } from "../main";

export class SchermataEngine extends NavElement {
    constructor() {
        super();
        this.db = firebase.firestore();
        this.navi = [];
        this.partita = null;
    }

    render() {
        return html`
            <h1 class="title is-4">Engine vero e proprio</h1>
            <!--Container p5. Viene eliminato separatamente nell'utils-->
            <div id="container-p5"></div>
        `;
    }

    /*
    first updated viene chiamato quando il render è completo.
    Devo creare qui la nuova istanza di p5 altrimenti non trova
    il container
    */
    firstUpdated() {
        //console.log("updated");
        //la variabile sketch contiene le funzioni setup e draw di p5
        let _self = this;
        let sketch = function (p) {
            //setup di p5
            p.setup = function () {
                p.createCanvas(300, 300);
                p.background(0);
                //console.log("setup completo");
                //setto il frame rate
                p.frameRate(1);
                //fermo il loop per permettere di cercare i dati su firebase
                p.noLoop();
                _self.cercaPartita(p);

            }

            p.draw = function () {
                //console.log("funzione di draw");
                p.background(50);
                for (let i = 0; i < _self.navi.length; i++) {
                    let nave = new Nave(_self.navi[i]);
                    p.ellipse(nave.pos.posx, nave.pos.posy, 15, 10);
                    //TODO far ruotare la nave
                }
            }
        };

        console.log(document.querySelector("#container-p5"));
        //creo un'istanza di p5 e la aggiungo all'array di utils.js
        istanzeP5.push(new p5(sketch, document.querySelector("#container-p5")));
    }

    cercaPartita(istanzap5) {
        this.db.collection("partite").doc(tokenUtente).get()
            .catch(err => {
                console.log("errore nell'ottenimento della partita", err);
            })
            .then(res => {
                //TODO controllare che la partita esista
                if (res.exists) {
                    //salvo i dati della partita
                    this.partita = new Partita(res.data());
                    console.log("partita ottenuta", this.partita);
                    //cerco le navi partecipanti
                    this.cercaNavi(istanzap5);
                }
                else {
                    console.log("Sembra che non abbia creato nessuna partita!")
                }
            })
    }

    cercaNavi(istanzap5) {
        //conto il numero di navi ottenute con successo
        let naviOttenute = 0;
        for (let i = 0; i < this.partita.squadre.length; i++) {
            this.db.collection("navi").doc(this.partita.squadre[i].reference).get()
                .catch(err => {
                    console.log("errore ottenimento nave", err);
                })
                .then(res => {
                    naviOttenute++;
                    //controllo se la nave esiste
                    if (res.exists) {
                        //la aggiungo all'array delle navi
                        this.navi.push(new Nave(res.data()));
                        //se tutte le navi sono state ottenute faccio cominciare il loop
                        if (naviOttenute == this.partita.squadre.length) {
                            console.log("navi ottenute: ", this.navi);
                            istanzap5.loop();
                        }
                    }
                    else {
                        console.log("Questa nave non esiste!", this.partita.squadre[i].reference);
                    }
                })
        }
    }
}