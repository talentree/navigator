import { NavElement, html } from '../nav-element';
import { referenceNaveDaControllare } from '../utils';

export class SchermataConsole extends NavElement {


  constructor() {
    super();
  }

  render() {
    return html`
      <h1 class="title is-4">Qui verrà mostrata la console per comandare la nave</h1>
      <p class="subtitle">La nave è in path navi/${referenceNaveDaControllare}</p>
    `;
  }
}
