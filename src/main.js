import { LoginConsole } from './console/login-console';
import { SchermataConsole } from './console/schermata-console';
import { backToMainMenu } from './utils';
import { HeaderTalentree } from './header/header';
import { MainMenu } from './main-menu/main-menu';
import { SchermataMappa } from './mappa/mappa';
import { SchermataCreaPartita } from './engine/crea-partita';
import { SchermataEngine } from './engine/schermata-engine';
//import * as firebase from 'firebase';

// Inizializzo Firebase
var config = {
    apiKey: "AIzaSyAGEi4dQkbR2feQyJwqZUkztgpgV0nT3Hk",
    authDomain: "navigator-talentree.firebaseapp.com",
    databaseURL: "https://navigator-talentree.firebaseio.com",
    projectId: "navigator-talentree",
    storageBucket: "navigator-talentree.appspot.com",
    messagingSenderId: "95277623251"
};
firebase.initializeApp(config);

//cambio settings a firestore dopo errore
/*
@firebase/firestore: Firestore (5.5.9): 
The behavior for Date objects stored in Firestore is going to change
AND YOUR APP MAY BREAK.
*/
firebase.firestore().settings({timestampsInSnapshots : true});


//console
customElements.define('login-console', LoginConsole);
customElements.define('schermata-console', SchermataConsole);

//mappa
customElements.define("schermata-mappa", SchermataMappa);

//engine
customElements.define("schermata-crea-partita", SchermataCreaPartita);
customElements.define("schermata-engine", SchermataEngine);

//header e main menu
customElements.define('header-talentree', HeaderTalentree);
customElements.define('main-menu', MainMenu);

//imposto al menù principale
backToMainMenu();




