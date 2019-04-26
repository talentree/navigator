import { NavElement, html } from '../nav-element';
import { referenceNaveDaControllare, idPartita } from '../utils';
import { istanzeP5, arraySquadrePartita, ButtonTondoConsole, InfoSullaNaveConsole } from '../utils';

export class SchermataConsole extends NavElement {


  constructor() {
    super();
    this.referenceSketchp5 = null;
    this.buttonTondo = new ButtonTondoConsole();
    this.infoSullaNave = new InfoSullaNaveConsole();

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
        _self.infoSullaNave = new InfoSullaNaveConsole(infoNaveTag);

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
        _self.infoSullaNave.display();
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

}
                                                                                                                        /*
                                                                                                                        function misureanticollisione()
                                                                                                                        {
                                                                                                                          var icf = frameCount;
                                                                                                                          print ("inizio misureanticollisione");
                                                                                                                          
                                                                                                                          b01.vel=-1;
                                                                                                                          collisionsound.loop();
                                                                                                                          collisionsound.play();
                                                                                                                          b01.vel=-1;
                                                                                                                        fill(255,0,0);
                                                                                                                        text("(C)Velocità: " + nf(b01.vel, 0, 2), width * 0.1, height * 0.2);
                                                                                                                        
                                                                                                                        
                                                                                                                          for(var i = 0; i < arretracoll; i++) {
                                                                                                                        //   loadFirebase();
                                                                                                                        // loadTime();
                                                                                                                        rect(50, height, 475, 10);  /// quale y?
                                                                                                                        //     b01.display(xc, yc, ra, rb,b01.variazionebarra, b01.barra, b01.accel);
                                                                                                                        //sendToFirebase3();
                                                                                                                          print ("fine misureanticollisione");
                                                                                                                        
                                                                                                                            
                                                                                                                          }
                                                                                                                          
                                                                                                                          b01.vel=0;
                                                                                                                          
                                                                                                                        noFill();  
                                                                                                                          
                                                                                                                        };
                                                                                                                        
                                                                                                                        
                                                                                                                        
                                                                                                                        var myFont;
                                                                                                                        
                                                                                                                        preload() {
                                                                                                                          myFont = loadFont('assets/Raleway_Thin.otf');
                                                                                                                        motorsound = loadSound ('assets/engine308.mp3');
                                                                                                                        arrivedsound = loadSound ('assets/shiphorn.wav'); //cambia in mp3
                                                                                                                        collisionsound = loadSound ('assets/alarmsgq.wav');
                                                                                                                        
                                                                                                                        }
                                                                                                                        
                                                                                                                        window.onresize = function() {
                                                                                                                          var w = window.innerWidth;
                                                                                                                          var h = window.innerHeight;
                                                                                                                          canvas.size(w, h);
                                                                                                                          width = w; height =h;
                                                                                                                        }
                                                                                                                        
                                                                                                                        
                                                                                                                        buttonTondo(raggio,r2, xc, yc, variazionebarra, barra, accel) {
                                                                                                                          this.r = raggio;
                                                                                                                          this.x = xc;
                                                                                                                          this.y = yc;
                                                                                                                          this.barra = barra;
                                                                                                                          this.accel = accel;
                                                                                                                          this.buttILpressed=false;
                                                                                                                        this.buttIRpressed=false;
                                                                                                                        this.buttELpressed=false;
                                                                                                                        this.buttERpressed=false;
                                                                                                                        
                                                                                                                        this.buttonpressed=0;
                                                                                                                        
                                                                                                                        
                                                                                                                          this.display = function(xc, yc, r,r2, variazionebarra, barra) {
                                                                                                                            // noFill ();
                                                                                                                            var rh = r2*0.2;
                                                                                                                            
                                                                                                                            textFont(myFont);
                                                                                                                            textSize(36);
                                                                                                                            fill(255, 255, 255, 90);
                                                                                                                            arc(xc, yc, r2, r2, -90, 90, PIE);
                                                                                                                            arc(xc, yc, r2, r2, 90, -90, PIE);
                                                                                                                            fill(255, 255, 255, 40);
                                                                                                                            arc(xc, yc, r, r, -90, 90, PIE);
                                                                                                                            arc(xc, yc, r, r, 90, -90, PIE);
                                                                                                                            print ("bP "+b01.buttonpressed);
                                                                                                                            if (b01.buttonpressed=1) {fill(255, 0, 0, 200);};
                                                                                                                        ellipse(xc, yc, r * 0.1, r * 0.1);
                                                                                                                            //strokeWeight (20);
                                                                                                                            stroke(0, 0, 0, 150);
                                                                                                                            line(xc, yc - r / 2, xc, yc + r / 2);
                                                                                                                          //  fill(0, 0, 0, 127);
                                                                                                                          // noStroke();
                                                                                                                                fill(255, 255, 255, 200);
                                                                                                                        
                                                                                                                            textSize(height*0.07);
                                                                                                                            textAlign(CENTER);
                                                                                                                            noStroke();
                                                                                                                            text("B", xc, yc - r * 0.1);
                                                                                                                            text(nf(this.barra, 2, 2), xc, yc - r * 0.3);
                                                                                                                            //text(nf(this.variazionebarra, 2, 2), xc, yc - r * 0.3)
                                                                                                                              //line (xc,yc,xc+r/2*cos(variazionebarra),yc+r*sin (variazionebarra));
                                                                                                                        text("V", xc, yc + r * 0.2);
                                                                                                                            text(nf(this.vel, 2, 2), xc, yc + r * 0.4);
                                                                                                                            
                                                                                                                            
                                                                                                                        //text("VEL: " + nf(b01.vel, 0, 2), width * 0.1, height * 0.4);
                                                                                                                            stroke(0, 255, 0, 150);
                                                                                                                            line (xc,yc,xc+r/2*cos( barra-90),yc+r/2*sin ( barra-90));
                                                                                                                            
                                                                                                                        //allarme
                                                                                                                        //if stato ..... 
                                                                                                                        fill (200);stroke (255, 255, 255, 150);
                                                                                                                        triangle (xc, ycb-rh, xc, ycb+rh, xc+2*rh, ycb);
                                                                                                                          triangle (xc, ycb-rh, xc, ycb+rh, xc-2*rh, ycb);
                                                                                                                            noFill;noStroke();
                                                                                                                            
                                                                                                                            stroke(255, 0, 0);fill(255, 0, 0);
                                                                                                                        
                                                                                                                            text ("stato:"+statonave,xc, yc+r);
                                                                                                                              noFill;noStroke();
                                                                                                                        
                                                                                                                            
                                                                                                                          }
                                                                                                                        }
                                                                                                                        
                                                                                                                        
                                                                                                                      mousePressed() 
                                                                                                                        {
                                                                                                                          b01.mx = mouseX;
                                                                                                                            b01.my = mouseY;
                                                                                                                            b01.r = ra;
                                                                                                                            b01.raggio2 = rb;
                                                                                                                            b01.variazionebarra = 0;
                                                                                                                            b01.accel = 0;
                                                                                                                            b01.buttonpressed=0;
                                                                                                                            //b01.barra= barra;
                                                                                                                            b01.variazionebarra =0;
                                                                                                                        print ("1 b.01barra "+ b01.barra+" b01.variazionebarra "+ b01.variazionebarra);
                                                                                                                        
                                                                                                                            b01.d = dist(b01.mx, b01.my, xc, yc);
                                                                                                                          print   ("d:"+b01.d+" r"+b01.r);
                                                                                                                        
                                                                                                                            if ((b01.d < b01.r * 0.1) ) { b01.barra = 0; b01.buttonpressed=0   } else
                                                                                                                        
                                                                                                                            {
                                                                                                                        
                                                                                                                              if ((b01.d < b01.r / 2) ) {
                                                                                                                                if (mouseX < xc) {
                                                                                                                                  b01.variazionebarra = -0.2;
                                                                                                                                } else {
                                                                                                                                  b01.variazionebarra = 0.2;
                                                                                                                                }
                                                                                                                        
                                                                                                                              } else
                                                                                                                        
                                                                                                                              {
                                                                                                                                if ((b01.d > b01.r/2) && (b01.d < b01.raggio2) ) {
                                                                                                                                  if (mouseX < xc) {
                                                                                                                                    b01.accel = -2;
                                                                                                                                    print("va---------------------------------------")
                                                                                                                                  } else {
                                                                                                                                    b01.accel = 2;
                                                                                                                                    print("vb-----------------------------------")
                                                                                                                                  }
                                                                                                                        
                                                                                                                                }
                                                                                                                              }
                                                                                                                        
                                                                                                                            }
                                                                                                                        
                                                                                                                            //print (b01.d+" variaz"+b01.variazionebarra);  
                                                                                                                        b01.barra = b01.barra + b01.variazionebarra;
                                                                                                                        print (" 3 b.01barra "+ b01.barra+" b01.variazionebarra "+ b01.variazionebarra);
                                                                                                                        
                                                                                                                        b01.vel = b01.vel + b01.accel;
                                                                                                                        if (b01.vel>velmax) {b01.vel=velmax}
                                                                                                                        else {
                                                                                                                        if (b01.vel<-velmax) {b01.vel=-velmax};
                                                                                                                        }
                                                                                                                        ;
                                                                                                                        
                                                                                                                        
                                                                                                                          }
                                                                                                                          

                                                                                                                      */
                                                                                                                        }