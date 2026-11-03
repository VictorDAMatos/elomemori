import { detectMediaType, displayNameFromFile, formatBytes, MAX_BYTES, validateMediaFile } from './media-validation';

describe('validação de arquivos de mídia', () => {
  it('aceita foto, áudio e vídeo compatíveis', () => {
    expect(validateMediaFile({ name: 'a.jpg', type: 'image/jpeg', size: 1000 }).mediaType).toBe('image');
    expect(validateMediaFile({ name: 'a.mp3', type: 'audio/mpeg', size: 1000 }).mediaType).toBe('audio');
    expect(validateMediaFile({ name: 'a.mp4', type: 'video/mp4', size: 1000 }).mediaType).toBe('video');
  });

  it('reconhece pela extensão quando o navegador não informa o tipo', () => {
    expect(detectMediaType({ name: 'musica.m4a', type: '', size: 10 })).toBe('audio');
    expect(detectMediaType({ name: 'filme.webm', type: '', size: 10 })).toBe('video');
  });

  it('recusa formato incompatível com mensagem que diz o que fazer', () => {
    const r = validateMediaFile({ name: 'relatorio.pdf', type: 'application/pdf', size: 1000 });
    expect(r.ok).toBeFalse();
    expect(r.message).toContain('Escolha');
    expect(r.message).toContain('relatorio.pdf');
  });

  it('recusa arquivo vazio e arquivo grande demais', () => {
    expect(validateMediaFile({ name: 'a.png', type: 'image/png', size: 0 }).ok).toBeFalse();
    const big = validateMediaFile({ name: 'a.png', type: 'image/png', size: MAX_BYTES.image + 1 });
    expect(big.ok).toBeFalse();
    expect(big.message).toContain('menor');
  });

  it('formata tamanhos e nomes de exibição', () => {
    expect(formatBytes(500)).toBe('500 bytes');
    expect(formatBytes(2048)).toBe('2 KB');
    expect(formatBytes(5 * 1024 * 1024)).toBe('5,0 MB');
    expect(displayNameFromFile('foto_praia-1.jpg')).toBe('foto praia 1');
    expect(displayNameFromFile('.jpg')).toBe('Arquivo sem nome');
  });
});
