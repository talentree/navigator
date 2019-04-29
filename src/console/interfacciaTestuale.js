import { NavElement, html } from '../nav-element';

export class InterfacciaTestuale extends NavElement {

    static get properties() {
        return {
            hide: { typpe: Boolean },
            nomeNave: { type: String },
            tempoDiGioco: { type: Number },
            vel: { type: Number },
            direzione: { type: Number },
            intVento: { type: Number },
            direzioneVento: { type: Number },
            motore: { type: Number },
            timone: { type: Number },
            radar: { type: Array },
            collisioneImminente: { type: Boolean },
            collisioneAvvenuta: { type: Boolean },
            ultimaPosRilevata: { type: Array },
        }
    }

    constructor() {
        super();
        this.hide = false;
        this.nomeNave = "nome nave";
        this.tempoDiGioco = 0;
        this.vel = 0;
        this.direzione = 0;
        this.intVento = 0;
        this.direzioneVento = 0;
        this.motore = 0;
        this.timone = 0;
        this.radar = [0, 0, 0, 0, 0, 0, 0, 0];
        this.collisioneImminente = false;
        this.collisioneAvvenuta = false;
        this.ultimaPosRilevata = [0, 0];
        //altro?

    }

    render() {
        let elementCollisione = html`
        <p class="has-text-success">Nessun ostacolo rilevato</p>`;

        if (this.collisioneImminente) {
            elementCollisione = html`<p class="has-text-danger has-text-weight-bold">Collisione imminente!</p>`;
        }

        let alertCollisione = html``;
        if (this.collisioneAvvenuta) {
            alertCollisione = html`<p class="has-text-danger has-text-weight-bold">Collisione Avvenuta!</p>`;
        }

        if (!this.hide) {
            return html`
            <h1 class="title is-4">${this.nomeNave}</h1>
            <p class="subtitle is-5">Time: ${this.tempoDiGioco} sec.</p>
            <br>
            <p>Velocità: ${this.vel} (udm??)</p>
            <p>Direzione: ${this.direzione} °</p>
            ${elementCollisione}
            <p>Vento: intensità: ${this.intVento} (udm), direzione: ${this.direzioneVento} °</p>
            <br>
            <p>Motore: ${this.motore}</p>
            <p>Timone: ${this.timone}</p>
            <br>
            <p>Rilevamento radar: TODO</p>
            ${this.collisioneAvvenuta ? alertCollisione : null}
            <br>
            <p>Ultima posizione rilavata: ${"(" + this.ultimaPosRilevata[0] + ", " + this.ultimaPosRilevata[1] + ")"}</p>
            <p>Qualcos'altro?</p>
        `}
        else {
            return html``;
        }
    }
}