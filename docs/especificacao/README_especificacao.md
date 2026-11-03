# EloMemori

**Protótipo mobile acadêmico de apoio à rotina, à memória autobiográfica e à conexão familiar para pessoas com Alzheimer.**

> **Modo de demonstração obrigatório:** este projeto deve funcionar exclusivamente com dados mockados. Não requer nem deve conectar a um backend real, banco de dados remoto, serviço de autenticação, armazenamento em nuvem, API externa ou serviço de notificações. O objetivo é demonstrar os fluxos e a experiência de uso, não armazenar dados reais de pacientes.

## 1. Visão geral

O EloMemori foi concebido para ajudar a pessoa assistida a manter parte de sua autonomia no dia a dia e facilitar o acompanhamento por familiares e cuidadores. Reúne lembretes, rotina e lembranças reais em uma experiência simples, com uma área separada para a família.

A persona de referência é **Ana Mendes**, 80 anos, que vive com a filha e os netos e apresenta Alzheimer em estágio inicial. Para esta demonstração, Ana e os demais usuários são personagens fictícios, e todos os registros apresentados são dados de exemplo.

**Princípio central:** a família preenche memórias e rotina usando dados fictícios; o aplicativo apresenta experiências de forma simples; a pessoa interage; o protótipo registra a interação localmente; e a família consulta os itens realizados e pendentes.

## 2. Escopo acadêmico e dados mockados

Toda a aplicação deve funcionar sem serviços externos e sem credenciais.

- Criar dados de demonstração fictícios para a pessoa assistida, familiares, memórias, atividades, lembretes e histórico.
- Implementar a leitura e alteração desses dados por meio de serviços TypeScript simulados, por exemplo `MockMemoryService`, `MockRoutineService` e `MockFamilyService`.
- Usar dados iniciais definidos em arquivos de fixtures/seed e disponibilizar uma ação para restaurar a demonstração ao estado original.
- Quando for útil manter as alterações entre atualizações da página, usar `localStorage` apenas para metadados fictícios e preferências não sensíveis. Incluir tratamento para dados ausentes ou inválidos e botão **Restaurar dados de demonstração**.
- Não enviar ou receber dados de um servidor real. Não instalar ou configurar Supabase, Firebase, autenticação real, banco de dados remoto ou storage em nuvem.
- A entrada de familiares pode ser simulada com perfis de demonstração predefinidos, claramente identificados como fictícios. Não solicitar e-mail, senha ou dados pessoais reais.
- As ações de convidar/remover familiar devem alterar apenas a lista mockada e não enviar convites.
- As ações de lembrete e notificações devem ser simuladas dentro da interface. Não alegar que notificações em segundo plano ou alertas a familiares foram enviados.
- Uploads de mídia devem ser demonstrativos: arquivos escolhidos pelo usuário podem ser pré-visualizados durante a sessão por URLs temporárias locais; não são enviados para nenhum servidor. Ao reiniciar a sessão, arquivos selecionados localmente podem precisar ser anexados novamente. Para as memórias já cadastradas, preferir mídias fictícias de demonstração incluídas em `assets`.
- Usar apenas nomes, histórias, fotos, vídeos e áudios fictícios ou livres/licenciados para demonstração. Não utilizar dados reais de saúde, fotos de pacientes ou conteúdo privado.

A interface deve indicar discretamente que se trata de uma **Demonstração acadêmica com dados fictícios**, por exemplo na tela de acesso da família ou no rodapé de configurações.

## 3. Linguagens e tecnologias

### Linguagens solicitadas

- **HTML:** estrutura semântica das telas e componentes.
- **CSS:** apresentação visual, responsividade, estados e acessibilidade.
- **TypeScript:** lógica da aplicação, modelos tipados, navegação, validação e serviços mockados.

### Stack recomendada

