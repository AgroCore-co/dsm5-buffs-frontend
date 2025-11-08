# 📊 Tutorial: Sistema de Relatórios em PDF - Buffs

## 📋 Índice

1. [Introdução](#introdução)
2. [Pré-requisitos](#pré-requisitos)
3. [Instalação das Dependências](#instalação-das-dependências)
4. [Estrutura do Projeto](#estrutura-do-projeto)
5. [Passo 1: Criar o Serviço de Relatórios](#passo-1-criar-o-serviço-de-relatórios)
6. [Passo 2: Criar o Template do Relatório](#passo-2-criar-o-template-do-relatório)
7. [Passo 3: Criar o Modal de Geração](#passo-3-criar-o-modal-de-geração)
8. [Passo 4: Integrar na Página](#passo-4-integrar-na-página)
9. [Testando o Sistema](#testando-o-sistema)
10. [Troubleshooting](#troubleshooting)
11. [Personalizações](#personalizações)

---

## 🎯 Introdução

Este tutorial ensina como implementar um sistema completo de geração de relatórios em PDF no projeto Buffs. Ao final, você terá:

- ✅ Geração de PDF com dados do rebanho
- ✅ Impressão direta do navegador
- ✅ Preview visual do relatório
- ✅ Estatísticas e tabelas formatadas

**Tempo estimado:** 30-45 minutos

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter:

- Node.js instalado (v16 ou superior)
- Projeto Next.js funcionando
- Sistema de autenticação implementado
- API de búfalos funcionando

---

## 🔧 Instalação das Dependências

### Passo 1: Instalar as bibliotecas necessárias

Abra o terminal na raiz do projeto e execute:

```bash
npm install react-to-print html2canvas jspdf
```

**O que cada biblioteca faz:**

- **`react-to-print`**: Permite impressão direta do navegador
- **`html2canvas`**: Converte HTML para imagem (canvas)
- **`jspdf`**: Gera arquivos PDF

### Passo 2: Verificar instalação

Confirme que as dependências foram adicionadas ao `package.json`:

```json
{
  "dependencies": {
    "react-to-print": "^2.15.1",
    "html2canvas": "^1.4.1",
    "jspdf": "^2.5.2"
  }
}
```

---

## 📁 Estrutura do Projeto

Vamos criar a seguinte estrutura:

```
src/
├── components/
│   └── proprietario/
│       └── relatorios/
│           ├── RelatorioRebanho.jsx      # Template visual do relatório
│           └── GerarRelatorioModal.jsx   # Modal de geração/exportação
├── services/
│   └── relatorioService.js               # Serviço para buscar dados da API
└── pages/
    └── proprietario/
        └── rebanho.js                    # Página onde será integrado
```

---

## 📝 Passo 1: Criar o Serviço de Relatórios

### 1.1. Criar o arquivo do serviço

Crie o arquivo: `src/services/relatorioService.js`

```javascript
// filepath: src/services/relatorioService.js
import bufaloService from './bufaloService';

/**
 * Serviço para buscar dados para relatórios
 */
const relatorioService = {
  /**
   * Busca todos os búfalos de uma propriedade para relatório
   * @param {string} idPropriedade - ID da propriedade
   * @returns {Promise<Object>} Dados dos búfalos e metadados
   */
  async buscarDadosRelatorioRebanho(idPropriedade) {
    if (!idPropriedade) {
      throw new Error('ID da propriedade é obrigatório');
    }

    try {
      // Busca com limite alto para pegar todos os registros
      const response = await bufaloService.listarBufalosPorPropriedade(
        idPropriedade,
        {
          page: 1,
          limit: 1000, // Ajuste conforme necessário
          sortBy: 'brinco',
          order: 'asc',
        }
      );

      return response;
    } catch (error) {
      console.error('Erro ao buscar dados do relatório:', error);
      throw error;
    }
  },

  /**
   * Busca dados com filtros personalizados (futuro)
   * @param {Object} filtros - Filtros para busca
   * @returns {Promise<Object>} Dados filtrados
   */
  async buscarDadosRelatorioFiltrado(filtros) {
    // Implementar conforme necessidade
    console.log('Filtros:', filtros);
    return this.buscarDadosRelatorioRebanho(filtros.idPropriedade);
  },
};

export default relatorioService;
```

**O que este serviço faz:**
- Centraliza a lógica de busca de dados
- Utiliza o serviço de búfalos já existente
- Permite extensão futura para filtros

---

## 🎨 Passo 2: Criar o Template do Relatório

### 2.1. Criar o componente do relatório

Crie o arquivo: `src/components/proprietario/relatorios/RelatorioRebanho.jsx`

```javascript
// filepath: src/components/proprietario/relatorios/RelatorioRebanho.jsx
import React, { forwardRef } from 'react';

/**
 * Template de Relatório de Rebanho
 * Este componente renderiza o relatório para impressão/PDF
 */
const RelatorioRebanho = forwardRef(({ data, meta, propriedadeNome }, ref) => {
  // Calcular estatísticas
  const totalAtivos = meta?.total || 0;
  const femeas = data?.filter(b => b.sexo === 'F').length || 0;
  const machos = data?.filter(b => b.sexo === 'M').length || 0;
  const ativos = data?.filter(b => b.status === true).length || 0;

  const calcPercentual = (valor, total) => {
    if (!total || total === 0) return 0;
    return Math.round((valor / total) * 100);
  };

  const formatarData = (dataString) => {
    if (!dataString) return 'N/D';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  const now = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div ref={ref} style={{ 
      fontFamily: 'Inter, sans-serif', 
      backgroundColor: '#ffffff',
      padding: '40px',
      maxWidth: '210mm',
      margin: '0 auto'
    }}>
      {/* Estilos para impressão */}
      <style>
        {`
          @page {
            size: A4 portrait;
            margin: 20mm;
          }
          
          @media print {
            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
        `}
      </style>

      {/* Cabeçalho */}
      <header style={{ 
        marginBottom: '32px', 
        paddingBottom: '24px', 
        borderBottom: '3px solid #CE7D0A' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ 
              fontSize: '32px', 
              fontWeight: 'bold', 
              color: '#1f2937', 
              margin: '0 0 8px 0' 
            }}>
              Relatório de Rebanho
            </h1>
            <p style={{ fontSize: '18px', color: '#6b7280', margin: 0 }}>
              {propriedadeNome || 'Propriedade Rural'}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>
              Data de Emissão
            </p>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
              {now}
            </p>
          </div>
        </div>
      </header>

      {/* Resumo Estatístico */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          color: '#1f2937', 
          marginBottom: '16px' 
        }}>
          Resumo do Rebanho
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '16px' 
        }}>
          {/* Card: Total */}
          <div style={{ 
            backgroundColor: '#f9fafb', 
            padding: '20px', 
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{ 
              fontSize: '12px', 
              fontWeight: '600', 
              color: '#6b7280', 
              margin: '0 0 8px 0' 
            }}>
              Total do Rebanho
            </h3>
            <p style={{ 
              fontSize: '36px', 
              fontWeight: '800', 
              color: '#1f2937', 
              margin: 0 
            }}>
              {totalAtivos}
            </p>
            <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px', marginBottom: 0 }}>
              Búfalos ativos
            </p>
          </div>

          {/* Card: Fêmeas */}
          <div style={{ 
            backgroundColor: '#f9fafb', 
            padding: '20px', 
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{ 
              fontSize: '12px', 
              fontWeight: '600', 
              color: '#6b7280', 
              margin: '0 0 8px 0' 
            }}>
              Fêmeas
            </h3>
            <p style={{ 
              fontSize: '36px', 
              fontWeight: '800', 
              color: '#1f2937', 
              margin: 0 
            }}>
              {femeas}
            </p>
            <p style={{ 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#CE7D0A', 
              marginTop: '8px', 
              marginBottom: 0 
            }}>
              {calcPercentual(femeas, totalAtivos)}% do rebanho
            </p>
          </div>

          {/* Card: Machos */}
          <div style={{ 
            backgroundColor: '#f9fafb', 
            padding: '20px', 
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{ 
              fontSize: '12px', 
              fontWeight: '600', 
              color: '#6b7280', 
              margin: '0 0 8px 0' 
            }}>
              Machos
            </h3>
            <p style={{ 
              fontSize: '36px', 
              fontWeight: '800', 
              color: '#1f2937', 
              margin: 0 
            }}>
              {machos}
            </p>
            <p style={{ 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#CE7D0A', 
              marginTop: '8px', 
              marginBottom: 0 
            }}>
              {calcPercentual(machos, totalAtivos)}% do rebanho
            </p>
          </div>

          {/* Card: Ativos */}
          <div style={{ 
            backgroundColor: '#f9fafb', 
            padding: '20px', 
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{ 
              fontSize: '12px', 
              fontWeight: '600', 
              color: '#6b7280', 
              margin: '0 0 8px 0' 
            }}>
              Status Ativo
            </h3>
            <p style={{ 
              fontSize: '36px', 
              fontWeight: '800', 
              color: '#1f2937', 
              margin: 0 
            }}>
              {ativos}
            </p>
            <p style={{ 
              fontSize: '12px', 
              color: '#6b7280', 
              marginTop: '8px', 
              marginBottom: 0 
            }}>
              Em operação
            </p>
          </div>
        </div>
      </section>

      {/* Tabela de Búfalos */}
      <section>
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          color: '#1f2937', 
          marginBottom: '8px' 
        }}>
          Registro de Búfalos
        </h2>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
          Lista completa dos animais da propriedade.
        </p>

        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          backgroundColor: '#fff',
          border: '1px solid #e5e7eb'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f3f4f6' }}>
              <th style={{ 
                padding: '12px', 
                textAlign: 'left', 
                fontWeight: '600', 
                fontSize: '14px',
                borderBottom: '2px solid #e5e7eb'
              }}>
                Brinco
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'left', 
                fontWeight: '600', 
                fontSize: '14px',
                borderBottom: '2px solid #e5e7eb'
              }}>
                Nome
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                fontWeight: '600', 
                fontSize: '14px',
                borderBottom: '2px solid #e5e7eb'
              }}>
                Sexo
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                fontWeight: '600', 
                fontSize: '14px',
                borderBottom: '2px solid #e5e7eb'
              }}>
                Nascimento
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'left', 
                fontWeight: '600', 
                fontSize: '14px',
                borderBottom: '2px solid #e5e7eb'
              }}>
                Raça
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                fontWeight: '600', 
                fontSize: '14px',
                borderBottom: '2px solid #e5e7eb'
              }}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((bufalo, index) => (
                <tr 
                  key={bufalo.id_bufalo} 
                  style={{ 
                    backgroundColor: index % 2 === 0 ? '#fff' : '#f9fafb',
                    borderBottom: '1px solid #e5e7eb'
                  }}
                >
                  <td style={{ padding: '12px', fontSize: '14px', fontWeight: '500' }}>
                    {bufalo.brinco}
                  </td>
                  <td style={{ padding: '12px', fontSize: '14px' }}>
                    {bufalo.nome}
                  </td>
                  <td style={{ padding: '12px', fontSize: '14px', textAlign: 'center' }}>
                    {bufalo.sexo === 'M' ? 'Macho' : 'Fêmea'}
                  </td>
                  <td style={{ padding: '12px', fontSize: '14px', textAlign: 'center' }}>
                    {formatarData(bufalo.dt_nascimento)}
                  </td>
                  <td style={{ padding: '12px', fontSize: '14px' }}>
                    {bufalo.raca?.nome || 'N/D'}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      backgroundColor: bufalo.status ? '#9DFFBE' : '#fecaca',
                      color: bufalo.status ? '#1f2937' : '#991b1b'
                    }}>
                      {bufalo.status ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td 
                  colSpan="6" 
                  style={{ 
                    padding: '24px', 
                    textAlign: 'center', 
                    color: '#6b7280' 
                  }}
                >
                  Nenhum búfalo encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Rodapé */}
      <footer style={{ 
        marginTop: '40px', 
        paddingTop: '24px', 
        borderTop: '1px solid #e5e7eb',
        textAlign: 'center'
      }}>
        <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>
          Gerado automaticamente pelo sistema Buffs — {now}
        </p>
      </footer>
    </div>
  );
});

RelatorioRebanho.displayName = 'RelatorioRebanho';

export default RelatorioRebanho;
```

**Características do template:**
- ✅ Estilos inline (funciona em PDF)
- ✅ Layout responsivo A4
- ✅ Estatísticas visuais
- ✅ Tabela formatada
- ✅ Cabeçalho e rodapé profissionais

---

## 🎯 Passo 3: Criar o Modal de Geração

### 3.1. Criar o componente do modal

Crie o arquivo: `src/components/proprietario/relatorios/GerarRelatorioModal.jsx`

```javascript
// filepath: src/components/proprietario/relatorios/GerarRelatorioModal.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import RelatorioRebanho from './RelatorioRebanho';
import relatorioService from '@/services/relatorioService';

/**
 * Modal para gerar e exportar relatório de rebanho
 */
export default function GerarRelatorioModal({
  open,
  onClose,
  propriedadeId,
  propriedadeNome,
}) {
  const [loading, setLoading] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [dadosRelatorio, setDadosRelatorio] = useState(null);
  const [metaRelatorio, setMetaRelatorio] = useState(null);
  const [pdfGerado, setPdfGerado] = useState(null);
  const componentRef = useRef();

  // Buscar dados para o relatório
  const buscarDados = async () => {
    if (!propriedadeId) {
      alert('Nenhuma propriedade selecionada');
      return;
    }

    setLoading(true);
    try {
      const response = await relatorioService.buscarDadosRelatorioRebanho(
        propriedadeId
      );
      setDadosRelatorio(response.data || []);
      setMetaRelatorio(response.meta || {});
    } catch (error) {
      console.error('Erro ao buscar dados do relatório:', error);
      alert('Erro ao carregar dados do relatório. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados quando o modal abrir
  useEffect(() => {
    if (open && propriedadeId) {
      buscarDados();
    } else {
      // Limpar dados quando fechar
      setDadosRelatorio(null);
      setMetaRelatorio(null);
      setPdfGerado(null);
    }
  }, [open, propriedadeId]);

  // Configurar impressão
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Relatorio_Rebanho_${new Date()
      .toLocaleDateString('pt-BR')
      .replace(/\//g, '-')}`,
    pageStyle: `
      @page {
        size: A4 portrait;
        margin: 20mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      }
    `,
  });

  // Gerar PDF
  const handleGeneratePDF = async () => {
    // Se o PDF já foi gerado, apenas baixar novamente
    if (pdfGerado) {
      pdfGerado.save(
        `Relatorio_Rebanho_${new Date()
          .toLocaleDateString('pt-BR')
          .replace(/\//g, '-')}.pdf`
      );
      return;
    }

    if (!componentRef.current || !dadosRelatorio) {
      alert('Dados não disponíveis para gerar PDF');
      return;
    }

    if (generatingPDF) {
      return;
    }

    try {
      setGeneratingPDF(true);

      // Capturar o HTML como imagem
      const canvas = await html2canvas(componentRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');

      // Criar PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Calcular dimensões
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Adicionar imagem ao PDF (com múltiplas páginas se necessário)
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Salvar em cache
      setPdfGerado(pdf);

      // Baixar
      pdf.save(
        `Relatorio_Rebanho_${new Date()
          .toLocaleDateString('pt-BR')
          .replace(/\//g, '-')}.pdf`
      );
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Tente novamente.');
    } finally {
      setGeneratingPDF(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-6xl max-h-[95vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b bg-white rounded-t-2xl">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Relatório de Rebanho
              </h2>
              <p className="text-sm text-gray-500">
                {propriedadeNome || 'Propriedade'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="h-10 w-10 grid place-items-center rounded-lg border border-gray-200 hover:bg-gray-50 text-xl font-bold text-gray-600"
              aria-label="Fechar modal"
            >
              ×
            </button>
          </div>

          {/* Botões de Ação */}
          <div className="px-6 pb-4 flex gap-3 justify-end">
            <button
              onClick={handlePrint}
              disabled={loading || !dadosRelatorio}
              className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 rounded-xl border border-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Imprimir
            </button>
            <button
              onClick={handleGeneratePDF}
              disabled={loading || generatingPDF || !dadosRelatorio}
              className="flex items-center gap-2 bg-[#CE7D0A] hover:bg-[#B86D09] text-white font-medium py-2.5 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              {generatingPDF ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Gerando PDF...
                </>
              ) : pdfGerado ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Baixar Novamente
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Baixar PDF
                </>
              )}
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
          {loading && !dadosRelatorio ? (
            <div className="flex items-center justify-center h-full min-h-[400px]">
              <div className="text-center">
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-[#CE7D0A] rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="text-gray-600 font-medium">
                  Carregando dados do relatório...
                </p>
              </div>
            </div>
          ) : dadosRelatorio ? (
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <RelatorioRebanho
                  ref={componentRef}
                  data={dadosRelatorio}
                  meta={metaRelatorio}
                  propriedadeNome={propriedadeNome}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[400px]">
              <div className="text-center">
                <p className="text-gray-600 font-medium">
                  Nenhum dado disponível
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Tente novamente ou verifique se há dados para esta propriedade
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

**Funcionalidades do modal:**
- ✅ Busca automática de dados
- ✅ Preview do relatório
- ✅ Botão de impressão
- ✅ Botão de download PDF
- ✅ Cache do PDF gerado
- ✅ Loading states

---

## 🔗 Passo 4: Integrar na Página

### 4.1. Adicionar ao arquivo da página de rebanho

Edite o arquivo: `src/pages/proprietario/rebanho.js`

```javascript
// filepath: src/pages/proprietario/rebanho.js
import { useState } from 'react';
import GerarRelatorioModal from '@/components/proprietario/relatorios/GerarRelatorioModal';
import { usePropriedade } from '@/contexts/propriedadeContext';

export default function RebanhoPage() {
  const { propriedadeId, propriedadeNome } = usePropriedade();
  const [modalRelatorioOpen, setModalRelatorioOpen] = useState(false);

  return (
    <div>
      {/* Seus componentes existentes */}
      
      {/* Botão para abrir o relatório */}
      <button
        onClick={() => setModalRelatorioOpen(true)}
        className="flex items-center gap-2 bg-[#CE7D0A] hover:bg-[#B86D09] text-white font-medium py-2.5 px-4 rounded-xl transition-all"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Gerar Relatório
      </button>

      {/* Modal de Relatório */}
      <GerarRelatorioModal
        open={modalRelatorioOpen}
        onClose={() => setModalRelatorioOpen(false)}
        propriedadeId={propriedadeId}
        propriedadeNome={propriedadeNome}
      />
    </div>
  );
}
```

---

## ✅ Testando o Sistema

### Passo 1: Iniciar o servidor

```bash
npm run dev
```

### Passo 2: Acessar a página

```
http://localhost:3000/proprietario/rebanho
```

### Passo 3: Testar funcionalidades

1. **Clicar no botão "Gerar Relatório"**
   - Modal deve abrir
   - Loading deve aparecer
   - Dados devem ser carregados

2. **Testar Impressão**
   - Clicar em "Imprimir"
   - Janela de impressão deve abrir
   - Verificar preview

3. **Testar PDF**
   - Clicar em "Baixar PDF"
   - Loading deve aparecer ("Gerando PDF...")
   - PDF deve baixar automaticamente
   - Clicar novamente → Download instantâneo (sem regenerar)

---

## 🐛 Troubleshooting

### Problema: PDF não gera ou fica em branco

**Solução:**
```javascript
// Aumentar o timeout
const canvas = await html2canvas(componentRef.current, {
  scale: 2,
  useCORS: true,
  logging: true, // Ativar logs
  backgroundColor: '#ffffff',
  timeout: 5000 // Adicionar timeout
});
```

### Problema: Tabela cortada no PDF

**Solução:**
```javascript
// Ajustar escala
const canvas = await html2canvas(componentRef.current, {
  scale: 1.5, // Reduzir de 2 para 1.5
  // ...
});
```

### Problema: Erro "Cannot read property 'current' of undefined"

**Solução:**
- Verificar se `componentRef` está definido
- Confirmar que `forwardRef` está sendo usado
- Verificar se o componente está montado

### Problema: API não retorna dados

**Solução:**
```javascript
// Verificar a resposta da API
console.log('Response:', response);
console.log('Data:', response.data);
console.log('Meta:', response.meta);
```

---

## 🎨 Personalizações

### Mudar cores do tema

Edite `RelatorioRebanho.jsx`:

```javascript
// Trocar #CE7D0A (laranja) por sua cor
style={{ borderBottom: '3px solid #CE7D0A' }}
// Para
style={{ borderBottom: '3px solid #YOUR_COLOR' }}
```

### Adicionar logo da fazenda

```javascript
<header>
  <img 
    src="/logo-fazenda.png" 
    alt="Logo" 
    style={{ width: '100px', height: 'auto' }} 
  />
  <h1>Relatório de Rebanho</h1>
</header>
```

### Adicionar mais estatísticas

```javascript
const bezerros = data?.filter(b => calcularIdade(b.dt_nascimento) < 2).length || 0;

// No resumo
<div>
  <h3>Bezerros</h3>
  <p>{bezerros}</p>
</div>
```

### Filtrar dados antes de gerar

Adicione filtros no modal:

```javascript
const [filtros, setFiltros] = useState({ sexo: '', raca: '' });

// Aplicar filtros
const dadosFiltrados = dadosRelatorio?.filter(b => {
  if (filtros.sexo && b.sexo !== filtros.sexo) return false;
  if (filtros.raca && b.raca?.nome !== filtros.raca) return false;
  return true;
});
```

---

## 📚 Recursos Adicionais

### Documentação das bibliotecas

- [react-to-print](https://github.com/MatthewHerbst/react-to-print)
- [html2canvas](https://html2canvas.hertzen.com/)
- [jsPDF](https://github.com/parallax/jsPDF)

### Próximos passos

1. Adicionar mais tipos de relatórios (Lactação, Reprodução)
2. Implementar filtros avançados
3. Adicionar gráficos com Chart.js
4. Enviar relatório por email
5. Salvar histórico de relatórios

---

## 🎓 Conclusão

Parabéns! Você implementou um sistema completo de relatórios em PDF. O sistema agora permite:

✅ Gerar relatórios profissionais  
✅ Exportar para PDF  
✅ Imprimir diretamente  
✅ Visualizar preview  
✅ Cache inteligente de PDFs  

**Dúvidas?** Consulte a documentação das bibliotecas ou abra uma issue no repositório.

---

**Desenvolvido para o projeto Buffs** 🐃  
Sistema de Gestão de Bubalinos