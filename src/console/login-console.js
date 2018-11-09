import { NavElement, html } from '../nav-element';
import { setGameContent } from '../utils';

export class LoginConsole extends NavElement {


  constructor() {
    super();
    this.game = 'GIOCO';
    this.player = 'SQUADRA';
  }

  login() {
    setGameContent('schermata-console');
  }

  render() {
    return html`
      <div class="field">
        <label class="label">Nome del gioco:</label>
        <div class="control">
          <input class="input" type="text" .value=${this.game} @input=${e => this.game = e.target.value}/>
        </div>
      </div>
      <div class="field">
        <label class="label">Nome della squadra:</label>
        <div class="control">
          <input class="input" type="text" .value=${this.player} @input=${e => this.player = e.target.value}/>
        </div>
      </div>
      <a class="button is-primary" @click=${(e) => this.login()}>Login</a>
    `;
  }
}
