import { Component, inject } from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { refreshCircleOutline } from 'ionicons/icons';
import { DemoStateService } from '../../core/services/demo-state.service';
@Component({
  selector: 'app-recovery-notice',
  standalone: true,
  imports: [IonButton, IonIcon],
  template: `
    @if (demo.recoveredFromInvalid()) {
      <div class="em-notice em-notice-warn" role="status">
        <ion-icon name="refresh-circle-outline" aria-hidden="true"></ion-icon>
        <div class="em-stack">
          <p>
            Os dados guardados neste aparelho estavam incompletos. Recuperamos os dados iniciais para que você possa continuar.
          </p>
          <ion-button class="em-btn" size="default" fill="outline" (click)="demo.dismissRecoveryNotice()">Entendi</ion-button>
        </div>
      </div>
    }
  `,
})
export class RecoveryNoticeComponent {
  readonly demo = inject(DemoStateService);

  constructor() {
    addIcons({ refreshCircleOutline });
  }
}
