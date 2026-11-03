import { Injectable, computed, signal } from '@angular/core';
import { DEFAULT_PREFERENCES, Preferences, TextScale } from '../models';
import { getBrowserStorage, loadPreferences, savePreferences } from '../state/persistence';

export const TEXT_SCALE_VALUES: Record<TextScale, number> = {
  normal: 1,
  large: 1.2,
  xlarge: 1.4,
};

export const TEXT_SCALE_LABELS: Record<TextScale, string> = {
  normal: 'Normal',
  large: 'Grande',
  xlarge: 'Muito grande',
};
@Injectable({ providedIn: 'root' })
export class PreferencesService {
  private readonly storage = getBrowserStorage();
  private readonly _prefs = signal<Preferences>(loadPreferences(this.storage));

  readonly prefs = this._prefs.asReadonly();
  readonly textScale = computed(() => this._prefs().textScale);
  readonly highContrast = computed(() => this._prefs().highContrast);
  readonly readAloud = computed(() => this._prefs().readAloud);

  constructor() {
    this.apply(this._prefs());
  }

  update(partial: Partial<Preferences>): void {
    const next: Preferences = { ...this._prefs(), ...partial };
    this._prefs.set(next);
    savePreferences(this.storage, next);
    this.apply(next);
  }

  resetToDefaults(): void {
    this.update({ ...DEFAULT_PREFERENCES });
  }
  private apply(prefs: Preferences): void {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.style.setProperty('--em-font-scale', String(TEXT_SCALE_VALUES[prefs.textScale]));
    root.classList.toggle('em-high-contrast', prefs.highContrast);
  }
}
