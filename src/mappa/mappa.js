import { NavElement, html } from '../nav-element';
import { tokenUtente } from '../main';
import { istanzeP5 } from '../utils';

export class SchermataMappa extends NavElement {
    constructor() {
        super();
    }

    render() {
        return html`
            <h1 class="title is-4">Mappa</h1>
            <p class="subtitle">La partita si trova in path partite/${tokenUtente}</p>
        `;
    }

    /*
    first updated viene chiamato quando il render è completo.
    Devo creare qui la nuova istanza di p5 altrimenti non trova
    il container
    */
    firstUpdated() {
        // creo la variabile dell'uid utente
        // da usare all'interno di sketch
        var uidUtente = tokenUtente;
        // imposto il riferimento _self che andrà a sostituire il this
        let _self = this;

        //la variabile sketch contiene le funzioni setup e draw di p5
        let sketch = function (p) {

            p.setup = function () {
                // imposto il database e creo il canvas
                _self.db = firebase.firestore();
                p.createCanvas(300, 300);
                p.background(200);
                // uso frameRate per rallentare l'esecuzione del draw
                // in modo da poter permettere la visualizzazione delle navi
                p.frameRate(1);
                // console.log("setup completo");
            }

            p.draw = function () {
                // imposto la grossezza del puntino andrà tolto
                p.strokeWeight(20);

                // pulisco il canvas dalle vecchie navi 
                p.background(200);

                // chiamo la funzione che mi andrà a inserire le navi nel canvas
                posizioneNavi();
            }
            
            function posizioneNavi() {
                // con l'uid dell'utente vado a prendermi la sua partita
                _self.db.collection("partite").doc(uidUtente).get()
                    .catch(err => {
                        console.log("Errore ricerca squadre.", err);
                    })
                    .then(res => {
                        // per ogni squadra della partita vado a vedermi la nave corrispondente
                        res.get("squadre").forEach(squadra => {
                            // vado a prendere le coordinate delle varie navi
                            _self.db.collection("navi").doc(squadra.reference).get()
                                .catch(err => {
                                    console.log("Errore ricerca navi", err);
                                })
                                .then(res => {
                                    // inserisco la nave nelle posizioni posx e posy del database
                                    // per mezzo di un puntino andrà tolto
                                    p.point(res.get("posx"),res.get("posy"));
                                })
                        })
                    })   
            }
        };

    console.log(document.querySelector("#container-p5"));
    //creo un'istanza di p5 e la aggiungo all'array di utils.js
    istanzeP5.push(new p5(sketch, document.querySelector("#container-p5")));
    }
}