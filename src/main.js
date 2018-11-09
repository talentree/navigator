import { LoginConsole } from './console/login-console';
import { SchermataConsole } from './console/schermata-console';
import { backToMainMenu } from './utils';
import { HeaderTalentree } from './header/header';

customElements.define('login-console', LoginConsole);
customElements.define('schermata-console', SchermataConsole);
customElements.define('header-talentree', HeaderTalentree);

//imposto al menù principale
backToMainMenu();