| Tecnologia | Responsabilidade |
|---|---|
| Angular com componentes standalone | Organização de telas, componentes, rotas e serviços TypeScript. |
| Ionic Angular | Componentes e padrões de interface adequados para mobile. |
| Capacitor | Opcional para empacotar o protótipo como aplicativo Android/iOS. Não exige integração com serviços externos. |
| `localStorage` | Persistência local opcional de metadados de demonstração e preferências; não usar para guardar arquivos grandes. |
| Fixtures TypeScript/JSON | Dados iniciais fictícios para os fluxos do protótipo. |

Não há backend nem banco de dados remoto neste escopo. Caso uma futura etapa precise transformar o protótipo em produto real, a integração deverá ser especificada separadamente e não deverá ser presumida nesta entrega.

## 4. Funcionalidades previstas

### Para a pessoa assistida

- Tela inicial limpa, com saudação, próxima atividade e acesso destacado às lembranças.
- Galeria de memórias pessoais fictícias cadastradas pela família.
- Visualização ampliada de fotos.
- Reprodução de vídeos, músicas e arquivos de áudio associados às memórias, usando mídias locais de exemplo ou arquivos selecionados para pré-visualização na sessão.
- Leitura da história de uma lembrança e leitura em voz alta opcional quando suportada pelo navegador/dispositivo.
- Lista de atividades e lembretes em linguagem simples.
- Ações grandes para confirmar uma atividade, pedir ajuda ou indicar que não se lembra.
- Ajustes de tamanho do texto, contraste e preferências acessíveis.

### Para familiares e cuidadores

- Área da Família separada da interface principal.
- Atalho para a Área da Família dentro de **Perfil**.
- Entrada simulada com perfis familiares de demonstração, sem autenticação real.
- Cadastro, edição, arquivamento e exclusão de lembranças mockadas.
- Seleção de fotos, vídeos e arquivos de áudio/música para pré-visualização local, sem upload remoto.
- Cadastro e ajuste de atividades e lembretes fictícios.
- Visualização de atividades realizadas, pendentes ou sinalizadas como precisando de ajuda.
- Gerenciamento simulado de familiares e permissões de demonstração.

## 5. Navegação proposta

1. **Início:** experiência principal simples para a pessoa assistida.
2. **Memórias:** galeria e visualização de lembranças.
3. **Rotina:** atividades e lembretes.
4. **Perfil:** preferências, acessibilidade, ajuda e acesso à Área da Família.
5. **Área da Família:** painel demonstrativo separado para gerenciar memórias, rotina e membros fictícios autorizados.

A navegação final deve ser compatibilizada com o Figma. A separação explícita da Área da Família e seu acesso a partir de Perfil são requisitos funcionais deste projeto.

## 6. Fluxo principal

1. Um familiar de demonstração abre a Área da Família.
2. O familiar cadastra uma memória fictícia ou seleciona uma das memórias de exemplo.
3. A pessoa assistida visualiza a atividade ou lembrança numa interface simples.
4. A pessoa visualiza a mídia ou responde ao lembrete.
5. O protótipo registra a interação no estado mockado local.
6. A família consulta o que foi concluído, o que continua pendente e onde a pessoa pediu ajuda.
7. A família restaura os dados de exemplo quando quiser repetir a demonstração.

O aplicativo não deve inferir que uma tarefa ou medicamento foi concluído sem confirmação explícita.

## 7. Princípios de UX/UI e acessibilidade

- Uma ação principal por tela sempre que possível.
- Botões e áreas de toque grandes, com rótulos explícitos.
- Tipografia ajustável, contraste adequado e foco visual perceptível.
- Navegação previsível, sem gestos obrigatórios ou menus escondidos como único caminho.
- Estados indicados por texto e ícone, não apenas por cor.
- Português brasileiro, linguagem adulta, calma e respeitosa.
- Evitar infantilização, mensagens culpabilizantes, alarmismo ou testes de memória.
- A interface da pessoa assistida deve permanecer simples mesmo quando a área de cuidadores possuir mais opções.
- Usar o Figma como referência visual quando estiver acessível, priorizando leitura e acessibilidade em caso de conflito.

### 7.1. As 10 heurísticas de usabilidade de Nielsen

