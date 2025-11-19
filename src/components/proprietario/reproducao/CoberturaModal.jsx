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

// --- SERVIÇO REAL ---
import coberturaService from "@/services/coberturaService";
import bufaloService from "@/services/bufaloService";

export default function CoberturaModal({ open = true, onClose, idCobertura = 1 }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cobertura, setCobertura] = useState(null);
  const [bufala, setBufala] = useState(null);
  const [bufalo, setBufalo] = useState(null);

  // Ícones SVG Inline para Gênero
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
    setBufala(null);
    setBufalo(null);
    
    coberturaService.getCoberturaById(idCobertura)
      .then(async (data) => {
        setCobertura(data);
        // Busca os dados completos dos búfalos
        try {
          const [bufalaData, bufaloData] = await Promise.all([
            data.id_bufala ? bufaloService.buscarBufaloPorId(data.id_bufala) : null,
            data.id_bufalo ? bufaloService.buscarBufaloPorId(data.id_bufalo) : null,
          ]);
          setBufala(bufalaData);
          setBufalo(bufaloData);
        } catch {
          // Se falhar, mostra erro mas continua exibindo cobertura
        }
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
      {/* Container Principal AUMENTADO para 1100px */}
      <div className="w-[min(96vw,1100px)] max-h-[95vh] bg-white rounded-3xl shadow-2xl ring-1 ring-gray-200 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="sticky top-0 z-10 border-b bg-white rounded-t-3xl">
          <div className="flex items-center justify-between px-6 py-5">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
                  Detalhes da Cobertura
                </h2>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wide ${getStatusColor(cobertura.status)}`}>
                  {cobertura.status || "Status Pendente"}
                </span>
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

        {/* Conteúdo Scrollável com GRID Horizontal */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* COLUNA ESQUERDA (Evento) - Ocupa 4 colunas */}
            <div className="lg:col-span-4 space-y-6">
              <div className="relative rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="absolute left-0 top-0 h-full w-1.5 bg-[#CE7D0A]" />
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                    <Calendar className="text-[#CE7D0A]" size={20} />
                    Dados do Evento
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Data</span>
                      <div className="text-xl font-bold text-gray-900">{formatDate(cobertura.dt_evento)}</div>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Tipo Inseminação</span>
                      <div className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Syringe className="text-gray-400" size={16} />
                        {cobertura.tipo_inseminacao || "-"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card de Resultados (Agora na esquerda) */}
              {(cobertura.tipo_parto || cobertura.ocorrencia) && (
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="text-gray-400" size={20} />
                    Resultados
                  </h3>
                  <div className="space-y-3">
                    {cobertura.tipo_parto && (
                      <div>
                        <span className="text-xs font-medium text-gray-500 block uppercase">Tipo de Parto</span>
                        <p className="text-base font-semibold text-gray-900">{cobertura.tipo_parto}</p>
                      </div>
                    )}
                    {cobertura.ocorrencia && (
                      <div>
                        <span className="text-xs font-medium text-gray-500 block uppercase">Ocorrência</span>
                        <p className="text-base font-semibold text-gray-900">{cobertura.ocorrencia}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* COLUNA DIREITA (Pais) - Ocupa 8 colunas */}
            <div className="lg:col-span-8">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                Genealogia do Evento
              </h3>
              
              {/* REMOVIDO 'h-full' aqui para não esticar a grade inteira até o fundo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Card Fêmea Unificado - REMOVIDO 'h-full' e 'flex-1' */}
                <div className="bg-pink-50 p-5 rounded-xl border border-pink-100 flex flex-col">
                  <div className="flex items-center gap-3 mb-4 border-b border-pink-200/50 pb-3">
                     <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-pink-600 shadow-sm">
                        <IconVenus className="w-5 h-5" />
                     </div>
                     <div>
                        <span className="text-xs font-bold text-pink-700 uppercase block">Matriz (Mãe)</span>
                        <div className="text-lg font-bold text-gray-900 leading-tight">
                          {bufala?.nome || cobertura.brinco_femea || "Não identificado"}
                        </div>
                     </div>
                  </div>
                  
                  <div className="space-y-2">
                    <InfoLine label="Brinco" value={bufala?.brinco || cobertura.brinco_femea} />
                    <InfoLine label="Raça" value={bufala?.raca?.nome} />
                    <InfoLine label="Nascimento" value={formatDate(bufala?.dt_nascimento)} />
                    <InfoLine label="Propriedade" value={bufala?.propriedade?.nome} />
                  </div>
                </div>

                {/* Card Macho Unificado - REMOVIDO 'h-full' e 'flex-1' */}
                <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 flex flex-col">
                  <div className="flex items-center gap-3 mb-4 border-b border-blue-200/50 pb-3">
                     <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-sm">
                        <IconMars className="w-5 h-5" />
                     </div>
                     <div>
                        <span className="text-xs font-bold text-blue-700 uppercase block">Touro (Pai)</span>
                        <div className="text-lg font-bold text-gray-900 leading-tight">
                          {bufalo?.nome || cobertura.brinco_macho || "Não identificado"}
                        </div>
                     </div>
                  </div>

                  <div className="space-y-2">
                    <InfoLine label="Brinco" value={bufalo?.brinco || cobertura.brinco_macho} />
                    <InfoLine label="Raça" value={bufalo?.raca?.nome} />
                    <InfoLine label="Nascimento" value={formatDate(bufalo?.dt_nascimento)} />
                    <InfoLine label="Propriedade" value={bufalo?.propriedade?.nome} />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// Pequeno componente auxiliar para manter o código limpo
function InfoLine({ label, value }) {
  return (
    <div className="flex justify-between border-b border-black/5 pb-1 last:border-0">
      <span className="text-sm text-gray-600">{label}:</span>
      <span className="text-sm font-medium text-gray-900 text-right">{value || "-"}</span>
    </div>
  );
}