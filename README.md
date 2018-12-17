# Navigator by Talentree

Per avviare sviluppo e servire l'applicazione digitare: `npm start`

# Configurazione
Il progetto utilizza alcune librerie a supporto dello sviluppo. 

* [Rollup](https://rollupjs.org): per la creazione del bundle da pubblicare
* [lit-element](https://github.com/Polymer/lit-element): una semplicissima libreria per creare [Custom Element](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) e renderizzarli con [lit-html](https://polymer.github.io/lit-html/guide)
* [Bulma](https://bulma.io/): CSS puro progettato mobile first

Nota installare [lite-server](https://github.com/johnpapa/lite-server) globalmente: `npm install -g lite-server`


cose da fare
- sono un player e inserisco nome gioco e squadra -> console di gioco
- sono un admin e inserisco user e password -> creazione gioco, squadre -> start/stop
- sono un admin e inserisco user e password -> mappa

# Comandi utili
* Per aprire il terminale utilizzare i tasti Ctrl + ò oppure click su Visualizza -> Terminale
* Per lanciare il compilatore usare `npm start` IL PATH DEVE ESSERE SULLA CARTELLA navigator più "inferiore" (quella che comprende questo readme per capirci)
* Nelle prime fasi del progetto è consigliato utilizzare `npm update` per aggiornare i moduli di node che potrebbero essere stati aggiunti

# How it works - Lit-Element
Lit-element è la libreria principale del progetto. Permette di creare dei tag HTML personalizzati. Un esempio si trova in `index.html`:
```html
<header-talentree></header-talentree>
```
Il browser, quando troverà un tag "personalizzato", lo sostituirà con il relativo html, che si trova all'interno del metodo `render()` di ogni schermata.  
Per poter associare un tag "custom" al relativo codice html, è necessario effettuare la sua dichiarazione nel main.js:
```javascript
customElements.define('header-talentree', HeaderTalentree);
```
In questa riga si associa il tag `<header-talentree>` con la relativa classe, `HeaderTalentree`.  
All'interno di questa classe troviamo due soli metodi:
* *constructor()* Il costruttore di ogni classe. Al suo interno si dichiarano le variabili (nel caso si voglia usare la variabile in tutta la classe, dichiararla come `this.nomeVariabile = valore`) e le funzioni (analogamente, per utilizzare la funzione in tutta la classe: `this.nomeFunzione = function(){}`)
* *render()* metodo che viene chiamato quando il browser trova un tag "custom" da sostituire. Al suo interno si possono eseguire controlli come in ogni metodo (vedi `header.js`), deve però concludersi nel seguente modo:
```javascript
return html`
<!--html da sostituire al tag-->`
```
Il browser, infatti, si aspetta di ricevere da questo metodo del codice html da sostituire al posto del custom tag. La scritta html dopo a render è una funzione (anche se non sembra) delle stringhe. Tale funzione trasforma una semplice stringa (compresa tra le virgolette) in codice html.

# How it works - Rollup e lite-server
Rollup è il plugin che unisce tutto il codice javascript sche trova in src in un unico file, ovvero `bundle.js` nella cartella dist. Aprendo il file bundle.js, è infatti possibile trovare tutto il code javascript scritto da noi. Esso però non è ancora visibile sul browser. E' necessario infatti lanciare lite-server.  
Lite-server, quando avviato, crea un server all'indirizzo di default `localhost:3000`. Il browser aprirà il file `index.html`, trovando il collegamento a bundle.js (è collegato da un tag script) e avviando la nostra applicazione.  
  
Sia il compilatore (rollup) che lite-server devono essere avviati tramite prompt dei comandi. Attraverso il comando `npm start` si lancia prima rollup e poi lite-server.  
Rollup, inoltre, aggiornerà automaticamente il bundle.js ad ogni nostra modifica, e ugualmente lite-server aggiornerà la pagina web ad ogni cambiamento del bundle.js o di index.html

# How it works - Bulma
Bulma è una libreria per gestire la grafica dell'applicazione senza dover scrivere righe di CSS. Funziona attraverso le classi degli elementi HTML. La documentazione si trova qui [Bulma](https://bulma.io/)

# Cose da sapere
* Può capitare che le modifiche che apportate al codice non vengano visualizzate sul browser senza la comparsa di un errore nella console del browser.
Questo è probabilmente causato da un errore nel codice che blocca il compilatore. L'errore compare nel prompt dei comandi dove avete lanciato npm start. Correggere l'errore e rilanciare `npm start`

# Cominciare con le modifiche
* Per prima cosa effettuare il pull delle modifiche (per aggiornare il codice).
* Si apre una feature su gitkraken. A sinistra GitFlow -> Start feature
* Effettuare le varie modifiche poi da visual studio code effettuare il "commit": a sinistra Controllo del codice sorgente -> scrivere un messaggio di info -> cliccare sulla spunta
* Una volta che avete terminato le modifiche (in uno o più commit, è arbitrario), chiudere la feature nello stesso modo con cui l'abbiamo aperta
* Effettuare il push delle modifiche

# How it works - Login utente
* Il file `main.js` ha una funzione che esegue quando cambia lo stato di autenticazione, ovvero quando l'utente completa il login o il logout. Questa funzione modifica la variabile tokenUtente.  
Essa contiene l'uid dell'utente. L'uid è un codice che identifica in modo univoco un utente e viene utilizzato in varie occasioni:  
1- conoscere se l'utente ha effettuato o meno il login (in caso non sia loggato tokenUtente vale "", stringa vuota)  
2- ogni partita nel database è identificata dall'uid dell'utente che l'ha creata  
3- la schermata della mappa mostra la partita creata dall'utente attraverso l'uid  
* l'uid dell'utente e la sua mail sono accessibili importandoli dal main:
```javascript
import { tokenUtente } from '../main.js'
// mostro l'uid
console.log("l'uid è ", tokenUtente);
```

# How it works - Accesso alla console
Vedi `login-console.js` per riferimenti al codice  
I due input si riferiscono al nome della partita a cui voglio connettermi e al nome della squadra di cui voglio controllare la nave.  
Gli input aggiornano ad ogni digitazione le variabili contenenti le due credenziali tramite l'evento
```javascript
@input=${e => /*codice da eseguire*/}
```
Analogamente, la funzione del login viene chiamata quando si clicca il pulsante:
```javascript
@click=${(e) => this.login(e)}
```
La funzione controlla se esiste la partita specificata e se esiste una squadra con il nome inserito.
Ottiene quindi la referenza (il percorso o path) per poter accedere ai dati della nave sul database.  
Il documento della nave è infatti separato da quello della partita per i seguenti motivi:  
1- Chi controlla una nave non deve poter modificare i dati generali della partita o i dati delle altre navi  
2- Le query ("ricerche" o "interrogazioni") su degli array (per tutte le navi di una partita) in Firebase sono molto complesse da implementare  
3- Non è possibile modificare un elemento di un array (quindi i dati di una certa nave) su Firestore senza modificare tutto l'array. Ciò significherebbe dover riscrivere i dati delle altre navi e non rispettare il punto 1  
  
Una volta che è stata trovata la nave corretta, si segna la referenza nella variabile `referenceNaveDaControllare` in `utils.js`. Per modificare questa variabile bisogna utilizzare il metodo `setReferenceNaveDaControllare()` per non dare errore al compilatore. La schermata della console utilizzerà questa variabile per accedere ai dati della nave.

# How it works - Header
Vedi `header.js` per riferimenti al codice  
La schermata dell'header è abbastanza complessa. Si utilizza una variabile, `infoScheda`, Per mostrare all'utente in quale punto si trovi dell'applicazione. Questa variabile viene modificata da utils.js al momento del cambio di schermata. Per rendere visibili le modifiche, è però necessario riaggiornare l'header attraverso il metodo `resetHeader()` in utils.js  
  
La stessa procedura si applica quando l'utente cambia il suo stato di login: all'interno della funzione `onAuthStateChanged()` del main.js si chiama il metodo per tornare al menù principale. Questo a sua volta chiamerà resetHeader. All'interno del metodo `render()` si controlla se l'utente è connesso. A seconda che l'utente abbia effettuato l'accesso o meno, la variabile `displayAutenticazione` mostrerà il tasto per disconnettere l'utente o per effettuare l'accesso.