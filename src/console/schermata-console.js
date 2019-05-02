import { NavElement, html } from '../nav-element';
import { referenceNaveDaControllare, idPartita } from '../utils';
import { istanzeP5, arraySquadrePartita, ButtonTondoConsole, InfoSullaNaveConsole, Nave,  } from '../utils';

export class SchermataConsole extends NavElement {


  constructor() {
    super();
    this.referenceSketchp5 = null;
    this.buttonTondo = new ButtonTondoConsole();
    this.interfacciaTestuale = null;
    this.nave = new Nave({});
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
    _self.nave.getNave(referenceNaveDaControllare);
    _self.nave.getDatiPartita(idPartita);
    console.log(_self.nave);

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

        //aggiornamento dati Nave
        _self.nave.getNave(referenceNaveDaControllare);
        _self.nave.getDatiPartita(idPartita);
        //uscita dalla schermata per inattività
        _self.nave.kick(referenceNaveDaControllare, idPartita);
      }

      

      p.mousePressed = function () {
        if (p.mouseButton === p.LEFT) {
          let coloreNelPunto = p.get(p.mouseX, p.mouseY);
          coloreNelPunto.pop();
          let whereIsClick = _self.buttonTondo.whereIsClick(coloreNelPunto);
          switch (whereIsClick) {
            case 1: {
              console.log("Aumenta accelerazione");
              //aumento accel e passaggio dati al database
              _self.nave.comandi.accel++;
              _self.nave.updateNave(referenceNaveDaControllare, _self.nave);
              _self.nave.updateTimer(referenceNaveDaControllare, idPartita);
              break;
            }
            case 2: {
              console.log("Diminuisci accelerazione");
              //diminuisco accel e passaggio dati al database
              _self.nave.comandi.accel--;
              _self.nave.updateNave(referenceNaveDaControllare, _self.nave);
              _self.nave.updateTimer(referenceNaveDaControllare, idPartita);
              break;
            }
            case 3: { 
              // controllo che barra sia tra -45<barra<45 poi aggiorno valori su firebase             
              if( _self.nave.comandi.barra < 45){
                console.log("Vira a destra");
                _self.nave.comandi.barra++;
                _self.nave.updateNave(referenceNaveDaControllare, _self.nave);
                _self.nave.updateTimer(referenceNaveDaControllare, idPartita);
                break;
              }
              else{
                _self.nave.updateTimer(referenceNaveDaControllare, idPartita);
                console.log("limite barra raggiunto");
                break;
              }
            }
            case 4: {
              // controllo che barra sia tra -45<barra<45 poi aggiorno valori su firebase
              if(_self.nave.comandi.barra > -45){
                console.log("Vira a sinistra");
                _self.nave.comandi.barra--;
                _self.nave.updateNave(referenceNaveDaControllare, _self.nave);
                _self.nave.updateTimer(referenceNaveDaControllare, idPartita);
                break;
              }
              else{
                _self.nave.updateTimer(referenceNaveDaControllare, idPartita);
                console.log("limite barra raggiunto");
                break;
              }
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
                                                                                                                        