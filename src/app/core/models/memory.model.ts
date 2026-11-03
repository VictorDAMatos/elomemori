export type MediaType = 'image' | 'video' | 'audio';
export type MediaSource = 'demo' | 'session';

export interface MockMedia {
  id: string;
  type: MediaType;
  name: string;
  source: MediaSource;
  assetPath?: string;
  alt?: string;
}

export interface MockMemory {
  id: string;
  assistedId: string;
  title: string;
  story: string;
  date?: string;
  people: string[];
  media: MockMedia[];
  createdBy: string;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface MemoryDraft {
  title: string;
  story: string;
  date?: string;
  people: string[];
  media: MockMedia[];
}

export const MEDIA_TYPE_LABELS: Record<MediaType, string> = {
  image: 'Foto',
  video: 'Vídeo',
  audio: 'Música ou áudio',
};
