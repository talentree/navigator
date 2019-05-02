import { tokenUtente } from "./main";

let oldElement = null;
//contiene la descrizione di dove ci troviamo
export let infoScheda = "";
//contiene l'elenco di tutte le istanze di p5 attive
export let istanzeP5 = [];
//contiene il path della nave da controllare sul database
export let referenceNaveDaControllare = "";
//imposta il valore del path (da errore assegnandolo direttamente)
export function setReferenceNaveDaControllare(val) {
    referenceNaveDaControllare = val;
}
//contiene l'array di squadre della partita
export let arraySquadrePartita = [];
//contene l'id della partita
export let idPartita = ""
//imposta il valore dell'array
export function setArraySquadrePartita(val, val1) {
    arraySquadrePartita = val;
    idPartita = val1;
}


export function setGameContent(element) {
    /*
    ANCHE SE ELIMINATO IL CANVAS, IL DRAW DI P5 RESTERA' IN ESECUZIONE
    */
    //elimino tutte le istanze di p5 chiamando il loro metodo remove
    istanzeP5.forEach(istanza => {
        istanza.remove();
    })
    //le rimuovo dall'array
    istanzeP5.length = 0;

    //elimino oldElement se esiste e aggiungo element passato
    let parent = document.querySelector('#game-content');
    const newElement = document.createElement(element);
    if (oldElement) {
        parent.replaceChild(newElement, oldElement);
    } else {
        parent.appendChild(newElement);
    }
    oldElement = newElement;

    //cambio il sottotitolo in base a dove voglio andare
    //console
    if (element === "schermata-console") { infoScheda = "Console della nave" };
    //mappa
    if (element === "schermata-mappa") { infoScheda = "Visualizza la mappa" };
    //engine
    if (element === "schermata-crea-partita") { infoScheda = "Creazione partita" };
    if (element === "schermata-engine") { infoScheda = "Motore di gioco" };
    if (element === "controllo-partita-esistente") { infoScheda = "Centro partita" };
    //main menù
    if (element === "main-menu") { infoScheda = "Home" };
    //login
    if (element === "login-register") { infoScheda = "Accedi" };

    //resetto l'header per aggiornare infoScheda e stato login
    resetHeader();
}

export function backToMainMenu() {
    //elimino oldElement se esiste
    if (oldElement) {
        document.querySelector("#game-content").removeChild(oldElement);
        oldElement = null;
    }
    if (infoScheda == "Console della nave") {
        liberaSquadra(referenceNaveDaControllare, tokenUtente)
    }
    //vado al menù pricipale
    setGameContent("main-menu");
}

//pone isUsed a false della squadra richiesta
export function liberaSquadra(ref, idPartita) {
    let squadre = []
    let i = 0;
    //ottengo partita da ID
    firebase.firestore().collection("partite").doc(idPartita).get()
        .catch(err => {
            console.log("WOOOPS, qualcosa è andato storto!", err);
        })
        .then(res => {
            //aggiorno il valore di isUsed della nave controllata al momento
            squadre = Object.values(res.data().squadre)
            squadre.forEach(squadra => {
                if (squadra.reference == ref) {
                    squadra.isUsed = false;
                    firebase.firestore().collection("partite").doc(idPartita).update("squadre." + i, squadra);
                }
                i++
            })
        })
}

//quando cambia lo stato di autenticazione (login/logout) va ricreato l'header
export function resetHeader() {
    //console.log("resetto header");
    //rimuovo il vecchio header e lo rimpiazzo aggiornato
    let oldHeader = document.querySelector("#headerTalentree");
    let newHeader = document.createElement("header-Talentree");
    newHeader.id = "headerTalentree";
    oldHeader.replaceWith(newHeader);
}

