import { NavElement, html } from "../nav-element";
import { istanzeP5, Partita, Nave, ToggleFullscreen } from '../utils';
import { tokenUtente } from "../main";

export class SchermataEngine extends NavElement {
    constructor() {
        super();
        this.db = firebase.firestore();
        this.navi = [];
        this.partita = new Partita({})
        //reference allo scketch (p) di p5, facile da raggiungere
        this.referenceSketchp5 = null;
        // tra un punto del radar e l'altro sono 10 gradi
        this.angoloTraPuntiRadar = 10;
        //dimensione nave, per posizionare il baricentro (in cui verrà rilevata la collisione) radar a prua
        this.dimNave = 10;
        //gestione colori per stato
        this.tolleranzaColore = 2; //tolleranza lettura pixel colore
        this.col1 = 0; // [0,0,0,255]; // nero terra
        this.col2 = 64; //[255,0,0,255]; // usi futuri
        this.col3 = 128; // obiettivo finale
        this.col4 = 192; //[0, 255, 0, 255]; // obbiettivi intermedi
        this.col5 = 255; //bianco mare
        this.distanzaRadar = 40; //distanza frontale del radar

        this.backgroundImageSrc = "mapset10 alpha.jpg";
        this.resolution = [1600, 1000];
        this.resolutionScale = 1;
    }

    render() {
        return html`
        <!--
            <h1 class="title is-4">Engine vero e proprio</h1>
            -->
            <a class="button is-primary" @click=${(e) => { ToggleFullscreen() }}>
            Attiva/disattiva schermo intero</a>
            <!--Container p5. Viene eliminato separatamente nell'utils-->
            <div id="container-p5" style="text-align: center"></div>
        `;
    }

    /*
    * first updated viene chiamato quando il render è completo.
    * Devo creare qui la nuova istanza di p5 altrimenti non trova
    * il container
    */
    firstUpdated() {
        //console.log("updated");
        //la variabile sketch contiene le funzioni setup e draw di p5
        let _self = this;

        /* 
        * descrizione: engine effetivo
        * 
        * funzionamento: Dichiara variabili fisse che in futuro verranno controllate da firebase,
        * richiama setup e draw;
        */
        let sketch = function (p) {
            let gtime = 0;
            let wspeed = 0; //velocita' del vento
            let wdir = 0; //direzione del vento
            let wMaxSpeed = 1; // vel max
            let wMaxChange = 0.3; // variazione max
            let wMaxAngle = 10; // angolo massimo di variazione
            let wtimer = 10; // timer aggiorno vento

            p.preload = function(){
                _self.backgroundImage = p.loadImage(_self.backgroundImageSrc);
            }

            //setup di p5
            p.setup = function () {
                //imposto il reference così non devo passarlo ad ogni funzione che chiamo
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
                //COMMENTARE PER TOGLIERE BACKGROUND IMAGE
                p.background(_self.backgroundImage);
                //p.background(0);
                console.log("setup completo");
                //setto il frame rate
                p.frameRate(1);
                //fermo il loop per permettere di cercare i dati su firebase
                p.noLoop();
                _self.cercaPartita();

                //FIXME: migliora inizializzazione variabili
                setTimeout(function () {
                    let t = _self.partita.datigenerali;
                    gtime = t.gametime;
                    wspeed = t.windForce;
                    wdir = t.windDir;
                }, 1000);
            }

            /*
            * descrizione: draw
            *   
            * funzionamento: aggiorna il clock,
            * controlla e aggiorna il vento,
            * corregge navi, not implemented yet
            * plotta navi
            */
            p.draw = function () {

                
                //uscita squadra e cambio variabile isUsed a False
                //_self.partita.kickInattività(tokenUtente);

                //aggiorno clock
                gtime++;
                //cambio vento
                if ((gtime % wtimer) == 0) {
                    wspeed = (wspeed * 10 + (Math.floor((Math.random() * 2 * wMaxChange - wMaxChange) * 10) + 1)) / 10;
                    if (wspeed < 0) { wspeed = 0 };
                    if (wspeed > wMaxSpeed) { wspeed = wMaxSpeed }
                    console.log(wspeed);

                    wdir = wdir + Math.floor(Math.random() * 2 * wMaxAngle - wMaxAngle);
                    if (wdir < 0) { wdir += 360 }
                    if (wdir > 360) { wdir += -360 }
                    console.log(wdir);
                }

                //update vento su firebase
                //aggiorno ogni secondo il gtime ma solo ogni dieci il vento
                let t = _self.partita.datigenerali;
                t.gametime = gtime;
                t.windForce = wspeed;
                t.windDir = wdir;
                _self.db.collection("partite").doc(tokenUtente).update("datigenerali", t);

                //aggiorna posizioni navi
                Object.keys(_self.partita.squadre).forEach(i => {
                    //se una nave non viene usata la salto
                    if (!_self.partita.squadre[i].isUsed) {return;}

                    // immaginando che direzione = 0 corrisponde all'asse orrizontale orientato
                    // verso destra gli angoli sono positivi in senso antiorario
                    _self.navi[i].pos.posx += _self.navi[i].comandi.velocity * Math.cos((_self.navi[i].pos.direzione - 90) * Math.PI / 180);
                    _self.navi[i].pos.posy += _self.navi[i].comandi.velocity * Math.sin((_self.navi[i].pos.direzione - 90) * Math.PI / 180);

                    //tengo conto del vento (FIXME: futura scelta)
                    if (true) {
                        _self.navi[i].pos.posx += wspeed * Math.cos((wdir - 90) * Math.PI / 180);
                        _self.navi[i].pos.posy += wspeed * Math.sin((wdir - 90) * Math.PI / 180);
                    }

                    // aggiorno le velocita'
                    // al momento si ferma e basta
                    let x = _self.navi[i].comandi.velocity;
                    if (x < _self.navi[i].comandi.accel) {
                        x++;
                    }
                    if (x > _self.navi[i].comandi.accel) {
                        x--;
                    }
                    if (x < -5) { x = -5 }
                    if (x > 20) { x = 20 }
                    _self.navi[i].comandi.velocity = x;
                    //aggiorno il carburante
                    _self.aggiornaCarb(_self.navi[i]);

                    //aggiorno direzione
                    x = _self.navi[i].pos.direzione + _self.navi[i].comandi.barra;
                    if (x < 0) { x += 360 }
                    if (x > 360) { x += -360 }
                    _self.navi[i].pos.direzione = x;
                    
                    //CONTROLLO DELLE COLLISIONI
                    _self.controllaCollisioniNave(i);
                    
                    //carico su firebase
                    _self.upNave(i);

                    //alert
                    if (_self.navi[i].radar.statoNave == 4) {
                        alert(_self.partita.squadre[i].nome + "ha vinto la gara!");
                    }
                });

                //plotta navi
                //COMMENTARE PER TOGLIERE BACKGROUND IMAGE
                p.background(_self.backgroundImage);
                //p.background(50);
                
                Object.keys(_self.partita.squadre).forEach(i => {
                    //se una nave non viene usata la salto
                    if (!_self.partita.squadre[i].isUsed) {return;}

                    let nave = new Nave(_self.navi[i]);
                    p.ellipse(nave.pos.posx, nave.pos.posy, 15, 10);
                    //TODO: far ruotare la nave
                });
            }
        };

        console.log(document.querySelector("#container-p5"));
        //creo un'istanza di p5 e la aggiungo all'array di utils.js
        istanzeP5.push(new p5(sketch, document.querySelector("#container-p5")));
    }

