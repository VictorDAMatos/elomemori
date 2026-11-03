import { buildSeedState } from '../../../mock-data/seed';
import { DemoState, MemoryDraft, ReminderDraft } from '../models';
import {
  addFamilyMember,
  addSimulatedNotice,
  createMemory,
  createReminder,
  deleteMemory,
  deleteReminder,
  getMemory,
  listFamily,
  listMemories,
  nextReminder,
  OpResult,
  recentLogs,
  removeFamilyMember,
  respondToReminder,
  routineForDay,
  setMemoryArchived,
  setMemberPermission,
  summarizeDay,
  undoLastResponse,
  updateMemory,
  updateReminder,
  validateMemoryDraft,
  validateReminderDraft,
} from './demo-engine';
const NOW = new Date(2026, 9, 28, 10, 0, 0);
const TODAY = '2026-10-28';
const THURSDAY = '2026-10-29';

function unwrap<T>(result: OpResult<T>): { state: DemoState; value: T } {
  if (!result.ok) throw new Error(`Operação falhou: ${result.error}`);
  return { state: result.state, value: result.value };
}

const goodMemory: MemoryDraft = {
  title: 'Passeio na praça',
  story: 'Uma tarde calma, com sorvete e muita conversa.',
  date: '2018-03',
  people: ['Marta', ' Marta ', 'Pedro'],
  media: [],
};

const goodReminder: ReminderDraft = {
  title: 'Regar as plantas',
  instruction: 'Regar as plantinhas da varanda.',
  time: '17:00',
  recurrence: { type: 'daily' },
  kind: 'activity',
  active: true,
};

describe('dados iniciais fictícios', () => {
  it('traz memórias, rotina e familiares de exemplo', () => {
    const s = buildSeedState(NOW);
    expect(listMemories(s).length).toBe(4);
    expect(s.reminders.length).toBe(8);
    expect(listFamily(s).length).toBe(3);
  });

  it('nenhuma atividade de hoje começa concluída (nada é inferido)', () => {
    const s = buildSeedState(NOW);
    const items = routineForDay(s, TODAY);
    expect(items.length).toBeGreaterThan(0);
    expect(items.every((i) => i.status === 'pending')).toBeTrue();
    expect(summarizeDay(items).done).toBe(0);
  });

  it('inclui histórico de ontem para a Área da Família', () => {
    const s = buildSeedState(NOW);
    expect(recentLogs(s, 20).length).toBeGreaterThan(0);
    expect(s.logs.every((l) => l.day === '2026-10-27')).toBeTrue();
  });

  it('mídias de demonstração só apontam para assets locais', () => {
    const s = buildSeedState(NOW);
    const demo = s.memories.flatMap((m) => m.media).filter((m) => m.source === 'demo');
    expect(demo.length).toBeGreaterThan(0);
    expect(demo.every((m) => m.assetPath!.startsWith('assets/demo-media/'))).toBeTrue();
  });
});

