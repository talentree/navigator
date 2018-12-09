import { NavElement, html } from "../nav-element";
import { istanzeP5 } from '../utils';

export class SchermataEngine extends NavElement {
    constructor() {
        super();
    }

    render() {
        return html`
            <h1 class="title is-4">Engine vero e proprio</h1>
            <!--Container p5. Viene eliminato separatamente nell'utils-->
            <div id="container-p5"></div>
        `;
    }

    /*
    first updated viene chiamato quando il render è completo.
    Devo creare qui la nuova istanza di p5 altrimenti non trova
    il container
    */
    firstUpdated() {
        //console.log("updated");
        //la variabile sketch contiene le funzioni setup e draw di p5
        let sketch = function (p) {

            p.setup = function () {
                p.createCanvas(300, 300);
                p.background(0);
                console.log("setup completo");
            }

            p.draw = function () {
                console.log("funzione di draw");
            }
        };

        console.log(document.querySelector("#container-p5"));
        //creo un'istanza di p5 e la aggiungo all'array di utils.js
        istanzeP5.push(new p5(sketch, document.querySelector("#container-p5")));
    }
}