O prompt de desenvolvimento exige que as dez heurísticas de Nielsen sejam consideradas explicitamente. A tabela abaixo mostra como devem orientar o EloMemori e como verificar a implementação. A lista de Nielsen é uma referência de princípios gerais de interação, não uma certificação automática de usabilidade ([Nielsen Norman Group](https://www.nngroup.com/articles/ten-usability-heuristics/)).

| Heurística | Aplicação prevista no EloMemori | Como verificar |
|---|---|---|
| 1. Visibilidade do estado do sistema | Feedback após ações; estados de atividades claros; controles e estado de reprodução de mídia visíveis. | Criar/editar uma memória e responder a uma atividade; confirmar que o resultado aparece claramente. |
| 2. Correspondência entre sistema e mundo real | Linguagem simples, adulta e familiar; tarefas e lembretes ligados à rotina diária. | Revisar textos com foco na compreensão de pessoas idosas, evitando jargões. |
| 3. Controle e liberdade | Voltar/cancelar, editar itens, confirmar ações destrutivas e restaurar os dados mockados. | Verificar se a pessoa consegue voltar de uma tela e cancelar ou corrigir uma ação. |
| 4. Consistência e padrões | Componentes, rótulos, ícones, cores de estado e navegação consistentes. | Comparar telas e verificar se os mesmos controles significam e fazem a mesma coisa. |
| 5. Prevenção de erros | Validação de formulários e arquivos; confirmação para exclusão; conclusão de atividade somente por ação explícita. | Tentar enviar formulário inválido ou mídia incompatível e verificar a prevenção do erro. |
| 6. Reconhecimento em vez de memorização | Opções visíveis, cartões de memória com contexto, próxima atividade e ações nomeadas. | Completar tarefas sem precisar decorar comandos ou caminhos anteriores. |
| 7. Flexibilidade e eficiência | Ajuste de texto/contraste; edição e reutilização de conteúdo por familiares; poucos passos na experiência principal. | Testar as configurações e comparar a quantidade de etapas dos fluxos frequentes. |
| 8. Estética e design minimalista | Poucas opções prioritárias na interface principal; controles avançados separados na Área da Família. | Verificar se cada tela destaca sua ação principal e evita informação concorrente. |
| 9. Reconhecer, diagnosticar e recuperar erros | Mensagens claras e ações para corrigir mídia incompatível ou indisponível e outros problemas. | Provocar estados de erro e confirmar se a mensagem explica o problema e a próxima ação. |
| 10. Ajuda e documentação | Ajuda fácil de localizar no Perfil e instruções curtas para funções principais; README de apoio. | Encontrar ajuda e seguir instruções para abrir uma memória, responder a lembrete e adicionar mídia. |

**Importante:** estes são requisitos e critérios de verificação para o protótipo, não uma afirmação de que a interface já foi implementada ou validada. Ao desenvolver, preencha uma checklist de avaliação com cada heurística marcada como **atende**, **atende parcialmente** ou **não atende**, acompanhada de evidências e pendências. A avaliação heurística não substitui testes de usabilidade com pessoas representativas do público-alvo.

## 8. Arquitetura sugerida

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
      pipes/
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
  environments/
```

Modelos sugeridos:

- `MockProfile`: identificador fictício, nome de exibição e papel.
- `MockFamilyRelationship`: vínculo fictício entre pessoa assistida e familiar.
- `MockMemory`: título, descrição, data opcional, criador fictício, pessoa assistida e lista de mídias.
- `MockMedia`: tipo de mídia, nome de exibição, URL local de demonstração ou referência temporária da sessão.
- `MockReminder`: atividade, instrução, horário, recorrência e estado.
- `MockRoutineLog`: resultado, data/hora fictícia ou local e origem da confirmação.

Os serviços mockados devem expor métodos semelhantes aos de um serviço de dados comum (listar, consultar, criar, atualizar, arquivar/excluir e restaurar dados), para facilitar uma futura evolução, sem implementar chamadas HTTP ou integração remota agora.

## 9. Mídias de demonstração

- Incluir exemplos fictícios locais para fotos, vídeos e áudio/música quando houver recursos de demonstração disponíveis e licenciados.
- Usar elementos nativos de mídia ou componentes acessíveis, como `<audio controls>` e `<video controls>`, quando apropriado.
- Para arquivos selecionados em um formulário, validar formato e tamanho, mostrar prévia e permitir remover antes de confirmar.
- Criar URLs temporárias com `URL.createObjectURL` apenas para a sessão e revogá-las quando não forem mais necessárias.
- Não simular um upload remoto real; a interface pode mostrar uma etapa breve de “Adicionando à demonstração”, seguida da inclusão no estado mockado.
- Não colocar mídia binária em `localStorage` nem converter arquivos grandes para Base64.
- Mostrar estado de mídia indisponível e permitir retorno seguro à lembrança.

## 10. Privacidade e segurança no protótipo

- Usar somente dados inventados e mídias de demonstração.
- Não recolher dados pessoais reais, dados de saúde, senhas, contatos ou credenciais.
- Não conectar a APIs, backend, banco de dados remoto, analytics ou storage externo.
- Não incluir chaves, tokens ou segredos no código.
- Explicar no README que o modo mockado não oferece autenticação real, sincronização entre dispositivos, backups ou proteção adequada para uso clínico.
- O protótipo não deve ser usado para orientar decisões médicas ou substituir cuidadores/profissionais de saúde.

## 11. Desenvolvimento local

Os comandos exatos devem seguir o `package.json` que for criado. Para um projeto Angular/Ionic típico:

1. Instale uma versão compatível de Node.js e npm.
2. Instale as dependências do projeto com `npm install`.
3. Execute `ionic serve` ou o script de desenvolvimento definido em `package.json`.
4. Use os perfis e conteúdos fictícios já fornecidos para demonstrar os fluxos.
5. Use a opção **Restaurar dados de demonstração** para retornar ao estado inicial.

Não crie variáveis para credenciais de serviços externos, migrações SQL ou configuração de backend nesta versão.

## 12. Referência visual do Figma

Projeto fornecido: [EloMemori no Figma](https://www.figma.com/design/lmUu977kXSwUZjCRt3XRy3/EloMemori?node-id=0-1&p=f&t=38QheYOCg0X3NIa5-0).

A tentativa de abrir o arquivo diretamente neste ambiente foi bloqueada pelo acesso restrito. Por isso, não afirmamos ter validado cores, tipografia, medidas ou telas específicas. A ferramenta de desenvolvimento deve inspecionar o arquivo quando tiver acesso; caso contrário, precisa documentar as decisões visuais inferidas, sem alegar que viu detalhes não acessíveis.

## 13. Limites do produto

- O EloMemori é um protótipo acadêmico de demonstração, não um produto validado para uso clínico.
- Todos os perfis, memórias, atividades, lembretes e eventos são fictícios.
- Os lembretes simulam interações dentro da interface. Não enviam notificações reais nem alertas para familiares.
- O protótipo não realiza diagnóstico, não recomenda doses e não substitui orientação profissional.
- As hipóteses de valor e usabilidade precisam ser validadas com usuários em estudos adequados antes de qualquer uso real.

## 14. Critérios mínimos de aceite

- A pessoa assistida consegue abrir uma lembrança com poucos passos.
- Uma lembrança pode conter imagem, vídeo e/ou áudio, e os controles de reprodução funcionam com mídia de demonstração disponível.
- Um familiar fictício consegue criar, editar e arquivar uma lembrança.
- A Área da Família fica separada e é acessível pelo Perfil.
- Um familiar fictício pode cadastrar lembretes e consultar itens concluídos/pendentes.
- A pessoa pode confirmar uma atividade, pedir ajuda ou informar que não se lembra.
- Alterações atualizam a interface e, quando configurado, persistem apenas localmente como dados fictícios.
- Há estados de vazio, erro e mídia indisponível, além de uma ação para restaurar os dados mockados.
- O projeto executa localmente sem credenciais ou acesso à internet para carregar os dados mockados e os assets locais.
- O README documenta com clareza o escopo de demonstração e as limitações.
- As dez heurísticas de Nielsen são verificadas e registradas em uma checklist com evidências, status e observações.
