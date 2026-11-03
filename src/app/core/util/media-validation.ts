import { MediaType } from '../models/memory.model';

export interface FileLike {
  name: string;
  type: string;
  size: number;
}

export interface MediaValidationResult {
  ok: boolean;
  mediaType?: MediaType;
  message?: string;
}

const MB = 1024 * 1024;

export const MAX_BYTES: Record<MediaType, number> = {
  image: 10 * MB,
  audio: 30 * MB,
  video: 50 * MB,
};

const ALLOWED: Record<MediaType, { mimes: string[]; extensions: string[]; label: string }> = {
  image: {
    mimes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
    extensions: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'],
    label: 'JPG, PNG, WEBP, GIF ou SVG',
  },
  audio: {
    mimes: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/ogg', 'audio/mp4', 'audio/aac', 'audio/webm'],
    extensions: ['mp3', 'wav', 'ogg', 'm4a', 'aac', 'weba'],
    label: 'MP3, WAV, OGG, M4A ou AAC',
  },
  video: {
    mimes: ['video/mp4', 'video/webm', 'video/ogg'],
    extensions: ['mp4', 'webm', 'ogv'],
    label: 'MP4, WEBM ou OGV',
  },
};
export const ACCEPT_ATTRIBUTE = [
  ...ALLOWED.image.mimes,
  ...ALLOWED.audio.mimes,
  ...ALLOWED.video.mimes,
  ...Object.values(ALLOWED).flatMap((a) => a.extensions.map((e) => `.${e}`)),
].join(',');

function extensionOf(name: string): string {
  const i = name.lastIndexOf('.');
  return i >= 0 ? name.slice(i + 1).toLowerCase() : '';
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} bytes`;
  if (bytes < MB) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / MB).toFixed(1).replace('.', ',')} MB`;
}
export function detectMediaType(file: FileLike): MediaType | null {
  const mime = (file.type || '').toLowerCase();
  const ext = extensionOf(file.name);
  for (const type of Object.keys(ALLOWED) as MediaType[]) {
    if (ALLOWED[type].mimes.includes(mime)) return type;
  }
  if (!mime) {
    for (const type of Object.keys(ALLOWED) as MediaType[]) {
      if (ALLOWED[type].extensions.includes(ext)) return type;
    }
  }
  return null;
}

export function validateMediaFile(file: FileLike): MediaValidationResult {
  const name = file.name || 'arquivo';
  const mediaType = detectMediaType(file);
  if (!mediaType) {
    return {
      ok: false,
      message:
        `Não foi possível usar "${name}", porque esse formato não é compatível. ` +
        `Escolha uma foto (${ALLOWED.image.label}), um vídeo (${ALLOWED.video.label}) ` +
        `ou um áudio (${ALLOWED.audio.label}).`,
    };
  }
  if (file.size <= 0) {
    return { ok: false, message: `O arquivo "${name}" está vazio. Escolha outro arquivo.` };
  }
  if (file.size > MAX_BYTES[mediaType]) {
    return {
      ok: false,
      message:
        `O arquivo "${name}" tem ${formatBytes(file.size)} e passa do limite de ` +
        `${formatBytes(MAX_BYTES[mediaType])} para este tipo. Escolha um arquivo menor.`,
    };
  }
  return { ok: true, mediaType };
}
export function displayNameFromFile(fileName: string): string {
  const base = fileName.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim();
  return base || 'Arquivo sem nome';
}
