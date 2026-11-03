import { Component, computed, inject } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eyeOutline, personCircleOutline } from 'ionicons/icons';
import { PERMISSION_LABELS } from '../../core/models';
import { MockSessionService } from '../../core/services/mock-session.service';
@Component({
  selector: 'app-family-context',
  standalone: true,
  imports: [IonIcon],
  template: `
    @if (session.familyProfile(); as p) {
      <div class="em-notice">
        <ion-icon name="person-circle-outline" aria-hidden="true"></ion-icon>
        <div>
          <strong>{{ p.displayName }}</strong> ({{ p.relationLabel }}) · perfil familiar
          <br />
          <span class="em-muted">Permissão: {{ permissionLabel() }}</span>
        </div>
      </div>
      @if (!session.canEdit()) {
        <div class="em-notice em-notice-warn" role="status">
          <ion-icon name="eye-outline" aria-hidden="true"></ion-icon>
          <div>Este perfil só pode visualizar. Para criar ou editar, entre com um perfil que tenha a permissão “Visualizar e editar”.</div>
        </div>
      }
    }
  `,
})
export class FamilyContextComponent {
  readonly session = inject(MockSessionService);
  readonly permissionLabel = computed(() => {
    const p = this.session.permission();
    return p ? PERMISSION_LABELS[p] : '';
  });

  constructor() {
    addIcons({ eyeOutline, personCircleOutline });
  }
}
