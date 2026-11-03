# Figma e decisões visuais

## Situação do Figma

O arquivo do Figma (<https://www.figma.com/design/lmUu977kXSwUZjCRt3XRy3/EloMemori>) foi **lido por meio do conector do
Figma** (capturas de tela, estrutura das telas, contexto de design e variáveis). Esta versão do protótipo é um **mix**:
a identidade do Figma, com os azuis suavizados a pedido do autor, sobre a estrutura acessível já existente.

Não houve teste com pessoas reais. As mudanças visuais **não foram compiladas nem executadas** no ambiente em que foram
escritas: precisam de `npm install` e `npm start` na máquina do autor.

## O que veio do Figma

- Cabeçalho e barra de abas em azul-marinho; cor de destaque clara (aqua).
- Marca "EloMemori" em dois tons ("Elo" em aqua, "Memori" em branco) e a frase "Memórias que aproximam".
- Tela de entrada com "Olá! Quem está usando o aplicativo?".
- Cartão de progresso do dia ("Hoje X de Y concluídas" com percentual e barra).
- Linha do tempo nas lembranças e linha curva decorativa na faixa de abertura.
- Botões em formato de pílula, cartões bem arredondados.
- Fontes Alata (títulos e botões) e Antonio (horários), instaladas pelos pacotes `@fontsource/alata` e
  `@fontsource/antonio`. Se não carregarem, a fonte do sistema assume.

## O que foi suavizado

| Figma | Mix | Motivo |
| --- | --- | --- |
| `#001827` azul-marinho | `#12303F` | menos pesado, mantém o contraste |
| `#00378b` azul-royal dos cartões | `#E4EFF4` (azul-névoa) | cartões claros, menos saturados |
| `#00d9ff`, `#00f6ff`, `#00b2ff`, `#4ecaff` (ciano neon) | `#8ED8E2` (aqua suave) | sem neon e sem brilho |

Mantidos do tema anterior: fundo claro neutro, verde-azulado `#0F5F6B` como cor principal e aqua suave nas ações
principais, estados com ícone + texto e o modo de alto contraste.

## O que NÃO foi adotado e por quê

- **Fonte Asimovian**: decorativa, difícil de ler para pessoas idosas.
- **Login com e-mail e senha, criar conta, "esqueci a senha" e pop-up de código**: o escopo proíbe autenticação e dados
  pessoais. Foi mantida a escolha de perfil fictício.
- **Telefones reais e links `tel:` na Ajuda**: o protótipo só usa dados fictícios.
- **Fotos de pessoas reais**: substituídas por imagens locais fictícias.

## Contrastes (razão WCAG calculada)

| Combinação | Razão |
| --- | --- |
| branco sobre azul-marinho | 13,11 |
| aqua sobre azul-marinho | 8,60 |
| âmbar claro sobre azul-marinho | 10,36 |
| abas inativas sobre azul-marinho | 8,54 |
| branco sobre azul-marinho 2 | 9,07 |
| âmbar sobre azul-marinho 2 | 5,44 |
| texto sobre azul-névoa | 12,61 |
| azul-marinho sobre azul-névoa | 11,81 |
| verde-azulado sobre azul-névoa | 6,26 |
| azul-marinho sobre âmbar (botão principal) | 7,86 |
| branco sobre verde-azulado | 7,32 |

Todas cumprem o nível AA (menor razão de texto: 5,44:1). Os originais do Figma já tinham contraste alto
(branco sobre `#00378b` 10,94; `#00d9ff` sobre `#001827` 10,66); a mudança foi de saturação, não de legibilidade.
O foco de teclado usa aqua dentro do cabeçalho e da barra de abas, e azul no restante.

## Alto contraste

Em "Ajustes de leitura" o tema passa a preto e branco: faixa de abertura, cartão de progresso e barra de abas ficam
pretos com texto branco; a linha curva decorativa é removida.
