![Logo](./public/images/banner%20buffs.png)

### 🦬 Buffs - Plataforma de Controle e Acompanhamento da Produção Leiteira e Manejo de Búfalas

O Buffs é um projeto acadêmico desenvolvido com Next.js com o objetivo de construir uma plataforma web para controle e acompanhamento da produção leiteira e manejo de búfalas. A aplicação tem foco em organização, acessibilidade e escalabilidade, facilitando o trabalho de produtores, técnicos e gestores rurais.

Este repositório contém a estrutura do frontend da aplicação, incluindo os principais diretórios, organização modular e instruções para rodar o projeto com variáveis de ambiente conectadas à API.

---

## Autores
- [@V1niSouza](https://github.com/V1niSouza)
- [@paulocsa](https://github.com/paulocsa)
- [@JoaoKuzinor](https://github.com/JoaoKuzinor)
- [@jaobarreto](https://github.com/jaobarreto)
- [@Gabrielll04](https://github.com/Gabrielll04)

<br>

# Como Trabalhar no Projeto

### 1. Fazer o Fork do Repositório
Trabalhe somente com fork do repositório original: `https://github.com/AgroCore-co/dsm5-buffs-frontend.git`.

#### a) Clique no botão Fork no canto superior direito
#### b) Escolha sua conta do GitHub como destino para o fork

<hr>

### 2. Clonar o Repositório (do seu fork)
```bash
git clone https://github.com/SEU_USUARIO/dsm5-buffs-frontend.git
cd dsm5-buffs-frontend
```

Opcional: configure o upstream para sincronizar com o repositório original:
```bash
git remote add upstream https://github.com/AgroCore-co/dsm5-buffs-frontend.git
git fetch upstream
```

<hr>

### 3. Criar uma Nova Branch
```bash
git checkout -b nome-da-sua-branch
```

<hr>

### 4. Fazer Modificações e Commits
Siga o padrão de commits para garantir consistência.

Commit Pattern:
- Tipo: `feat`, `fix`, `docs`, `style`, `refactor`, `test`
- Escopo (opcional): área afetada (ex.: `auth`, `dashboard`)
- Descrição: clara e objetiva

Exemplos:
- `feat(auth): add login functionality`
- `fix(button): fix button color issue`
- `docs(readme): update setup instructions`

Comandos:
```bash
git add .
git commit -m "feat(auth): add login functionality"
```

<hr>

### 5. Subir suas Mudanças
```bash
git push origin nome-da-sua-branch
```

<hr>

### 6. Abrir um Pull Request (PR)
Abra um PR do seu fork para o repositório original, descrevendo claramente o que foi feito.

<br>

# Como rodar o projeto

### 1) Requisitos
- Node.js 18.17+ (recomendado 20+)
- npm

### 2) Instale as dependências
```bash
npm install
```

### 3) Configure variáveis de ambiente (conectar com a API)
Crie um arquivo `.env.local` na raiz do projeto e adicione:
```bash
NEXT_PUBLIC_API_URL=https://api.exemplo.com
```

### 4) Inicie o servidor de desenvolvimento
```bash
npm run dev
```
Acesse `http://localhost:3000`.

### 5) Build e produção
```bash
npm run build
npm run start
```

<br>

# Estrutura do Projeto

Este projeto é modular para facilitar evolução e manutenção.

### 📁 `src/`
Código-fonte da aplicação.

### 📁 `src/pages/`
Páginas do Next.js (Pages Router). Cada arquivo é uma rota. Ex.: `_app.js`, `_document.js`, `index.js`.

### 📁 `src/components/`
Componentes React reutilizáveis de UI (botões, modais, cards, etc.).

### 📁 `src/hooks/`
Hooks customizados para encapsular lógicas reutilizáveis.

### 📁 `src/context/`
Providers e estados globais usando React Context.

### 📁 `src/services/`
Integração com APIs e camadas de serviço.

### 📁 `src/utils/`
Funções utilitárias puras e helpers.

### 📁 `src/styles/`
Estilos globais (ex.: `globals.css`) e utilitários de estilo.

### 📁 `src/lib/`
Módulos de suporte (ex.: clientes, parsers, configs compartilhadas).

### 📁 `src/tests/`
Estrutura de testes (configure o runner conforme necessidade).

### 📁 `public/`
Arquivos estáticos servidos diretamente (imagens, ícones, etc.).

---

