import { Injectable, computed, inject, signal } from '@angular/core';
import { ASSISTED_PROFILE_ID, DemoSession, DEFAULT_SESSION, MockProfile } from '../models';
import { canEdit, canManageMembers, permissionOf, profileById } from '../state/demo-engine';
import { getBrowserStorage, loadSession, saveSession } from '../state/persistence';
import { DemoStateService } from './demo-state.service';
@Injectable({ providedIn: 'root' })
export class MockSessionService {
  private readonly demo = inject(DemoStateService);
  private readonly storage = getBrowserStorage();
  private readonly _session = signal<DemoSession>(loadSession(this.storage));

  readonly entered = computed(() => this._session().entered);
  readonly familyProfile = computed<MockProfile | null>(() => {
    const p = profileById(this.demo.state(), this._session().familyProfileId);
    return p && p.role === 'family' ? p : null;
  });

  readonly assistedProfile = computed(() => profileById(this.demo.state(), ASSISTED_PROFILE_ID) ?? this.demo.state().profiles.find((p) => p.role === 'assisted') ?? null);

  readonly permission = computed(() => permissionOf(this.demo.state(), this.familyProfile()?.id));
  readonly canEdit = computed(() => canEdit(this.permission()));
  readonly canManageMembers = computed(() => canManageMembers(this.permission()));
  enterAsAssisted(): void {
    this.set({ entered: true, familyProfileId: null });
  }
  enterAsFamily(profileId: string): boolean {
    const p = profileById(this.demo.state(), profileId);
    if (!p || p.role !== 'family') return false;
    this.set({ entered: true, familyProfileId: p.id });
    return true;
  }
  leaveFamilyArea(): void {
    this.set({ entered: true, familyProfileId: null });
  }
  exit(): void {
    this.set({ ...DEFAULT_SESSION });
  }

  private set(next: DemoSession): void {
    this._session.set(next);
    saveSession(this.storage, next);
  }
}
