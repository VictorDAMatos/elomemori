import { Component, inject } from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { refresh } from 'ionicons/icons';
import { DemoRestoreService } from '../../core/services/demo-restore.service';
@Component({
  selector: 'app-restore-demo',
  standalone: true,
  imports: [IonButton, IonIcon],
  template: `
    <ion-button class="em-btn" expand="block" fill="outline" color="medium" (click)="restore()">
      <ion-icon slot="start" name="refresh" aria-hidden="true"></ion-icon>
      Restaurar dados iniciais
    </ion-button>
  `,
})
export class RestoreDemoComponent {
  private readonly restoreService = inject(DemoRestoreService);

  constructor() {
    addIcons({ refresh });
  }

  restore(): void {
    void this.restoreService.restoreWithConfirmation();
  }
}
