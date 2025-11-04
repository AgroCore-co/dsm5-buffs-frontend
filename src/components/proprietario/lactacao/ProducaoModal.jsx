"use client";

import React, { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaTint,
  FaChartLine,
  FaHistory,
  FaClock,
} from "react-icons/fa";
import lactacaoService from "@/services/lactacaoService";

export default function ProducaoModal({ open, onClose, idBufala }) {
  const [producaoData, setProducaoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && idBufala) {
      setLoading(true);
      setError(null);
      lactacaoService
        .buscarResumoProducaoPorBufala(idBufala)
        .then((data) => {
          console.log('📊 Dados de produção recebidos:', data);
          setProducaoData(data);
        })
        .catch((error) => {
          console.error("Erro ao buscar resumo de produção:", error);
          setError("Não foi possível carregar os dados de produção.");
        })
        .finally(() => setLoading(false));
    }
  }, [open, idBufala]);

  if (!open) return null;

  if (loading) {
    return (
      <div
        className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/45 backdrop-blur-sm p-4"
        role="dialog"
        aria-modal="true"
      >
        <div className="w-[min(96vw,1200px)] max-h-[92vh] bg-white rounded-3xl shadow-2xl ring-1 ring-gray-200 flex flex-col overflow-hidden">
          <div className="flex items-center justify-center p-6">
            <div className="text-gray-600">Carregando dados de produção...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !producaoData) {
    return (
      <div
        className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/45 backdrop-blur-sm p-4"
        role="dialog"
        aria-modal="true"
      >
        <div className="w-[min(96vw,1200px)] max-h-[92vh] bg-white rounded-3xl shadow-2xl ring-1 ring-gray-200 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-xl font-bold text-gray-900">Erro</h2>
            <button
              onClick={onClose}
              className="h-10 w-10 grid place-items-center rounded-xl border border-gray-200 hover:bg-gray-50 text-xl font-bold text-gray-600"
              aria-label="Fechar modal"
            >
              ×
            </button>
          </div>
          <div className="flex items-center justify-center p-6">
            <div className="text-red-500">{error || "Erro ao carregar dados."}</div>
          </div>
        </div>
      </div>
    );
  }

  const { bufala, ciclo_atual, comparativo_ciclos, grafico_producao } = producaoData;

  // Formatar data para exibição
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

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
                    Resumo de Produção • {bufala.nome}
                  </h2>
                </div>
                <p className="text-sm text-gray-500">
                  Brinco: {bufala.brinco}
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
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6">
            <div className="max-w-6xl mx-auto space-y-6">
            {/* Ciclo Atual */}
            <div className="relative rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="absolute left-0 top-0 h-full w-1.5 bg-[#CE7D0A] rounded-l-xl" />
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Ciclo Atual de Lactação
                </h3>
                
                {/* Indicadores principais */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Ciclo Nº</span>
                    <p className="text-2xl font-bold text-[#CE7D0A] mt-1">{ciclo_atual.numero_ciclo}</p>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Dias em Lactação</span>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{ciclo_atual.dias_em_lactacao}</p>
                    <span className="text-xs text-gray-500 mt-0.5 block">dias</span>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Produzido</span>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{ciclo_atual.total_produzido.toFixed(2)}</p>
                    <span className="text-xs text-gray-500 mt-0.5 block">litros</span>
                  </div>
                </div>

                {/* Detalhes do Ciclo Atual */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Informações Detalhadas</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-[#CE7D0A] rounded-full mt-2"></div>
                      <div className="flex-1">
                        <span className="text-xs font-medium text-gray-500 block">Data do Parto</span>
                        <span className="text-sm font-semibold text-gray-900">{formatDate(ciclo_atual.dt_parto)}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-[#CE7D0A] rounded-full mt-2"></div>
                      <div className="flex-1">
                        <span className="text-xs font-medium text-gray-500 block">Previsão de Secagem</span>
                        <span className="text-sm font-semibold text-gray-900">{formatDate(ciclo_atual.dt_secagem_prevista)}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-[#CE7D0A] rounded-full mt-2"></div>
                      <div className="flex-1">
                        <span className="text-xs font-medium text-gray-500 block">Média Diária</span>
                        <span className="text-sm font-semibold text-gray-900">{ciclo_atual.media_diaria.toFixed(2)} L/dia</span>
                      </div>
                    </div>
                    {ciclo_atual.ultima_ordenha && (
                      <div className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-[#CE7D0A] rounded-full mt-2"></div>
                        <div className="flex-1">
                          <span className="text-xs font-medium text-gray-500 block">Última Ordenha</span>
                          <span className="text-sm font-semibold text-gray-900">
                            {formatDate(ciclo_atual.ultima_ordenha.data)} • {ciclo_atual.ultima_ordenha.quantidade.toFixed(2)} L
                          </span>
                          <span className="inline-block mt-1 text-xs bg-white px-2 py-1 rounded border border-gray-200 font-medium text-gray-700">
                            {ciclo_atual.ultima_ordenha.periodo === 'M' ? 'Manhã' : ciclo_atual.ultima_ordenha.periodo === 'T' ? 'Tarde' : 'Noite'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Histórico de Ciclos */}
            {comparativo_ciclos && comparativo_ciclos.length > 0 && (
              <div className="relative rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="absolute left-0 top-0 h-full w-1.5 bg-purple-400 rounded-l-xl" />
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Histórico de Ciclos Anteriores
                  </h3>

                  {/* Estatísticas Resumidas */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                      <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Melhor Produção Total</span>
                      <p className="text-xl font-bold text-blue-900 mt-1">
                        {Math.max(...comparativo_ciclos.map(c => c.total_produzido)).toFixed(2)} L
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                      <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">Melhor Média Diária</span>
                      <p className="text-xl font-bold text-green-900 mt-1">
                        {Math.max(...comparativo_ciclos.map(c => c.media_diaria)).toFixed(2)} L/dia
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                      <span className="text-xs font-semibold text-purple-700 uppercase tracking-wide">Ciclo Mais Longo</span>
                      <p className="text-xl font-bold text-purple-900 mt-1">
                        {Math.max(...comparativo_ciclos.map(c => c.duracao_dias))} dias
                      </p>
                    </div>
                  </div>

                  {/* Tabela de Ciclos */}
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full border-collapse bg-white">
                      <thead>
                        <tr className="bg-gray-100 border-b border-gray-200">
                          <th className="p-2.5 text-left font-semibold text-gray-700 text-xs">Ciclo</th>
                          <th className="p-2.5 text-left font-semibold text-gray-700 text-xs">Data Parto</th>
                          <th className="p-2.5 text-left font-semibold text-gray-700 text-xs">Data Secagem</th>
                          <th className="p-2.5 text-center font-semibold text-gray-700 text-xs">Duração</th>
                          <th className="p-2.5 text-right font-semibold text-gray-700 text-xs">Total Produzido</th>
                          <th className="p-2.5 text-right font-semibold text-gray-700 text-xs">Média Diária</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparativo_ciclos.map((ciclo, idx) => (
                          <tr key={ciclo.numero_ciclo} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? "" : "bg-gray-50/50"}`}>
                            <td className="p-2.5 text-gray-900 text-xs font-semibold">
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#CE7D0A] text-white text-xs font-bold">
                                {ciclo.numero_ciclo}
                              </span>
                            </td>
                            <td className="p-2.5 text-gray-800 text-xs">{formatDate(ciclo.dt_parto)}</td>
                            <td className="p-2.5 text-gray-800 text-xs">{formatDate(ciclo.dt_secagem)}</td>
                            <td className="p-2.5 text-center text-gray-900 text-xs font-medium">
                              <span className="inline-block bg-gray-100 px-2 py-0.5 rounded text-xs">{ciclo.duracao_dias} dias</span>
                            </td>
                            <td className="p-2.5 text-right text-gray-900 text-xs font-bold">{ciclo.total_produzido.toFixed(2)} L</td>
                            <td className="p-2.5 text-right text-gray-700 text-xs font-medium">{ciclo.media_diaria.toFixed(2)} L/dia</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Gráfico de Produção - Placeholder */}
            {grafico_producao && grafico_producao.length > 0 && (
              <div className="relative rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="absolute left-0 top-0 h-full w-1.5 bg-blue-400 rounded-l-xl" />
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Gráfico de Produção Diária
                  </h3>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100/30 border border-blue-200 rounded-lg p-6 text-center">
                    <FaChartLine className="text-blue-400 text-3xl mx-auto mb-3" />
                    <p className="text-gray-700 font-medium text-sm">Gráfico de produção diária será implementado aqui</p>
                    <p className="text-xs text-gray-500 mt-2">
                      <span className="inline-block bg-white px-2.5 py-1 rounded-full border border-blue-200 font-semibold text-blue-700">
                        {grafico_producao.length} registros disponíveis
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
