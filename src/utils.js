let oldElement = null;
export let infoScheda = "";
export let istanzeP5 = [];

export function setGameContent(element) {
    //elimino tutte le istanze di p5
    istanzeP5.forEach(istanza=>{
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
    if (element === "schermata-console") { infoScheda = "Console della nave" }
    if (element === "schermata-mappa") { infoScheda = "Visualizza la mappa" }
    if (element === "schermata-crea-partita") { infoScheda = "Creazione partita" }
    if (element === "main-menu") { infoScheda = "Home" }
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
export function resetHeader(){
    //console.log("resetto header");
    //rimuovo il vecchio header e lo rimpiazzo aggiornato
    let oldHeader = document.querySelector("#headerTalentree");
    let newHeader = document.createElement("header-Talentree");
    newHeader.id = "headerTalentree";
    oldHeader.replaceWith(newHeader);
}