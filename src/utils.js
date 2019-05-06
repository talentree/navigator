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
        this.partita = {
            datigenerali: {
                gametime: 0,
                windDir: 0,
                windForce: 0
            },
            nomePartita: "",
        }
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
                this.radar = res.data().radar || {};
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

    //FIXME: FATTIBILE ANCHE SENZA FIREBASE (FORSE) ritorna al menù principlae in caso sia rilevato inattività
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
/*
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
*/
export class InterfacciaParametrizzata {
    constructor(p, width, height, coloreBackground) {
        this.p = p;
        if (width && height) {
            this.setDimensioni(width, height);
        }
        this.coloreBackground = coloreBackground;// § <-- il mio gatto è più bravo di me con la tastiera
        this.radar = [false, true, true, false, false, false, true];
        this.collisioneAvvenuta = false;

        this.nomeNave = "NAVE";
        this.gameTime = 0;
        this.direzione = 20;
        this.vel = 34;
        this.ultimaPosRilevata = {
            x: 0,
            y: 0
        }

        this.messaggi = "Nessun messaggio";
        this.carburante = 100;

        this.coloreResettaTimone = [255, 1, 0];
        this.coloreViraDestra = [255, 200, 0];
        this.coloreViraSinistra = [255, 201, 0];
        this.coloreAumentaVelocita = [255, 202, 0];
        this.coloreDiminuisciVelocita = [255, 203, 0];
        this.coloreAnelloBussola = this.p.color(255, 204, 0);
        this.coloreTesti = this.p.color(255, 255, 255);
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
        //barra verrà moltiplicata per 10
        this.barra = 5;
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

        this.windstarText = {
            x: width * 0.11,
            y: height * 0.05,
            yNomeNave: height * 0.09
        }

        this.gameTimeText = {
            x: width * 0.89,
            y: height * 0.09,
            yDescrizione: height * 0.127
        }

        this.posizioneTestiVelEDirezione = {
            xDir: width * 0.3,
            xVel: width * 0.7,
            y: height * 0.59,
            yDescrizioni: height * 0.64,
            xDescDirezione: width * 0.065,
            xDescvel: width * (1 - 0.065),
        }

        this.dimensioniTesti = {
            piccoli: height * 0.02 * 2,
            grandi: height * 0.05 * 2
        }

        this.posizioneTestiFinali = {
            x: width * 0.11,
            yUltimaPosizione: height * 0.88,
            yTesto: height * 0.91,
            yMessaggi: height * 0.94
        }

        this.posizioneCarburante = {
            x: width * 0.5,
            y: height * 0.4
        }
    }