describe('memórias', () => {
  it('exige título e história', () => {
    const errors = validateMemoryDraft({ ...goodMemory, title: '  ', story: '' }, NOW);
    expect(errors['title']).toBeDefined();
    expect(errors['story']).toBeDefined();
  });

  it('rejeita data inválida e data futura, mas aceita ano, mês/ano e dia completo', () => {
    expect(validateMemoryDraft({ ...goodMemory, date: '2018-13' }, NOW)['date']).toBeDefined();
    expect(validateMemoryDraft({ ...goodMemory, date: '2018-02-30' }, NOW)['date']).toBeDefined();
    expect(validateMemoryDraft({ ...goodMemory, date: '2027' }, NOW)['date']).toBeDefined();
    expect(validateMemoryDraft({ ...goodMemory, date: '2018' }, NOW)['date']).toBeUndefined();
    expect(validateMemoryDraft({ ...goodMemory, date: '2018-03' }, NOW)['date']).toBeUndefined();
    expect(validateMemoryDraft({ ...goodMemory, date: '2018-03-09' }, NOW)['date']).toBeUndefined();
    expect(validateMemoryDraft({ ...goodMemory, date: undefined }, NOW)['date']).toBeUndefined();
  });

  it('limita a quantidade de arquivos por lembrança', () => {
    const many = Array.from({ length: 9 }, (_, i) => ({
      id: `m${i}`,
      type: 'image' as const,
      name: `Foto ${i}`,
      source: 'session' as const,
    }));
    expect(validateMemoryDraft({ ...goodMemory, media: many }, NOW)['media']).toBeDefined();
  });

  it('cria, normaliza nomes repetidos e não altera o estado original', () => {
    const seed = buildSeedState(NOW);
    const { state, value } = unwrap(createMemory(seed, goodMemory, 'profile-marta', NOW));
    expect(listMemories(seed).length).toBe(4);
    expect(listMemories(state).length).toBe(5);
    expect(value.people).toEqual(['Marta', 'Pedro']);
    expect(value.archived).toBeFalse();
    expect(getMemory(state, value.id)?.title).toBe('Passeio na praça');
  });

  it('devolve os erros de campo quando o rascunho é inválido', () => {
    const result = createMemory(buildSeedState(NOW), { ...goodMemory, title: '' }, 'profile-marta', NOW);
    expect(result.ok).toBeFalse();
    if (!result.ok) expect(result.fieldErrors?.['title']).toBeDefined();
  });

  it('edita, arquiva (some da galeria) e restaura', () => {
    let s = unwrap(createMemory(buildSeedState(NOW), goodMemory, 'profile-marta', NOW)).state;
    const id = s.memories[s.memories.length - 1].id;
    s = unwrap(updateMemory(s, id, { ...goodMemory, title: 'Passeio na praça central' }, NOW)).state;
    expect(getMemory(s, id)?.title).toBe('Passeio na praça central');

    s = unwrap(setMemoryArchived(s, id, true, NOW)).state;
    expect(listMemories(s).some((m) => m.id === id)).toBeFalse();
    expect(listMemories(s, { archived: true }).some((m) => m.id === id)).toBeTrue();

    s = unwrap(setMemoryArchived(s, id, false, NOW)).state;
    expect(listMemories(s).some((m) => m.id === id)).toBeTrue();
  });

  it('exclui e avisa quando a lembrança já não existe', () => {
    const seed = buildSeedState(NOW);
    const { state } = unwrap(deleteMemory(seed, 'mem-praia'));
    expect(getMemory(state, 'mem-praia')).toBeUndefined();
    expect(deleteMemory(state, 'mem-praia').ok).toBeFalse();
    expect(updateMemory(state, 'mem-praia', goodMemory, NOW).ok).toBeFalse();
  });

  it('ordena da mais recente para a mais antiga', () => {
    const dates = listMemories(buildSeedState(NOW)).map((m) => m.date);
    expect(dates).toEqual(['2021-01', '2019-08-11', '2012', '1985-06']);
  });
});

