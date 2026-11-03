import {
  describeRecurrence,
  formatPartialDate,
  formatTimeHuman,
  greetingFor,
  isDueOn,
  isValidPartialDate,
  isValidTime,
  minutesOf,
  toDayKey,
} from './dates';

describe('datas e horários', () => {
  it('valida datas parciais reais', () => {
    expect(isValidPartialDate('1985')).toBeTrue();
    expect(isValidPartialDate('1985-06')).toBeTrue();
    expect(isValidPartialDate('1985-06-30')).toBeTrue();
    expect(isValidPartialDate('1985-02-29')).toBeFalse();
    expect(isValidPartialDate('1985-00')).toBeFalse();
    expect(isValidPartialDate('85')).toBeFalse();
    expect(isValidPartialDate('')).toBeFalse();
  });

  it('escreve datas em português do dia a dia', () => {
    expect(formatPartialDate('2019-08-11')).toBe('11 de agosto de 2019');
    expect(formatPartialDate('1985-06')).toBe('junho de 1985');
    expect(formatPartialDate('2012')).toBe('2012');
    expect(formatPartialDate('xx')).toBe('');
    expect(formatPartialDate(undefined)).toBe('');
  });

  it('valida e escreve horários', () => {
    expect(isValidTime('08:00')).toBeTrue();
    expect(isValidTime('24:00')).toBeFalse();
    expect(isValidTime('8:00')).toBeFalse();
    expect(formatTimeHuman('08:00')).toBe('8h');
    expect(formatTimeHuman('15:30')).toBe('15h30');
    expect(minutesOf('10:30')).toBe(630);
    expect(Number.isNaN(minutesOf('abc'))).toBeTrue();
  });

  it('usa o fuso local ao gerar a chave do dia', () => {
    expect(toDayKey(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05');
  });

  it('saúda conforme o horário', () => {
    expect(greetingFor(new Date(2026, 9, 28, 8))).toBe('Bom dia');
    expect(greetingFor(new Date(2026, 9, 28, 14))).toBe('Boa tarde');
    expect(greetingFor(new Date(2026, 9, 28, 20))).toBe('Boa noite');
  });

  it('calcula recorrência', () => {
    expect(isDueOn({ type: 'daily' }, '2026-10-31')).toBeTrue();
    expect(isDueOn({ type: 'weekdays' }, '2026-10-28')).toBeTrue();
    expect(isDueOn({ type: 'weekdays' }, '2026-10-31')).toBeFalse();
    expect(isDueOn({ type: 'weekly', days: [3] }, '2026-10-28')).toBeTrue();
    expect(isDueOn({ type: 'weekly', days: [3] }, '2026-10-29')).toBeFalse();
    expect(isDueOn({ type: 'once', date: '2026-10-28' }, '2026-10-28')).toBeTrue();
    expect(isDueOn({ type: 'once', date: '2026-10-28' }, '2026-10-29')).toBeFalse();
  });

  it('descreve recorrência em frases curtas', () => {
    expect(describeRecurrence({ type: 'daily' })).toBe('Todos os dias');
    expect(describeRecurrence({ type: 'weekdays' })).toBe('De segunda a sexta');
    expect(describeRecurrence({ type: 'weekly', days: [3] })).toBe('Toda quarta-feira');
    expect(describeRecurrence({ type: 'weekly', days: [5, 1, 3] })).toBe('seg, qua e sex');
    expect(describeRecurrence({ type: 'once', date: '2026-11-05' })).toBe('Só em 5 de novembro de 2026');
  });
});
