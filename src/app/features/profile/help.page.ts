import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonContent } from '@ionic/angular/standalone';
import { DemoBannerComponent } from '../../shared/components/demo-banner.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';

interface HelpTopic {
  title: string;
  steps: string[];
}
@Component({
  selector: 'app-help-page',
  standalone: true,
  imports: [IonContent, IonButton, PageHeaderComponent, DemoBannerComponent],
  templateUrl: './help.page.html',
  styleUrl: './help.page.css',
})
export class HelpPage {
  private readonly router = inject(Router);

  readonly topics: HelpTopic[] = [
    {
      title: 'Como ver uma lembrança',
      steps: [
        'Na tela Início, toque em “Ver lembranças”.',
        'Toque no cartão da lembrança que você quer abrir.',
        'Para ver uma foto maior, toque em “Ampliar”. Para ouvir ou assistir, toque no botão de tocar.',
        'Para voltar, toque em “Voltar”, no alto da tela.',
      ],
    },
    {
      title: 'Como responder a uma atividade',
      steps: [
        'Abra a aba “Rotina” e toque na atividade.',
        'Toque em “Concluí” se você já fez, e confirme. Toque em “Preciso de ajuda” ou “Não me lembro” se for o caso.',
        'Se tocou sem querer, use “Mudar minha resposta”.',
        'Nenhuma mensagem é enviada para fora do aplicativo.',
      ],
    },
    {
      title: 'Como mudar o tamanho do texto',
      steps: [
        'Abra a aba “Perfil”.',
        'Em “Ajustes de leitura”, escolha Normal, Grande ou Muito grande.',
        'Se quiser, ligue o “Alto contraste”.',
      ],
    },
    {
      title: 'Como abrir a Área da Família',
      steps: [
        'Abra a aba “Perfil”.',
        'Toque no botão “Área da Família”.',
        'Escolha um perfil familiar. O acesso é simulado.',
        'Para sair, toque em “Sair da Área da Família”.',
      ],
    },
    {
      title: 'Como adicionar fotos, vídeos ou músicas (família)',
      steps: [
        'Na Área da Família, toque em “Nova lembrança” (ou em “Editar” numa lembrança existente).',
        'Em “Fotos, vídeos e músicas”, toque em “Escolher arquivos” ou use um dos exemplos incluídos.',
        'Confira a prévia. Para tirar um arquivo, toque em “Remover”.',
        'Toque em “Salvar lembrança”. O arquivo não é enviado a nenhum servidor: só fica neste aparelho enquanto a página estiver aberta.',
      ],
    },
    {
      title: 'Uma foto, vídeo ou música não abre. E agora?',
      steps: [
        'Você pode continuar lendo a história da lembrança normalmente e voltar quando quiser.',
        'Arquivos escolhidos neste aparelho precisam ser anexados de novo depois que a página é reaberta.',
        'Na Área da Família, abra “Editar” na lembrança e use “Selecionar o arquivo de novo”.',
      ],
    },
    {
      title: 'Voltar ao exemplo inicial',
      steps: [
        'Abra o Perfil e toque em “Restaurar dados iniciais”.',
        'Confirme. Lembranças, rotina e familiares voltam ao exemplo original.',
      ],
    },
  ];

  backToProfile(): void {
    void this.router.navigateByUrl('/tabs/perfil');
  }
}
