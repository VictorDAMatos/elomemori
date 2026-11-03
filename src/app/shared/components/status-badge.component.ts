import { Component, computed, input } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircle, helpBuoy, helpCircle, time } from 'ionicons/icons';
import { ReminderStatus, STATUS_LABELS } from '../../core/models';

export const STATUS_ICONS: Record<ReminderStatus, string> = {
  done: 'checkmark-circle',
  pending: 'time',
  help: 'help-buoy',
  forgot: 'help-circle',
};
@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [IonIcon],
  styles: [
    `
      .badge {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.3rem 0.8rem 0.3rem 0.6rem;
        border-radius: 999px;
        font-weight: 700;
        font-size: 0.95rem;
        border: var(--em-border-width) solid currentColor;
        white-space: nowrap;
      }
      ion-icon {
        font-size: 1.25em;
      }
      .done {
        color: var(--em-done-fg);
        background: var(--em-done-bg);
      }
      .pending {
        color: var(--em-pending-fg);
        background: var(--em-pending-bg);
      }
      .help {
        color: var(--em-help-fg);
        background: var(--em-help-bg);
      }
      .forgot {
        color: var(--em-forgot-fg);
        background: var(--em-forgot-bg);
      }
    `,
  ],
  template: `
    <span class="badge" [class]="status()">
      <ion-icon [name]="icon()" aria-hidden="true"></ion-icon>
      <span>{{ label() }}</span>
    </span>
  `,
})
export class StatusBadgeComponent {
  readonly status = input.required<ReminderStatus>();
  readonly label = computed(() => STATUS_LABELS[this.status()]);
  readonly icon = computed(() => STATUS_ICONS[this.status()]);

  constructor() {
    addIcons({ checkmarkCircle, time, helpBuoy, helpCircle });
  }
}
