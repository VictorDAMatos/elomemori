# Prompt de desenvolvimento: EloMemori

Copie o prompt abaixo e use-o em uma ferramenta de desenvolvimento assistido por IA ou entregue-o à equipe de desenvolvimento. Ele especifica a experiência do produto, os fluxos e os critérios de aceite para um **protótipo acadêmico que utiliza exclusivamente dados mockados**.

---

## PROMPT

Atue como uma equipe sênior composta por **Product Designer UX/UI, especialista em acessibilidade, desenvolvedor front-end mobile e arquiteto de aplicações**. Desenvolva uma aplicação mobile chamada **EloMemori**, destinada a apoiar pessoas com Alzheimer, especialmente em estágio inicial, na rotina diária, no acesso a lembranças autobiográficas e na conexão com familiares e cuidadores.

### Restrição central: projeto acadêmico com dados mockados

Este é um protótipo para fins de estudo e apresentação. **Use apenas dados fictícios/mockados; não conecte a aplicação a backend real, banco de dados remoto, autenticação real, APIs externas, analytics, armazenamento em nuvem ou serviços de notificação.** Não configure Supabase, Firebase ou serviços equivalentes. Não crie uma integração real que dependa de credenciais.

Todos os perfis, relações familiares, memórias, atividades, lembretes, registros e eventos devem ser simulados em fixtures TypeScript/JSON e serviços mockados. A aplicação deve ser demonstrável localmente, sem precisar de contas externas, chaves ou internet para carregar seus dados de exemplo e assets locais.

Use dados iniciais fictícios e implemente métodos simulados de consulta, criação, edição, arquivamento/exclusão e restauração. Pode utilizar `localStorage` para persistir metadados mockados e preferências locais entre atualizações de página, mas nunca armazene arquivos grandes ou dados pessoais reais nele. Inclua uma ação visível **“Restaurar dados de demonstração”**.

A seleção de mídia em formulários deve funcionar como demonstração local: permitir selecionar arquivos compatíveis, pré-visualizá-los na sessão com URLs temporárias e adicioná-los ao estado mockado da interface, sem enviar os arquivos a qualquer servidor. Explique que arquivos escolhidos localmente podem precisar ser selecionados outra vez após reiniciar a sessão. Para memórias já existentes, prefira assets fictícios locais incluídos no projeto. Não simule que uma notificação foi realmente enviada ou que um convite familiar foi entregue.

A interface deve indicar de forma discreta que é uma **demonstração acadêmica com dados fictícios**. Não use nomes, imagens, histórias ou informações reais de pessoas com Alzheimer. O produto não deve ser tratado como ferramenta clínica validada.

### 1. Objetivo e referência do produto

Desenvolva o EloMemori para apoiar a autonomia da pessoa assistida e facilitar a participação da família, com uma experiência acolhedora, previsível e simples. O app não diagnostica, não substitui cuidadores nem toma decisões médicas.

- Referência visual fornecida: **https://www.figma.com/design/lmUu977kXSwUZjCRt3XRy3/EloMemori?node-id=0-1&p=f&t=38QheYOCg0X3NIa5-0**
- Persona de referência: Ana Mendes, 80 anos, que mora com a filha e os netos e apresenta Alzheimer em estágio inicial. Para a demonstração, todos os dados de Ana e da família são fictícios.
- Fluxo central: **a família fictícia cadastra memórias e rotina → Ana visualiza uma lembrança ou atividade → o protótipo registra a interação mockada → a família consulta itens realizados e pendentes → a família ajusta os próximos exemplos**.
- A área da família deve ficar separada da experiência principal, mas acessível pelo **Perfil** por meio de uma opção clara chamada **“Área da Família”**.
- Primeiro, inspecione o Figma e identifique telas, componentes, cores, tipografia, espaçamentos e navegação. Reproduza a identidade visual quando ela estiver acessível. Se o Figma não puder ser aberto, não alegue ter visto as telas nem invente detalhes: documente a limitação e faça uma implementação visual coerente, priorizando acessibilidade.

### 2. Tecnologias obrigatórias

Utilize **HTML, CSS e TypeScript** como linguagens principais da interface.

Stack sugerida:

- **Angular com componentes standalone** para organizar telas, componentes, rotas e serviços.
- **Ionic Angular** para padrões e componentes mobile.
- **Capacitor** opcional para empacotar o protótipo como aplicativo Android/iOS, sem integrar serviços externos.
- **Fixtures TypeScript/JSON e serviços mockados** para todos os dados.
- **localStorage opcional** para persistência local de metadados fictícios e preferências.

