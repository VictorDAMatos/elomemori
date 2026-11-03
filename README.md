# EloMemori 🧠💙

> Aplicativo mobile de apoio à memória autobiográfica, à rotina e à comunicação entre pessoas com Alzheimer, familiares e cuidadores.

O **EloMemori** é um projeto acadêmico desenvolvido para explorar como uma interface digital pode apoiar a organização da rotina, o acesso a lembranças pessoais e a comunicação com uma rede de apoio.

A aplicação apresenta fluxos de login e cadastro, perfis, memórias, atividades, recursos de acessibilidade e solicitação de ajuda. Para esta etapa de estudo, utiliza **dados mocados** e interações simuladas.

> **Contexto:** projeto de estudo e demonstração. Não é um serviço clínico, sistema de emergência ou substituto de acompanhamento profissional.

---

## 📚 Sumário

- [Objetivos](#-objetivos)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias e bibliotecas](#-tecnologias-e-bibliotecas)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Execução](#-execução)
- [Scripts disponíveis](#-scripts-disponíveis)
- [Estrutura do projeto](#-estrutura-do-projeto)
- [Dados e persistência](#-dados-e-persistência)
- [Acessibilidade e UX](#-acessibilidade-e-ux)
- [Limitações da demonstração](#-limitações-da-demonstração)
- [Repositório](#-repositório)

---

## 🎯 Objetivos

- Apoiar a organização de atividades e rotinas cotidianas.
- Facilitar a visualização de memórias autobiográficas.
- Promover a comunicação entre a pessoa assistida, familiares e cuidadores.
- Explorar uma interface acessível, simples e responsiva.
- Aplicar conceitos de UI/UX e desenvolvimento frontend em uma aplicação mobile.

## ✨ Funcionalidades

### 🔐 Login, cadastro e recuperação de acesso

- Tela de login como ponto inicial do aplicativo.
- Navegação para criação de conta.
- Navegação para recuperação de senha.
- Validação dos campos de cadastro.
- Regra de senha com mínimo de 6 caracteres.
- Validação da confirmação de senha e mensagens de erro para entradas inválidas.

Os fluxos de acesso são simulados e utilizam dados de demonstração.

### 👤 Perfis de Ana, familiares e cuidadores

- Perfil principal de Ana.
- Perfis de familiares e cuidadores.
- Inclusão, alteração e remoção de foto de perfil.
- Exibição das fotos nas áreas correspondentes.
- Edição de cada perfil dentro do próprio perfil.
- Exibição de iniciais quando não existe uma foto cadastrada.

### 🆘 Solicitação de ajuda

- Acesso à função de pedir ajuda.
- Identificação da pessoa que solicitou ajuda.
- Exibição da foto de Ana quando disponível.
- Seleção e identificação dos familiares ou cuidadores cadastrados.
- Interface de simulação de ligação para o contato escolhido.

#### 📞 Simulação de ligação

A tela de chamada apresenta controles interativos para:

- Visualizar o contato e o tempo da ligação.
- Ativar ou desativar o viva-voz.
- Silenciar ou reativar o microfone.
- Colocar a chamada em espera e retomá-la.
- Encerrar a chamada.

A chamada é uma simulação dentro do aplicativo. Ela não utiliza a rede telefônica nem inicia uma ligação real.

### 🧠 Memórias

- Visualização e organização de lembranças pessoais.
- Inclusão de memórias por familiares ou cuidadores.
- Conteúdos de memória com fotos, vídeos e músicas.
- Visualização ou reprodução de mídias disponíveis na interface.

### 📅 Rotina e atividades

- Visualização de atividades cotidianas.
- Organização de tarefas da rotina.
- Interação com os estados das atividades.
- Controles para indicar estados de atividade, conforme a interface da demonstração.

### 🔊 Leitura em voz alta

- Recurso de leitura de histórias e conteúdos textuais.
- Uso da síntese de voz disponível no navegador ou ambiente compatível.

### ♿ Acessibilidade

- Ajuste do tamanho do texto.
- Opção de alto contraste.
- Opção de leitura em voz alta.
- Estados visuais para controles de acessibilidade.
- Interface pensada para facilitar leitura e interação.

---

## 🛠 Tecnologias e bibliotecas

### Tecnologias principais

| Tecnologia | Uso no projeto |
|---|---|
| HTML5 | Estrutura das páginas e templates |
| CSS3 | Estilização, layout e responsividade |
| TypeScript | Lógica da aplicação e tipagem |
| Angular 20 | Framework frontend, componentes e navegação |
| Ionic Angular 8 | Componentes e experiência de interface mobile |
| Node.js | Ambiente de execução das ferramentas de desenvolvimento |
| npm | Instalação e gerenciamento de dependências |

### Dependências de aplicação

| Biblioteca | Finalidade |
|---|---|
| `@angular/common` | Recursos comuns e diretivas Angular |
| `@angular/compiler` | Compilação de templates Angular |
| `@angular/core` | Núcleo do Angular |
| `@angular/forms` | Formulários e validação |
| `@angular/platform-browser` | Execução da aplicação no navegador |
| `@angular/router` | Navegação entre páginas |
| `@ionic/angular` | Componentes e integração Ionic com Angular |
| `ionicons` | Ícones da interface |
| `rxjs` | Programação reativa e fluxos assíncronos |
| `zone.js` | Detecção de mudanças usada pelo Angular |
| `tslib` | Suporte de runtime para recursos TypeScript |
| `@fontsource/alata` | Fonte Alata |
| `@fontsource/antonio` | Fonte Antonio |

### Ferramentas de desenvolvimento e testes

| Pacote | Finalidade |
|---|---|
| `@angular/cli` | Comandos de desenvolvimento Angular |
| `@angular/build` | Ferramentas de build |
| `@angular/compiler-cli` | Compilação Angular para TypeScript |
| `typescript` | Compilador TypeScript |
| `jasmine-core` | Framework de testes |
| `@types/jasmine` | Tipos TypeScript para Jasmine |
| `karma` | Executor de testes no navegador |
| `karma-chrome-launcher` | Inicialização do Chrome para testes |
| `karma-coverage` | Relatórios de cobertura |
| `karma-jasmine` | Integração Karma e Jasmine |
| `karma-jasmine-html-reporter` | Relatório visual dos testes |

As versões e dependências declaradas podem ser consultadas em [`package.json`](./package.json). O arquivo `package-lock.json` registra a árvore de dependências resolvida.

---

## 💻 Pré-requisitos

Instale os seguintes recursos:

- **Node.js** (versão compatível com Angular 20).
- **npm**, incluído na instalação do Node.js.
- **Git**, para clonar o repositório.
- Navegador atualizado, como Chrome, Firefox ou Edge.

Verifique as instalações:

```bash
node -v
npm -v
git --version
```

O Angular CLI e o Ionic CLI globais não são obrigatórios para executar os comandos abaixo: o projeto pode utilizar os executáveis locais com `npx` ou os scripts npm.

---

## 📥 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/VictorDAMatos/elomemori.git
```

### 2. Acesse a pasta

```bash
cd elomemori
```

### 3. Instale as dependências

```bash
npm install
```

O comando instala os pacotes definidos no `package.json` e usa o `package-lock.json` para reproduzir as versões resolvidas.

---

## ▶️ Execução

Inicie o servidor de desenvolvimento:

```bash
npx ionic serve
```

O Ionic normalmente disponibiliza a aplicação em:

```text
http://localhost:8100
```

Se o terminal informar outro endereço, abra o endereço exibido por ele.

Para encerrar o servidor, pressione `Ctrl + C` no terminal.

### Executar pelo script Angular

O projeto também declara o script `start`:

```bash
npm start
```

Esse script executa `ng serve`. Dependendo da configuração local do Angular, a porta padrão pode ser diferente da utilizada pelo Ionic.

---

## 🧰 Scripts disponíveis

Os scripts abaixo estão declarados no `package.json`:

| Comando | Descrição |
|---|---|
| `npm start` | Inicia o servidor Angular (`ng serve`) |
| `npm run build` | Compila a aplicação (`ng build`) |
| `npm run watch` | Compila em modo desenvolvimento e observa alterações |
| `npm test` | Executa os testes sem modo watch usando ChromeHeadless |
| `npm run test:watch` | Executa os testes em modo watch |
| `npx ionic serve` | Inicia o servidor de desenvolvimento Ionic |
| `npm audit` | Analisa dependências quanto a vulnerabilidades conhecidas |

Para gerar o build:

```bash
npm run build
```

Para executar os testes:

```bash
npm test
```

O script de teste utiliza ChromeHeadless; portanto, é necessário que o ambiente tenha um Chrome ou Chromium compatível disponível.

---

## 📂 Estrutura do projeto

Estrutura geral, conforme os diretórios e arquivos do projeto:

```text
elomemori/
├── docs/                     # Documentação complementar
├── src/
│   └── app/
│       ├── core/             # Recursos centrais compartilhados
│       │   └── state/        # Estado e persistência
│       └── features/         # Funcionalidades organizadas por domínio
│           └── routine/      # Rotina e atividades
├── .gitignore
├── angular.json              # Configuração Angular
├── ionic.config.json         # Configuração Ionic
├── package.json              # Scripts e dependências
├── package-lock.json         # Dependências resolvidas
├── README.md
├── tsconfig.app.json
├── tsconfig.json
└── tsconfig.spec.json
```

Os recursos específicos ficam organizados em `src/app/` por áreas funcionais. A estrutura pode evoluir conforme novas páginas e componentes forem adicionados.

---

## 💾 Dados e persistência

O EloMemori utiliza dados mocados para fins de estudo e apresentação.

- Os dados da demonstração não são obtidos de uma API de produção.
- Os fluxos de login e cadastro são simulados.
- As chamadas não são ligações telefônicas reais.
- A persistência local depende dos recursos implementados no navegador.
- As mídias e informações utilizadas na apresentação devem ser fictícias ou autorizadas.

Não utilize dados médicos reais, credenciais pessoais ou informações sensíveis na demonstração.

---

## ♿ Acessibilidade e UX

O projeto explora princípios de usabilidade e acessibilidade, incluindo:

- Visibilidade do estado do sistema.
- Consistência de componentes e padrões.
- Reconhecimento em vez de memorização.
- Prevenção e comunicação de erros.
- Textos legíveis e controles identificáveis.
- Feedback visual após ações.
- Ajustes de contraste e tamanho de texto.

A interface também considera as heurísticas de usabilidade de Nielsen como referência de projeto. Isso não significa que o aplicativo tenha sido formalmente certificado ou validado por uma avaliação de usabilidade com usuários.

---

<p align="center">
  <strong>EloMemori</strong><br>
  Tecnologia como apoio à memória, à rotina e aos vínculos.
</p>