describe('rotina e respostas', () => {
  it('mostra a atividade semanal só no dia certo (quarta)', () => {
    const s = buildSeedState(NOW);
    expect(routineForDay(s, TODAY).some((i) => i.reminder.id === 'rem-video-prima')).toBeTrue();
    expect(routineForDay(s, THURSDAY).some((i) => i.reminder.id === 'rem-video-prima')).toBeFalse();
  });

  it('lista as atividades em ordem cronológica', () => {
    const times = routineForDay(buildSeedState(NOW), TODAY).map((i) => i.reminder.time);
    expect(times).toEqual([...times].sort());
  });

  it('só vira "Concluída" após a resposta explícita e registra o histórico', () => {
    const seed = buildSeedState(NOW);
    const { state, value } = unwrap(respondToReminder(seed, 'rem-cafe', 'done', NOW));
    const item = routineForDay(state, TODAY).find((i) => i.reminder.id === 'rem-cafe');
    expect(item?.status).toBe('done');
    expect(value.source).toBe('assisted_confirmation');
    expect(recentLogs(state, 1)[0].reminderId).toBe('rem-cafe');
    expect(routineForDay(seed, TODAY).find((i) => i.reminder.id === 'rem-cafe')?.status).toBe('pending');
  });

  it('registra "Preciso de ajuda" e "Não me lembro" sem marcar como concluída', () => {
    let s = buildSeedState(NOW);
    s = unwrap(respondToReminder(s, 'rem-remedio-manha', 'help', NOW)).state;
    s = unwrap(respondToReminder(s, 'rem-almoco', 'forgot', NOW)).state;
    const sum = summarizeDay(routineForDay(s, TODAY));
    expect(sum.help).toBe(1);
    expect(sum.forgot).toBe(1);
    expect(sum.done).toBe(0);
  });

  it('o estado de ontem não vale para hoje (volta a pendente no dia seguinte)', () => {
    const s = unwrap(respondToReminder(buildSeedState(NOW), 'rem-cafe', 'done', NOW)).state;
    const tomorrow = routineForDay(s, THURSDAY).find((i) => i.reminder.id === 'rem-cafe');
    expect(tomorrow?.status).toBe('pending');
  });

  it('desfaz a última resposta de hoje', () => {
    let s = unwrap(respondToReminder(buildSeedState(NOW), 'rem-cafe', 'done', NOW)).state;
    const undone = unwrap(undoLastResponse(s, 'rem-cafe', NOW));
    s = undone.state;
    expect(undone.value).toBe('pending');
    expect(routineForDay(s, TODAY).find((i) => i.reminder.id === 'rem-cafe')?.status).toBe('pending');
    expect(undoLastResponse(s, 'rem-cafe', NOW).ok).toBeFalse();
  });

  it('desfazer volta ao estado anterior quando houve duas respostas', () => {
    let s = unwrap(respondToReminder(buildSeedState(NOW), 'rem-cafe', 'help', NOW)).state;
    s = unwrap(respondToReminder(s, 'rem-cafe', 'done', NOW)).state;
    const undone = unwrap(undoLastResponse(s, 'rem-cafe', NOW));
    expect(undone.value).toBe('help');
  });

  it('responder a uma atividade que sumiu devolve erro compreensível', () => {
    const r = respondToReminder(buildSeedState(NOW), 'rem-inexistente', 'done', NOW);
    expect(r.ok).toBeFalse();
  });

  it('próxima atividade: a primeira pendente a partir de agora', () => {
    const s = buildSeedState(NOW); // 10:00
    expect(nextReminder(s, NOW)?.reminder.id).toBe('rem-caminhada'); // 10:30
  });

  it('próxima atividade: sem nada à frente, mostra a primeira pendente do dia; sem pendências, nulo', () => {
    let s = buildSeedState(NOW);
    const late = new Date(2026, 9, 28, 22, 30);
    expect(nextReminder(s, late)?.reminder.id).toBe('rem-cafe');
    for (const i of routineForDay(s, TODAY)) {
      s = unwrap(respondToReminder(s, i.reminder.id, 'done', NOW)).state;
    }
    expect(nextReminder(s, NOW)).toBeNull();
  });

  it('"Avisar familiar" só registra um aviso de demonstração', () => {
    const { state, value } = unwrap(addSimulatedNotice(buildSeedState(NOW), 'rem-remedio-manha', NOW));
    expect(value.text).toContain('Nenhuma mensagem foi enviada');
    expect(state.notices.length).toBe(buildSeedState(NOW).notices.length + 1);
  });
});

