import { Injectable, Signal, WritableSignal, signal } from '@angular/core';
import { buildSeedState } from '../../../mock-data/seed';
import { DemoState } from '../models';
import { SaveOutcome, clearSavedState, getBrowserStorage, loadState, saveState } from '../state/persistence';
@Injectable({ providedIn: 'root' })
export class DemoStateService {
  private readonly storage = getBrowserStorage();
  private readonly _state: WritableSignal<DemoState>;

  readonly state: Signal<DemoState>;
  readonly storageAvailable = this.storage !== null;
  readonly recoveredFromInvalid = signal(false);
  readonly lastSaveError = signal<string | null>(null);

  constructor() {
    const outcome = loadState(this.storage);
    this._state = signal(outcome.state);
    this.state = this._state.asReadonly();
    this.recoveredFromInvalid.set(outcome.recovered);
  }
  commit(next: DemoState): SaveOutcome {
    this._state.set(next);
    const outcome = saveState(this.storage, next);
    this.lastSaveError.set(outcome.ok ? null : (outcome.error ?? null));
    return outcome;
  }
  restore(): void {
    clearSavedState(this.storage);
    this._state.set(buildSeedState(new Date()));
    this.recoveredFromInvalid.set(false);
    this.lastSaveError.set(null);
  }

  dismissRecoveryNotice(): void {
    this.recoveredFromInvalid.set(false);
  }
}