Não substitua a stack por React, Vue ou Flutter. Não configure banco de dados remoto, Supabase, Firebase, autenticação real, chamadas HTTP de API, cloud storage, migrações SQL ou variáveis de ambiente com segredos. Separe a camada de mock data dos componentes para que uma futura integração real, se vier a ser solicitada, possa ser planejada depois, mas **não implemente essa integração agora**.

### 3. Perfis e contextos de uso

**Pessoa assistida (perfil principal)**

- Tela inicial com poucas opções e linguagem simples.
- Visualiza lembranças e reproduz as mídias disponíveis.
- Consulta atividades e lembretes de demonstração.
- Pode marcar uma atividade como concluída, pedir ajuda ou indicar que não se lembra.
- Não precisa acessar a área de gerenciamento familiar na experiência principal.

**Familiar/cuidador (perfil demonstrativo)**

- Entra por uma tela de seleção/login simulado com contas de demonstração predefinidas.
- Acessa a **Área da Família** a partir da tela Perfil.
- Pode criar, editar, arquivar ou excluir lembranças mockadas, com fotos, vídeos e músicas/áudios de demonstração.
- Pode criar e editar atividades, lembretes e recorrências fictícias.
- Consulta os estados de itens concluídos, pendentes ou sinalizados como “Preciso de ajuda”.
- Pode simular a inclusão ou remoção de familiares e a alteração de permissões, sempre no estado local fictício.

Não peça e-mail, senha, telefone ou informação pessoal real. Não afirme que a entrada simulada oferece autenticação ou segurança real.

### 4. Telas mínimas

1. **Entrada de demonstração:** escolha entre experiência da pessoa assistida e perfis familiares fictícios; explicar que são contas demonstrativas.
2. **Início:** saudação, próxima atividade e ação destacada “Ver lembranças”.
3. **Memórias:** galeria com cartões grandes, miniatura, título e data opcional.
4. **Detalhe da memória:** título, história/descrição, data opcional, pessoas relacionadas e mídia. Fotos podem ser ampliadas; vídeos e áudios/músicas devem ter controles funcionais de reprodução e pausa usando mídia local/selecionada.
5. **Rotina e lembretes:** atividades em ordem cronológica e estados claros: pendente, concluída ou precisa de ajuda.
6. **Resposta à atividade:** botões grandes “Concluí”, “Preciso de ajuda” e “Não me lembro”. Só marcar como concluída após a confirmação explícita.
7. **Perfil:** preferências, acessibilidade, ajuda e atalho visível para “Área da Família”.
8. **Área da Família:** resumo da rotina, atividades concluídas/pendentes e atalhos para criar lembranças e atividades.
9. **Criar/editar memória:** formulário curto para título, história, data opcional, pessoas relacionadas e anexos de imagem, vídeo e áudio.
10. **Familiares demonstrativos:** lista fictícia e ações locais para adicionar/remover membros simulados.
11. **Configurar rotina:** cadastro/edição de atividades e horários/recorrências fictícios.

Todos os botões devem funcionar dentro do protótipo. Inclua estados de primeira utilização, ausência de conteúdo, carregamento simulado, arquivo incompatível, mídia indisponível e confirmação de alterações. Não represente upload remoto, envio real de convite ou entrega de notificação externa.

### 5. Memórias e mídias

Familiares demonstrativos devem conseguir:

- Criar uma memória com título, história curta, data opcional e pessoas relacionadas.
- Selecionar uma ou mais fotos, vídeos e arquivos de áudio/música compatíveis.
- Visualizar prévias e remover anexos antes de confirmar.
- Editar, arquivar ou excluir uma memória fictícia.
- Receber feedback visual de validação e de “adição à demonstração”.

A pessoa assistida deve conseguir:

- Abrir memórias com poucos passos.
- Visualizar fotos em tamanho confortável.
- Reproduzir/pausar vídeos, músicas e áudios usando controles acessíveis.
- Ler a história da lembrança e, se suportado, optar por leitura em voz alta.
- Voltar com um controle visível e consistente.

Use assets locais de demonstração quando possível e elementos apropriados como `<audio controls>` e `<video controls>`. Para arquivos escolhidos localmente, use URLs temporárias com `URL.createObjectURL` e revogue-as quando não forem mais necessárias. Não use Base64 nem `localStorage` para guardar arquivos grandes. Não faça chamadas de rede para enviar mídia. Se o arquivo não estiver disponível após recarregar, mostre um estado compreensível e permita selecioná-lo novamente.

Não transforme a experiência num teste de memória. Prefira mensagens acolhedoras, sem pressionar a pessoa a lembrar nomes ou datas. Não apresente conteúdo como fato certo se não tiver sido inserido no dado fictício.

### 6. Rotina e lembretes simulados

