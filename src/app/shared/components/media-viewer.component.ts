import { Component, computed, inject, input, signal } from '@angular/core';
import { IonButton, IonContent, IonIcon, IonModal } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close, expandOutline, imageOutline, musicalNotesOutline, videocamOutline, warningOutline } from 'ionicons/icons';
import { MEDIA_TYPE_LABELS, MockMedia } from '../../core/models';
import { SessionMediaService } from '../../core/services/session-media.service';
@Component({
  selector: 'app-media-viewer',
  standalone: true,
  imports: [IonModal, IonContent, IonButton, IonIcon],
  styles: [
    `
      :host {
        display: block;
      }
      figure {
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      figcaption {
        font-weight: 650;
      }
      .photo-button {
        position: relative;
        display: block;
        width: 100%;
        padding: 0;
        border: var(--em-border-width) solid var(--em-card-border);
        border-radius: var(--em-radius);
        overflow: hidden;
        background: var(--em-surface);
        cursor: zoom-in;
        min-height: var(--em-touch);
      }
      .photo-button img {
        display: block;
        width: 100%;
        height: auto;
        max-height: 70vh;
        object-fit: contain;
        background: #fff;
      }
      .zoom-hint {
        position: absolute;
        right: 0.6rem;
        bottom: 0.6rem;
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.4rem 0.8rem;
        border-radius: 999px;
        background: #1f2933;
        color: #fff;
        font-weight: 650;
        font-size: 0.95rem;
      }
      video,
      audio {
        width: 100%;
        border-radius: var(--em-radius-sm);
      }
      video {
        background: #000;
        max-height: 60vh;
      }
      audio {
        min-height: 3.5rem;
      }
      .unavailable {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-start;
        padding: 1rem;
        border: 2px dashed var(--em-pending-fg);
        border-radius: var(--em-radius);
        background: var(--em-pending-bg);
        color: var(--em-pending-fg);
      }
      .unavailable h3 {
        color: inherit;
        display: flex;
        gap: 0.5rem;
        align-items: center;
      }
      .zoom-wrap {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
        min-height: 100%;
        background: #fff;
      }
      .zoom-wrap img {
        width: 100%;
        height: auto;
        object-fit: contain;
      }
    `,
  ],
  template: `
    @if (unavailable()) {
      <div class="unavailable" role="status">
        <h3>
          <ion-icon name="warning-outline" aria-hidden="true"></ion-icon>
          {{ typeLabel() }} indisponível
        </h3>
        <p>
          “{{ media().name }}” não está disponível agora. Você pode continuar lendo a lembrança normalmente.
          @if (media().source === 'session') {
            Arquivos escolhidos neste aparelho precisam ser anexados de novo depois que a página é reaberta.
          }
        </p>
        <ng-content></ng-content>
      </div>
    } @else {
      @switch (media().type) {
        @case ('image') {
          <figure>
            <button type="button" class="photo-button" (click)="zoomed.set(true)" [attr.aria-label]="'Ampliar a foto: ' + media().name">
              <img [src]="url()!" [alt]="media().alt || media().name" (error)="markFailed()" />
              <span class="zoom-hint"><ion-icon name="expand-outline" aria-hidden="true"></ion-icon> Ampliar</span>
            </button>
            <figcaption>{{ media().name }}</figcaption>
          </figure>
          <ion-modal [isOpen]="zoomed()" (didDismiss)="zoomed.set(false)">
            <ng-template>
              <ion-content>
                <div class="zoom-wrap">
                  <ion-button class="em-btn" expand="block" (click)="zoomed.set(false)">
                    <ion-icon slot="start" name="close" aria-hidden="true"></ion-icon>
                    Fechar foto
                  </ion-button>
                  <img [src]="url()!" [alt]="media().alt || media().name" />
                  <p class="em-muted">{{ media().name }}</p>
                </div>
              </ion-content>
            </ng-template>
          </ion-modal>
        }
        @case ('video') {
          <figure>
            <figcaption>{{ media().name }}</figcaption>
            <video controls playsinline preload="metadata" [src]="url()!" (error)="markFailed()" [attr.aria-label]="'Vídeo: ' + media().name">
              Seu navegador não consegue reproduzir este vídeo.
            </video>
          </figure>
        }
        @case ('audio') {
          <figure>
            <figcaption>{{ media().name }}</figcaption>
            <audio controls preload="metadata" [src]="url()!" (error)="markFailed()" [attr.aria-label]="'Áudio: ' + media().name">
              Seu navegador não consegue reproduzir este áudio.
            </audio>
          </figure>
        }
      }
    }
  `,
})
export class MediaViewerComponent {
  private readonly sessionMedia = inject(SessionMediaService);

  readonly media = input.required<MockMedia>();

  readonly zoomed = signal(false);
  private readonly failedUrl = signal<string | null>(null);

  readonly url = computed(() => this.sessionMedia.urlFor(this.media()));
  readonly unavailable = computed(() => {
    const u = this.url();
    return !u || this.failedUrl() === u;
  });
  readonly typeLabel = computed(() => MEDIA_TYPE_LABELS[this.media().type]);

  constructor() {
    addIcons({ close, expandOutline, imageOutline, musicalNotesOutline, videocamOutline, warningOutline });
  }

  markFailed(): void {
    this.failedUrl.set(this.url());
  }
}
