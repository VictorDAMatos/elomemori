import { Component } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { informationCircle } from 'ionicons/icons';

/** Aviso discreto de que o aplicativo é uma demonstração com dados fictícios. */
@Component({
  selector: 'app-demo-banner',
  standalone: true,
  imports: [IonIcon],
  template: `
    <p class="em-muted em-small demo-banner" role="note">
      <ion-icon name="information-circle" aria-hidden="true"></ion-icon>
      Demonstração acadêmica: dados fictícios e ações simuladas, guardados só neste aparelho.
    </p>
  `,
  styles: [`.demo-banner { display: flex; gap: .4rem; align-items: flex-start; margin-top: 1rem; }`],
})
export class DemoBannerComponent {
  constructor() {
    addIcons({ informationCircle });
  }
}