export class Partita {
    constructor(data) {
        this.nomePartita = data.nomePartita || "";
        this.datigenerali = data.datigenerali || {};
        this.squadre = data.squadre || {};
    }
    kickInattività(idPartita) {
        let i = 0;
        let squadre = Object.values(this.squadre)
        squadre.forEach(squadra => {
            if (squadra.isUsed == true) {
                //il numero deriva da una stima con refreshrate 30fps quindi il timeout corrisponde a 5 minuti
                if ((this.datigenerali.gametime - squadra.timer) > 9000) {
                    squadra.isUsed = false;
                    firebase.firestore().collection("partite").doc(idPartita).update("squadre." + i, squadra)
                }
            }
            i++
        })
    }
}
export class Nave {
    /*
        comandi = {
            accel: 0,
            barra: 0,
            vel: 0
        }
        datiIniziali = {
            carb: 1800,
            posx: 10,
            posy: 10
        }
        pos = {
            carb: 1800,
            posx: 10,
            posy: 10,
            direzione: 0
        }
        radar = {
            statoNave: 0
        }
    */
    constructor(nave) {
        this.comandi = nave.comandi || {};
        this.datiIniziali = nave.datiIniziali || {};
        this.pos = nave.pos || {};
        /*stati:
        0 navigazione libera 
        1 collisione costa 
        2 obbiettivo finale 
        3 obbiettivo intermedio 
        4 porto di arrivo
        */
        /*radarfrontale[7], array di 7 bit corriposndenti ai punti rilevati dal radar frontale
        0 = orizzonte vuoto
        orizzonte pieno
        */
        this.radar = nave.radar || {};
        this.partita = {}
    }

    //ottiene i dati della nave in uso da firebase
    getNave(ref) {
        //ottengo la nave dalla refernce
        firebase.firestore().collection("navi").doc(ref).get()
            .catch(err => {
                console.log("WOOOPS, qualcosa è andato storto!", err);
            })
            .then(res => {
                //inserisco i dati da firebase
                this.comandi = res.data().comandi || {};
                this.datiIniziali = res.data().datiIniziali || {};
                this.pos = res.data().pos || {};
                this.radar = res.data.radar || {};
            })
    }


    updateNave(ref, nave) {
        firebase.firestore().collection("navi").doc(ref).update("comandi", nave.comandi);
    }

    //ottiene i dati della partita corrente da firebase
    getDatiPartita(ref) {
        firebase.firestore().collection("partite").doc(ref).get()
            .catch(err => {
                console.log("WOOOPS, qualcosa è andato storto!", err);
            })
            .then(res => {
                //aggiornati singolarmente perchè dava errore aggiornando tutto in un unico passaggio
                this.partita.nomePartita = res.data().nomePartita || {};
                this.partita.datigenerali = res.data().datigenerali || {};
                this.partita.squadre = res.data().squadre || {};
            })
    }

    //aggiorna il timer delle navi
    updateTimer(ref, idPartita) {
        firebase.firestore().collection("partite").doc(idPartita).get()
            .catch(err => {
                console.log("WOOOPS, qualcosa è andato storto!", err);
            })
            .then(res => {
                //aggiorno il timer della singola nave richiesta
                let i = 0;
                let squadre = Object.values(res.data().squadre)
                squadre.forEach(squadra => {
                    if (squadra.reference == ref) {
                        squadra.timer = this.partita.datigenerali.gametime;
                        firebase.firestore().collection("partite").doc(idPartita).update("squadre." + i, squadra)
                    }
                    i++;
                })
            })
    }

    //ritorna al menù principlae in caso sia rilevato inattività
    kick(ref, idPartita) {
        firebase.firestore().collection("partite").doc(idPartita).get()
            .catch(err => {
                console.log("WOOOPS, qualcosa è andato storto!", err);
            })
            .then(res => {
                let squadre = Object.values(res.data().squadre)
                squadre.forEach(squadra => {
                    //trovo la squadra desiderata
                    if (squadra.reference == ref) {
                        //controllo se in uso o no in caso negativo ritorno al menù principale
                        if (squadra.isUsed == false) {
                            //TODO: trovare un modo avvertire della disconnessione (alert non funziona)
                            backToMainMenu();
                        }
                    }
                })
            })
    }

}

export class ButtonTondoConsole {

    constructor(istanzap5, xc, yc, rInterno, rEsterno, variazionebarra, barra, accel) {
        this.p = istanzap5;
        this.setPosEDimensioni(xc, yc, rInterno, rEsterno)
        this.barra = barra;
        this.accel = accel;
        this.variazionebarra = variazionebarra;

        this.coloreViraDestra = [100, 100, 100];
        this.coloreViraSinistra = [99, 99, 99];
        this.coloreAumentaVelocita = [150, 150, 150];
        this.coloreDiminuisciVelocita = [149, 149, 149];

    }

    setPosEDimensioni(posX, posY, raggioInterno, raggioEsterno) {
        this.raggio = raggioInterno;
        this.raggioEsterno = raggioEsterno;
        this.x = posX;
        this.y = posY;
    }

