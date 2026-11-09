import { MockFamilyRelationship, MockProfile } from './profile.model';
import { MockMemory } from './memory.model';
import { MockNotice, MockReminder, MockRoutineLog } from './routine.model';
export interface DemoState {
  version: number;
  profiles: MockProfile[];
  relationships: MockFamilyRelationship[];
  memories: MockMemory[];
  reminders: MockReminder[];
  logs: MockRoutineLog[];
  notices: MockNotice[];
}

export const DEMO_STATE_VERSION = 1;

export type TextScale = 'normal' | 'large' | 'xlarge';

export interface Preferences {
  textScale: TextScale;
  highContrast: boolean;
  readAloud: boolean;
  darkMode: boolean;
}

export const DEFAULT_PREFERENCES: Preferences = {
  textScale: 'large',
  highContrast: false,
  readAloud: true,
  darkMode: false,
};
export interface DemoSession {
  entered: boolean;
  familyProfileId: string | null;
}

export const DEFAULT_SESSION: DemoSession = { entered: false, familyProfileId: null };

export const ASSISTED_PROFILE_ID = 'profile-ana';
