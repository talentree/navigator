import { NavElement, html } from "../nav-element";
import { istanzeP5 } from '../utils';

export class SchermataEngine extends NavElement{
    constructor(){
        super();

        let sketch = function(p) {
            p.setup = function(){
              p.createCanvas(300,300);
              p.background(0);
              console.log("canvas creato correttamente")
            }
            p.draw = function(){
                console.log("funzione di draw")
            }
          };
        istanzeP5.push(new p5(sketch, 'container-p5'));
    }

    render(){
        return html`
            <h1 class="title is-4">Engine vero e proprio</h1>
            <div id="container-p5"></div>
        `;
    }
}