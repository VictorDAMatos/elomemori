import { formatPhone, normalizePhone } from './phone';

describe('phone', () => {
  it('normaliza para dígitos e valida o tamanho', () => {
    expect(normalizePhone('(11) 90000-0001')).toBe('11900000001');
    expect(normalizePhone('1133334444')).toBe('1133334444');
    expect(normalizePhone('123')).toBeNull();
    expect(normalizePhone('')).toBeNull();
  });

  it('formata celular e fixo', () => {
    expect(formatPhone('11900000001')).toBe('(11) 90000-0001');
    expect(formatPhone('1133334444')).toBe('(11) 3333-4444');
    expect(formatPhone(undefined)).toBe('');
  });
});
