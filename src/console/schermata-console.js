import { NavElement, html } from '../nav-element';
import { referenceNaveDaControllare, idPartita } from '../utils';
import { istanzeP5, arraySquadrePartita, ButtonTondoConsole, InfoSullaNaveConsole } from '../utils';


export class SchermataConsole extends NavElement {


  constructor() {
    super();
    this.referenceSketchp5 = null;
    this.buttonTondo = new ButtonTondoConsole();
    //this.infoSullaNave = new InfoSullaNaveConsole();
    this.interfacciaTestuale = null;
    this.coefficienteResize = 0.7;

    window.onresize = () => {
      this.referenceSketchp5.resizeCanvas(window.innerWidth * this.coefficienteResize, window.innerHeight * this.coefficienteResize)
    }
  }

  render() {
    if (idPartita != "") {
      firebase.firestore().collection("partite").doc(idPartita).update({ squadre: arraySquadrePartita })
    }
    return html`
      <h1 class="title is-4">Qui verrà mostrata la console per comandare la nave</h1>
      <p class="subtitle">La nave è in path navi/${referenceNaveDaControllare}</p>
      <a class="button is-primary" @click=${(e) => { this.interfacciaTestuale.hide = !
       this.interfacciaTestuale.hide }}>Provvisorio, toggle interfaccia testuale</a>
      <br>
      ${this.setInterfacciaTestuale()}
      <br>
      <p id="info-nave"></p>
      <!--Container p5. Viene eliminato separatamente nell'utils-->
      <div id="container-p5"></div>
    `;
  }




  firstUpdated() {
    let _self = this;

    let sketch = function (p) {
      p.setup = function () {
        //console.log("setup working!");
        _self.referenceSketchp5 = p;
        //imposto angoli in deg
        p.angleMode(p.DEGREES);

        //creo il canvas secondo le dimensioni dello schermo
        p.createCanvas(window.innerWidth * _self.coefficienteResize, window.innerHeight * _self.coefficienteResize);
        //import framerate a tot
        p.frameRate(30);

        //backgroung grigio
        p.background(51);

        //TODO: settare parametri corretti qui o in draw
        _self.buttonTondo = new ButtonTondoConsole(p, 250, 250, 50, 70, 0, 60, 0);
        let infoNaveTag = document.querySelector("#info-nave");
        //_self.infoSullaNave = new InfoSullaNaveConsole(infoNaveTag);

        //TODO: motorsound
      }

      p.draw = function () {
        //console.log("draw working!");
        p.background(51);

        let posX = window.innerWidth * _self.coefficienteResize / 2;
        let posY = window.innerHeight * _self.coefficienteResize / 2;
        let raggioInterno = window.innerWidth * _self.coefficienteResize * 0.3;
        let raggioEsterno = raggioInterno * 1.4;


        _self.buttonTondo.setPosEDimensioni(posX, posY, raggioInterno, raggioEsterno);
        let ycb = window.innerHeight * _self.coefficienteResize * 0.80;

        _self.buttonTondo.display(ycb);
        //_self.infoSullaNave.display();
      }

      p.mousePressed = function () {
        if (p.mouseButton === p.LEFT) {
          let coloreNelPunto = p.get(p.mouseX, p.mouseY);
          coloreNelPunto.pop();
          let whereIsClick = _self.buttonTondo.whereIsClick(coloreNelPunto);
          switch (whereIsClick) {
            case 1: {
              console.log("Aumenta velocità");
              break;
            }
            case 2: {
              console.log("Diminuisci velocità");
              break;
            }
            case 3: {
              console.log("Vira a destra");
              break;
            }
            case 4: {
              console.log("Vira a sinistra");
              break;
            }
            default: {
              console.log("Fuori dal cerchio");
              break;
            }
          }
        }
      }
    }

    //creo un'istanza di p5 e la aggiungo all'array di utils.js
    istanzeP5.push(new p5(sketch, document.querySelector("#container-p5")));
  }


  setInterfacciaTestuale() {
    this.interfacciaTestuale = document.createElement("interfaccia-testuale-console");
    this.interfacciaTestuale.testo = "fanc";
    return html`
    ${this.interfacciaTestuale}
    `
  }
}
