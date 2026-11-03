import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronForward, image, musicalNotes, videocam } from 'ionicons/icons';
import { MEDIA_TYPE_LABELS, MediaType, MockMemory } from '../../core/models';
import { SessionMediaService } from '../../core/services/session-media.service';
import { MemoryDatePipe } from '../pipes/format.pipes';

const TYPE_ICONS: Record<MediaType, string> = { image: 'image', video: 'videocam', audio: 'musical-notes' };
@Component({
  selector: 'app-memory-card',
  standalone: true,
  imports: [RouterLink, IonIcon, MemoryDatePipe],
  styles: [
    `
      a {
        display: flex;
        flex-direction: column;
        color: inherit;
        text-decoration: none;
        background: var(--em-surface);
        border: var(--em-border-width) solid var(--em-card-border);
        border-radius: var(--em-radius);
        overflow: hidden;
        box-shadow: 0 1px 2px rgba(31, 41, 51, 0.08);
      }
      .thumb {
        position: relative;
        aspect-ratio: 16 / 9;
        background: #e7f3f4;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .thumb img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      .thumb ion-icon.placeholder {
        font-size: 3.5rem;
        color: var(--em-primary);
      }
      .body {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        padding: 0.9rem 1.1rem 1.1rem;
      }
      .title-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
      }
      .title-row ion-icon {
        flex: none;
        font-size: 1.4rem;
        color: var(--em-primary);
      }
      h2 {
        font-size: 1.25rem;
      }
      ul {
        list-style: none;
        margin: 0.2rem 0 0;
        padding: 0;
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;
      }
      li {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.15rem 0.65rem;
        border: var(--em-border-width) solid var(--em-card-border);
        border-radius: 999px;
        font-size: 0.9rem;
        font-weight: 600;
        background: #f4f8f8;
      }
    `,
  ],
  template: `
    <a [routerLink]="['/memoria', memory().id]">
      <div class="thumb">
        @if (thumbUrl(); as src) {
          <img [src]="src" alt="" loading="lazy" />
        } @else {
          <ion-icon class="placeholder" [name]="placeholderIcon()" aria-hidden="true"></ion-icon>
        }
      </div>
      <div class="body">
        <div class="title-row">
          <h2>{{ memory().title }}</h2>
          <ion-icon name="chevron-forward" aria-hidden="true"></ion-icon>
        </div>
        @if (memory().date) {
          <p class="em-muted">{{ memory().date | memoryDate }}</p>
        }
        @if (types().length) {
          <ul aria-label="Conteúdo desta lembrança">
            @for (t of types(); track t) {
              <li><ion-icon [name]="icons[t]" aria-hidden="true"></ion-icon> {{ labels[t] }}</li>
            }
          </ul>
        }
        <span class="em-visually-hidden">Abrir esta lembrança</span>
      </div>
    </a>
  `,
})
export class MemoryCardComponent {
  private readonly sessionMedia = inject(SessionMediaService);

  readonly memory = input.required<MockMemory>();
  readonly icons = TYPE_ICONS;
  readonly labels = MEDIA_TYPE_LABELS;
  readonly thumbUrl = computed(() => {
    const photo = this.memory().media.find((m) => m.type === 'image');
    return photo ? this.sessionMedia.urlFor(photo) : null;
  });
  readonly types = computed<MediaType[]>(() => {
    const present = new Set(this.memory().media.map((m) => m.type));
    return (['image', 'video', 'audio'] as MediaType[]).filter((t) => present.has(t));
  });
  readonly placeholderIcon = computed(() => {
    const t = this.types();
    return t.length ? TYPE_ICONS[t[0]] : 'image';
  });

  constructor() {
    addIcons({ chevronForward, image, musicalNotes, videocam });
  }
}
