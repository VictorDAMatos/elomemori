# Avaliação heurística de Nielsen — EloMemori

Checklist de revisão de código. A avaliação não é teste de usabilidade e não comprova adequação clínica. A experiência ainda precisa ser observada com pessoas idosas, pessoas com Alzheimer em estágio inicial e familiares/cuidadores.

## Resultado atual

| # | Heurística | Status de revisão | Evidência/observação |
|---|---|---|---|
| 1 | Visibilidade do estado do sistema | Atende parcialmente | Feedback de ações, estados da rotina e estados dos pedidos de ajuda. Confirmar consistência ao executar em navegador. |
| 2 | Correspondência entre sistema e mundo real | Atende parcialmente | Vocabulário adulto e cotidiano: “Concluí”, “Preciso de ajuda”, “Não me lembro” e “Lembranças”. Validar compreensão com usuários. |
| 3 | Controle e liberdade do usuário | Atende | Retorno entre telas, possibilidade de mudar resposta da atividade, cancelar formulários e confirmar ações destrutivas. |
| 4 | Consistência e padrões | Atende parcialmente | Componentes compartilhados, identidade visual centralizada e padrões Ionic. Verificar as telas novas em execução. |
| 5 | Prevenção de erros | Atende parcialmente | Validação em formulários e confirmação de conclusão de atividade. Testar entradas inválidas e mídia indisponível. |
| 6 | Reconhecimento em vez de memorização | Atende | Abas rotuladas, controles com nomes, perfis familiares selecionáveis e contatos ligados aos perfis cadastrados. |
| 7 | Flexibilidade e eficiência de uso | Atende parcialmente | Ajuste de texto/contraste, filtros de memória e gestão familiar. Não há atalhos avançados nem duplicação de registros. |
| 8 | Estética e design minimalista | Atende parcialmente | Tema claro neutro, aqua/verde-azulado equilibrado e remoção da base creme. A comparação visual definitiva depende da inspeção do Figma e execução. |
| 9 | Reconhecimento, diagnóstico e recuperação de erros | Atende parcialmente | Mensagens de validação e feedback; precisa ser verificado com falhas de armazenamento e arquivos locais expirados. |
| 10 | Ajuda e documentação | Atende parcialmente | Tela de ajuda e README disponíveis. Conteúdo de ajuda deve acompanhar futuras mudanças e ser testado. |

## Roteiro de validação manual

1. Entrar pela tela de login e verificar validação de e-mail/senha.
2. Criar conta com senhas diferentes e iguais; observar mensagens e retorno.
3. Solicitar recuperação com e-mail inválido e válido; confirmar que não há envio externo.
4. Abrir o perfil de Ana e verificar que os familiares não aparecem misturados na seleção principal.
5. Acessar perfis familiares, criar um novo, editar nome/parentesco/papel e confirmar que ele aparece na lista.
6. Na área familiar, criar uma lembrança com foto e depois testar seleção de vídeo/áudio local; confirmar que não há arquivos de música ou vídeo pré-carregados.
7. Ordenar memórias nas duas direções e conferir datas parciais/ausentes.
8. Na rotina da Ana, marcar uma atividade como concluída somente após confirmação.
9. Solicitar ajuda, selecionar um perfil e conferir que o pedido aparece somente na área do familiar selecionado; marcar como visualizado e atendido.
10. Recarregar o navegador e verificar persistência dos dados textuais e o comportamento esperado para mídias temporárias.
11. Conferir contraste, tamanho de toque, foco por teclado, mensagens de erro e retorno em telas pequenas.

## Limitações da avaliação

- Não foram realizados testes com participantes.
- A revisão não substitui uma auditoria de acessibilidade WCAG.
- As permissões, autenticação e solicitações são fluxos simulados; não constituem segurança nem comunicação externa.
- A execução/compilação precisa ser confirmada no ambiente com as dependências Angular/Ionic instaladas.

## Rodada 2 (Parte I): notas de revisão de código

Notas de 0 a 10 baseadas apenas em **revisão de código**; não houve teste com usuários nem execução do aplicativo (ver limitações).

| # | Heurística | Nota inicial | Nota após ajustes | Ajustes aplicados |
|---|---|---|---|---|
| 1 | Visibilidade do estado | 7 | 8 | Rótulo “Ligação simulada”, `aria-live` no estado da chamada, (o aviso de demonstração foi removido a pedido). |
| 2 | Correspondência com o mundo real | 8 | 8 | Sem mudança; linguagem já cotidiana. |
| 3 | Controle e liberdade | 7 | 8 | Tecla Esc fecha a ligação simulada e o diálogo de contatos; foco vai para “Desligar”. |
| 4 | Consistência e padrões | 6 | 8 | Removido bloco de foto duplicado (ids repetidos) em Familiares; ícones decorativos com `aria-hidden`. |
| 5 | Prevenção de erros | 7 | 7 | Pendente: guarda de alterações não salvas e marcadores de obrigatório nos formulários de perfil/login. |
| 6 | Reconhecimento em vez de memorização | 8 | 8 | Fotos dos contatos agora aparecem no diálogo e na chamada. |
| 7 | Flexibilidade e eficiência | 6 | 6 | Sem atalhos avançados (não aplicável a este público). |
| 8 | Estética e minimalismo | 7 | 7 | Sem mudança. |
| 9 | Diagnóstico e recuperação de erros | 6 | 7 | Ícone + texto nas mensagens de erro do login/cadastro. Pendente: erro por campo. |
| 10 | Ajuda e documentação | 6 | 8 | Novos tópicos: pedido de ajuda/ligação simulada, ordenar lembranças, foto de perfil. |

Pendências conhecidas: rotas `familia/perfis*` sem `enteredGuard` (mudaria comportamento; requer decisão); erros por campo e guarda de alterações não salvas em login/perfis.
