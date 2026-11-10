import { Component, OnDestroy, computed, input, output, signal } from '@angular/core';

/**
 * Botão que só dispara depois de ser mantido pressionado (toque, mouse ou teclado).
 * Serve para ações que não podem acontecer por engano. Soltar antes do tempo cancela.
 */
@Component({
  selector: 'app-hold-button',
  standalone: true,
  template: `
    <button
      type="button"
      class="hold-btn"
      [class.holding]="holding()"
      [attr.aria-describedby]="hintId()"
      (pointerdown)="start($event)"
      (pointerup)="cancel()"
      (pointerleave)="cancel()"
      (pointercancel)="cancel()"
      (contextmenu)="$event.preventDefault()"
      (keydown.space)="startKey($event)"
      (keydown.enter)="startKey($event)"
      (keyup.space)="cancel()"
      (keyup.enter)="cancel()"
      (blur)="cancel()"
    >
      <span class="hold-fill" [style.width.%]="percent()" aria-hidden="true"></span>
      <span class="hold-label">
        <ng-content />
        @if (holding()) { <span class="hold-count" aria-hidden="true">{{ remaining() }}</span> }
      </span>
    </button>
    <p class="hold-hint" [id]="hintId()">{{ hint() }}</p>
    <span class="hold-live" role="status" aria-live="polite">{{ holding() ? 'Continue segurando…' : '' }}</span>
  `,
  styles: [`
    :host { display: block; }
    .hold-btn { position: relative; overflow: hidden; width: 100%; min-height: var(--em-touch, 3.5rem); padding: .9rem 1rem; border: 2px solid var(--em-danger); border-radius: var(--em-radius, 1rem); background: var(--em-surface); color: var(--em-danger); font: inherit; font-weight: 700; font-size: 1.1rem; cursor: pointer; touch-action: none; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; }
    .hold-fill { position: absolute; inset: 0 auto 0 0; background: color-mix(in srgb, var(--em-danger) 28%, transparent); pointer-events: none; }
    .hold-label { position: relative; display: inline-flex; align-items: center; justify-content: center; gap: .5rem; }
    .hold-count { display: inline-grid; place-items: center; min-width: 1.8rem; height: 1.8rem; border-radius: 50%; background: var(--em-danger); color: var(--em-danger-contrast, #fff); font-size: 1rem; }
    .hold-hint { margin: .5rem 0 0; text-align: center; color: var(--em-text-muted); font-size: .95rem; }
    .hold-live { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
  `],
})
export class HoldButtonComponent implements OnDestroy {
  readonly durationMs = input(5000);
  readonly hint = input('Segure o botão para confirmar.');
  readonly hintId = input('hold-hint');
  readonly held = output<void>();

  readonly holding = signal(false);
  private readonly elapsed = signal(0);
  readonly percent = computed(() => Math.min(100, (this.elapsed() / this.durationMs()) * 100));
  readonly remaining = computed(() => Math.max(1, Math.ceil((this.durationMs() - this.elapsed()) / 1000)));
  private timer: ReturnType<typeof setInterval> | null = null;
  private startedAt = 0;

  start(event: Event): void {
    event.preventDefault();
    this.begin();
  }

  startKey(event: Event): void {
    event.preventDefault();
    if ((event as KeyboardEvent).repeat) return;
    this.begin();
  }

  cancel(): void {
    this.stop();
    this.elapsed.set(0);
  }

  ngOnDestroy(): void {
    this.stop();
  }

  private begin(): void {
    if (this.timer) return;
    this.holding.set(true);
    this.startedAt = Date.now();
    this.timer = setInterval(() => {
      const spent = Date.now() - this.startedAt;
      this.elapsed.set(spent);
      if (spent >= this.durationMs()) {
        this.cancel();
        this.held.emit();
      }
    }, 50);
  }

  private stop(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.holding.set(false);
  }
}
