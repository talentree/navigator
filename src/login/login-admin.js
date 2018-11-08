import { NavElement, html } from '../nav-element';

export class LoginAdmin extends NavElement {


  constructor() {
    super();
  }

  render() {
    return html`
      <h1>Sono passato al secondo elemento</h1>
    `;
  }
}
