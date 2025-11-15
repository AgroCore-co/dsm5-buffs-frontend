import React, { forwardRef } from 'react';

/**
 * Template de Relatório de Rebanho
 * Este componente renderiza o relatório para impressão/PDF
 * Primeira página: Cabeçalho + Resumo
 * Demais páginas: Cabeçalho simplificado + Dados (com margens)
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

  // Dividir dados em páginas (primeira página: 7 búfalos, demais: 12 búfalos)
  const PRIMEIRA_PAGINA_ITENS = 7;
  const PAGINAS_SEGUINTES_ITENS = 12;
  
  const dividirEmPaginas = (dados) => {
    if (!dados || dados.length === 0) return [];
    
    const paginas = [];
    let indice = 0;
    
    // Primeira página com resumo
    if (dados.length > 0) {
      paginas.push({
        numero: 1,
        dados: dados.slice(0, PRIMEIRA_PAGINA_ITENS),
        mostrarResumo: true
      });
      indice = PRIMEIRA_PAGINA_ITENS;
    }
    
    // Páginas seguintes
    let numeroPagina = 2;
    while (indice < dados.length) {
      paginas.push({
        numero: numeroPagina,
        dados: dados.slice(indice, indice + PAGINAS_SEGUINTES_ITENS),
        mostrarResumo: false
      });
      indice += PAGINAS_SEGUINTES_ITENS;
      numeroPagina++;
    }
    
    return paginas;
  };

  const paginas = dividirEmPaginas(data);

  return (
    <div ref={ref} style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#f5f5f5', width: '100%', minHeight: '100vh', padding: '20px 0' }}>
      <style>
        {`
          @page {
            size: A4 portrait;
            margin: 15mm;
          }
          
          * {
            box-sizing: border-box;
          }
          
          @media print {
            html, body {
              width: 210mm;
              height: 297mm;
              margin: 0;
              padding: 0;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            
            .page-container {
              width: 210mm;
              height: 297mm;
              padding: 15mm;
              page-break-after: always;
              page-break-inside: avoid;
              position: relative;
              box-sizing: border-box;
            }
            
            .page-container:last-child {
              page-break-after: auto;
            }
            
            .no-page-break {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            
            table {
              page-break-inside: auto;
            }
            
            tr {
              page-break-inside: avoid !important;
              page-break-after: auto;
            }
            
            thead {
              display: table-header-group;
            }
            
            tfoot {
              display: table-footer-group;
            }
          }
          
          @media screen {
            .page-container {
              width: 210mm;
              height: 297mm;
              padding: 15mm;
              margin: 0 auto 20px;
              background: white;
              box-shadow: 0 4px 12px rgba(0,0,0,0.15);
              box-sizing: border-box;
              position: relative;
            }
          }
        `}
      </style>

      {paginas.map((pagina, indexPagina) => (
        <div key={pagina.numero} className="page-container">
          {/* Container da página */}
          <div style={{ width: '100%', height: '100%' }}>
            {/* Cabeçalho */}
            <header style={{ marginBottom: pagina.mostrarResumo ? '24px' : '16px', paddingBottom: pagina.mostrarResumo ? '16px' : '12px', borderBottom: pagina.mostrarResumo ? '2px solid #CE7D0A' : '1px solid #CE7D0A' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h1 style={{ fontSize: pagina.mostrarResumo ? '28px' : '22px', fontWeight: 'bold', color: '#1f2937', marginBottom: '6px', margin: 0 }}>
                    Relatório de Rebanho
                  </h1>
                  <p style={{ fontSize: pagina.mostrarResumo ? '16px' : '14px', color: '#6b7280', margin: '6px 0 0 0' }}>
                    {propriedadeNome || 'Propriedade Rural'}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>
                    {pagina.mostrarResumo ? 'Data de Emissão' : `Página ${pagina.numero}`}
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', margin: 0 }}>{now}</p>
                </div>
              </div>
            </header>

            {/* Resumo Estatístico - Apenas na Primeira Página */}
            {pagina.mostrarResumo && (
              <section style={{ marginBottom: '32px' }} className="no-page-break">
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '12px', marginTop: 0 }}>
            Resumo do Rebanho
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {/* Total do Rebanho */}
            <div style={{ backgroundColor: '#fff', padding: '12px', borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <h3 style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', margin: 0 }}>Total do Rebanho</h3>
                <span style={{ fontSize: '10px', fontWeight: '500', color: '#43310B' }}>Ativos</span>
              </div>
              <p style={{ fontSize: '28px', fontWeight: '800', color: '#1f2937', margin: '6px 0' }}>
                {totalAtivos}
              </p>
              <p style={{ fontSize: '10px', color: '#9ca3af', marginTop: '4px', marginBottom: 0 }}>
                Búfalos ativos no sistema
              </p>
            </div>

            {/* Fêmeas */}
            <div style={{ backgroundColor: '#fff', padding: '12px', borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <h3 style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', margin: 0 }}>Fêmeas</h3>
                <span style={{ fontSize: '10px', fontWeight: '500', color: '#43310B' }}>Percentual</span>
              </div>
              <p style={{ fontSize: '28px', fontWeight: '800', color: '#1f2937', margin: '6px 0' }}>
                {femeas}
              </p>
              <p style={{ fontSize: '12px', fontWeight: '600', color: '#CE7D0A', marginTop: '4px', marginBottom: 0 }}>
                {calcPercentual(femeas, totalAtivos)}% do rebanho
              </p>
            </div>

            {/* Machos */}
            <div style={{ backgroundColor: '#fff', padding: '12px', borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <h3 style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', margin: 0 }}>Machos</h3>
                <span style={{ fontSize: '10px', fontWeight: '500', color: '#43310B' }}>Percentual</span>
              </div>
              <p style={{ fontSize: '28px', fontWeight: '800', color: '#1f2937', margin: '6px 0' }}>
                {machos}
              </p>
              <p style={{ fontSize: '12px', fontWeight: '600', color: '#CE7D0A', marginTop: '4px', marginBottom: 0 }}>
                {calcPercentual(machos, totalAtivos)}% do rebanho
              </p>
            </div>

            {/* Status Ativo */}
            <div style={{ backgroundColor: '#fff', padding: '12px', borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <h3 style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', margin: 0 }}>Status Ativo</h3>
                <span style={{ fontSize: '10px', fontWeight: '500', color: '#43310B' }}>Percentual</span>
              </div>
              <p style={{ fontSize: '28px', fontWeight: '800', color: '#1f2937', margin: '6px 0' }}>
                {ativos}
              </p>
              <p style={{ fontSize: '12px', fontWeight: '500', color: '#6b7280', marginTop: '4px', marginBottom: 0 }}>
                Em operação
              </p>
            </div>
          </div>
              </section>
            )}

            {/* Tabela de Búfalos */}
            <section style={{ marginTop: pagina.mostrarResumo ? '16px' : '0' }}>
              {pagina.mostrarResumo && (
                <div style={{ marginBottom: '12px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '6px', marginTop: 0 }}>
                    Registro de Búfalos
                  </h2>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                    Lista completa dos animais da propriedade.
                  </p>
                </div>
              )}

              <div style={{ overflowX: 'auto', width: '100%' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <thead style={{ backgroundColor: '#f3f4f6' }}>
                    <tr>
                      <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '600', color: '#1f2937', fontSize: '14px', borderBottom: '2px solid #e5e7eb' }}>Brinco</th>
                      <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '600', color: '#1f2937', fontSize: '14px', borderBottom: '2px solid #e5e7eb' }}>Nome</th>
                      <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '600', color: '#1f2937', fontSize: '14px', borderBottom: '2px solid #e5e7eb' }}>Sexo</th>
                      <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '600', color: '#1f2937', fontSize: '14px', borderBottom: '2px solid #e5e7eb' }}>Nascimento</th>
                      <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '600', color: '#1f2937', fontSize: '14px', borderBottom: '2px solid #e5e7eb' }}>Raça</th>
                      <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '600', color: '#1f2937', fontSize: '14px', borderBottom: '2px solid #e5e7eb' }}>Origem</th>
                      <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '600', color: '#1f2937', fontSize: '14px', borderBottom: '2px solid #e5e7eb' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagina.dados && pagina.dados.length > 0 ? (
                      pagina.dados.map((bufalo, index) => (
                    <tr key={bufalo.id_bufalo} style={{ backgroundColor: index % 2 === 0 ? '#fff' : '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '10px 8px', textAlign: 'center', color: '#1f2937', fontSize: '14px', fontWeight: '500' }}>
                        {bufalo.brinco}
                      </td>
                      <td style={{ padding: '10px 8px', textAlign: 'center', color: '#1f2937', fontSize: '14px' }}>
                        {bufalo.nome}
                      </td>
                      <td style={{ padding: '10px 8px', textAlign: 'center', color: '#1f2937', fontSize: '14px' }}>
                        {bufalo.sexo === 'M' ? 'Macho' : 'Fêmea'}
                      </td>
                      <td style={{ padding: '10px 8px', textAlign: 'center', color: '#1f2937', fontSize: '14px' }}>
                        {formatarData(bufalo.dt_nascimento)}
                      </td>
                      <td style={{ padding: '10px 8px', textAlign: 'center', color: '#1f2937', fontSize: '14px' }}>
                        {bufalo.raca?.nome || 'N/D'}
                      </td>
                      <td style={{ padding: '10px 8px', textAlign: 'center', color: '#1f2937', fontSize: '14px' }}>
                        {bufalo.origem}
                      </td>
                      <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                        {bufalo.status ? (
                          <span style={{ padding: '4px 8px', borderRadius: '9999px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block', minWidth: '80px', backgroundColor: '#9DFFBE', color: '#1f2937' }}>
                            Ativo
                          </span>
                        ) : (
                          <span style={{ padding: '4px 8px', borderRadius: '9999px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block', minWidth: '80px', backgroundColor: '#fecaca', color: '#991b1b' }}>
                            Inativo
                          </span>
                        )}

                      </td>
                    </tr>
                  ))
                      ) : (
                        <tr>
                          <td colSpan="7" style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>
                            Nenhum búfalo encontrado
                          </td>
                        </tr>
                      )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Footer - Apenas na última página */}
            {indexPagina === paginas.length - 1 && (
              <footer style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
                <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>
                  Gerado automaticamente pelo sistema Buffs — {now}
                </p>
              </footer>
            )}
          </div>
        </div>
      ))}
    </div>
  );
});

RelatorioRebanho.displayName = 'RelatorioRebanho';

export default RelatorioRebanho;
