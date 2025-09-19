"use client";

import React, { useEffect, useState, useCallback } from "react";
import GenealogyTree from "./GenealogyTree";
import { useAuth } from "@/hooks/useAuth";
import bufaloService from "@/services/bufaloService";
import dadosZootecnicosService from "@/services/dadosZootecnicosService";
import dadosSanitariosService from "@/services/dadosSanitariosService";

export default function BuffaloModal({
  open,
  buffalo,
  onClose,
  getStatusColor,
  getSexIcon,
}) {
  const { token, getAccessToken } = useAuth();
  const [activeTab, setActiveTab] = useState("info");
  const [bufaloDetalhado, setBufaloDetalhado] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  // zootecnicos
  const [dadosZootecnicos, setDadosZootecnicos] = useState([]);
  const [carregandoZootecnicos, setCarregandoZootecnicos] = useState(false);
  const [erroZootecnicos, setErroZootecnicos] = useState(null);

  // sanitarios
  const [dadosSanitarios, setDadosSanitarios] = useState([]);
  const [carregandoSanitarios, setCarregandoSanitarios] = useState(false);
  const [erroSanitarios, setErroSanitarios] = useState(null);

  useEffect(() => {
    console.log(`🔄 useEffect zootécnicos executado - activeTab: ${activeTab}, buffalo.id_bufalo: ${buffalo?.id_bufalo}`);
    
    if (activeTab !== "zootecnicos") {
      console.log("ℹ️ Aba não é zootécnicos, limpando dados");
      setDadosZootecnicos([]);
      setCarregandoZootecnicos(false);
      setErroZootecnicos(null);
      return;
    }

    if (!buffalo?.id_bufalo) {
      console.log("⚠️ ID do búfalo não disponível");
      setDadosZootecnicos([]);
      setCarregandoZootecnicos(false);
      setErroZootecnicos(null);
      return;
    }

    // Variável para cancelar a requisição se o componente for desmontado
    let isCancelled = false;

    const fetchZootecnicos = async () => {
      try {
        setCarregandoZootecnicos(true);
        setErroZootecnicos(null);
        
        // Obter token fresco
        const accessToken = await getAccessToken();
        if (!accessToken) {
          throw new Error("Token de acesso não disponível");
        }
        
        if (isCancelled) return; // Cancelar se o componente foi desmontado
        
        console.log(`🔍 Buscando dados zootécnicos para búfalo ID: ${buffalo.id_bufalo}`);
        
        const zootecnicosData =
          await dadosZootecnicosService.listarDadosZootecnicosPorBufalo(
            buffalo.id_bufalo,
            accessToken
          );
        
        if (!isCancelled) {
          setDadosZootecnicos(zootecnicosData || []);
          console.log("✅ Dados zootécnicos obtidos:", zootecnicosData);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error("❌ Erro ao buscar dados zootécnicos:", error);
          setErroZootecnicos(
            `Não foi possível carregar os dados zootécnicos: ${error.message}`
          );
          setDadosZootecnicos([]);
        }
      } finally {
        if (!isCancelled) {
          setCarregandoZootecnicos(false);
        }
      }
    };

    console.log("� Iniciando busca de dados zootécnicos");
    fetchZootecnicos();

    // Função de cleanup para cancelar a requisição
    return () => {
      isCancelled = true;
    };
  }, [activeTab, buffalo?.id_bufalo]); // Removendo getAccessToken das dependências

  // useEffect para dados sanitários
  useEffect(() => {
    console.log(`🔄 useEffect sanitários executado - activeTab: ${activeTab}, buffalo.id_bufalo: ${buffalo?.id_bufalo}`);
    
    if (activeTab !== "sanitarios") {
      console.log("ℹ️ Aba não é sanitários, limpando dados");
      setDadosSanitarios([]);
      setCarregandoSanitarios(false);
      setErroSanitarios(null);
      return;
    }

    if (!buffalo?.id_bufalo) {
      console.log("⚠️ ID do búfalo não disponível");
      setDadosSanitarios([]);
      setCarregandoSanitarios(false);
      setErroSanitarios(null);
      return;
    }

    // Variável para cancelar a requisição se o componente for desmontado
    let isCancelled = false;

    const fetchSanitarios = async () => {
      try {
        setCarregandoSanitarios(true);
        setErroSanitarios(null);
        
        // Obter token fresco
        const accessToken = await getAccessToken();
        if (!accessToken) {
          throw new Error("Token de acesso não disponível");
        }
        
        if (isCancelled) return; // Cancelar se o componente foi desmontado
        
        console.log(`🔍 Buscando dados sanitários para búfalo ID: ${buffalo.id_bufalo}`);
        
        const sanitariosData =
          await dadosSanitariosService.listarDadosSanitariosPorBufalo(
            buffalo.id_bufalo,
            accessToken
          );
        
        if (!isCancelled) {
          setDadosSanitarios(sanitariosData || []);
          console.log("✅ Dados sanitários obtidos:", sanitariosData);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error("❌ Erro ao buscar dados sanitários:", error);
          setErroSanitarios(
            `Não foi possível carregar os dados sanitários: ${error.message}`
          );
          setDadosSanitarios([]);
        }
      } finally {
        if (!isCancelled) {
          setCarregandoSanitarios(false);
        }
      }
    };

    console.log("🚀 Iniciando busca de dados sanitários");
    fetchSanitarios();

    // Função de cleanup para cancelar a requisição
    return () => {
      isCancelled = true;
    };
  }, [activeTab, buffalo?.id_bufalo]); // Removendo getAccessToken das dependências

  //fim zootecnicos

  // reset de abas ao abrir/trocar animal
  useEffect(() => {
    if (open) {
      setActiveTab("info");
    }
  }, [open, buffalo]);

  // Buscar dados detalhados do búfalo quando o modal for aberto
  useEffect(() => {
    if (open && buffalo?.id_bufalo) {
      const fetchBufaloDetalhes = async () => {
        try {
          setCarregando(true);
          setErro(null);
          
          // Obter token fresco
          const accessToken = await getAccessToken();
          if (!accessToken) {
            throw new Error("Token de acesso não disponível");
          }
          
          console.log(
            `🔍 Buscando detalhes do búfalo com ID: ${buffalo.id_bufalo}`
          );
          const bufaloData = await bufaloService.getBufaloById(
            buffalo.id_bufalo,
            accessToken
          );
          setBufaloDetalhado(bufaloData);
          console.log("✅ Detalhes do búfalo obtidos com sucesso:", bufaloData);
        } catch (error) {
          console.error(
            `❌ Erro ao buscar detalhes do búfalo ID ${buffalo.id_bufalo}:`,
            error
          );
          setErro(
            `Não foi possível carregar os detalhes do búfalo: ${error.message}`
          );
        } finally {
          setCarregando(false);
        }
      };

      fetchBufaloDetalhes();
    } else {
      setBufaloDetalhado(null);
    }
  }, [open, buffalo?.id_bufalo]);

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
                      <svg
                        className="h-5 w-5 text-red-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Erro ao carregar dados
                      </h3>
                      <p className="mt-1 text-sm text-red-700">{erro}</p>
                      <p className="mt-2 text-xs text-red-600">
                        Tente fechar e abrir novamente o modal ou atualize a
                        página.
                      </p>
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
                        typeof bufaloData.status === "boolean"
                          ? bufaloData.status
                            ? "Ativo"
                            : "Inativo"
                          : bufaloData.status
                      )}`}
                    >
                      {typeof bufaloData.status === "boolean"
                        ? bufaloData.status
                          ? "Ativo"
                          : "Inativo"
                        : bufaloData.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Brinco: {bufaloData.brinco || "N/A"} •{" "}
                    {getSexIcon(bufaloData.sexo === "F" ? "Fêmea" : "Macho")}{" "}
                    {bufaloData.sexo === "F" ? "Fêmea" : "Macho"} •{" "}
                    {buffalo.raca || "N/A"} • ID:{" "}
                    {bufaloData.id || bufaloData.id_bufalo}
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
              { id: "genealogia", label: "Genealogia" },
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
                        <span className="font-medium">
                          {bufaloData.id || bufaloData.id_bufalo}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Nome</span>
                        <span className="font-medium">{bufaloData.nome}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Brinco</span>
                        <span className="font-medium">
                          {bufaloData.brinco || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Sexo</span>
                        <span className="font-medium">
                          {bufaloData.sexo === "F" ? "Fêmea" : "Macho"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Raça</span>
                        <span className="font-medium">
                          {buffalo.raca || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Maturidade</span>
                        <span className="font-medium">
                          {bufaloData.nivel_maturidade === "V"
                            ? "Vaca"
                            : bufaloData.nivel_maturidade === "B"
                            ? "Bezerra"
                            : bufaloData.nivel_maturidade === "N"
                            ? "Novilha"
                            : bufaloData.nivel_maturidade || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Categoria</span>
                        <span className="font-medium">
                          {bufaloData.categoria || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Status</span>
                        <span className="font-medium">
                          {typeof bufaloData.status === "boolean"
                            ? bufaloData.status
                              ? "Ativo"
                              : "Inativo"
                            : bufaloData.status || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Nascimento</span>
                        <span className="font-medium">
                          {bufaloData.dt_nascimento
                            ? new Date(
                                bufaloData.dt_nascimento
                              ).toLocaleDateString("pt-BR")
                            : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Origem</span>
                        <span className="font-medium">
                          {bufaloData.origem === "N"
                            ? "Nascimento"
                            : bufaloData.origem === "C"
                            ? "Compra"
                            : bufaloData.origem === "D"
                            ? "Doação"
                            : bufaloData.origem || "N/A"}
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
                          {bufaloData.data_baixa
                            ? new Date(
                                bufaloData.data_baixa
                              ).toLocaleDateString("pt-BR")
                            : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Motivo Inativo</span>
                        <span className="font-medium">
                          {bufaloData.motivo_inativo || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Brinco Original</span>
                        <span className="font-medium">
                          {bufaloData.brinco_original || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">
                          Registro Provisório
                        </span>
                        <span className="font-medium">
                          {bufaloData.registro_prov || "N/A"}
                        </span>
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
                        <span className="font-medium">
                          {bufaloData.id_raca || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">ID Propriedade</span>
                        <span className="font-medium">
                          {bufaloData.id_propriedade || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">ID Grupo</span>
                        <span className="font-medium">
                          {bufaloData.id_grupo || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Criado em</span>
                        <span className="font-medium">
                          {bufaloData.created_at
                            ? new Date(
                                bufaloData.created_at
                              ).toLocaleDateString("pt-BR")
                            : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">
                          Última Atualização
                        </span>
                        <span className="font-medium">
                          {bufaloData.updated_at
                            ? new Date(
                                bufaloData.updated_at
                              ).toLocaleDateString("pt-BR")
                            : "N/A"}
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
                        <span className="font-medium">
                          {bufaloData.id_pai || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">ID da Mãe</span>
                        <span className="font-medium">
                          {bufaloData.id_mae || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">
                          Registro Definitivo
                        </span>
                        <span className="font-medium">
                          {bufaloData.registro_def || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Microchip</span>
                        <span className="font-medium">
                          {bufaloData.microchip || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Aba Zootécnicos */}
          {activeTab === "zootecnicos" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Dados Zootécnicos
                    </h3>
                    <p className="text-sm text-gray-500">
                      Histórico de registros zootécnicos de {bufaloData.nome}
                    </p>
                  </div>
                </div>

                {carregandoZootecnicos && (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600"></div>
                      <span className="text-gray-600">Carregando dados zootécnicos...</span>
                    </div>
                  </div>
                )}

                {erroZootecnicos && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Erro ao carregar dados</h3>
                        <div className="mt-2 text-sm text-red-700">
                          <p>{erroZootecnicos}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!carregandoZootecnicos && !erroZootecnicos && dadosZootecnicos.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-3">
                      <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum registro encontrado</h3>
                    <p className="text-gray-500">Não há dados zootécnicos registrados para este búfalo.</p>
                  </div>
                )}

                {!carregandoZootecnicos && !erroZootecnicos && dadosZootecnicos.length > 0 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      {dadosZootecnicos.map((registro, index) => (
                        <div
                          key={registro.id_zootec || index}
                          className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center space-x-2">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                {new Date(registro.dt_registro).toLocaleDateString('pt-BR')}
                              </span>
                              <span className="text-sm text-gray-500">
                                ID: {registro.id_zootec}
                              </span>
                            </div>
                            <span className="text-xs text-gray-400">
                              {registro.tipo_pesagem}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-sm">
                            <div>
                              <span className="block text-gray-500 text-xs mb-1">Peso</span>
                              <span className="font-medium">{registro.peso} kg</span>
                            </div>
                            <div>
                              <span className="block text-gray-500 text-xs mb-1">Condição Corporal</span>
                              <span className="font-medium">{registro.condicao_corporal}</span>
                            </div>
                            <div>
                              <span className="block text-gray-500 text-xs mb-1">Cor da Pelagem</span>
                              <span className="font-medium">{registro.cor_pelagem}</span>
                            </div>
                            <div>
                              <span className="block text-gray-500 text-xs mb-1">Formato do Chifre</span>
                              <span className="font-medium">{registro.formato_chifre}</span>
                            </div>
                            <div>
                              <span className="block text-gray-500 text-xs mb-1">Porte Corporal</span>
                              <span className="font-medium">{registro.porte_corporal}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t pt-4">
                      <p className="text-sm text-gray-500 text-center">
                        Total de {dadosZootecnicos.length} registro{dadosZootecnicos.length !== 1 ? 's' : ''} encontrado{dadosZootecnicos.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Aba Sanitários */}
          {activeTab === "sanitarios" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Dados Sanitários
                    </h3>
                    <p className="text-sm text-gray-500">
                      Histórico de aplicações e tratamentos sanitários de {bufaloData.nome}
                    </p>
                  </div>
                </div>

                {carregandoSanitarios && (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                      <span className="text-gray-600">Carregando dados sanitários...</span>
                    </div>
                  </div>
                )}

                {erroSanitarios && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Erro ao carregar dados</h3>
                        <div className="mt-2 text-sm text-red-700">
                          <p>{erroSanitarios}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!carregandoSanitarios && !erroSanitarios && dadosSanitarios.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-3">
                      <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum registro encontrado</h3>
                    <p className="text-gray-500">Não há dados sanitários registrados para este búfalo.</p>
                  </div>
                )}

                {!carregandoSanitarios && !erroSanitarios && dadosSanitarios.length > 0 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      {dadosSanitarios.map((registro, index) => (
                        <div
                          key={registro.id_sanit || `sanitario-${index}`}
                          className="border border-gray-200 rounded-lg p-5 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center space-x-3">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {new Date(registro.dt_aplicacao).toLocaleDateString('pt-BR')}
                              </span>
                              <span className="text-sm text-gray-500">
                                ID: {registro.id_sanit}
                              </span>
                              {registro.necessita_retorno && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                  Retorno necessário
                                </span>
                              )}
                            </div>
                            <div className="text-right">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                registro.medicacao?.tipo_tratamento === "Vacinação"
                                  ? "bg-blue-100 text-blue-800"
                                  : registro.medicacao?.tipo_tratamento === "Vermifugação"
                                  ? "bg-purple-100 text-purple-800"
                                  : registro.medicacao?.tipo_tratamento === "Suplementação"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : registro.medicacao?.tipo_tratamento === "Curativo"
                                  ? "bg-pink-100 text-pink-800"
                                  : registro.medicacao?.tipo_tratamento === "Anticoccidiano"
                                  ? "bg-indigo-100 text-indigo-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}>
                                {registro.medicacao?.tipo_tratamento || "N/A"}
                              </span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                            <div>
                              <span className="block text-gray-500 text-xs mb-1">Medicação</span>
                              <span className="font-medium text-gray-900">
                                {registro.medicacao?.medicacao || "N/A"}
                              </span>
                            </div>
                            <div>
                              <span className="block text-gray-500 text-xs mb-1">Doença/Condição</span>
                              <span className="font-medium text-gray-900">{registro.doenca}</span>
                            </div>
                            <div>
                              <span className="block text-gray-500 text-xs mb-1">Dosagem</span>
                              <span className="font-medium text-gray-900">
                                {registro.dosagem} {registro.unidade_medida}
                              </span>
                            </div>
                          </div>

                          {registro.medicacao?.descricao && (
                            <div className="mb-3">
                              <span className="block text-gray-500 text-xs mb-1">Descrição</span>
                              <p className="text-sm text-gray-700">{registro.medicacao.descricao}</p>
                            </div>
                          )}

                          {registro.necessita_retorno && registro.dt_retorno && (
                            <div className="bg-orange-50 border border-orange-200 rounded-md p-3">
                              <div className="flex items-center">
                                <svg className="h-4 w-4 text-orange-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <div>
                                  <p className="text-sm font-medium text-orange-800">Retorno agendado</p>
                                  <p className="text-sm text-orange-700">
                                    Data: {new Date(registro.dt_retorno).toLocaleDateString('pt-BR')}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t pt-4">
                      <p className="text-sm text-gray-500 text-center">
                        Total de {dadosSanitarios.length} registro{dadosSanitarios.length !== 1 ? 's' : ''} encontrado{dadosSanitarios.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Aba Saúde sem conteúdo */}
          {activeTab === "saude" && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center p-6 max-w-md">
                <div className="mb-4 text-amber-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mx-auto h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Dados não disponíveis
                </h3>
                <p className="text-gray-500">
                  Esta seção será implementada em breve. Por enquanto, consulte
                  as informações básicas na aba "Resumo".
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
                    <p className="text-sm text-gray-500">{bufaloData.nome}</p>
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
                      nome: bufaloData.id_pai
                        ? `ID: ${bufaloData.id_pai}`
                        : "—",
                      raca: "N/A",
                      risk: "low",
                    },
                    mae: {
                      nome: bufaloData.id_mae
                        ? `ID: ${bufaloData.id_mae}`
                        : "—",
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
