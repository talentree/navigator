import { LoginConsole } from './console/login-console';
import { SchermataConsole } from './console/schermata-console';
import { backToMainMenu } from './utils';
import { HeaderTalentree } from './header/header';
import { MainMenu } from './main-menu/main-menu';
import { SchermataMappa } from './mappa/mappa';
import { SchermataCreaPartita } from './engine/crea-partita';
import { SchermataEngine } from './engine/schermata-engine';

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




