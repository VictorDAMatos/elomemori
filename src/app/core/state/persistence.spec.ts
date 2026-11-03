import { buildSeedState } from '../../../mock-data/seed';
import { DEFAULT_PREFERENCES, DEMO_STATE_VERSION } from '../models';
import { createMemory } from './demo-engine';
import {
  KeyValueStorage,
  loadPreferences,
  loadSession,
  loadState,
  MAX_SERIALIZED_CHARS,
  sanitizeMedia,
  saveSession,
  saveState,
  savePreferences,
  serializeState,
  STORAGE_KEYS,
  validateState,
} from './persistence';

const NOW = new Date(2026, 9, 28, 10, 0, 0);

class MemoryStorage implements KeyValueStorage {
  readonly data = new Map<string, string>();
  getItem(key: string): string | null {
    return this.data.has(key) ? (this.data.get(key) as string) : null;
  }
  setItem(key: string, value: string): void {
    this.data.set(key, value);
  }
  removeItem(key: string): void {
    this.data.delete(key);
  }
}

class BrokenStorage implements KeyValueStorage {
  getItem(): string | null {
    throw new Error('bloqueado');
  }
  setItem(): void {
    throw new Error('cota excedida');
  }
  removeItem(): void {
    throw new Error('bloqueado');
  }
}

describe('persistência local do estado', () => {
  it('sem dados salvos, usa os dados de exemplo', () => {
    const out = loadState(new MemoryStorage(), NOW);
    expect(out.reason).toBe('missing');
    expect(out.recovered).toBeFalse();
    expect(out.state.memories.length).toBe(4);
  });

  it('sem localStorage disponível, usa os dados de exemplo', () => {
    expect(loadState(null, NOW).reason).toBe('unavailable');
    expect(loadState(new BrokenStorage(), NOW).reason).toBe('unavailable');
  });

  it('JSON corrompido ou versão incompatível voltam ao exemplo e avisam', () => {
    const storage = new MemoryStorage();
    storage.setItem(STORAGE_KEYS.state, '{não é json');
    const a = loadState(storage, NOW);
    expect(a.recovered).toBeTrue();
    expect(a.reason).toBe('invalid');

    storage.setItem(STORAGE_KEYS.state, JSON.stringify({ ...buildSeedState(NOW), version: DEMO_STATE_VERSION + 1 }));
    expect(loadState(storage, NOW).recovered).toBeTrue();

    storage.setItem(STORAGE_KEYS.state, JSON.stringify({ version: DEMO_STATE_VERSION, profiles: [], memories: [], reminders: [], relationships: [] }));
    expect(loadState(storage, NOW).recovered).toBeTrue();
  });

  it('salva e recarrega as alterações', () => {
    const storage = new MemoryStorage();
    const seed = buildSeedState(NOW);
    const created = createMemory(
      seed,
      { title: 'Nova lembrança', story: 'Uma história curta.', people: ['Marta'], media: [] },
      'profile-marta',
      NOW,
    );
    expect(created.ok).toBeTrue();
    if (!created.ok) return;
    expect(saveState(storage, created.state).ok).toBeTrue();
    const loaded = loadState(storage, NOW);
    expect(loaded.reason).toBe('loaded');
    expect(loaded.state.memories.length).toBe(5);
    expect(loaded.state.memories.some((m) => m.title === 'Nova lembrança')).toBeTrue();
  });

  it('falha de gravação devolve mensagem em vez de lançar erro', () => {
    const seed = buildSeedState(NOW);
    const a = saveState(new BrokenStorage(), seed);
    expect(a.ok).toBeFalse();
    expect(a.error).toBeDefined();
    expect(saveState(null, seed).ok).toBeFalse();
  });

  it('recusa gravar quantidade anormal de dados', () => {
    const seed = buildSeedState(NOW);
    const big = { ...seed, notices: [{ id: 'n', at: '2026-10-28T10:00:00', text: 'x'.repeat(MAX_SERIALIZED_CHARS) }] };
    const out = saveState(new MemoryStorage(), big);
    expect(out.ok).toBeFalse();
  });

  it('descarta itens inválidos sem derrubar o resto', () => {
    const seed = buildSeedState(NOW);
    const dirty = JSON.parse(JSON.stringify(seed));
    dirty.memories.push({ id: 5 }, null, 'texto');
    dirty.reminders.push({ id: 'x', title: 'sem horário' });
    const valid = validateState(dirty, NOW);
    expect(valid).not.toBeNull();
    expect(valid!.memories.length).toBe(4);
    expect(valid!.reminders.length).toBe(8);
  });
});

describe('mídia nunca é guardada como arquivo ou URL', () => {
  it('rejeita caminhos externos, data: e blob:', () => {
    const base = { id: 'm', type: 'image', name: 'x', source: 'demo' };
    expect(sanitizeMedia({ ...base, assetPath: 'https://exemplo.com/a.jpg' })).toBeNull();
    expect(sanitizeMedia({ ...base, assetPath: 'data:image/png;base64,AAAA' })).toBeNull();
    expect(sanitizeMedia({ ...base, assetPath: 'blob:http://localhost/abc' })).toBeNull();
    expect(sanitizeMedia({ ...base, assetPath: 'assets/demo-media/../../segredo.txt' })).toBeNull();
    expect(sanitizeMedia({ ...base, assetPath: 'assets/demo-media/images/praia.svg' })).not.toBeNull();
  });

  it('serializa mídia de sessão apenas com metadados', () => {
    const seed = buildSeedState(NOW);
    const withSession = {
      ...seed,
      memories: [
        {
          ...seed.memories[0],
          media: [{ id: 's1', type: 'video', name: 'Meu vídeo', source: 'session', url: 'blob:http://localhost/xyz', data: 'AAAA' } as never],
        },
      ],
    };
    const text = serializeState(withSession);
    expect(text).not.toContain('blob:');
    expect(text).not.toContain('AAAA');
    expect(text).toContain('Meu vídeo');
  });
});

describe('preferências e sessão', () => {
  it('usa padrões quando não há dados ou há dados inválidos', () => {
    expect(loadPreferences(new MemoryStorage())).toEqual(DEFAULT_PREFERENCES);
    const storage = new MemoryStorage();
    storage.setItem(STORAGE_KEYS.prefs, JSON.stringify({ textScale: 'gigante', highContrast: 'sim', readAloud: false }));
    const prefs = loadPreferences(storage);
    expect(prefs.textScale).toBe(DEFAULT_PREFERENCES.textScale);
    expect(prefs.highContrast).toBe(DEFAULT_PREFERENCES.highContrast);
    expect(prefs.readAloud).toBeFalse();
  });

  it('guarda e recarrega preferências', () => {
    const storage = new MemoryStorage();
    savePreferences(storage, { textScale: 'xlarge', highContrast: true, readAloud: false, darkMode: true });
    expect(loadPreferences(storage)).toEqual({ textScale: 'xlarge', highContrast: true, readAloud: false, darkMode: true });
  });

  it('guarda e recarrega a sessão simulada e tolera dados ruins', () => {
    const storage = new MemoryStorage();
    saveSession(storage, { entered: true, familyProfileId: 'profile-marta' });
    expect(loadSession(storage)).toEqual({ entered: true, familyProfileId: 'profile-marta' });
    storage.setItem(STORAGE_KEYS.session, '###');
    expect(loadSession(storage)).toEqual({ entered: false, familyProfileId: null });
    expect(loadSession(null)).toEqual({ entered: false, familyProfileId: null });
  });
});
