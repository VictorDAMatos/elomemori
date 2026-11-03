import { Injectable, computed, inject } from '@angular/core';
import { MemoryDraft, MockMemory } from '../models';
import {
  OpResult,
  createMemory,
  deleteMemory,
  getMemory,
  listMemories,
  setMemoryArchived,
  updateMemory,
} from '../state/demo-engine';
import { DemoStateService } from './demo-state.service';
import { MockSessionService } from './mock-session.service';
import { SessionMediaService } from './session-media.service';

export type MemoryOutcome = OpResult<MockMemory>;
@Injectable({ providedIn: 'root' })
export class MockMemoryService {
  private readonly demo = inject(DemoStateService);
  private readonly session = inject(MockSessionService);
  private readonly sessionMedia = inject(SessionMediaService);

  readonly memories = computed(() => listMemories(this.demo.state()));
  readonly archivedMemories = computed(() => listMemories(this.demo.state(), { archived: true }));
  get(id: string | null | undefined): MockMemory | undefined {
    return getMemory(this.demo.state(), id);
  }

  create(draft: MemoryDraft): MemoryOutcome {
    const createdBy = this.session.familyProfile()?.id ?? 'profile-marta';
    return this.apply(createMemory(this.demo.state(), draft, createdBy));
  }

  update(id: string, draft: MemoryDraft): MemoryOutcome {
    const previous = this.get(id);
    const result = this.apply(updateMemory(this.demo.state(), id, draft));
    if (result.ok && previous) this.releaseRemovedMedia(previous, draft);
    return result;
  }

  archive(id: string): MemoryOutcome {
    return this.apply(setMemoryArchived(this.demo.state(), id, true));
  }

  unarchive(id: string): MemoryOutcome {
    return this.apply(setMemoryArchived(this.demo.state(), id, false));
  }

  remove(id: string): MemoryOutcome {
    const result = this.apply(deleteMemory(this.demo.state(), id));
    if (result.ok) {
      this.sessionMedia.revokeMany(result.value.media.filter((m) => m.source === 'session').map((m) => m.id));
    }
    return result;
  }

  private apply(result: MemoryOutcome): MemoryOutcome {
    if (result.ok) this.demo.commit(result.state);
    return result;
  }
  private releaseRemovedMedia(previous: MockMemory, draft: MemoryDraft): void {
    const kept = new Set(draft.media.map((m) => m.id));
    this.sessionMedia.revokeMany(previous.media.filter((m) => m.source === 'session' && !kept.has(m.id)).map((m) => m.id));
  }
}
