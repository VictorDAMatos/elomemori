import { Component, input } from '@angular/core';
import { IonBackButton, IonButtons, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack } from 'ionicons/icons';
@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton],
  template: `
    <ion-header>
      <ion-toolbar>
        @if (backHref(); as href) {
          <ion-buttons slot="start">
            <ion-back-button [defaultHref]="href" text="Voltar" icon="arrow-back"></ion-back-button>
          </ion-buttons>
        }
        <ion-title>{{ title() }}</ion-title>
        <ng-content></ng-content>
      </ion-toolbar>
    </ion-header>
  `,
})
export class PageHeaderComponent {
  readonly title = input.required<string>();
  readonly backHref = input<string | null>(null);

  constructor() {
    addIcons({ arrowBack });
  }
}
