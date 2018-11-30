import { LoginConsole } from './console/login-console';
import { SchermataConsole } from './console/schermata-console';
import { backToMainMenu, resetHeader } from './utils';
import { HeaderTalentree } from './header/header';
import { MainMenu } from './main-menu/main-menu';
import { SchermataMappa } from './mappa/mappa';
import { SchermataCreaPartita } from './engine/crea-partita';
import { SchermataEngine } from './engine/schermata-engine';
import { LoginRegistrazione } from './login-registrazione/login-registrazione';

export let tokenUtente = "";
export let mailUtente = "";

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
firebase.firestore().settings({ timestampsInSnapshots: true });

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

//schermata di login
customElements.define('login-register', LoginRegistrazione);

//imposto al menù principale
backToMainMenu();

//gestisco cambio di utente
firebase.auth().onAuthStateChanged(user => {
    //se l'utente è connesso (quindi ho fatto il login)
    if (user) {
        mailUtente = user.email;
        //chiedo il token
        user.getIdToken()
            .catch(err=>{console.log("Errore nel recuper del token utente", err)})
            .then(token => {
                //console.log("token cambiato", token);
                tokenUtente = token;
                //resetto header
                resetHeader();
                backToMainMenu();
            })
    }
    //se ho fatto il logout
    else {
        mailUtente = "";
        tokenUtente = "";
        //resetto header
        resetHeader();
        backToMainMenu();
    }


})