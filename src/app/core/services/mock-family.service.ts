import { Injectable, computed, inject } from '@angular/core';
import { FamilyPermission } from '../models';
import { FamilyMember, OpResult, addFamilyMember, listFamily, removeFamilyMember, setMemberPermission } from '../state/demo-engine';
import { DemoStateService } from './demo-state.service';
import { MockSessionService } from './mock-session.service';
@Injectable({ providedIn: 'root' })
export class MockFamilyService {
  private readonly demo = inject(DemoStateService);
  private readonly session = inject(MockSessionService);

  readonly members = computed(() => listFamily(this.demo.state()));
  readonly demoProfiles = computed(() => this.demo.state().profiles.filter((p) => p.role === 'family'));
  readonly assisted = computed(() => this.session.assistedProfile());

  add(input: { displayName: string; relation: string; permission: FamilyPermission; memberType?: 'family' | 'caregiver' }): OpResult<FamilyMember> {
    const result = addFamilyMember(this.demo.state(), input);
    if (result.ok && input.memberType) {
      const next = { ...result.state, profiles: result.state.profiles.map((p) => p.id === result.value.profile.id ? { ...p, memberType: input.memberType } : p) };
      this.demo.commit(next);
      return { ...result, state: next, value: { ...result.value, profile: next.profiles.find((p) => p.id === result.value.profile.id)! } };
    }
    return this.apply(result);
  }


  updateProfile(profileId: string, input: { displayName: string; relation: string; memberType?: 'family' | 'caregiver'; permission?: FamilyPermission }): OpResult<true> {
    const name = input.displayName.trim(); const relation = input.relation.trim();
    if (!name || !relation) return { ok: false, error: 'Informe nome e parentesco.' };
    const state = this.demo.state(); const profile = state.profiles.find((p) => p.id === profileId && p.role === 'family');
    if (!profile) return { ok: false, error: 'Perfil familiar não encontrado.' };
    if (state.profiles.some((p) => p.id !== profileId && p.displayName.toLowerCase() === name.toLowerCase())) return { ok: false, error: 'Já existe um perfil com esse nome.' };
    const next = { ...state, profiles: state.profiles.map((p) => p.id === profileId ? { ...p, displayName: name, relationLabel: relation, memberType: input.memberType, initials: name.trim().split(/\s+/).filter(Boolean).map((v) => v[0]).slice(0,2).join('').toUpperCase() } : p), relationships: state.relationships.map((r) => r.familyId === profileId ? { ...r, relation, permission: input.permission ?? r.permission } : r) };
    this.demo.commit(next); return { ok: true, state: next, value: true };
  }

  updateProfilePhoto(profileId: string, photoDataUrl: string | null): OpResult<true> {
    const state = this.demo.state();
    const profile = state.profiles.find((p) => p.id === profileId);
    if (!profile) return { ok: false, error: 'Perfil não encontrado.' };
    if (photoDataUrl && (!/^data:image\/(jpeg|png|webp);base64,/.test(photoDataUrl) || photoDataUrl.length > 1_500_000)) {
      return { ok: false, error: 'A imagem deve ser JPG, PNG ou WEBP e ter até aproximadamente 1 MB.' };
    }
    const next = { ...state, profiles: state.profiles.map((p) => {
      if (p.id !== profileId) return p;
      const updated = { ...p };
      if (photoDataUrl) updated.photoDataUrl = photoDataUrl;
      else delete updated.photoDataUrl;
      return updated;
    }) };
    this.demo.commit(next);
    return { ok: true, state: next, value: true };
  }

  remove(familyId: string): OpResult<true> {
    return this.apply(removeFamilyMember(this.demo.state(), familyId, this.session.familyProfile()?.id ?? null));
  }

  setPermission(familyId: string, permission: FamilyPermission): OpResult<true> {
    return this.apply(setMemberPermission(this.demo.state(), familyId, permission));
  }

  private apply<T>(result: OpResult<T>): OpResult<T> {
    if (result.ok) this.demo.commit(result.state);
    return result;
  }
}
