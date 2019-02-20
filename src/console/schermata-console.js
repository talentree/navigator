import { NavElement, html } from '../nav-element';
import { referenceNaveDaControllare, idPartita } from '../utils';
import { arraySquadrePartita } from '../utils';


export class SchermataConsole extends NavElement {


  constructor() {
    super();
  }

  render() {
    firebase.firestore().collection("partite").doc(idPartita).update({squadre: arraySquadrePartita})
    return html`
      <h1 class="title is-4">Qui verrà mostrata la console per comandare la nave</h1>
      <p class="subtitle">La nave è in path navi/${referenceNaveDaControllare}</p>
      
    `;
  }
}
