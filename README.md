# EloMemori

Aplicativo mobile de apoio à memória autobiográfica, à rotina e à conexão familiar para pessoas com Alzheimer em estágio inicial. O projeto utiliza dados fictícios e interações locais para representar os principais fluxos de um produto real.

> **Importante:** o acesso, os cadastros, os pedidos de ajuda e as notificações são simulados. Não existe backend, autenticação de produção, sincronização ou envio de mensagens. O aplicativo não faz diagnóstico e não substitui cuidadores ou profissionais de saúde.

## Referências

- [Figma EloMemori](https://www.figma.com/design/lmUu977kXSwUZjCRt3XRy3/EloMemori?node-id=0-1&t=Zsf1BndzSQOKf0Uu-0)
- Pitch do projeto
- Task Flow

## Tecnologias

- HTML
- CSS
- TypeScript
- Angular 20
- Ionic 8

## Funcionalidades

### Acesso

- Login simulado com validação de e-mail e senha.
- Criação de conta simulada com validação e confirmação de senha.
- Recuperação de senha simulada, sem envio de e-mail.
- Após o acesso, o usuário escolhe a experiência da Ana ou entra na área separada dos perfis familiares.

### Perfil da Ana

- Início, lembranças, rotina e perfil em navegação por abas.
- Lembranças com história, data, pessoas relacionadas e imagens ilustrativas locais.
- Ordenação das lembranças por data: mais recente primeiro ou mais antiga primeiro.
- Atividades com estados pendente, concluída, preciso de ajuda e não me lembro.
- A atividade só é marcada como concluída após ação explícita e confirmação.

### Área da família

- Perfis familiares e cuidadores acessados por uma tela separada da seleção da Ana.
- Criação e edição de perfis com nome, parentesco e papel (familiar/cuidador).
- Cadastro e edição de lembranças.
- Seleção manual de fotos, vídeos e áudios/músicas no formulário de lembrança.
- Organização da rotina e dos lembretes.
- Resumo da rotina, respostas e pedidos de ajuda direcionados ao perfil familiar selecionado.

### Pedido de ajuda

1. Ana abre uma atividade e escolhe “Preciso de ajuda”.
2. O aplicativo apresenta os perfis familiares e cuidadores disponíveis.
3. Ana escolhe um contato e registra o pedido localmente.
4. O perfil selecionado visualiza o pedido no painel familiar e pode marcá-lo como visualizado ou atendido.

Nenhum aviso é enviado para fora do aplicativo.

## Mídias

- Os arquivos de áudio e vídeo que estavam pré-incluídos foram removidos.
- Vídeos e áudios são anexados manualmente no cadastro de lembrança.
- As fotos ilustrativas iniciais permanecem como conteúdo local de exemplo.
- Arquivos escolhidos são pré-visualizados por URL temporária do navegador. Não são enviados a servidores.
- Após recarregar ou reabrir a página, arquivos locais podem precisar ser selecionados novamente. Os dados persistidos não incluem bytes de mídia.
- Formatos e limites são validados pelo utilitário `src/app/core/util/media-validation.ts`.

## Dados e persistência

O estado é mantido em serviços mockados e, quando permitido pelo navegador, salvo localmente. Perfis, memórias, lembretes, respostas e pedidos são fictícios. Não insira dados pessoais reais.

## Executar localmente

Requisitos: Node.js compatível com Angular 20 e npm.

```bash
npm install
npm start
```

O servidor de desenvolvimento Angular normalmente fica disponível em `http://localhost:4200`.

Para compilar:

```bash
npm run build
```

Para executar os testes unitários configurados:

```bash
npm test
```

## Rotas principais

| Rota | Finalidade |
|---|---|
| `/login` | Login, cadastro e recuperação de senha simulados |
| `/entrada` | Seleção da experiência da Ana ou entrada na lista familiar |
| `/familia/perfis` | Lista separada de familiares e cuidadores |
| `/familia/perfis/novo` | Criar perfil familiar/cuidador |
| `/familia/perfis/:id/editar` | Editar perfil |
| `/tabs/inicio` | Início da Ana |
| `/tabs/memorias` | Galeria e filtros de lembranças |
| `/tabs/rotina` | Atividades e lembretes |
| `/familia` | Painel familiar |
| `/familia/memorias/nova` | Cadastro de lembrança |

Os guards apenas organizam o fluxo local. Não representam controle de acesso seguro.

## Acessibilidade e heurísticas de Nielsen

O projeto prioriza linguagem direta e adulta, alvos de toque amplos, rótulos visíveis, navegação previsível, retorno após ações, validação de formulários e possibilidade de desfazer respostas da rotina. A avaliação é uma revisão interna do código, não um teste com usuários.

Consulte [`docs/AVALIACAO_HEURISTICA.md`](docs/AVALIACAO_HEURISTICA.md) para a checklist das dez heurísticas e suas limitações.

## Limitações

- Não há backend, conta real, sincronização, backup, e-mail ou notificação externa.
- A mídia local é temporária e pode exigir nova seleção após recarregar.
- As permissões são simuladas e não protegem dados reais.
- A experiência precisa ser testada em dispositivos reais e com usuários representativos antes de qualquer uso público ou clínico.
