import { NavElement, html } from '../nav-element';

export class SchermataConsole extends NavElement {


  constructor() {
    super();
  }

  render() {
    return html`
      <h1 class="title is-4">Qui verrà mostrata la console per comandare la nave</h1>
    `;
  }
}
