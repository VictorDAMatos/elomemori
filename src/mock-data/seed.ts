import { DEMO_STATE_VERSION, DemoState } from '../app/core/models/state.model';
import { toDayKey, toLocalIso } from '../app/core/util/dates';
import { buildMockMemories } from './memories.mock';
import { MOCK_PROFILES, MOCK_RELATIONSHIPS } from './profiles.mock';
import { buildMockLogs, buildMockReminders } from './routine.mock';
export function buildSeedState(now: Date = new Date()): DemoState {
  const { logs, notices } = buildMockLogs(now);
  return {
    version: DEMO_STATE_VERSION,
    profiles: structuredCloneSafe(MOCK_PROFILES),
    relationships: structuredCloneSafe(MOCK_RELATIONSHIPS),
    memories: buildMockMemories(toLocalIso(now)),
    reminders: buildMockReminders(toDayKey(now)),
    logs,
    notices,
  };
}

function structuredCloneSafe<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