    cercaPartita() {
        this.db.collection("partite").doc(tokenUtente).get()
            .catch(err => {
                console.log("errore nell'ottenimento della partita", err);
            })
            .then(res => {
                //controllo che la partita esista
                if (res.exists) {
                    //salvo i dati della partita
                    this.partita = new Partita(res.data());
                    console.log("partita ottenuta", this.partita);
                    //cerco le navi partecipanti
                    this.cercaNavi();
                }
                else {
                    console.log("Sembra che non abbia creato nessuna partita!")
                }
            })
    }

    cercaNavi() {
        //conto il numero di navi ottenute con successo
        let naviOttenute = 0;
        Object.keys(this.partita.squadre).forEach(i => {
            this.db.collection("navi").doc(this.partita.squadre[i].reference).get()
                .catch(err => {
                    console.log("errore ottenimento nave", err);
                })
                .then(res => {
                    naviOttenute++;
                    //controllo se la nave esiste
                    if (res.exists) {
                        /*
                        la aggiungo all'array delle navi.
                        Non uso il push per evitare che le navi vengano scambiate durante la query a firestore
                        */
                        this.navi[naviOttenute-1] = new Nave(res.data());
                        //se tutte le navi sono state ottenute faccio cominciare il loop
                        if (naviOttenute == Object.keys(this.partita.squadre).length) {
                            console.log("navi ottenute: ", this.navi);
                            this.subNave();
                            this.subPartita();
                            this.referenceSketchp5.loop();
                        }
                    }
                    else {
                        console.log("Questa nave non esiste!", this.partita.squadre[i].reference);
                    }
                })
            i++;
        });
    }

    upNave(i) {
        /*dava errore se non si aggiungeva un controllo
        Impediva di aggiungere l'istanza di p5 nell'array di utils.js
        Rimaneva quindi il draw attivo al cambio schermata
        */
        if (this.partita && this.partita.squadre) {
            this.db.collection("navi").doc(this.partita.squadre[i].reference).update("pos", this.navi[i].pos);
            this.db.collection("navi").doc(this.partita.squadre[i].reference).update("comandi.velocity", this.navi[i].comandi.velocity);
            this.db.collection("navi").doc(this.partita.squadre[i].reference).update("radar", this.navi[i].radar);
        }
    }

