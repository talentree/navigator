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
export function  setArraySquadrePartita(val, val1){
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