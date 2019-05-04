import { NavElement, html } from '../nav-element';
import { referenceNaveDaControllare, idPartita, InterfacciaParametrizzata, GestoreInterfacceConsole } from '../utils';
import { istanzeP5, arraySquadrePartita, ButtonTondoConsole, InfoSullaNaveConsole, Nave, } from '../utils';

export class SchermataConsole extends NavElement {


  constructor() {
    super();
    this.referenceSketchp5 = null;

    this.nave = new Nave({});
    this.coefficienteResize = 0.7;
    this.gestoreInterfacceConsole = new GestoreInterfacceConsole();
    window.onresize = () => {
      this.referenceSketchp5.resizeCanvas(window.innerWidth * this.coefficienteResize, window.innerHeight * this.coefficienteResize);
      this.gestoreInterfacceConsole.SetDimensioni(window.innerWidth * this.coefficienteResize, window.innerHeight * this.coefficienteResize);
    }
  }

  render() {
    if (idPartita != "") {
      firebase.firestore().collection("partite").doc(idPartita).update({ squadre: arraySquadrePartita })
    }
    return html`
      <h1 class="title is-4">Qui verrà mostrata la console per comandare la nave</h1>
      <p class="subtitle">La nave è in path navi/${referenceNaveDaControllare}</p>
      <a class="button is-primary" @click=${(e) => {
        this.gestoreInterfacceConsole.PassaAInterfacciaTestuale(!this.gestoreInterfacceConsole.isInterfacciaTestuale)
      }}>Provvisorio, toggle interfaccia testuale</a>
      <br>
      ${this.creaInterfacciaTestuale()}
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
   // _self.gestoreInterfacceConsole.SetNomeNave(_self.nave);

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

        _self.gestoreInterfacceConsole = new GestoreInterfacceConsole(p, document.querySelector("#container-p5"), _self.interfacciaTestualeProvvisoria, window.innerWidth * _self.coefficienteResize, window.innerHeight * _self.coefficienteResize, 51);
        //TODO: motorsound
      }

      p.draw = function () {
        //console.log("draw working!");
        p.background(51);

        //aggiornamento dati Nave
        _self.nave.getNave(referenceNaveDaControllare);
        _self.nave.getDatiPartita(idPartita);
        //uscita dalla schermata per inattività
        _self.nave.kick(referenceNaveDaControllare, idPartita);
        _self.gestoreInterfacceConsole.SetNomeNave(_self.nave);
        //passaggio dati a interfaccia tesuale
        _self.gestoreInterfacceConsole.SetTempoDiGioco(_self.nave.partita.datigenerali.gametime);
        _self.gestoreInterfacceConsole.SetVelocita(_self.nave.comandi.velocity);
        _self.gestoreInterfacceConsole.SetDirezione(_self.nave.pos.direzione);
        _self.gestoreInterfacceConsole.SetIntensitaVento(_self.nave.partita.datigenerali.windForce);
        _self.gestoreInterfacceConsole.SetDirezioneVento(_self.nave.partita.datigenerali.windDir);
        _self.gestoreInterfacceConsole.SetUltimaPosizioneRilevata(_self.nave.pos.posx, _self.nave.pos.posy)
       // _self.gestoreInterfacceConsole.SetRadar(_self.nave.radar.radarfrontale) TODO: QUANDO PRONTO SU ENGINE E FIREBASE TOGLIERE IL COMMENTO
       //_self.gestoreInterfacceConsole.SetCollisioneImminente()
       if(_self.nave.radar.statoNave == 1){
        _self.gestoreInterfacceConsole.SetCollisioneAvvenuta(true)
       }
       else{
          _self.gestoreInterfacceConsole.SetCollisioneAvvenuta(false)
        }
        _self.gestoreInterfacceConsole.Display();
      }



      p.mousePressed = function () {
        if (p.mouseButton === p.LEFT) {
          let coloreNelPunto = p.get(p.mouseX, p.mouseY);
          coloreNelPunto.pop();
          let whereIsClick = _self.gestoreInterfacceConsole.WhereIsClick(coloreNelPunto);

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
              // controllo che barra sia tra -30<barra<30 poi aggiorno valori su firebase             
              if (_self.nave.comandi.barra < 30) {
                console.log("Vira a destra");
                _self.nave.comandi.barra++;
                _self.nave.updateNave(referenceNaveDaControllare, _self.nave);
                _self.nave.updateTimer(referenceNaveDaControllare, idPartita);
                break;
              }
              else {
                //riporta il valore a 30 nel caso vada oltre per errori
                _self.nave.comandi.barra = 30;
                _self.nave.updateNave(referenceNaveDaControllare, _self.nave);
                _self.nave.updateTimer(referenceNaveDaControllare, idPartita);
                console.log("limite barra raggiunto");
                break;
              }
            }
            case 4: {
              // controllo che barra sia tra -30<barra<30 poi aggiorno valori su firebase
              if (_self.nave.comandi.barra > -30) {
                console.log("Vira a sinistra");
                _self.nave.comandi.barra--;
                _self.nave.updateNave(referenceNaveDaControllare, _self.nave);
                _self.nave.updateTimer(referenceNaveDaControllare, idPartita);
                break;
              }
              else {
                //riporta il valore a -30 nel caso vada oltre per errori
                _self.nave.comandi.barra = -30
                _self.nave.updateNave(referenceNaveDaControllare, _self.nave);
                _self.nave.updateTimer(referenceNaveDaControllare, idPartita);
                console.log("limite barra raggiunto");
                break;
              }
            }
            case 5: {
              console.log("Reset timone");
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

  creaInterfacciaTestuale() {
    this.interfacciaTestualeProvvisoria = document.createElement("interfaccia-testuale-console");
    return html`
    ${this.interfacciaTestualeProvvisoria}
    `
  }
}