    display(ycb) {
        // noFill ();
        var rh = this.raggio * 0.2;

        //contorni in nero
        this.p.stroke(0, 0, 0, 150);

        //grafica vira a destra
        this.p.fill(this.coloreViraDestra[0], this.coloreViraDestra[1], this.coloreViraDestra[2], 255);
        this.p.arc(this.x, this.y, this.raggioEsterno, this.raggioEsterno, -90, 90, this.p.PIE);

        //grafica vira a sinistra
        this.p.fill(this.coloreViraSinistra[0], this.coloreViraSinistra[1], this.coloreViraSinistra[2], 255);
        this.p.arc(this.x, this.y, this.raggioEsterno, this.raggioEsterno, 90, -90, this.p.PIE);

        //grafica accelera
        this.p.fill(this.coloreAumentaVelocita[0], this.coloreAumentaVelocita[1], this.coloreAumentaVelocita[2], 255);
        this.p.arc(this.x, this.y, this.raggio, this.raggio, -90, 90, this.p.PIE);

        //grafica decelera
        this.p.fill(this.coloreDiminuisciVelocita[0], this.coloreDiminuisciVelocita[1], this.coloreDiminuisciVelocita[2], 255);
        this.p.arc(this.x, this.y, this.raggio, this.raggio, 90, -90, this.p.PIE);

        //pallino rosso al centro se sto cliccando
        if (this.p.mouseIsPressed) {
            this.p.fill(255, 0, 0, 255);
        }
        else {
            this.p.fill(0, 0, 0, 255);
        }
        this.p.ellipse(this.x, this.y, this.raggio * 0.1, this.raggio * 0.1);
        //strokeWeight (20);
        this.p.stroke(0, 0, 0, 150);
        this.p.line(this.x, this.y - this.raggio / 2, this.x, this.y + this.raggio / 2);
        //  fill(0, 0, 0, 127);
        // noStroke();
        this.p.fill(255, 255, 255, 200);

        //text("VEL: " + nf(b01.vel, 0, 2), width * 0.1, height * 0.4);
        this.p.stroke(0, 255, 0, 150);
        this.p.line(this.x, this.y, this.x + this.raggio / 2 * this.p.cos(this.barra - 90), this.y + this.raggio / 2 * this.p.sin(this.barra - 90));

        //allarme
        //if stato ..... 
        this.p.fill(200);
        this.p.stroke(255, 255, 255, 150);
        this.p.triangle(this.x, ycb - rh, this.x, ycb + rh, this.x + 2 * rh, ycb);
        this.p.triangle(this.x, ycb - rh, this.x, ycb + rh, this.x - 2 * rh, ycb);
        this.p.noFill();
        this.p.noStroke();

        this.p.stroke(255, 0, 0);
        this.p.fill(255, 0, 0);

        this.p.noFill();
        this.p.noStroke();
    }

    //0 se esterno, 1 se aumento velocita, 2 de diminuisco, 3 se viro a dx, 4 se viro a sx
    whereIsClick(coloreNelPunto) {
        //console.log(coloreNelPunto);
        if (JSON.stringify(coloreNelPunto) == JSON.stringify(this.coloreAumentaVelocita)) {
            return 1;
        }
        else if (JSON.stringify(coloreNelPunto) == JSON.stringify(this.coloreDiminuisciVelocita)) {
            return 2;
        }
        else if (JSON.stringify(coloreNelPunto) == JSON.stringify(this.coloreViraDestra)) {
            return 3;
        }
        else if (JSON.stringify(coloreNelPunto) == JSON.stringify(this.coloreViraSinistra)) {
            return 4;
        }
        else {
            return 0;
        }
    }
}

export class InfoSullaNaveConsole {
    constructor(paragrafo) {
        this.carburanteRimasto = 0;
        this.velocita = 0;
        this.direzione = 0;
        if (paragrafo) {
            this.paragrafo = paragrafo;
            console.log(paragrafo);
            this.display();
        }
    }

    display() {
        this.paragrafo.innerHTML = "Velocità: " + this.velocita + " (udm??)<br>";
        this.paragrafo.innerHTML += "Direzione: " + this.direzione + " °<br>";
        this.paragrafo.innerHTML += "Carburante rimasto: " + this.direzione + " (udm??)";
    }
}

