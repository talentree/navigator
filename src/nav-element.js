import { LitElement, html } from '@polymer/lit-element';

export { html };
export class NavElement extends LitElement {

    constructor() {
        super();
    }

    // serve per modificare il comportamento di default che crea un elemento
    // all'interno di uno shadows-dom e non permette quindi di condividere 
    // uno stile globale
    createRenderRoot() {
        return this;
    }

}