    display() {
        //disegno anello bussola
        this.p.fill(this.coloreAnelloBussola);
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
        this.p.fill(this.coloreResettaTimone);
        this.p.stroke(this.coloreAnelloBussola);
        let raggioCentroBussola = this.raggioAnelloBussola * 0.09;
        this.p.ellipse(this.centroBussola.x, this.centroBussola.y, raggioCentroBussola, raggioCentroBussola);

        //disegno manopola motore

        this.p.fill(this.coloreAumentaVelocita);
        this.p.noStroke();
        this.p.rect(this.centroManopolaMotore.x - this.larghezzaManopolaMotore / 2, this.centroManopolaMotore.y - this.altezzaManopolaMotore / 2, this.larghezzaManopolaMotore, this.altezzaManopolaMotore / 2);

        this.p.fill(this.coloreDiminuisciVelocita);
        this.p.rect(this.centroManopolaMotore.x - this.larghezzaManopolaMotore / 2, this.centroManopolaMotore.y, this.larghezzaManopolaMotore, this.altezzaManopolaMotore / 2);

        //disegno triangolo per muovere timone
        //triangolo sx
        let timoneSxBase = {
            x: this.centroManopolaMotore.x - this.distanzaBaseComandiTimone,
            y: this.centroManopolaMotore.y
        }
        this.p.fill(this.coloreViraSinistra);
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
        this.p.fill(this.coloreViraDestra);

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


        //collisione avvenuta
        if (this.collisioneAvvenuta) {
            this.p.fill(coloreRadar.alert);
            this.p.rect(this.angoloAltoASxRadar.x, this.angoloAltoASxRadar.y + this.altezzaRadar, this.lunghezzaRadar, this.altezzaCollisioneImminente);
        }

        //testi
        this.p.fill(this.coloreTesti);
        this.p.noStroke();
        this.p.textSize(this.dimensioniTesti.piccoli);
        this.p.textAlign(this.p.LEFT);
        this.p.text('WINDSTAR', this.windstarText.x, this.windstarText.y);
        this.p.text(this.nomeNave, this.windstarText.x, this.windstarText.yNomeNave);

        this.p.textSize(this.dimensioniTesti.grandi);
        this.p.textAlign(this.p.RIGHT);
        this.p.text(this.gameTime, this.gameTimeText.x, this.gameTimeText.y);
        this.p.textSize(this.dimensioniTesti.piccoli);
        this.p.text("TIME", this.gameTimeText.x, this.gameTimeText.yDescrizione);

        //testo carburante
        this.p.textSize(this.dimensioniTesti.piccoli);
        this.p.textAlign(this.p.CENTER, this.p.CENTER);
        this.p.text("Carburante:\n" + this.carburante, this.posizioneCarburante.x, this.posizioneCarburante.y);

        //testi velocità e direzione
        this.p.textSize(this.dimensioniTesti.grandi / 2);
        this.p.textAlign(this.p.RIGHT);
        this.p.text(this.direzione + " N", this.posizioneTestiVelEDirezione.xDir, this.posizioneTestiVelEDirezione.y);
        let velocitaMostrata = 0;
        if (this.vel < 10) {
            velocitaMostrata = "00" + this.vel;
        }
        else if (this.vel < 100) {
            velocitaMostrata = "0" + this.vel;
        }
        else {
            velocitaMostrata = this.vel;
        }

        this.p.textAlign(this.p.LEFT);
        this.p.text(velocitaMostrata, this.posizioneTestiVelEDirezione.xVel, this.posizioneTestiVelEDirezione.y);
        this.p.textSize(this.dimensioniTesti.piccoli);
        this.p.textAlign(this.p.LEFT);
        this.p.text("DIR", this.posizioneTestiVelEDirezione.xDescDirezione, this.posizioneTestiVelEDirezione.yDescrizioni);
        this.p.textAlign(this.p.RIGHT);
        this.p.text("VEL", this.posizioneTestiVelEDirezione.xDescvel, this.posizioneTestiVelEDirezione.yDescrizioni);

        this.p.text(this.dimensioniTesti.piccoli);
        this.p.textAlign(this.p.LEFT);

        this.p.text("Last pos: " + this.ultimaPosRilevata.x + " " + this.ultimaPosRilevata.y, this.posizioneTestiFinali.x, this.posizioneTestiFinali.yUltimaPosizione);
        this.p.text("Testo di cosa??", this.posizioneTestiFinali.x, this.posizioneTestiFinali.yTesto);
        this.p.text(this.messaggi, this.posizioneTestiFinali.x, this.posizioneTestiFinali.yMessaggi);

        //disegno indicatore nord
        let direzioneIndicatore = this.direzione;
        this.p.fill(this.p.color(0, 0, 0));
        for (let i = 0; i < 4; i++) {
            direzioneIndicatore = -this.direzione + 90 * i;
            this.p.textAlign(this.p.CENTER, this.p.CENTER);
            this.p.textSize(this.dimensioniTesti.piccoli);
            let posNord = {
                x: this.centroBussola.x + (this.raggioAnelloBussola - this.spessoreAnelloBussola / 2) * Math.sin(direzioneIndicatore * Math.PI / 180),
                y: this.centroBussola.y - (this.raggioAnelloBussola - this.spessoreAnelloBussola / 2) * Math.cos(direzioneIndicatore * Math.PI / 180)
            }
            //this.p.ellipse(posNord.x, posNord.y, 10, 10);
            this.p.translate(posNord.x, posNord.y);
            this.p.rotate(direzioneIndicatore);
            let lettera = "N";
            switch (i) {
                case 0: {
                    lettera = "N";
                    break;
                }
                case 1: {
                    lettera = "E";
                    break;
                }
                case 2: {
                    lettera = "S";
                    break;
                }
                case 3: {
                    lettera = "W";
                    break;
                }
            }
            this.p.text(lettera, 0, 0);
            this.p.rotate(- direzioneIndicatore);
            this.p.translate(-posNord.x, -posNord.y);
        }
    }

