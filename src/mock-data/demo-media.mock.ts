import { MediaType } from '../app/core/models/memory.model';

export interface DemoMediaItem {
  key: string;
  type: MediaType;
  name: string;
  assetPath: string;
  alt?: string;
}

export const DEMO_MEDIA_LIBRARY: DemoMediaItem[] = [
  {
    key: 'img-almoco',
    type: 'image',
    name: 'Mesa posta do almoço',
    assetPath: 'assets/demo-media/images/almoco-de-domingo.svg',
    alt: 'Ilustração de uma mesa posta com uma panela grande, tigelas, pães e um vaso de flores.',
  },
  {
    key: 'img-quintal',
    type: 'image',
    name: 'Quintal com roseiras',
    assetPath: 'assets/demo-media/images/quintal-e-roseiras.svg',
    alt: 'Ilustração de um quintal ensolarado com roseiras floridas, um banco de madeira e um varal.',
  },
  {
    key: 'img-festa',
    type: 'image',
    name: 'Bandeirinhas e fogueira',
    assetPath: 'assets/demo-media/images/festa-junina.svg',
    alt: 'Ilustração de uma festa junina ao entardecer, com bandeirinhas, fogueira, bolo e milho.',
  },
  {
    key: 'img-praia',
    type: 'image',
    name: 'Guarda-sol e toalhas',
    assetPath: 'assets/demo-media/images/tarde-na-praia.svg',
    alt: 'Ilustração de uma praia tranquila com guarda-sol listrado, toalhas, balde de areia e o mar ao fundo.',
  },

];
