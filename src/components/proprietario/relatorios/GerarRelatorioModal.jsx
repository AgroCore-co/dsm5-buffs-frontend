import React, { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import RelatorioRebanho from "./RelatorioRebanho";
import relatorioService from "@/services/relatorioService";

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
  const [pdfGerado, setPdfGerado] = useState(null); // Cache do PDF
  const componentRef = useRef();

  // Buscar dados para o relatório
  const buscarDados = async () => {
    if (!propriedadeId) {
      alert("Nenhuma propriedade selecionada");
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
      console.error("Erro ao buscar dados do relatório:", error);
      alert("Erro ao carregar dados do relatório. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados quando o modal abrir
  React.useEffect(() => {
    if (open && propriedadeId) {
      buscarDados();
    } else {
      // Limpar dados quando fechar
      setDadosRelatorio(null);
      setMetaRelatorio(null);
      setPdfGerado(null); // Limpar cache do PDF
    }
  }, [open, propriedadeId]);

  // Configurar impressão
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Relatorio_Rebanho_${new Date()
      .toLocaleDateString("pt-BR")
      .replace(/\//g, "-")}`,
    pageStyle: `
      @page {
        size: A4 portrait;
        margin: 20mm 15mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      }
    `,
    onPrintError: (error) => {
      console.error("Erro ao imprimir:", error);
      alert("Erro ao abrir impressão. Verifique o console para mais detalhes.");
    },
  });

  // Gerar PDF
  const handleGeneratePDF = async () => {
    // Se o PDF já foi gerado, apenas baixar novamente
    if (pdfGerado) {
      pdfGerado.save(
        `Relatorio_Rebanho_${new Date()
          .toLocaleDateString("pt-BR")
          .replace(/\//g, "-")}.pdf`
      );
      return;
    }

    if (!componentRef.current || !dadosRelatorio) {
      alert("Dados não disponíveis para gerar PDF");
      return;
    }

    if (generatingPDF) {
      return; // Previne múltiplas gerações simultâneas
    }

    try {
      setGeneratingPDF(true);

      // Pegar todas as páginas individuais
      const pages = componentRef.current.querySelectorAll(".page-container");

      if (pages.length === 0) {
        alert("Nenhuma página encontrada para gerar PDF");
        return;
      }

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Processar cada página individualmente
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];

        // Capturar a página individual com alta qualidade
        const canvas = await html2canvas(page, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
          width: page.scrollWidth,
          height: page.scrollHeight,
        });

        const imgData = canvas.toDataURL("image/png");

        // Adicionar nova página (exceto para a primeira)
        if (i > 0) {
          pdf.addPage();
        }

        // Dimensões A4 em mm
        const pageWidth = 210;
        const pageHeight = 297;

        // Adicionar a imagem ocupando toda a página A4
        pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight, "", "FAST");
      }

      // Salvar o PDF em cache
      setPdfGerado(pdf);

      // Baixar o PDF
      pdf.save(
        `Relatorio_Rebanho_${new Date()
          .toLocaleDateString("pt-BR")
          .replace(/\//g, "-")}.pdf`
      );
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Erro ao gerar PDF. Tente novamente.");
    } finally {
      setGeneratingPDF(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/45 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-[min(96vw,1200px)] max-h-[95vh] bg-white rounded-3xl shadow-2xl ring-1 ring-gray-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b bg-white rounded-t-3xl">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-start gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
                    Relatório de Rebanho
                  </h2>
                </div>
                <p className="text-sm text-gray-500">
                  {propriedadeNome || "Propriedade"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="h-10 w-10 grid place-items-center rounded-xl border border-gray-200 hover:bg-gray-50 text-xl font-bold text-gray-600"
              aria-label="Fechar modal"
            >
              ×
            </button>
          </div>

          {/* Botões de Ação */}
          <div className="px-6 pb-4 flex gap-3 justify-end">
            <button
              onClick={handleGeneratePDF}
              disabled={loading || generatingPDF || !dadosRelatorio}
              className="flex items-center gap-2 bg-[#CE7D0A] hover:bg-[#B86D09] text-white font-medium py-2.5 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              {generatingPDF ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Gerando PDF...
                </>
              ) : pdfGerado ? (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Baixar Novamente
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Baixar PDF
                </>
              )}
            </button>
          </div>
        </div>

        {/* Conteúdo do Relatório */}
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
              <div className="relative rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="absolute left-0 top-0 h-full w-1.5 bg-[#CE7D0A] rounded-l-xl" />
                <div className="bg-white rounded-lg shadow-lg">
                  <RelatorioRebanho
                    ref={componentRef}
                    data={dadosRelatorio}
                    meta={metaRelatorio}
                    propriedadeNome={propriedadeNome}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[400px]">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
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
