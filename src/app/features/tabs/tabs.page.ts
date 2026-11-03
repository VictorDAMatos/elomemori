import { Component } from '@angular/core';
import { IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { calendarOutline, homeOutline, imagesOutline, personCircleOutline } from 'ionicons/icons';
@Component({
  selector: 'app-tabs-page',
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom" aria-label="Navegação principal">
        <ion-tab-button tab="inicio">
          <ion-icon name="home-outline" aria-hidden="true"></ion-icon>
          <ion-label>Início</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="memorias">
          <ion-icon name="images-outline" aria-hidden="true"></ion-icon>
          <ion-label>Memórias</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="rotina">
          <ion-icon name="calendar-outline" aria-hidden="true"></ion-icon>
          <ion-label>Rotina</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="perfil">
          <ion-icon name="person-circle-outline" aria-hidden="true"></ion-icon>
          <ion-label>Perfil</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
})
export class TabsPage {
  constructor() {
    addIcons({ calendarOutline, homeOutline, imagesOutline, personCircleOutline });
  }
}
