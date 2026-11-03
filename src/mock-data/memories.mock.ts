import { MockMemory } from '../app/core/models/memory.model';

export function buildMockMemories(nowIso: string): MockMemory[] {
  const base = { assistedId: 'profile-ana', createdBy: 'profile-marta', archived: false, createdAt: nowIso, updatedAt: nowIso };
  return [
    {
      ...base,
      id: 'mem-almoco',
      title: 'Almoço de domingo na casa da Marta',
      story:
        'Todo domingo a família se reunia para o almoço. Tinha feijão no fogo, pão quentinho e muita conversa na mesa. ' +
        'Os netos sempre pediam um pedacinho a mais de sobremesa.',
      date: '2019-08-11',
      people: ['Marta', 'Pedro', 'Júlia'],
      media: [
        {
          id: 'media-almoco-img',
          type: 'image',
          name: 'Mesa posta do almoço',
          source: 'demo',
          assetPath: 'assets/demo-media/images/almoco-de-domingo.svg',
          alt: 'Ilustração de uma mesa posta com uma panela grande, tigelas, pães e um vaso de flores.',
        },
      ],
    },
    {
      ...base,
      id: 'mem-quintal',
      title: 'O quintal e as roseiras',
      story:
        'No quintal havia um banco de madeira à sombra e roseiras de várias cores. De manhã cedo, era hora de regar as flores ' +
        'e ouvir uma música tranquila enquanto o dia começava.',
      date: '2012',
      people: ['Marta'],
      media: [
        {
          id: 'media-quintal-img',
          type: 'image',
          name: 'Quintal com roseiras',
          source: 'demo',
          assetPath: 'assets/demo-media/images/quintal-e-roseiras.svg',
          alt: 'Ilustração de um quintal ensolarado com roseiras floridas, um banco de madeira e um varal.',
        },
      ],
    },
    {
      ...base,
      id: 'mem-festa',
      title: 'Festa junina no quintal',
      story:
        'Em junho, o quintal ficava enfeitado com bandeirinhas coloridas. Havia milho cozido, bolo e uma fogueirinha. ' +
        'No fim da tarde, todos dançavam uma valsa animada.',
      date: '1985-06',
      people: ['Marta', 'Roberto'],
      media: [
        {
          id: 'media-festa-img',
          type: 'image',
          name: 'Bandeirinhas e fogueira',
          source: 'demo',
          assetPath: 'assets/demo-media/images/festa-junina.svg',
          alt: 'Ilustração de uma festa junina ao entardecer, com bandeirinhas, fogueira, bolo e milho.',
        },
      ],
    },
    {
      ...base,
      id: 'mem-praia',
      title: 'Tarde na praia com os netos',
      story:
        'Numa tarde de verão, a família foi à praia. Os netos construíram um castelo de areia, ' +
        'e o fim do dia coloriu o céu de laranja e azul.',
      date: '2021-01',
      people: ['Pedro', 'Júlia'],
      media: [
        {
          id: 'media-praia-img',
          type: 'image',
          name: 'Guarda-sol e toalhas',
          source: 'demo',
          assetPath: 'assets/demo-media/images/tarde-na-praia.svg',
          alt: 'Ilustração de uma praia tranquila com guarda-sol listrado, toalhas, balde de areia e o mar ao fundo.',
        },
      ],
    },
  ];
}
