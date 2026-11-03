import { Component, input } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { albumsOutline, calendarOutline, peopleOutline, searchOutline } from 'ionicons/icons';
@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [IonIcon],
  styles: [
    `
      :host {
        display: block;
      }
      .empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 0.75rem;
        padding: 2rem 1rem;
        border: 2px dashed var(--em-border);
        border-radius: var(--em-radius);
        background: var(--em-surface);
      }
      ion-icon {
        font-size: 3rem;
        color: var(--em-primary);
      }
      .actions {
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
        width: 100%;
        max-width: 22rem;
        margin-top: 0.5rem;
      }
    `,
  ],
  template: `
    <div class="empty" role="status">
      <ion-icon [name]="icon()" aria-hidden="true"></ion-icon>
      <h2>{{ title() }}</h2>
      <p class="em-muted">{{ message() }}</p>
      <div class="actions"><ng-content></ng-content></div>
    </div>
  `,
})
export class EmptyStateComponent {
  readonly icon = input('albums-outline');
  readonly title = input.required<string>();
  readonly message = input.required<string>();

  constructor() {
    addIcons({ albumsOutline, calendarOutline, peopleOutline, searchOutline });
  }
}