- Permita que familiares fictícios cadastrem atividades de rotina e lembretes, inclusive exemplos de lembretes de medicamentos.
- Apresente nome, horário e ação esperada em linguagem simples.
- Registre a resposta escolhida pela pessoa no estado mockado local.
- Para itens pendentes, mostre feedback dentro do app. Não programe notificações push, envio de SMS, e-mail ou alertas externos.
- Botões como “Avisar familiar” devem apenas registrar/exibir um evento fictício na demonstração, deixando claro que nenhuma mensagem foi enviada.
- Não marque um medicamento como tomado apenas porque uma notificação foi fechada.
- Não recomende doses, altere prescrições nem ofereça orientação médica automatizada.

### 7. UX/UI e acessibilidade

Projete para pessoas idosas e pessoas que podem ter dificuldades de memória, atenção, visão ou coordenação:

- Uma ação principal por tela sempre que possível.
- Botões grandes, áreas de toque generosas (meta de aproximadamente 48 × 48 px ou mais), rótulos explícitos e espaçamento confortável.
- Contraste adequado, foco visível e WCAG 2.2 AA como referência sempre que aplicável.
- Tipografia legível, configurável e sem blocos longos de texto.
- Navegação previsível; evite menus escondidos, gestos obrigatórios, ícones ambíguos e interrupções desnecessárias.
- Não dependa apenas de cor para comunicar estados.
- Português brasileiro, linguagem adulta, calma e respeitosa. Evite infantilização, culpa ou alarmismo.
- Permita ajustes de tamanho do texto e contraste; considere leitura em voz alta quando suportada.
- Mantenha a interface principal simples, mesmo que a Área da Família tenha mais opções.

#### Aplicação explícita das 10 heurísticas de usabilidade de Nielsen

Aplique as dez heurísticas de Nielsen como requisitos de projeto, não apenas como inspiração. Para cada tela e fluxo principal, confira os critérios abaixo e registre eventuais exceções. As heurísticas são princípios gerais de usabilidade; a sua inclusão no prompt não substitui uma avaliação com usuários.

1. **Visibilidade do estado do sistema:** mostrar retorno imediato após salvar, editar, excluir, concluir ou restaurar dados; deixar visíveis os estados de rotina (pendente, concluída, precisa de ajuda) e o estado de reprodução da mídia.
2. **Correspondência entre o sistema e o mundo real:** usar português brasileiro simples, horários e datas compreensíveis, nomes de ações familiares e exemplos contextualizados à rotina diária; evitar jargões técnicos.
3. **Controle e liberdade do usuário:** oferecer voltar/cancelar, permitir corrigir escolhas e editar itens; pedir confirmação para ações destrutivas e disponibilizar “Restaurar dados de demonstração”. Não tornar uma ação irreversível sem aviso.
4. **Consistência e padrões:** manter rótulos, ícones, cores de estado, posicionamento de voltar, botões e controles de mídia consistentes entre telas; criar componentes compartilhados para padrões repetidos.
5. **Prevenção de erros:** validar campos obrigatórios e formatos/tamanhos de mídia antes de concluir; desativar ações impossíveis; evitar exclusões acidentais; nunca marcar atividade ou medicamento como concluído sem confirmação explícita.
6. **Reconhecimento em vez de memorização:** deixar opções e próximos passos visíveis; usar fotos, títulos, contexto, datas quando conhecidas e lembretes explícitos; não exigir que a pessoa se lembre de comandos, códigos ou caminhos anteriores.
7. **Flexibilidade e eficiência de uso:** oferecer ajustes de tamanho do texto e contraste, permitir que familiares reutilizem/editem memórias e atividades e reduzir passos repetitivos sem acrescentar complexidade à experiência principal. Não depender de atalhos escondidos.
8. **Estética e design minimalista:** apresentar uma tarefa principal por tela sempre que possível, limitar informações concorrentes e priorizar lembranças e atividades relevantes. Manter ferramentas avançadas na Área da Família.
9. **Reconhecimento, diagnóstico e recuperação de erros:** explicar erros em linguagem simples, indicar o que aconteceu e como prosseguir, por exemplo, selecionar novamente uma mídia indisponível ou corrigir um formato incompatível. Evitar códigos de erro isolados.
10. **Ajuda e documentação:** disponibilizar ajuda fácil de encontrar no Perfil, com instruções curtas e contextuais para ver lembranças, responder a atividades, adicionar mídia e acessar a Área da Família. Documentar o uso no README.

**Verificação obrigatória:** inclua uma checklist de avaliação heurística no projeto/documentação com as dez heurísticas, exemplos de evidência em cada tela, resultado (atende / atende parcialmente / não atende) e observações. Não declarar “conformidade garantida” sem revisão das telas implementadas; registre pendências e corrija problemas de alta prioridade antes da entrega.

