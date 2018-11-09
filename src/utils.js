let oldElement = null;

export let infoScheda = "";

export function setGameContent(element) {
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