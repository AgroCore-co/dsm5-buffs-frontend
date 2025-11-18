"use client";

import React, { useEffect, useState } from "react";
import { 
  X, 
  Calendar, 
  Syringe, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Info
} from "lucide-react";

// --- MOCK DO SERVIÇO (Para visualização funcional) ---
// Em seu projeto real, você pode remover isso e descomentar o import abaixo
// import coberturaService from "@/services/coberturaService";

const mockCoberturaService = {
  getCoberturaById: (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: id,
          status: "Confirmada", // Tente mudar para "Falha" ou "Aguardando"
          dt_evento: "2023-10-15T10:30:00",
          tipo_inseminacao: "Inseminação Artificial (IATF)",
          brinco_femea: "5028",
          brinco_macho: "Touro Bravo 01",
          tipo_parto: "Normal",
          ocorrencia: "Nenhuma observação anormal registrada.",
          created_at: "2023-10-15T10:35:00",
          updated_at: "2023-12-20T14:20:00"
        });
      }, 800); // Simula delay de rede
    });
  }
};

export default function CoberturaModal({ open = true, onClose, idCobertura = 1 }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cobertura, setCobertura] = useState(null);

  // Ícones SVG Inline para Gênero (para garantir disponibilidade sem dependências extras)
  const IconVenus = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 15v7M9 19h6M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>
    </svg>
  );

  const IconMars = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 3h5v5M21 3l-5.5 5.5M10 11a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/>
    </svg>
  );

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError(null);
    
    // Usando o mock service aqui. No real, use: coberturaService.getCoberturaById(idCobertura)
    mockCoberturaService.getCoberturaById(idCobertura)
      .then((data) => {
        setCobertura(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Erro ao buscar dados da cobertura.");
        setLoading(false);
      });
  }, [open, idCobertura]);

  if (!open) return null;

  // Formatação de data auxiliar
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR') + ' às ' + new Date(dateString).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  // Helper para cor do status
  const getStatusColor = (status) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('confirmada') || s.includes('prenhez')) return 'bg-green-100 text-green-800 border-green-200';
    if (s.includes('falha') || s.includes('negativa') || s.includes('aborto')) return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  // --- RENDERIZAÇÃO DO LOADING ---
  if (loading) {
    return (
      <div
        className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/45 backdrop-blur-sm p-4"
        role="dialog"
        aria-modal="true"
      >
        <div className="w-[min(96vw,800px)] max-h-[92vh] bg-white rounded-3xl shadow-2xl ring-1 ring-gray-200 flex flex-col overflow-hidden">
          <div className="flex items-center justify-center p-12">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#CE7D0A]"></div>
              <div className="text-gray-600 font-medium">Carregando detalhes da cobertura...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDERIZAÇÃO DO ERRO ---
  if (error || !cobertura) {
    return (
      <div
        className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/45 backdrop-blur-sm p-4"
        role="dialog"
        aria-modal="true"
      >
        <div className="w-[min(96vw,800px)] max-h-[92vh] bg-white rounded-3xl shadow-2xl ring-1 ring-gray-200 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-xl font-bold text-gray-900">Erro</h2>
            <button
              onClick={onClose}
              className="h-10 w-10 grid place-items-center rounded-xl border border-gray-200 hover:bg-gray-50 text-xl font-bold text-gray-600"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex items-center justify-center p-8">
            <div className="text-red-500 font-medium bg-red-50 px-4 py-3 rounded-lg border border-red-100 flex items-center gap-2">
              <AlertCircle size={20} />
              {error || "Dados não encontrados."}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDERIZAÇÃO DO CONTEÚDO PRINCIPAL ---
  return (
    <div
      className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/45 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Container Principal */}
      <div className="w-[min(96vw,800px)] max-h-[95vh] bg-white rounded-3xl shadow-2xl ring-1 ring-gray-200 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="sticky top-0 z-10 border-b bg-white rounded-t-3xl">
          <div className="flex items-center justify-between px-6 py-5">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
                  Detalhes da Cobertura
                </h2>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Visualizando registro ID: #{idCobertura}
              </p>
            </div>
            <button
              onClick={onClose}
              className="h-10 w-10 grid place-items-center rounded-xl border border-gray-200 hover:bg-gray-50 text-xl font-bold text-gray-600 transition-colors"
              aria-label="Fechar modal"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Conteúdo Scrollável */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Card Principal */}
            <div className="relative rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              {/* Faixa lateral colorida */}
              <div className="absolute left-0 top-0 h-full w-1.5 bg-[#CE7D0A]" />
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Calendar className="text-[#CE7D0A]" size={20} />
                    Dados do Evento
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getStatusColor(cobertura.status)}`}>
                    {cobertura.status || "Não informado"}
                  </span>
                </div>

                {/* Grid de Informações Principais */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Data e Tipo */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Data do Evento</span>
                      <div className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        {formatDate(cobertura.dt_evento)}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Tipo de Inseminação</span>
                      <div className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Syringe className="text-gray-400" size={18} />
                        {cobertura.tipo_inseminacao || "-"}
                      </div>
                    </div>
                  </div>

                  {/* Matriz e Touro */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-pink-50 to-white p-4 rounded-lg border border-pink-100">
                      <span className="text-xs font-semibold text-pink-700 uppercase tracking-wide block mb-1">Matriz (Fêmea)</span>
                      <div className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
                          <IconVenus className="w-4 h-4" />
                        </div>
                        {cobertura.brinco_femea || "Não identificado"}
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg border border-blue-100">
                      <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide block mb-1">Touro (Macho)</span>
                      <div className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <IconMars className="w-4 h-4" />
                        </div>
                        {cobertura.brinco_macho || "Não identificado"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card de Resultados/Detalhes Adicionais */}
            {(cobertura.tipo_parto || cobertura.ocorrencia) && (
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="text-gray-400" size={20} />
                  Resultado e Ocorrências
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                     <span className="text-sm font-medium text-gray-500 block">Tipo de Parto</span>
                     <p className="text-base font-semibold text-gray-900 mt-1">{cobertura.tipo_parto || "-"}</p>
                  </div>
                  <div>
                     <span className="text-sm font-medium text-gray-500 block">Ocorrência</span>
                     <p className="text-base font-semibold text-gray-900 mt-1">{cobertura.ocorrencia || "-"}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Metadata Footer */}
            <div className="flex flex-col sm:flex-row gap-4 text-xs text-gray-400 px-2">
              <div className="flex items-center gap-1">
                <Clock size={12} /> Criado em: {formatDateTime(cobertura.created_at)}
              </div>
              <div className="hidden sm:block">•</div>
              <div className="flex items-center gap-1">
                <Clock size={12} /> Atualizado em: {formatDateTime(cobertura.updated_at)}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}