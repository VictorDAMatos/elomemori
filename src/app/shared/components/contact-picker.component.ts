import { AfterViewInit, Component, ElementRef, HostListener, input, output, viewChild } from '@angular/core';
import { MockProfile } from '../../core/models';
import { formatPhone } from '../../core/util/phone';

/** Pop-up com os perfis que podem ser chamados. Toque numa pessoa para escolher. */
@Component({
  selector: 'app-contact-picker',
  standalone: true,
  template: `
    <div class="picker-backdrop" role="presentation" (click)="closed.emit()">
      <section class="picker-dialog" role="dialog" aria-modal="true" aria-labelledby="picker-title" (click)="$event.stopPropagation()">
        <h2 id="picker-title">Quem você quer chamar?</h2>
        <p class="picker-lead">Toque no nome de uma pessoa. Nada será ligado ainda.</p>
        <ul class="picker-list">
          @for (c of contacts(); track c.id; let first = $first) {
            <li>
              <button type="button" class="picker-option" #firstOption (click)="picked.emit(c.id)">
                <span class="picker-avatar" aria-hidden="true">@if (c.photoDataUrl) { <img [src]="c.photoDataUrl" alt="" /> } @else { {{ c.initials }} }</span>
                <span class="picker-text">
                  <strong>{{ c.displayName }}</strong>
                  <small>{{ c.relationLabel }}</small>
                  <small>{{ c.phone ? formatPhone(c.phone) : 'Sem telefone cadastrado' }}</small>
                </span>
              </button>
            </li>
          }
        </ul>
        <button type="button" class="picker-cancel" (click)="closed.emit()">Cancelar</button>
      </section>
    </div>
  `,
  styles: [`
    .picker-backdrop { position: fixed; inset: 0; z-index: 11000; display: grid; place-items: center; padding: 1rem; background: var(--em-overlay); animation: em-fade-in .2s ease-out; }
    .picker-dialog { width: min(100%, 28rem); max-height: 90vh; overflow: auto; display: flex; flex-direction: column; gap: .75rem; padding: 1.25rem; border: 2px solid var(--em-card-border); border-radius: 1.5rem; background: var(--em-surface); color: var(--em-text); animation: em-pop-in .25s cubic-bezier(.2,.8,.2,1); }
    h2 { margin: 0; font-size: 1.4rem; }
    .picker-lead { margin: 0; color: var(--em-text-muted); }
    .picker-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: .6rem; }
    .picker-option { display: flex; align-items: center; gap: .9rem; width: 100%; min-height: 4.5rem; padding: .7rem .9rem; border: 2px solid var(--em-card-border); border-radius: 1rem; background: var(--em-surface-soft); color: inherit; font: inherit; text-align: left; cursor: pointer; transition: transform .12s ease, border-color .15s ease, background .15s ease; }
    .picker-option:hover { border-color: var(--em-primary); }
    .picker-option:active { transform: scale(.98); }
    .picker-avatar { display: grid; place-items: center; flex: none; width: 3.4rem; height: 3.4rem; border-radius: 50%; overflow: hidden; background: var(--em-primary); color: var(--em-primary-contrast); font-weight: 700; }
    .picker-avatar img { width: 100%; height: 100%; object-fit: cover; }
    .picker-text { display: flex; flex-direction: column; min-width: 0; }
    .picker-text strong { font-size: 1.15rem; }
    .picker-text small { color: var(--em-text-muted); font-size: .95rem; }
    .picker-cancel { min-height: var(--em-touch, 3.5rem); border: 2px solid var(--em-border); border-radius: 1rem; background: transparent; color: var(--em-text); font: inherit; font-weight: 650; cursor: pointer; }
  `],
})
export class ContactPickerComponent implements AfterViewInit {
  readonly contacts = input.required<MockProfile[]>();
  readonly picked = output<string>();
  readonly closed = output<void>();
  readonly formatPhone = formatPhone;
  private readonly host = viewChild<ElementRef<HTMLElement>>('firstOption');

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closed.emit();
  }

  ngAfterViewInit(): void {
    this.host()?.nativeElement.focus();
  }
}
