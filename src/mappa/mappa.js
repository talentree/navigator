import { NavElement, html } from '../nav-element';
import { tokenUtente } from '../main';
import { istanzeP5, ToggleFullscreen } from '../utils';

export class SchermataMappa extends NavElement {
    constructor() {
        super();
        this.referenceSketchp5 = null;
        this.elencoNavi = [];
        this.backgroundImage = null;
        this.backgroundImageSrc = "mapset10.jpg";
        this.resolution = [1600, 1000];
        this.containerp5 = null;
        this.coloriNavi = [
            [200, 120, 0],
            [100, 255, 100],
            [130, 30, 200],
            [250, 120, 99],
            [96, 25, 90],
            [34, 100, 200],
        ]
    }

    render() {
        return html`
        <!--
                                            <h1 class="title is-4">Mappa</h1>
                                    -->
        <a class="button is-primary" @click=${(e)=> { ToggleFullscreen() }}>
            Attiva/disattiva schermo intero</a>
        <br>
        <div id="container-p5" style="text-align: center"></div>
        `;
    }

    /*
    first updated viene chiamato quando il render è completo.
    Devo creare qui la nuova istanza di p5 altrimenti non trova
    il container
    */
    firstUpdated() {
        this.containerp5 = document.querySelector("#container-p5");
        // creo la variabile dell'uid utente
        // da usare all'interno di sketch
        var uidUtente = tokenUtente;
        // imposto il riferimento _self che andrà a sostituire il this
        let _self = this;

        //la variabile sketch contiene le funzioni setup e draw di p5
        let sketch = function (p) {

            p.preload = function () {
                _self.backgroundImage = p.loadImage(_self.backgroundImageSrc);
            }

            p.setup = function () {
                // imposto il database e creo il canvas
                _self.db = firebase.firestore();
                _self.referenceSketchp5 = p;
                if (window.innerWidth / window.innerHeight > _self.resolution[0] / _self.resolution[1]) {
                    console.log("if ", (window.innerHeight / _self.resolution[1]) * _self.resolution[0], window.innerHeight)
                    p.createCanvas((window.innerHeight / _self.resolution[1]) * _self.resolution[0], window.innerHeight)
                }
                else {
                    console.log("else ", window.innerWidth, (window.innerWidth / _self.resolution[0]) * _self.resolution[1])
                    p.createCanvas(window.innerWidth, (window.innerWidth / _self.resolution[0]) * _self.resolution[1]);
                }
                //p.createCanvas(_self.resolution[0] * _self.resolutionScale, _self.resolution[1] * _self.resolutionScale);
                p.background(_self.backgroundImage);
                // uso frameRate per rallentare l'esecuzione del draw
                // in modo da poter permettere la visualizzazione delle navi
                p.frameRate(1);
                // console.log("setup completo");
                // chiamo la funzione che mi andrà a inserire le navi nel canvas
                posizioneNavi();
            }

            p.draw = function () {
                // imposto la grossezza del puntino andrà tolto
                //p.strokeWeight(20);

                // pulisco il canvas dalle vecchie navi 
                //p.background(200);
            }

            function posizioneNavi() {
                p.noLoop();
                // con l'uid dell'utente vado a prendermi la sua partita
                _self.db.collection("partite").doc(uidUtente).get()
                    .catch(err => {
                        console.log("Errore ricerca squadre.", err);
                    })
                    .then(res => {
                        // per ogni squadra della partita vado a vedermi la nave corrispondente
                        let squadre = Object.values(res.get("squadre"));
                        console.log(squadre);
                        //console.log(squadre);
                        squadre.forEach((squadra, index) => {
                            // vado a prendere le coordinate delle varie navi
                            _self.db.collection("navi").doc(squadra.reference)
                                .onSnapshot(res => {
                                    // inserisco la nave nelle posizioni posx e posy del database
                                    // per mezzo di un puntino andrà tolto
                                    _self.elencoNavi[index] = {
                                        x: res.get("pos").posx,
                                        y: res.get("pos").posy,
                                        nome: squadra.nome
                                    }
                                    _self.disegnaNavi(p);
                                    //p.point(res.get("pos").posx, res.get("pos").posy);
                                })
                        })

                        //faccio ripartire il loop
                        p.loop()
                    })
            }
        };

        //console.log(document.querySelector("#container-p5"));
        //creo un'istanza di p5 e la aggiungo all'array di utils.js
        istanzeP5.push(new p5(sketch, this.containerp5));
    }

    disegnaNavi(p) {
        //console.log(this.posizioneNavi);
        p.background(this.backgroundImage);
        
        //console.log("disegno navi", this.elencoNavi);
        this.elencoNavi.forEach((nave, index) => {
            if (nave) {
                if (index < this.coloriNavi.length) {
                    p.stroke(this.coloriNavi[index])
                }
                else {
                    p.stroke([0, 0, 0]);
                }
                p.strokeWeight(20);
                p.point(nave.x, nave.y);
                p.noStroke();
                p.textSize(20);
                p.textAlign(p.CENTER);
                p.text(nave.nome, nave.x, nave.y - 10);
                //console.log("Draw con ", this.coloriNavi[index], nave)
            }
        })
    }
}