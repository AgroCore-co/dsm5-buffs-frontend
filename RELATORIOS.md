# Sistema de Relatórios - Buffs

## Visão Geral

O sistema de relatórios permite gerar e exportar relatórios em PDF dos dados do rebanho. Implementado na branch `feature/relatorios`.

## Arquitetura

### Estrutura de Arquivos

```
src/
├── components/
│   └── proprietario/
│       └── relatorios/
│           ├── RelatorioRebanho.jsx      # Template do relatório
│           └── GerarRelatorioModal.jsx   # Modal para gerar/exportar
├── services/
│   └── relatorioService.js               # Serviço para buscar dados
└── pages/
    └── proprietario/
        └── rebanho.js                    # Página integrada com botão
```

## Componentes

### 1. RelatorioRebanho.jsx

Template visual do relatório usando React com estilos inline para garantir compatibilidade com PDF.

**Características:**
- Layout responsivo em A4
- Estatísticas resumidas (total, fêmeas, machos, ativos)
- Tabela completa de búfalos
- Formatação de dados (datas, porcentagens)
- Estilização inline para export PDF

**Props:**
- `data`: Array de búfalos
- `meta`: Metadados da paginação (total, etc)
- `propriedadeNome`: Nome da propriedade

### 2. GerarRelatorioModal.jsx

Modal que gerencia a geração e exportação do relatório.

**Funcionalidades:**
- Busca automática de dados ao abrir
- Preview do relatório
- Exportação para PDF
- Impressão direta
- Loading states

**Tecnologias:**
- `react-to-print`: Para impressão
- `html2canvas`: Conversão HTML para imagem
- `jspdf`: Geração de PDF

### 3. relatorioService.js

Serviço para buscar dados para relatórios.

**Métodos:**
- `buscarDadosRelatorioRebanho(idPropriedade)`: Busca todos os búfalos (limite 1000)
- `buscarDadosRelatorioFiltrado(filtros)`: Busca com filtros avançados

## Como Usar

### 1. Na página de Rebanho

```javascript
import GerarRelatorioModal from '@/components/proprietario/relatorios/GerarRelatorioModal';

// No componente
const [modalRelatorioOpen, setModalRelatorioOpen] = useState(false);

// Botão para abrir
<button onClick={() => setModalRelatorioOpen(true)}>
  Gerar Relatório
</button>

// Modal
<GerarRelatorioModal
  open={modalRelatorioOpen}
  onClose={() => setModalRelatorioOpen(false)}
  propriedadeId={propriedadeId}
  propriedadeNome="Fazenda Buffs"
/>
```

### 2. Integração com API

O serviço utiliza o `bufaloService.listarBufalosPorPropriedade` com limite alto (1000) para buscar todos os registros.

**Exemplo de resposta esperada:**
```json
{
  "data": [
    {
      "id_bufalo": "uuid",
      "nome": "Zeus",
      "brinco": "IZ-001",
      "dt_nascimento": "2014-05-12",
      "sexo": "M",
      "status": true,
      "origem": "Externo",
      "raca": {
        "nome": "Murrah"
      },
      "propriedade": {
        "nome": "Fazenda Buffs"
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 1000,
    "total": 87,
    "totalPages": 1
  }
}
```

## Funcionalidades Implementadas

### ✅ Implementado

1. **Template de Relatório**
   - Header com logo e data
   - Resumo estatístico (4 cards)
   - Tabela completa de búfalos
   - Footer com timestamp

2. **Exportação PDF**
   - Conversão HTML para PDF
   - Múltiplas páginas automáticas
   - Nome do arquivo com data

3. **Impressão**
   - Impressão direta do navegador
   - Formatação otimizada para impressão

4. **UI/UX**
   - Modal fullscreen
   - Preview do relatório
   - Loading states
   - Botões de ação claros

### 🔄 Melhorias Futuras

1. **Filtros**
   - Adicionar filtros antes de gerar
   - Relatórios por sexo, raça, maturidade

2. **Outros Relatórios**
   - Relatório de Lactação
   - Relatório de Reprodução
   - Relatório Financeiro
   - Relatório de Indústrias

3. **Customização**
   - Escolher campos para exibir
   - Ordenação personalizada
   - Gráficos no PDF

4. **Backend**
   - Endpoint dedicado para relatórios
   - Geração server-side
   - Cache de relatórios

## Dependências

```json
{
  "react-to-print": "^2.x",
  "html2canvas": "^1.x",
  "jspdf": "^2.x"
}
```

## Instalação

```bash
npm install react-to-print html2canvas jspdf
```

## Troubleshooting

### PDF não gera ou fica em branco
- Verifique se há dados em `dadosRelatorio`
- Confirme que o `componentRef` está atachado corretamente
- Verifique erros no console

### Tabela cortada no PDF
- Ajuste o `scale` em `html2canvas` (padrão: 2)
- Reduza o tamanho da fonte se necessário
- Considere orientação landscape para tabelas largas

### Lentidão ao gerar PDF
- Limite o número de registros (< 500 recomendado)
- Use paginação server-side
- Implemente loading visual

## Exemplo Completo

```javascript
// Página com relatório
import { useState } from 'react';
import { usePropriedade } from '@/contexts/propriedadeContext';
import GerarRelatorioModal from '@/components/proprietario/relatorios/GerarRelatorioModal';

export default function MinhaPage() {
  const { propriedadeId } = usePropriedade();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setModalOpen(true)}>
        📊 Gerar Relatório
      </button>

      <GerarRelatorioModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        propriedadeId={propriedadeId}
        propriedadeNome="Minha Fazenda"
      />
    </div>
  );
}
```

## Contribuindo

Para adicionar novos tipos de relatórios:

1. Crie um novo template em `src/components/proprietario/relatorios/`
2. Adicione método no `relatorioService.js` se necessário
3. Crie modal específico ou reutilize `GerarRelatorioModal`
4. Documente aqui no README

## Licença

Parte do projeto Buffs - Sistema de Gestão de Bubalinos
