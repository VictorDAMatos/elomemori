import { Injectable, OnDestroy, signal } from '@angular/core';
import { MockMedia } from '../models';
import { newId } from '../state/demo-engine';
import { displayNameFromFile, validateMediaFile } from '../util/media-validation';

export type RegisterResult =
  | { ok: true; media: MockMedia }
  | { ok: false; message: string };
@Injectable({ providedIn: 'root' })
export class SessionMediaService implements OnDestroy {
  private readonly urls = signal<Record<string, string>>({});
  register(file: File): RegisterResult {
    const check = validateMediaFile(file);
    if (!check.ok || !check.mediaType) {
      return { ok: false, message: check.message ?? 'Não foi possível usar esse arquivo.' };
    }
    const id = newId('media');
    this.setUrl(id, URL.createObjectURL(file));
    return {
      ok: true,
      media: { id, type: check.mediaType, name: displayNameFromFile(file.name), source: 'session' },
    };
  }
  reattach(media: MockMedia, file: File): RegisterResult {
    const check = validateMediaFile(file);
    if (!check.ok || !check.mediaType) {
      return { ok: false, message: check.message ?? 'Não foi possível usar esse arquivo.' };
    }
    if (check.mediaType !== media.type) {
      return { ok: false, message: 'Esse arquivo é de outro tipo. Escolha um arquivo do mesmo tipo que o original.' };
    }
    this.revoke(media.id);
    this.setUrl(media.id, URL.createObjectURL(file));
    return { ok: true, media };
  }
  urlFor(media: MockMedia): string | null {
    if (media.source === 'demo') return media.assetPath ?? null;
    return this.urls()[media.id] ?? null;
  }

  has(id: string): boolean {
    return id in this.urls();
  }

  revoke(id: string): void {
    const current = this.urls();
    const url = current[id];
    if (!url) return;
    URL.revokeObjectURL(url);
    const { [id]: _removed, ...rest } = current;
    this.urls.set(rest);
  }

  revokeMany(ids: string[]): void {
    ids.forEach((id) => this.revoke(id));
  }

  revokeAll(): void {
    for (const url of Object.values(this.urls())) URL.revokeObjectURL(url);
    this.urls.set({});
  }

  ngOnDestroy(): void {
    this.revokeAll();
  }

  private setUrl(id: string, url: string): void {
    this.urls.update((u) => ({ ...u, [id]: url }));
  }
}
