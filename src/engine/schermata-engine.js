import { NavElement, html } from "../nav-element";


export class SchermataEngine extends NavElement{
    constructor(){
        super();
    }

    render(){
        return html`
            <h1 class="title is-4">Engine vero e proprio</h1>
        `;
    }
}