export class InterfacciaParametrizzata {
    constructor(p, width, height, coloreBackground) {
        this.p = p;
        if (width && height) {
            this.setDimensioni(width, height);
        }
        this.coloreBackground = coloreBackground;
        this.radar = [false, true, true, false, false, false, true];
        this.collisioneImminente = true;
    }

    setDimensioni(width, height) {
        this.centroBussola = {
            x: width * 0.5,
            y: height * 0.35
        }

        this.centroManopolaMotore = {
            x: width * 0.5,
            y: height * 0.64
        }
        this.altezzaManopolaMotore = height * 0.28 / 2;
        this.larghezzaManopolaMotore = width * 0.15 / 2;
        this.distanzaBaseComandiTimone = width * 0.13;
        this.dimBaseComandiTimone = height * 0.09;
        this.dimAltezzaComandiTimone = width * 0.26;

        this.raggioAnelloBussola = width * 0.38;
        this.spessoreAnelloBussola = width * 0.05;
        this.barra = 90;
        this.intVento = 30;
        this.maxIntVento = 40;
        this.direzioneVento = 200;

        this.angoloAltoASxRadar = {
            x: width * 0.11,
            y: height * 0.74
        }
        this.lunghezzaRadar = width * 0.78;
        this.altezzaRadar = height * 0.04;

        this.altezzaCollisioneImminente = height * 0.03;
    }

