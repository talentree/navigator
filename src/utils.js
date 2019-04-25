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
    //vado al menù pricipale
    setGameContent("main-menu");
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
        this.squadre = data.squadre || [];
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
        if(paragrafo){
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