describe('atividades e lembretes (cadastro pela família)', () => {
  it('valida horário, instrução e recorrência', () => {
    expect(validateReminderDraft({ ...goodReminder, time: '25:00' }, NOW)['time']).toBeDefined();
    expect(validateReminderDraft({ ...goodReminder, instruction: ' ' }, NOW)['instruction']).toBeDefined();
    expect(validateReminderDraft({ ...goodReminder, recurrence: { type: 'weekly', days: [] } }, NOW)['recurrence']).toBeDefined();
    expect(validateReminderDraft({ ...goodReminder, recurrence: { type: 'once', date: '2026-10-01' } }, NOW)['recurrence']).toBeDefined();
    expect(validateReminderDraft({ ...goodReminder, recurrence: { type: 'once', date: '2026-11-05' } }, NOW)['recurrence']).toBeUndefined();
    expect(Object.keys(validateReminderDraft(goodReminder, NOW)).length).toBe(0);
  });

  it('cria, edita e exclui mantendo o histórico', () => {
    let s = buildSeedState(NOW);
    const created = unwrap(createReminder(s, goodReminder, 'profile-marta', NOW));
    s = created.state;
    expect(routineForDay(s, TODAY).some((i) => i.reminder.id === created.value.id)).toBeTrue();

    s = unwrap(updateReminder(s, created.value.id, { ...goodReminder, time: '17:30' }, NOW)).state;
    expect(s.reminders.find((r) => r.id === created.value.id)?.time).toBe('17:30');

    s = unwrap(respondToReminder(s, created.value.id, 'done', NOW)).state;
    const logsBefore = s.logs.length;
    s = unwrap(deleteReminder(s, created.value.id)).state;
    expect(s.reminders.some((r) => r.id === created.value.id)).toBeFalse();
    expect(s.logs.length).toBe(logsBefore);
    expect(s.logs.some((l) => l.reminderTitle === 'Regar as plantas')).toBeTrue();
  });

  it('lembrete inativo não aparece na rotina do dia', () => {
    const s = buildSeedState(NOW);
    const r = s.reminders.find((x) => x.id === 'rem-cafe')!;
    const edited = unwrap(updateReminder(s, r.id, { ...r, active: false }, NOW)).state;
    expect(routineForDay(edited, TODAY).some((i) => i.reminder.id === 'rem-cafe')).toBeFalse();
  });
});

describe('familiares de demonstração', () => {
  it('adiciona um familiar fictício apenas na lista local', () => {
    const { state, value } = unwrap(addFamilyMember(buildSeedState(NOW), { displayName: 'Beatriz Lima', relation: 'Sobrinha', permission: 'view' }));
    expect(listFamily(state).length).toBe(4);
    expect(value.profile.initials).toBe('BL');
  });

  it('valida nome vazio, parentesco vazio e nome repetido', () => {
    const seed = buildSeedState(NOW);
    const r1 = addFamilyMember(seed, { displayName: '', relation: '', permission: 'view' });
    expect(r1.ok).toBeFalse();
    if (!r1.ok) {
      expect(r1.fieldErrors?.['displayName']).toBeDefined();
      expect(r1.fieldErrors?.['relation']).toBeDefined();
    }
    const r2 = addFamilyMember(seed, { displayName: 'pedro costa', relation: 'Primo', permission: 'view' });
    expect(r2.ok).toBeFalse();
  });

  it('remove familiar, mas nunca o próprio perfil nem o último gestor', () => {
    const seed = buildSeedState(NOW);
    expect(removeFamilyMember(seed, 'profile-julia', 'profile-marta').ok).toBeTrue();
    expect(removeFamilyMember(seed, 'profile-marta', 'profile-marta').ok).toBeFalse();
    expect(removeFamilyMember(seed, 'profile-marta', 'profile-pedro').ok).toBeFalse();
  });

  it('altera permissão, mas mantém ao menos um gestor', () => {
    const seed = buildSeedState(NOW);
    expect(setMemberPermission(seed, 'profile-julia', 'edit').ok).toBeTrue();
    expect(setMemberPermission(seed, 'profile-marta', 'view').ok).toBeFalse();
    const promoted = unwrap(setMemberPermission(seed, 'profile-pedro', 'manage')).state;
    expect(setMemberPermission(promoted, 'profile-marta', 'view').ok).toBeTrue();
  });
});
