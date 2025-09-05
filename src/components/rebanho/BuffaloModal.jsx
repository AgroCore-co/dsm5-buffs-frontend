"use client";

import React, { useEffect, useState, useCallback } from "react";
import GenealogyTree from "./GenealogyTree";
import { useAuth } from "@/hooks/useAuth";
import bufaloService from "@/services/bufaloService";

export default function BuffaloModal({
  open,
  buffalo,
  onClose,
  getStatusColor,
  getSexIcon,
}) {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState("info");
  const [bufaloDetalhado, setBufaloDetalhado] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  // reset de abas ao abrir/trocar animal
  useEffect(() => {
    if (open) {
      setActiveTab("info");
    }
  }, [open, buffalo]);

  // Buscar dados detalhados do búfalo quando o modal for aberto
  useEffect(() => {
    if (open && buffalo?.id_bufalo && token) {
      const fetchBufaloDetalhes = async () => {
        try {
          setCarregando(true);
          setErro(null);
          console.log(`Buscando detalhes do búfalo com ID: ${buffalo.id_bufalo}`);
          const bufaloData = await bufaloService.getBufaloById(buffalo.id_bufalo, token);
          setBufaloDetalhado(bufaloData);
          console.log("Detalhes do búfalo obtidos com sucesso:", bufaloData);
        } catch (error) {
          console.error(`Erro ao buscar detalhes do búfalo ID ${buffalo.id_bufalo}:`, error);
          setErro(`Não foi possível carregar os detalhes do búfalo: ${error.message}`);
        } finally {
          setCarregando(false);
        }
      };

      fetchBufaloDetalhes();
    } else {
      setBufaloDetalhado(null);
    }
  }, [open, buffalo, token]);

  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  const stop = useCallback((e) => e.stopPropagation(), []);
  if (!open || !buffalo) return null;
  
  // Usar dados detalhados se disponíveis, senão usar os dados originais
  const bufaloData = bufaloDetalhado || buffalo;

  return (
    <div
      className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/45 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-[min(96vw,1200px)] max-h-[92vh] bg-white rounded-3xl shadow-2xl ring-1 ring-gray-200 flex flex-col overflow-hidden"
        onClick={stop}
      >
        {/* Header (sticky) */}
        <div className="sticky top-0 z-10 border-b bg-white rounded-t-3xl">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-start gap-4">
              {carregando ? (
                <div className="flex items-center justify-center p-4">
                  <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mr-2"></div>
                  <p>Carregando detalhes...</p>
                </div>
              ) : erro ? (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 w-full">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Erro ao carregar dados</h3>
                      <p className="mt-1 text-sm text-red-700">{erro}</p>
                      <p className="mt-2 text-xs text-red-600">Tente fechar e abrir novamente o modal ou atualize a página.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
                      Prontuário • {bufaloData.nome}
                    </h2>
                    <span
                      className={`text-xs px-2 py-1 rounded-full uppercase tracking-wide ${getStatusColor(
                        typeof bufaloData.status === "boolean" ? (bufaloData.status ? "Ativo" : "Inativo") : bufaloData.status
                      )}`}
                    >
                      {typeof bufaloData.status === "boolean" ? (bufaloData.status ? "Ativo" : "Inativo") : bufaloData.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Brinco: {bufaloData.brinco || "N/A"} • {getSexIcon(bufaloData.sexo === "F" ? "Fêmea" : "Macho")} {bufaloData.sexo === "F" ? "Fêmea" : "Macho"}{" "}
                    • {buffalo.raca || "N/A"} • ID: {bufaloData.id || bufaloData.id_bufalo}
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="h-10 w-10 grid place-items-center rounded-xl border border-gray-200 hover:bg-gray-50 text-xl font-bold text-gray-600"
              aria-label="Fechar modal"
            >
              ×
            </button>
          </div>

          {/* Abas */}
          <div className="flex gap-1 px-3 pb-3">
            {[
              { id: "info", label: "Resumo" },
              { id: "zootecnicos", label: "Zootécnicos" },
              { id: "saude", label: "Saúde" },
              { id: "sanitarios", label: "Sanitários" },
              { id: "genealogia", label: "Genealogia" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border
                  ${
                    activeTab === tab.id
                      ? "bg-amber-50 text-amber-900 border-amber-200 shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-transparent"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Conteúdo com rolagem */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Resumo com dados básicos */}
          {activeTab === "info" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Coluna principal - 2/3 do espaço */}
              <div className="lg:col-span-2 space-y-6">
                {/* Dados Básicos */}
                <div className="relative rounded-xl border border-gray-200 bg-white">
                  <div className="absolute left-0 top-0 h-full w-1.5 bg-amber-400 rounded-l-xl" />
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Dados Básicos
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">ID</span>
                        <span className="font-medium">{bufaloData.id || bufaloData.id_bufalo}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Nome</span>
                        <span className="font-medium">{bufaloData.nome}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Brinco</span>
                        <span className="font-medium">{bufaloData.brinco || "N/A"}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Sexo</span>
                        <span className="font-medium">{bufaloData.sexo === "F" ? "Fêmea" : "Macho"}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Raça</span>
                        <span className="font-medium">{buffalo.raca || "N/A"}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Maturidade</span>
                        <span className="font-medium">
                          {bufaloData.nivel_maturidade === "V" ? "Vaca" : 
                           bufaloData.nivel_maturidade === "B" ? "Bezerra" : 
                           bufaloData.nivel_maturidade === "N" ? "Novilha" : 
                           bufaloData.nivel_maturidade || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Categoria</span>
                        <span className="font-medium">{bufaloData.categoria || "N/A"}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Status</span>
                        <span className="font-medium">
                          {typeof bufaloData.status === "boolean" ? (bufaloData.status ? "Ativo" : "Inativo") : bufaloData.status || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Nascimento</span>
                        <span className="font-medium">
                          {bufaloData.dt_nascimento ? new Date(bufaloData.dt_nascimento).toLocaleDateString('pt-BR') : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Origem</span>
                        <span className="font-medium">
                          {bufaloData.origem === "N" ? "Nascimento" : 
                           bufaloData.origem === "C" ? "Compra" : 
                           bufaloData.origem === "D" ? "Doação" : 
                           bufaloData.origem || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dados Complementares */}
                <div className="relative rounded-xl border border-gray-200 bg-white">
                  <div className="absolute left-0 top-0 h-full w-1.5 bg-purple-400 rounded-l-xl" />
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Dados Complementares
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Data de Baixa</span>
                        <span className="font-medium">
                          {bufaloData.data_baixa ? new Date(bufaloData.data_baixa).toLocaleDateString('pt-BR') : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Motivo Inativo</span>
                        <span className="font-medium">{bufaloData.motivo_inativo || "N/A"}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Brinco Original</span>
                        <span className="font-medium">{bufaloData.brinco_original || "N/A"}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Registro Provisório</span>
                        <span className="font-medium">{bufaloData.registro_prov || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coluna lateral - 1/3 do espaço */}
              <div className="lg:col-span-1 space-y-6">
                {/* Informações do Sistema */}
                <div className="relative rounded-xl border border-gray-200 bg-white">
                  <div className="absolute left-0 top-0 h-full w-1.5 bg-blue-400 rounded-l-xl" />
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Informações do Sistema
                    </h3>
                    <div className="grid grid-cols-1 gap-4 text-sm">
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">ID da Raça</span>
                        <span className="font-medium">{bufaloData.id_raca || "N/A"}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">ID Propriedade</span>
                        <span className="font-medium">{bufaloData.id_propriedade || "N/A"}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">ID Grupo</span>
                        <span className="font-medium">{bufaloData.id_grupo || "N/A"}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Criado em</span>
                        <span className="font-medium">
                          {bufaloData.created_at ? new Date(bufaloData.created_at).toLocaleDateString('pt-BR') : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Última Atualização</span>
                        <span className="font-medium">
                          {bufaloData.updated_at ? new Date(bufaloData.updated_at).toLocaleDateString('pt-BR') : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informações de Genealogia */}
                <div className="relative rounded-xl border border-gray-200 bg-white">
                  <div className="absolute left-0 top-0 h-full w-1.5 bg-emerald-400 rounded-l-xl" />
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Informações de Genealogia
                    </h3>
                    <div className="grid grid-cols-1 gap-4 text-sm">
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">ID do Pai</span>
                        <span className="font-medium">{bufaloData.id_pai || "N/A"}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">ID da Mãe</span>
                        <span className="font-medium">{bufaloData.id_mae || "N/A"}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Registro Definitivo</span>
                        <span className="font-medium">{bufaloData.registro_def || "N/A"}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Microchip</span>
                        <span className="font-medium">{bufaloData.microchip || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Abas adicionais sem conteúdo */}
          {(activeTab === "zootecnicos" || activeTab === "saude" || activeTab === "sanitarios") && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center p-6 max-w-md">
                <div className="mb-4 text-amber-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Dados não disponíveis</h3>
                <p className="text-gray-500">
                  Esta seção será implementada em breve. Por enquanto, consulte as informações básicas na aba "Resumo".
                </p>
              </div>
            </div>
          )}

          {/* Genealogia */}
          {activeTab === "genealogia" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Árvore Genealógica
                    </h3>
                    <p className="text-sm text-gray-500">
                      {bufaloData.nome}
                    </p>
                  </div>
                </div>

                {/* GenealogyTree recebe o búfalo atual e dados básicos dos antepassados */}
                <GenealogyTree
                  current={{
                    nome: bufaloData.nome,
                    tag: bufaloData.brinco || "N/A",
                    raca: buffalo.raca || "N/A",
                    maturidade: bufaloData.nivel_maturidade || "N/A",
                    sexo: bufaloData.sexo === "F" ? "Fêmea" : "Macho",
                  }}
                  parents={{
                    pai: {
                      nome: bufaloData.id_pai ? `ID: ${bufaloData.id_pai}` : "—",
                      raca: "N/A",
                      risk: "low",
                    },
                    mae: {
                      nome: bufaloData.id_mae ? `ID: ${bufaloData.id_mae}` : "—",
                      raca: "N/A",
                      risk: "low",
                    },
                  }}
                  grandparents={{
                    avoPai: {
                      nome: "—",
                      raca: "—",
                      risk: "low",
                    },
                    avoPaiF: {
                      nome: "—",
                      raca: "—",
                      risk: "low",
                    },
                    avoMae: {
                      nome: "—",
                      raca: "—",
                      risk: "low",
                    },
                    avoMaeF: {
                      nome: "—",
                      raca: "—",
                      risk: "low",
                    },
                  }}
                  greatGrandparents={{
                    bisavoP1: { nome: "—", raca: "—", risk: "low" },
                    bisavoP2: { nome: "—", raca: "—", risk: "low" },
                    bisavoM1: { nome: "—", raca: "—", risk: "low" },
                    bisavoM2: { nome: "—", raca: "—", risk: "low" },
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
