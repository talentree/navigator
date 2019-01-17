import { NavElement, html } from "../nav-element";
import { istanzeP5, Partita, Nave } from '../utils';
import { tokenUtente } from "../main";

export class SchermataEngine extends NavElement {
    constructor() {
        super();
        this.db = firebase.firestore();
        this.navi = [];
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
                console.log("setup completo");
                //setto il frame rate
                p.frameRate(1);
                //fermo il loop per permettere di cercare i dati su firebase
                p.noLoop();
                _self.cercaPartita(p);

            }

            p.draw = function () {
                console.log("funzione di draw");
            }
        };

        console.log(document.querySelector("#container-p5"));
        //creo un'istanza di p5 e la aggiungo all'array di utils.js
        istanzeP5.push(new p5(sketch, document.querySelector("#container-p5")));
    }

    cercaPartita(istanzap5){
        this.db.collection("partite").doc(tokenUtente).get()
        .catch(err=>{
            console.log("errore nell'ottenimento della partita",err);
        })
        .then(res=>{
            //TODO controllare che la partita esista
            //console.log("data",res.data());
            this.partita = new Partita(res.data());
            console.log("partita ottenuta",this.partita);
            this.cercaNavi(istanzap5);
        })
    }

    cercaNavi(istanzap5){
        let naviOttenute = 0;
        for(let i=0;i<this.partita.squadre.length;i++){
            this.db.collection("navi").doc(this.partita.squadre[i].reference).get()
            .catch(err=>{
                console.log("errore ottenimento nave",err);
            })
            .then(res=>{
                naviOttenute++;
                //TODO controllare che esista la nave
                this.navi.push(new Nave(res.data()));
                if(naviOttenute== this.partita.squadre.length){
                    istanzap5.loop();
                }
            })
        }
    }
}