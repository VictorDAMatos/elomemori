/** Telefones são guardados só com dígitos (DDD + número, 10 ou 11 dígitos). Números de demonstração são fictícios. */
export function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, '');
  return /^\d{10,11}$/.test(digits) ? digits : null;
}

export function formatPhone(digits: string | undefined | null): string {
  if (!digits) return '';
  if (digits.length === 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  if (digits.length === 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return digits;
}
