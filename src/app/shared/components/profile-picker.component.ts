import { Component, inject, output } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronForward } from 'ionicons/icons';
import { PERMISSION_LABELS } from '../../core/models';
import { MockFamilyService } from '../../core/services/mock-family.service';
@Component({
  selector: 'app-profile-picker',
  standalone: true,
  imports: [IonIcon],
  styles: [
    `
      ul {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      button {
        display: flex;
        align-items: center;
        gap: 0.9rem;
        width: 100%;
        min-height: 4.5rem;
        padding: 0.7rem 1rem;
        text-align: left;
        font: inherit;
        color: var(--em-text);
        background: var(--em-surface);
        border: 2px solid var(--em-primary);
        border-radius: var(--em-radius);
        cursor: pointer;
      }
      .name {
        font-weight: 700;
        font-size: 1.1rem;
      }
      .meta {
        font-size: 0.9rem;
        color: var(--em-text-muted);
      }
      .text {
        flex: 1;
        display: flex;
        flex-direction: column;
      }
      ion-icon {
        font-size: 1.4rem;
        color: var(--em-primary);
      }
    `,
  ],
  template: `
    <ul>
      @for (m of family.members(); track m.profile.id) {
        <li>
          <button type="button" (click)="picked.emit(m.profile.id)">
            <span class="em-avatar" aria-hidden="true">{{ m.profile.initials }}</span>
            <span class="text">
              <span class="name">{{ m.profile.displayName }}</span>
              <span class="meta">{{ m.relationship.relation }} · {{ labels[m.relationship.permission] }}</span>
            </span>
            <ion-icon name="chevron-forward" aria-hidden="true"></ion-icon>
            <span class="em-visually-hidden">Entrar como {{ m.profile.displayName }}</span>
          </button>
        </li>
      }
    </ul>
  `,
})
export class ProfilePickerComponent {
  readonly family = inject(MockFamilyService);
  readonly labels = PERMISSION_LABELS;
  readonly picked = output<string>();

  constructor() {
    addIcons({ chevronForward });
  }
}
