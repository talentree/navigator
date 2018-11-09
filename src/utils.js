let oldElement = null;

export function setGameContent(element) {

    let parent = document.querySelector('#game-content');
    const newElement = document.createElement(element);
    if(oldElement) {
        parent.replaceChild(newElement, oldElement);
    } else {
        parent.appendChild(newElement);
    }
    oldElement = newElement;

}

export function backToMainMenu(){
    if(oldElement){
        document.querySelector("#game-content").removeChild(oldElement);
        oldElement = null;
    }
    setGameContent("login-console");
}