    display() {
        //disegno anello bussola
        let coloreAnelloBussola = this.p.color(255, 204, 0);
        this.p.fill(coloreAnelloBussola);
        this.p.noStroke();
        this.p.ellipse(this.centroBussola.x, this.centroBussola.y, this.raggioAnelloBussola * 2);
        this.p.fill(this.coloreBackground);
        this.p.ellipse(this.centroBussola.x, this.centroBussola.y, (this.raggioAnelloBussola - this.spessoreAnelloBussola) * 2);

        //disegno triangolo timone
        this.p.angleMode(this.p.DEGREES);
        let coloreTriangoloTimone = this.p.color(0, 255, 0);
        let baseTimone = this.raggioAnelloBussola * 0.21;
        let altezzaTimone = this.raggioAnelloBussola * 0.80;
        let puntiTriangoloTimone = [
            this.centroBussola.x + baseTimone / 2 * Math.sin((this.barra - 90) * Math.PI / 180),
            this.centroBussola.y - baseTimone / 2 * Math.cos((this.barra - 90) * Math.PI / 180),
            this.centroBussola.x + baseTimone / 2 * Math.sin((this.barra + 90) * Math.PI / 180),
            this.centroBussola.y - baseTimone / 2 * Math.cos((this.barra + 90) * Math.PI / 180),
            this.centroBussola.x + altezzaTimone * Math.sin(this.barra * Math.PI / 180),
            this.centroBussola.y - altezzaTimone * Math.cos(this.barra * Math.PI / 180)
        ]
        this.p.fill(coloreTriangoloTimone);
        this.p.triangle(puntiTriangoloTimone[0], puntiTriangoloTimone[1], puntiTriangoloTimone[2], puntiTriangoloTimone[3], puntiTriangoloTimone[4], puntiTriangoloTimone[5]);

        //disegno triangolo vento
        let coloreTriangoloVento = this.p.color(0, 0, 255);
        let baseVento = this.raggioAnelloBussola * 0.23;
        let altezzaVento = this.intVento / this.maxIntVento * 0.75 * this.raggioAnelloBussola;

        this.p.fill(this.p.color(255, 255, 255));
        let centroBaseTriangoloVento = {
            x: this.centroBussola.x + (this.raggioAnelloBussola - this.spessoreAnelloBussola) * Math.sin(this.direzioneVento * Math.PI / 180),
            y: this.centroBussola.y - (this.raggioAnelloBussola - this.spessoreAnelloBussola) * Math.cos(this.direzioneVento * Math.PI / 180)
        }
        //this.p.ellipse(centroBaseTriangoloVento.x, centroBaseTriangoloVento.y, 10, 10);

        let centroVerticeTriangoloVento = {
            x: this.centroBussola.x + (this.raggioAnelloBussola - this.spessoreAnelloBussola - altezzaVento) * Math.sin(this.direzioneVento * Math.PI / 180),
            y: this.centroBussola.y - (this.raggioAnelloBussola - this.spessoreAnelloBussola - altezzaVento) * Math.cos(this.direzioneVento * Math.PI / 180)
        }
        //this.p.ellipse(centroVerticeTriangoloVento.x, centroVerticeTriangoloVento.y, 10, 10);

        let puntiTriangoloVento = [
            centroBaseTriangoloVento.x + (baseVento / 2) * Math.sin((this.direzioneVento - 90) * Math.PI / 180),
            centroBaseTriangoloVento.y - (baseVento / 2) * Math.cos((this.direzioneVento - 90) * Math.PI / 180),
            centroBaseTriangoloVento.x + (baseVento / 2) * Math.sin((this.direzioneVento + 90) * Math.PI / 180),
            centroBaseTriangoloVento.y - (baseVento / 2) * Math.cos((this.direzioneVento + 90) * Math.PI / 180),
            centroVerticeTriangoloVento.x,
            centroVerticeTriangoloVento.y
        ]
        this.p.fill(coloreTriangoloVento);
        this.p.triangle(puntiTriangoloVento[0], puntiTriangoloVento[1], puntiTriangoloVento[2], puntiTriangoloVento[3], puntiTriangoloVento[4], puntiTriangoloVento[5]);

        //disegno centro bussola
        let coloreCentroBussola = this.p.color(255, 0, 0);
        this.p.fill(coloreCentroBussola);
        this.p.stroke(coloreAnelloBussola);
        let raggioCentroBussola = this.raggioAnelloBussola * 0.09;
        this.p.ellipse(this.centroBussola.x, this.centroBussola.y, raggioCentroBussola, raggioCentroBussola);

        //disegno manopola motore
        let coloreManopolaMotore = this.p.color(255, 150, 0);
        this.p.fill(coloreManopolaMotore);
        this.p.noStroke();
        this.p.rect(this.centroManopolaMotore.x - this.larghezzaManopolaMotore / 2, this.centroManopolaMotore.y - this.altezzaManopolaMotore / 2, this.larghezzaManopolaMotore, this.altezzaManopolaMotore);

        //disegno triangolo per muovere timone
        //triangolo sx
        let timoneSxBase = {
            x: this.centroManopolaMotore.x - this.distanzaBaseComandiTimone,
            y: this.centroManopolaMotore.y
        }
        this.p.fill(coloreManopolaMotore);
        let timoneSxVertice = {
            x: timoneSxBase.x - this.dimAltezzaComandiTimone,
            y: timoneSxBase.y
        }
        this.p.triangle(timoneSxBase.x, timoneSxBase.y - this.dimBaseComandiTimone / 2, timoneSxBase.x, timoneSxBase.y + this.dimBaseComandiTimone / 2, timoneSxVertice.x, timoneSxVertice.y);

        //triangolo dx
        let timoneDxBase = {
            x: this.centroManopolaMotore.x + this.distanzaBaseComandiTimone,
            y: this.centroManopolaMotore.y
        }
        let timoneDxVertice = {
            x: timoneDxBase.x + this.dimAltezzaComandiTimone,
            y: timoneDxBase.y
        }
        this.p.triangle(timoneDxBase.x, timoneDxBase.y - this.dimBaseComandiTimone / 2, timoneDxBase.x, timoneDxBase.y + this.dimBaseComandiTimone / 2, timoneDxVertice.x, timoneDxVertice.y);

        //disegno i radar
        let coloreRadar = {
            normal: this.p.color(0, 255, 0),
            alert: this.p.color(255, 0, 0),
            contorno: this.p.color(150, 150, 0)
        }

        this.p.stroke(coloreRadar.contorno);
        for (let i = 0; i < 7; i++) {
            if (this.radar[i] == false) {
                this.p.fill(coloreRadar.normal);
            }
            else {
                this.p.fill(coloreRadar.alert);
            }
            this.p.rect(this.angoloAltoASxRadar.x + (this.lunghezzaRadar / 7) * i, this.angoloAltoASxRadar.y, this.lunghezzaRadar / 7, this.altezzaRadar);
        }


        //collisione imminente
        if (this.collisioneImminente) {
            this.p.fill(coloreRadar.alert);
            this.p.rect(this.angoloAltoASxRadar.x, this.angoloAltoASxRadar.y + this.altezzaRadar, this.lunghezzaRadar, this.altezzaCollisioneImminente);
        }
    }
}