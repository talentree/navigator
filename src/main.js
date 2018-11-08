import { LoginPlayer } from './login/login-player';
import { LoginAdmin } from './login/login-admin';
import { setGameContent } from './utils';

customElements.define('login-player', LoginPlayer);
customElements.define('login-admin', LoginAdmin);

setGameContent('login-player');




