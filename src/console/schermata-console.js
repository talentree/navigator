import { NavElement, html } from '../nav-element';
import { referenceNaveDaControllare, idPartita, GestoreInterfacceConsole, ToggleFullscreen } from '../utils';
import { istanzeP5, arraySquadrePartita, Nave, } from '../utils';

export class SchermataConsole extends NavElement {


  constructor() {
    super();
    this.referenceSketchp5 = null;
    this.nave = new Nave({});
    this.coefficienteResize = 1; //0.7;
    this.gestoreInterfacceConsole = new GestoreInterfacceConsole();
    this.containerp5 = null;
    window.onresize = () => {
      this.referenceSketchp5.resizeCanvas(this.containerp5.clientWidth * this.coefficienteResize, this.containerp5.clientHeight * this.coefficienteResize);
      this.gestoreInterfacceConsole.SetDimensioni(this.containerp5.clientWidth * this.coefficienteResize, this.containerp5.clientHeight * this.coefficienteResize);
    }
  }

  render() {
    if (idPartita != "") {
      firebase.firestore().collection("partite").doc(idPartita).update({ squadre: arraySquadrePartita })
    }
    return html`
    <a class="button is-primary" @click=${(e)=> { ToggleFullscreen()}}>
     Provvisorio, toggle fullscreen</a>
      <a class="button is-primary" @click=${(e)=> {
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
    this.containerp5 = document.querySelector("#container-p5");
    let _self = this;
    _self.nave.getNave(referenceNaveDaControllare);
    _self.nave.getDatiPartita(idPartita);
    _self.subGametime();
    // _self.getNomeNave()
    console.log(_self.nave);
    //TODO: PASSARE NOME NAVE _self.gestoreInterfacceConsole.SetNomeNave(_self.nave);

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

        _self.gestoreInterfacceConsole = new GestoreInterfacceConsole(p, _self.containerp5, _self.interfacciaTestualeProvvisoria, _self.containerp5.clientWidth * _self.coefficienteResize, _self.containerp5.clientHeight * _self.coefficienteResize, 51);
        //TODO: motorsound
      }

      p.draw = function () {
        //console.log("draw working!");
        p.background(51);

        //controllo uscita dalla schermata per inattività ogni 10 secondi
        if ((_self.nave.partita.datigenerali.gametime % 10) == 0) {
          _self.nave.kick(referenceNaveDaControllare, idPartita);
        }
        //passaggio dati a interfaccia tesuale
        _self.gestoreInterfacceConsole.SetNomeNave("TODO");
        _self.gestoreInterfacceConsole.SetTempoDiGioco(_self.nave.partita.datigenerali.gametime);
        _self.gestoreInterfacceConsole.SetVelocita(_self.nave.comandi.velocity);
        _self.gestoreInterfacceConsole.SetDirezione(_self.nave.pos.direzione);
        _self.gestoreInterfacceConsole.SetIntensitaVento(_self.nave.partita.datigenerali.windForce);
        _self.gestoreInterfacceConsole.SetDirezioneVento(_self.nave.partita.datigenerali.windDir);
        _self.gestoreInterfacceConsole.SetUltimaPosizioneRilevata(_self.nave.pos.posx, _self.nave.pos.posy)
        _self.gestoreInterfacceConsole.SetBarra(_self.nave.comandi.barra);
        _self.gestoreInterfacceConsole.SetMotore(_self.nave.comandi.accel);
        _self.gestoreInterfacceConsole.SetCarburante(_self.nave.pos.carb);
        // _self.gestoreInterfacceConsole.SetRadar(_self.nave.radar.radarfrontale) TODO: QUANDO PRONTO SU ENGINE E FIREBASE TOGLIERE IL COMMENTO
        //_self.gestoreInterfacceConsole.SetCollisioneImminente()
        if (_self.nave.radar.statoNave == 1) {
          _self.gestoreInterfacceConsole.SetCollisioneAvvenuta(true)
        }
        else {
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
              //TODO: reset timone
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
    istanzeP5.push(new p5(sketch, this.containerp5));
  }

  subGametime() {
    let ref = "/partite/" + idPartita
    firebase.firestore().doc(ref)
      .onSnapshot(doc => {
        //console.log(doc.data())
        //this.nave.getNave(referenceNaveDaControllare);
        //this.nave.getDatiPartita(idPartita);
        if(this.nave && this.nave.partita){
          //console.log(doc.data())
          this.nave.partita.nomePartita = doc.data().nomePartita || {};
          this.nave.partita.datigenerali = doc.data().datigenerali || {};
          this.nave.partita.squadre = doc.data().squadre || {};
        }
      });

      this.subNave()
  }

  subNave(){
    firebase.firestore().collection("navi").doc(referenceNaveDaControllare)
    .onSnapshot(doc=>{
      if(this.nave){
        //console.log(doc.data())
        this.nave.comandi = doc.data().comandi || {};
        this.nave.datiIniziali = doc.data().datiIniziali || {};
        this.nave.pos = doc.data().pos || {};
        this.nave.radar = doc.data().radar || {};
      }
    })
  }
  /*
  getNomeNave(){
    let temp=Object.values(arraySquadrePartita);
    temp.forEach(squadra =>{
      console.log(squadra.nome.toString())
      if(squadra.reference==referenceNaveDaControllare){
        this.gestoreInterfacceConsole.SetNomeNave("ciao");
      }
    })
  }*/

  creaInterfacciaTestuale() {
    this.interfacciaTestualeProvvisoria = document.createElement("interfaccia-testuale-console");
    return html`
    ${this.interfacciaTestualeProvvisoria}
    `
  }
}
