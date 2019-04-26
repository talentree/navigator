import { NavElement, html } from '../nav-element';
import { referenceNaveDaControllare, idPartita } from '../utils';
import { arraySquadrePartita } from '../utils';

export class SchermataConsole extends NavElement {


  constructor() {
    super();
    this.db = firebase.firestore();
  }

  render() {
    firebase.firestore().collection("partite").doc(idPartita).update({squadre: arraySquadrePartita})
    return html`
      <h1 class="title is-4">Qui verrà mostrata la console per comandare la nave</h1>
      <p class="subtitle">La nave è in path navi/${referenceNaveDaControllare}</p>
      <div id="container-p5"></div>
      
    `;
  }

firstUpdated(){
  let _self = this;
  let sketch = function (p) {
      var canvas;
      var vel, barra, dir, posx, posy, carb;
      var gtime, wforce, wdir;
      var database;
      
      var ra, rb, xc, yc,ycb, dd;
      var variazionebarra;
      
      var velmax =20; // nodi, velocità max
      var statonave; 
      var arretracoll=10; // n.cicli di arretramento per collisione a vel.1
      var b01 ;
      var motorsound,collisionsound,arrivedsound;
      
      
      var isOverRectangle, isOverRectangle2;
      //var x1, x2, x3, x4, y1, y2, y3, y4;
      //var online =true ; // connesso o no rete, per simulare senza firebase
   p.setup=function() {
            p.angleMode(DEGREES); // Change the mode to DEGREES
          
          // audio = createAudio ('assets/engine308.mp3');
          p.motorsound.loop(); // song is ready to play during setup() because it was loaded during preload
          
          p.motorsound.play();
            // createCanvas(800, 600);
            p.createCanvas(window.innerWidth, window.innerHeight);
            vel = 0;
            barra = 0;
          
            dir = 90;
          // dati di inzio che elggerà da fbase
          
            posx = 10;
            posy = 10;
            carb = 1800;
            
            // fine dati inziali
          
            p.angleMode(DEGREES);
            
            
            ra =  window.innerWidth *0.3;// cerchio interno barra
            rb = ra*1.4; //cerchio esterno accel
            xc = window.innerWidth *0.5;
            yc = window.innerHeight * 0.7;
            b01 = new buttonTondo(ra,rb, xc, yc, variazionebarra, barra, vel);
            b01.vel = 0;
            //b01.barra=0;
            b01.variazionebarra = 1;
          
            gtime = 0;
            wforce = 1;
            wdir = 90;
            
          p.frameRate(30); //ck per la variabile tempo
          
          p. background(51);
            p.textFont(myFont);
            p.textSize(36);
          /*
            // Initialize Firebase
            var config = {
              apiKey: "AIzaSyCylMEP4sWtvBzHHyGfDlZw4UaBGeyFGkk",
              authDomain: "asdsd-1cd19.firebaseapp.com",
              databaseURL: "https://asdsd-1cd19.firebaseio.com",
              projectId: "asdsd-1cd19",
              storageBucket: "asdsd-1cd19.appspot.com",
              messagingSenderId: "1084152933059"
            };
            if (online) 
            {
            firebase.initializeApp(config);
            database = firebase.database();
            //console.log (firebase);
          
            loadFirebase();
            }*/
    }
                                                                                                                  /*
                                                                                                                  function loadFirebase() {
                                                                                                                    var ref = database.ref("nave01");
                                                                                                                    ref.on("value", gotData, errData);
                                                                                                                  }
                                                                                                                  loadTime() {
                                                                                                                    //var refgt = database.ref("datigenerali/gametime");
                                                                                                                    //refgt.on("value", gotData, errData);
                                                                                                                    //  console.log (firebase.database().ref("datigenerali/gametime"));
                                                                                                                  
                                                                                                                    var gt = firebase.database().ref("datigenerali");
                                                                                                                    gt.on("value", gotData2, errData);
                                                                                                                  
                                                                                                                    // console.log("gt:"+gt.val);
                                                                                                                  }
                                                                                                                  
                                                                                                                  
                                                                                                                  function errData(error) {
                                                                                                                    console.log("Something went wrong.");
                                                                                                                    console.log(error);
                                                                                                                  }
                                                                                                                  
                                                                                                                  
                                                                                                                  // The data comes back as an object
                                                                                                                  function gotData2(data) {
                                                                                                                    var datigenerali = data.val();
                                                                                                                    // Grab all the keys to iterate over the object
                                                                                                                    var gt = Object.keys(datigenerali);
                                                                                                                    //var velocity = nave01[key];
                                                                                                                  // console.log("Firebase gametime:" + datigenerali.gametime);
                                                                                                                  //  console.log("Firebase w dir:" + datigenerali.winddir);
                                                                                                                  //  console.log("Firebase w forc:" + datigenerali.windforce);
                                                                                                                    // console.log("Firebase:" + velocity.total);
                                                                                                                  
                                                                                                                    gtime = datigenerali.gametime;
                                                                                                                    wdir = datigenerali.winddir;
                                                                                                                    wforce= datigenerali.windforce
                                                                                                                  
                                                                                                                  
                                                                                                                  }
                                                                                                                  
                                                                                                                  
                                                                                                                  // The data comes back as an object
                                                                                                                  function gotData(data) {
                                                                                                                    var nave01 = data.val();
                                                                                                                    // Grab all the keys to iterate over the object
                                                                                                                    var keys = Object.keys(nave01);
                                                                                                                    //var velocity = nave01[key];
                                                                                                                    //console.log("Firebase dir:" + nave01.direzione);
                                                                                                                    //console.log("Firebase barra:" + nave01.barra);
                                                                                                                  dd= nave01.pos.direzione;
                                                                                                                  carb= nave01.pos.carb;
                                                                                                                  statonave=nave01.radar.statonave;
                                                                                                                  print ("direzione: "+dd);
                                                                                                                  
                                                                                                                    console.log("leggo stato nave:" + statonave);
                                                                                                                    // console.log("Firebase:" + velocity.total);
                                                                                                                  
                                                                                                                  
                                                                                                                  }
                                                                                                                  
                                                                                                                  
                                                                                                                  // This is a function for sending data
                                                                                                                  function sendToFirebase3() {
                                                                                                                    var nave01 = database.ref('nave01/comandi');
                                                                                                                  
                                                                                                                    // Make an object with data in it
                                                                                                                    var data = {
                                                                                                                      // velocity: velInput.value(),
                                                                                                                      velocity: b01.vel,
                                                                                                                      barra: b01.barra,
                                                                                                                      accel: b01.accel
                                                                                                                    }
                                                                                                                  
                                                                                                                  
                                                                                                                    var velocity = nave01.set(data, finished);
                                                                                                                    //console.log("Firebase generated key: " + velocity.key);
                                                                                                                  
                                                                                                                    // Reload the data for the page
                                                                                                                    function finished(err) {
                                                                                                                      if (err) {
                                                                                                                        console.log("ooops, something went wrong.");
                                                                                                                        console.log(err);
                                                                                                                      } else {
                                                                                                                        //   console.log('Data saved successfully');
                                                                                                                      }
                                                                                                                    }
                                                                                                                  }
                                                                                                                  
                                                                                                                  */
                                                                                                                  
                                                                                                                  //===========================================================================================
        p.draw =function() {
                  //  if (online) 
                    // { 
                    //   loadFirebase();
                  //loadTime();
                // };
                    ra =  window.innerWidth *0.3;// cerchio interno barra
                    rb = ra*1.4; //cerchio esterno accel
                    xc = window.innerWidth / 2;
                    yc = window.innerHeight * 0.5;
                    ycb = window.innerHeight  * 0.80;
                    //buttonpressed=0;
                    motorsound.setVolume (abs(b01.vel)*0.2);
                    console.log ("volume:"+(abs(b01.vel)*0.2)); // per veloc abs 0-5
                    p.fill(51);
                    p.rect(0, 0, width, height);
                    p.fill(255);
                    p.stroke(255);
                    p.strokeWeight(1)
                    p.textAlign(LEFT);
                    p.textSize(width*0.05);
                    p.text("SHIP: "+"nave01", width * 0.1, height * 0.09);
                    p.textSize(width / 30);   text("TIME: ", width *0.5, height * 0.09)
                    p.textSize(width / 10);   text(nf(gtime, 0, 0), width * 0.75, height * 0.09);
                  
                    p.textSize(width*0.04);
                    
                    p.text("Velocità: " + nf(b01.vel, 0, 2), width * 0.1, height * 0.2);
                  // text(" Direzione: " + nf(b01.barra, 0, 2), width * 0.5, height * 0.4);
                      p.text(" Direzione: " + dd, width * 0.5, height * 0.2);
                  // errore print ("dd "+nf(dd,2,0));
                  
                    p.text("Fuel: " + nf(carb, 0, 2), width * 0.1, height * 0.25);
                  // text("direzione: " + nf(b01.barra, 0, 2), width * 0.5, height * 0.4);
                      p.text("vento: dir " + nf(wdir,0,2)+" forza: "+nf(wforce,0,2) , width * 0.5, height * 0.25);
                  
                  //  b01.press(mouseX, mouseY, xc, yc, ra,b01.barra);
                    // textAlign(LEFT);   textSize(25);   text("d " + dd, 10, height * 0.95); //controllo distanza
                    b01.display(xc, yc, ra, rb,b01.variazionebarra, b01.barra, b01.accel);
                  // b01.barra = b01.barra + b01.variazionebarra;
                  // b01.vel = b01.vel + b01.accel;
                  p.strokeWeight(1);
                  p.fill(255, 255, 255, 160);
                  
                    p.line(xc, yc, xc + ra / 2 * cos(b01.barra - 90), yc + ra / 2 * sin(b01.barra - 90));
                  // direzione del Nord -----------------------------
                  p.stroke (255,0,0,160);strokeWeight(4);
                  // bussolab
                  p.line(xc, yc, xc + ra * cos(180-dd), yc + ra * sin(180-dd));
                  //print ("dd "+dd);
                  p.noStroke();
                  //--------------------------------------
                  
                  if (statonave==1) {misureanticollisione();};
                  if (statonave==2)  {arrived()};
                  
                  if (online){ sendToFirebase3()};
     };

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