### 8. Arquitetura e serviços mockados

Separe visualização, modelos e lógica de dados. Use modelos tipados e serviços de demonstração, sem dependências de servidor.

Estrutura sugerida:

```text
src/
  app/
    core/
      models/
      services/
        mock-memory.service.ts
        mock-routine.service.ts
        mock-family.service.ts
        mock-session.service.ts
    shared/
      components/
    features/
      home/
      memories/
      routine/
      profile/
      family/
      settings/
    app.routes.ts
  assets/
    demo-media/
  mock-data/
    profiles.mock.ts
    memories.mock.ts
    routine.mock.ts
```

Implemente serviços com métodos claros, como listar, consultar, criar, editar, arquivar/excluir e restaurar. Os dados iniciais devem ser fictícios e fornecidos no repositório. Pode persistir metadados mockados no `localStorage`, mas deve haver tratamento de erros e uma ação para restaurar o estado original. Não criar chamadas HTTP, APIs ou camada remota.

Modelos sugeridos: `MockProfile`, `MockFamilyRelationship`, `MockMemory`, `MockMedia`, `MockReminder` e `MockRoutineLog`.

### 9. Privacidade e limites da demonstração

- Utilizar exclusivamente nomes, perfis e conteúdos fictícios ou recursos de demonstração com licença compatível.
- Não recolher informações de pacientes ou outras pessoas reais.
- Não configurar serviços externos, analytics, backend, autenticação, banco remoto ou armazenamento em nuvem.
- Não pedir ou armazenar senhas reais, tokens ou segredos.
- Informar no README que o protótipo não oferece sincronização entre dispositivos, autenticação real, backup remoto ou segurança adequada para uso clínico.
- Deixar claro que o EloMemori é um protótipo acadêmico não validado para decisões de saúde e que não substitui cuidadores ou profissionais de saúde.

### 10. Critérios de aceite

1. A pessoa assistida consegue abrir uma lembrança com poucos passos.
2. O detalhe da lembrança consegue mostrar fotos e reproduzir vídeos/áudios disponíveis nos assets locais ou selecionados na sessão.
3. Um familiar fictício consegue criar, editar, arquivar e excluir memórias mockadas.
4. A Área da Família fica separada e é acessível pelo Perfil.
5. A seleção de perfil familiar funciona sem credenciais reais.
6. Atividades e lembretes podem ser cadastrados e atualizados localmente; os estados aparecem na Área da Família.
7. A pessoa pode confirmar uma atividade, pedir ajuda ou indicar que não se lembra.
8. A aplicação não alega ter enviado notificações, convites ou mídias para serviços externos.
9. Há estados de vazio, validação, mídia indisponível e erro, e um botão para restaurar dados de demonstração.
10. O projeto funciona localmente sem credenciais e sem conexão a serviços remotos.
11. O README descreve setup, tecnologias, estrutura e limitações do modo mockado.
12. As dez heurísticas de Nielsen foram avaliadas com uma checklist documentada; cada item possui evidência, estado de avaliação e observações, sem afirmar validação com usuários quando ela não tiver ocorrido.
13. O projeto mantém consistência entre rótulos, botões, cores semânticas e navegação, e oferece mensagens de erro compreensíveis com meios de recuperação.

### 11. Entrega esperada

Implemente o projeto no repositório disponível e entregue:

- Código organizado por funcionalidades, com HTML, CSS e TypeScript.
- Telas, rotas e navegação funcional.
- Fixtures com dados fictícios e serviços mockados.
- Assets locais de demonstração quando disponíveis, sem conteúdo protegido ou privado indevido.
- `README.md` com instalação, execução, funcionalidades, arquitetura, dados mockados e limitações.
- Testes para fluxos essenciais quando a infraestrutura de testes estiver disponível.
- Resumo final distinguindo o que foi implementado do que permaneceu simulado ou fora do escopo.

Não entregue apenas uma descrição. Execute os comandos de build/teste disponíveis, corrija os erros encontrados e informe honestamente os resultados. Não afirme que testes ou funcionalidades foram executados se isso não ocorreu.

---

## Como usar este prompt

1. Abra o projeto existente no ambiente de desenvolvimento escolhido.
2. Cole o prompt completo na ferramenta de programação assistida por IA.
3. Disponibilize o acesso ao Figma ou exporte telas para inspeção visual. Se o link não estiver acessível, informe a limitação antes de inferir o design.
4. Implemente primeiro a experiência usando dados mockados e assets locais, sem backend nem credenciais.
5. Execute o protótipo e valide os fluxos de memória, mídia, rotina e Área da Família.