    //0 se esterno, 1 se aumento velocita, 2 de diminuisco, 3 se viro a dx, 4 se viro a sx, 5 se resetto timones
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
        else if (JSON.stringify(coloreNelPunto) == JSON.stringify(this.coloreResettaTimone)) {
            return 5;
        }
        else {
            return 0;
        }
    }
}

export class GestoreInterfacceConsole {
    constructor(p, containerp5, interfacciaTestuale, width, height, coloreBackground) {
        this.isInterfacciaTestuale = false;
        if (p) {
            this.containerp5 = containerp5;
            this.interfacciaParametrizzata = new InterfacciaParametrizzata(p, width, height, coloreBackground);
            this.interfacciaTestuale = interfacciaTestuale;
            this.PassaAInterfacciaTestuale(this.isInterfacciaTestuale);
        }
    }

    SetDimensioni(width, height) {
        this.interfacciaParametrizzata.setDimensioni(width, height);
    }

    Display() {
        this.interfacciaParametrizzata.display();
    }

    PassaAInterfacciaTestuale(isTestuale) {
        this.isInterfacciaTestuale = isTestuale;
        this.interfacciaTestuale.hide = !isTestuale;
        if (isTestuale) {
            this.containerp5.style.display = "none";
        }
        else {
            this.containerp5.style.display = "block";
        }
    }

    WhereIsClick(coloreNelPunto) {
        let res = this.interfacciaParametrizzata.whereIsClick(coloreNelPunto);
        console.log(res);
        return res;
    }

    //string
    SetNomeNave(val) {
        this.interfacciaTestuale.nomeNave = val;
        this.interfacciaParametrizzata.nomeNave = val;
    }

    //int o float
    SetTempoDiGioco(val) {
        this.interfacciaTestuale.tempoDiGioco = val;
        this.interfacciaParametrizzata.gameTime = val;
    }

    //int o float
    SetVelocita(val) {
        this.interfacciaTestuale.vel = val;
        this.interfacciaParametrizzata.vel = val;
    }

    //int o float
    SetDirezione(val) {
        this.interfacciaTestuale.direzione = val;
        this.interfacciaParametrizzata.direzione = val;
    }

    //int o float
    SetIntensitaVento(val) {
        this.interfacciaTestuale.intVento = val;
        this.interfacciaParametrizzata.intVento = val;
    }

    //int o float
    SetDirezioneVento(val) {
        this.interfacciaTestuale.direzioneVento = val;
        this.interfacciaParametrizzata.direzioneVento = val;
    }

    //array di true o false
    SetRadar(val) {
        this.interfacciaTestuale.radar = val;
        this.interfacciaTestuale.requestUpdate();
        this.interfacciaParametrizzata.radar = val;
    }

    //true o false TODO: inutile?
    SetCollisioneImminente(val) {
        this.interfacciaTestuale.collisioneImminente = val;
        this.interfacciaParametrizzata.collisioneImminente = val;
    }

    //true o false
    SetCollisioneAvvenuta(val) {
        this.interfacciaTestuale.collisioneAvvenuta = val;
        this.interfacciaParametrizzata.collisioneAvvenuta = val;
    }

    //object con x e y
    SetUltimaPosizioneRilevata(posX, posY) {
        this.interfacciaTestuale.ultimaPosRilevata[0] = posX;
        this.interfacciaTestuale.ultimaPosRilevata[1] = posY;
        this.interfacciaTestuale.requestUpdate();
        this.interfacciaParametrizzata.ultimaPosRilevata.x = posX;
        this.interfacciaParametrizzata.ultimaPosRilevata.y = posY;
    }

    SetBarra(val) {
        this.interfacciaTestuale.timone = val;
        this.interfacciaParametrizzata.barra = val;
    }

    SetMotore(val) {
        this.interfacciaTestuale.motore = val;
        //TODO:
        //this.interfacciaParametrizzata.motore = val;
    }

    SetCarburante(val) {
        if (val < 0) {
            val = 0;
        }

        this.interfacciaTestuale.carburante = val;
        this.interfacciaParametrizzata.carburante = val;
    }
}

export function ToggleFullscreen(){
    let header = document.querySelector("header-talentree");
    if(header.style.display != "none"){
        header.style.display = "none";
    }
    else{
        header.style.display = "block";
    }
}