    subNave(){
        Object.keys(this.partita.squadre).forEach(i => {
            this.db.collection("navi").doc(this.partita.squadre[i].reference)
            .onSnapshot(doc=>{
                if(this.navi[i] && this.partita && this.partita.squadre){
                    this.navi[i].comandi = doc.data().comandi || {};
                    console.log("nuova barra" + this.navi[i].comandi.barra);
                }
            })
        });
    }

    subPartita(){
        this.db.collection("partite").doc(tokenUtente)
            .onSnapshot(doc =>{
                if(this.partita && this.partita.squadre) {
                    Object.keys(doc.data().squadre).forEach(i =>{
                        //se timer o isUsed sono cambiati allora li aggiorno
                        this.partita.squadre[i] = doc.data().squadre[i] || {};
                        console.log('aggiornata squadra '+ i);
                    })
                }
            })
    }

    controllaCollisioniNave(index) {
        let posizioneDaControllare = {};
        //converto in radianti perchè sin e cos accettano radianti
        let direzioneInRadianti = this.navi[index].pos.direzione * Math.PI / 180;
        //calcolo il punto della prua della nave
        posizioneDaControllare.x = this.navi[index].pos.posx + this.dimNave * Math.cos(direzioneInRadianti);
        posizioneDaControllare.y = this.navi[index].pos.posy + this.dimNave * Math.sin(direzioneInRadianti);
        //controllo il colore nel punto
        this.navi[index].radar.statoNave = this.controllaPunto(posizioneDaControllare.x, posizioneDaControllare.y);

        //disegno un cerchio per mostrare prua
        this.referenceSketchp5.ellipse(posizioneDaControllare.x, posizioneDaControllare.y, 7, 7);
        //ottengo stato del radar frontale
        this.navi[index].radar.radarfrontale = this.controllaRadarFrontale(index);
    }

    controllaPunto(posX, posY) {
        //ritorna aray rgba
        let coloreNelPunto = this.referenceSketchp5.get(posX, posY);
        // traduce in scala di grigio;
        let coloreInScalaDiGrigio = (Math.floor(coloreNelPunto[0] + coloreNelPunto[1] + coloreNelPunto[2]) / 3);
        // controllo colore campionato (con tolleranza tolleranzaColore) colori vicini
        let stato = 0;
        if ((coloreInScalaDiGrigio > (this.col1 - this.tolleranzaColore) && coloreInScalaDiGrigio < (this.col1 + this.tolleranzaColore))) { stato = 1 };
        if ((coloreInScalaDiGrigio > (this.col2 - this.tolleranzaColore) && coloreInScalaDiGrigio < (this.col2 + this.tolleranzaColore))) { stato = 2 };
        if ((coloreInScalaDiGrigio > (this.col3 - this.tolleranzaColore) && coloreInScalaDiGrigio < (this.col3 + this.tolleranzaColore))) { stato = 3 };
        if ((coloreInScalaDiGrigio > (this.col4 - this.tolleranzaColore) && coloreInScalaDiGrigio < (this.col4 + this.tolleranzaColore))) { stato = 4 };
        //ritorno lo stato del punto
        return stato;
    }

    controllaRadarFrontale(index) {
        let statoRadar = [];
        let puntoDaControllare = {};
        //il radar in totale ha 7 punto angolati di angoloTraPuntiRadar gradi
        for (let i = 0; i < 7; i++) {
            //converto in radianti perchè sin e cos accettano solo radianti
            let direzioneInGradi = this.navi[index].pos.direzione + (this.angoloTraPuntiRadar * (i - 3));
            let direzioneInRadianti = direzioneInGradi * Math.PI / 180;
            //calcolo punto del radar
            puntoDaControllare.x = this.navi[index].pos.posx + this.distanzaRadar * Math.cos(direzioneInRadianti);
            puntoDaControllare.y = this.navi[index].pos.posy + this.distanzaRadar * Math.sin(direzioneInRadianti);
            //controllo colore
            statoRadar[i] = this.controllaPunto(puntoDaControllare.x, puntoDaControllare.y);
            //disegno cerchietto per visualizzazione
            this.referenceSketchp5.ellipse(puntoDaControllare.x, puntoDaControllare.y, 5, 5);
        }
        return statoRadar;
    }

    aggiornaCarb(nave) {
        //dovrebbe servire per i turni da fermo
        if (nave.pos.carb<0) {
            nave.pos.carb++;
            if (nave.pos.carb == 0) {
                nave.pos.carb = 1800;
            }
            return;
        }

        //effettivo consumo di carburante
        nave.pos.carb -= Math.abs(nave.comandi.velocity);
        if (nave.pos.carb <= 0) {
            //dovrebbe servire per i turni da fermo
            nave.pos.carb = -5;
            nave.comandi.velocity = 0;
        }
    }
}