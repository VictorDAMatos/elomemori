import { Component, inject } from '@angular/core';
import { IonButton } from '@ionic/angular/standalone';
import { TextScale } from '../../core/models';
import { PreferencesService, TEXT_SCALE_LABELS } from '../../core/services/preferences.service';
import { SpeechService } from '../../core/services/speech.service';
@Component({
  selector: 'app-reading-settings',
  standalone: true,
  imports: [IonButton],
  template: `
    <section class="em-card em-stack" aria-labelledby="reading-title">
      <h2 id="reading-title">Ajustes de leitura</h2>

      <fieldset>
        <legend>Tamanho do texto</legend>
        @for (scale of scales; track scale) {
          <label class="em-choice">
            <input
              type="radio"
              name="textScale"
              [value]="scale"
              [checked]="prefs.textScale() === scale"
              (change)="setScale(scale)"
            />
            <span>{{ labels[scale] }}</span>
          </label>
        }
        <p class="em-hint">Este texto muda de tamanho conforme a sua escolha.</p>
      </fieldset>

      <fieldset>
        <legend>Aparência</legend>
        <label class="em-choice em-switch-choice" for="dark-mode-switch">
          <span class="em-switch-text">
            <strong id="dark-mode-title">Modo noturno</strong>
            <small id="dark-mode-desc">Ative uma aparência mais confortável para ambientes com pouca iluminação.</small>
          </span>
          <input
            id="dark-mode-switch"
            class="em-switch"
            type="checkbox"
            role="switch"
            aria-labelledby="dark-mode-title"
            aria-describedby="dark-mode-desc"
            [checked]="prefs.darkMode()"
            (change)="setDarkMode($any($event.target).checked)"
          />
        </label>
      </fieldset>

      <fieldset>
        <legend>Outras opções</legend>
        <label class="em-choice">
          <input type="checkbox" [checked]="prefs.highContrast()" (change)="setContrast($any($event.target).checked)" />
          <span>Alto contraste (cores mais fortes)</span>
        </label>
        @if (speech.supported) {
          <label class="em-choice em-switch-choice">
            <span>Mostrar o botão “Ouvir a história”</span>
            <input class="em-switch" type="checkbox" role="switch" [checked]="prefs.readAloud()" (change)="setReadAloud($any($event.target).checked)" />
          </label>
        } @else {
          <p class="em-hint">A leitura em voz alta não está disponível neste navegador ou aparelho.</p>
        }
      </fieldset>

      <ion-button class="em-btn" expand="block" fill="outline" color="medium" (click)="prefs.resetToDefaults()">
        Voltar aos ajustes padrão
      </ion-button>
    </section>
  `,
})
export class ReadingSettingsComponent {
  readonly prefs = inject(PreferencesService);
  readonly speech = inject(SpeechService);
  readonly scales: TextScale[] = ['normal', 'large', 'xlarge'];
  readonly labels = TEXT_SCALE_LABELS;

  setScale(scale: TextScale): void {
    this.prefs.update({ textScale: scale });
  }

  setContrast(on: boolean): void {
    this.prefs.update({ highContrast: on });
  }

  setDarkMode(on: boolean): void {
    this.prefs.update({ darkMode: on });
  }

  setReadAloud(on: boolean): void {
    this.prefs.update({ readAloud: on });
  }
}
