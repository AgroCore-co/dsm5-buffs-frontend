"use client";

import React, { useState, useEffect } from "react";
import ReproducaoTable from "@/components/proprietario/reproducao/ReproducaoTable";
import Head from "next/head";
import { usePropriedade } from "@/contexts/propriedadeContext";
import coberturaService from "@/services/coberturaService";
import bufaloService from "@/services/bufaloService";
import * as simulacaoService from "@/services/simulacaoService";
import SimulacaoAcasalamentoPanel from "@/components/proprietario/reproducao/SimulacaoAcasalamentoPanel";

export default function Reproducao() {
  const { propriedadeId } = usePropriedade();
  
  // Estados visuais e de Dashboard
  const [viewMode, setViewMode] = useState("monthly"); // 'monthly' | 'yearly'
  const [reproStats, setReproStats] = useState(null);
  const [loadingReproStats, setLoadingReproStats] = useState(false);

  // Estados da Simulação e Seleção de Animais (Vindo da branch dev)
  const [selectedMale, setSelectedMale] = useState("");
  const [selectedFemale, setSelectedFemale] = useState("");
  const [simulationResult, setSimulationResult] = useState(null);
  const [males, setMales] = useState([]);
  const [females, setFemales] = useState([]);
  const [loadingBufalos, setLoadingBufalos] = useState(true);
  const [loadingSimulacao, setLoadingSimulacao] = useState(false);

  // Estados da Tabela de Registros (Vindo da branch main)
  const [reproducaoRegistros, setReproducaoRegistros] = useState([]);
  const [metaReproducao, setMetaReproducao] = useState(null);
  const [loadingReproducao, setLoadingReproducao] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Paginação e filtro para touros e matrizes (Modais de busca)
  const MALES_PER_PAGE = 5;
  const FEMALES_PER_PAGE = 5;
  const [malePage, setMalePage] = useState(1);
  const [femalePage, setFemalePage] = useState(1);
  const [maleSearch, setMaleSearch] = useState("");
  const [femaleSearch, setFemaleSearch] = useState("");

  // Estados para análises unitárias (Cards de Top 5)
  const [femeasDisponiveis, setFemeasDisponiveis] = useState([]);
  const [loadingFemeasDisponiveis, setLoadingFemeasDisponiveis] = useState(true);
  const [machosDisponiveis, setMachosDisponiveis] = useState([]);
  const [loadingMachos, setLoadingMachos] = useState(true);
  const [errorMachos, setErrorMachos] = useState(null);

  // --- Lógica de Filtros Locais ---
  const filteredMales = males.filter(
    (m) =>
      (m.nome || m.name || "")
        .toLowerCase()
        .includes(maleSearch.toLowerCase()) ||
      (m.raca_nome || m.breed || "")
        .toLowerCase()
        .includes(maleSearch.toLowerCase())
  );
  const filteredFemales = females.filter(
    (f) =>
      (f.nome || f.name || "")
        .toLowerCase()
        .includes(femaleSearch.toLowerCase()) ||
      (f.raca_nome || f.breed || "")
        .toLowerCase()
        .includes(femaleSearch.toLowerCase())
  );

  const totalMalePages = Math.max(
    1,
    Math.ceil(filteredMales.length / MALES_PER_PAGE)
  );
  const totalFemalePages = Math.max(
    1,
    Math.ceil(filteredFemales.length / FEMALES_PER_PAGE)
  );
  const paginatedMales = filteredMales.slice(
    (malePage - 1) * MALES_PER_PAGE,
    malePage * MALES_PER_PAGE
  );
  const paginatedFemales = filteredFemales.slice(
    (femalePage - 1) * FEMALES_PER_PAGE,
    femalePage * FEMALES_PER_PAGE
  );

  // --- EFFECT 1: Carregar Estatísticas do Dashboard ---
  useEffect(() => {
    if (!propriedadeId) return;
    setLoadingReproStats(true);
    import("@/services/dashboardService")
      .then(({ default: dashboardService }) => {
        dashboardService
          .getReproducaoStatsByPropriedadeId(propriedadeId)
          .then((data) => setReproStats(data))
          .catch(() => setReproStats(null))
          .finally(() => setLoadingReproStats(false));
      })
      .catch(() => setLoadingReproStats(false));
  }, [propriedadeId]);

  // --- EFFECT 2: Carregar Búfalos para Simulação (Origem: DEV branch) ---
  useEffect(() => {
    const fetchBufalos = async () => {
      setLoadingBufalos(true);
      try {
        if (!propriedadeId) {
          setMales([]);
          setFemales([]);
          setLoadingBufalos(false);
          return;
        }
        // Touros: maturidade T, sexo M, ativos
        const resTouros = await bufaloService.filtrarBufalosPorMaturidadeStatusPropriedade(
          "T",
          propriedadeId,
          true,
          1,
          100
        );
        const touros = Array.isArray(resTouros?.data)
          ? resTouros.data.filter((b) => b.sexo === "M")
          : [];
        setMales(touros);

        // Bufalas: maturidade V e N, sexo F, ativos
        const [resVacas, resNovilhas] = await Promise.all([
          bufaloService.filtrarBufalosPorMaturidadeStatusPropriedade(
            "V",
            propriedadeId,
            true,
            1,
            100
          ),
          bufaloService.filtrarBufalosPorMaturidadeStatusPropriedade(
            "N",
            propriedadeId,
            true,
            1,
            100
          ),
        ]);
        const vacas = Array.isArray(resVacas?.data)
          ? resVacas.data.filter((b) => b.sexo === "F")
          : [];
        const novilhas = Array.isArray(resNovilhas?.data)
          ? resNovilhas.data.filter((b) => b.sexo === "F")
          : [];
        setFemales([...vacas, ...novilhas]);
      } catch (err) {
        setMales([]);
        setFemales([]);
      } finally {
        setLoadingBufalos(false);
      }
    };
    fetchBufalos();
  }, [propriedadeId]);

  // --- EFFECT 3: Carregar Registros de Reprodução (Origem: MAIN branch) ---
  useEffect(() => {
    if (!propriedadeId) {
      setReproducaoRegistros([]);
      setMetaReproducao(null);
      return;
    }
    let ignore = false;
    async function fetchReproducao() {
      setLoadingReproducao(true);
      try {
        const res = await coberturaService.listarCoberturasPorPropriedade(
          propriedadeId,
          page,
          limit
        );
        if (!ignore) {
          setReproducaoRegistros(Array.isArray(res.data) ? res.data : []);
          setMetaReproducao(res.meta || null);
        }
      } catch (e) {
        if (!ignore) {
          setReproducaoRegistros([]);
          setMetaReproducao(null);
        }
      } finally {
        if (!ignore) setLoadingReproducao(false);
      }
    }
    fetchReproducao();
    return () => {
      ignore = true;
    };
  }, [propriedadeId, page, limit]);

  // --- EFFECT 4: Buscar Fêmeas Disponíveis (Recomendação) ---
  useEffect(() => {
    if (!propriedadeId) {
      setFemeasDisponiveis([]);
      return;
    }
    let ignore = false;
    async function fetchFemeasDisponiveis() {
      setLoadingFemeasDisponiveis(true);
      try {
        const res = await coberturaService.listarRecomendacoesFemeas(
          propriedadeId
        );
        if (!ignore) {
          const femeas = Array.isArray(res) ? res : [];
          const femeasOrdenadas = femeas.sort((a, b) => b.score - a.score);
          setFemeasDisponiveis(femeasOrdenadas.slice(0, 5));
        }
      } catch (e) {
        console.error("Erro ao buscar fêmeas disponíveis:", e);
        if (!ignore) {
          setFemeasDisponiveis([]);
        }
      } finally {
        if (!ignore) setLoadingFemeasDisponiveis(false);
      }
    }
    fetchFemeasDisponiveis();
    return () => {
      ignore = true;
    };
  }, [propriedadeId]);

  // --- EFFECT 5: Buscar Machos Disponíveis (Recomendação) ---
  useEffect(() => {
    if (!propriedadeId) {
      setMachosDisponiveis([]);
      return;
    }
    let ignore = false;
    async function fetchMachosDisponiveis() {
      setLoadingMachos(true);
      setErrorMachos(null);
      try {
        const response = await coberturaService.listarRecomendacoesMachos(
          propriedadeId,
          { limit: 5 }
        );
        if (!ignore) {
          setMachosDisponiveis(response);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMachos(
            "Erro ao carregar machos disponíveis para reprodução."
          );
        }
      } finally {
        if (!ignore) setLoadingMachos(false);
      }
    }
    fetchMachosDisponiveis();
    return () => {
      ignore = true;
    };
  }, [propriedadeId]);

  // --- Função de Simulação ---
  const handleSimulation = async () => {
    if (!selectedMale || !selectedFemale) return;
    setSimulationResult(null);
    setLoadingSimulacao(true);
    try {
      const result = await simulacaoService.simularAcasalamento({
        id_macho: selectedMale,
        id_femea: selectedFemale,
      });
      setSimulationResult({
        confidence: 100,
        estimatedProduction: result.predicao_producao_femea ?? 0,
        inbreeding: result.consanguinidade_prole ?? 0,
        resistance: result.risco_consanguinidade || "-",
        geneticScore: result.parentesco_pais ?? 0,
        alert:
          result.risco_consanguinidade === "Alto"
            ? "Consanguinidade alta"
            : null,
        recommendation: result.recomendacao || "-",
        raw: result,
      });
    } catch (err) {
      setSimulationResult({
        confidence: 0,
        estimatedProduction: 0,
        inbreeding: 0,
        resistance: "Erro",
        geneticScore: 0,
        alert: "Erro ao simular acasalamento",
        recommendation: err?.message || "Falha na simulação",
      });
    } finally {
      setLoadingSimulacao(false);
    }
  };

  const getStatusColor = (status) => {
    switch ((status || "").toLowerCase()) {
      case "prenha":
      case "confirmada":
      case "confirmado":
        return "bg-[#9DFFBE] text-gray-800";
      case "em andamento":
      case "em processo":
        return "bg-[#F2B84D] text-gray-800";
      case "no cio":
        return "bg-[#FFCF78] text-gray-800";
      case "abortada":
      case "abortado":
        return "bg-red-200 text-red-800";
      case "falha":
      case "falhou":
        return "bg-red-100 text-red-700";
      case "normal":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "#CE7D0A";
    if (score >= 80) return "#FFCF78";
    return "#ef4444";
  };

  return (
    <>
      <Head>
        <title>Controle de Reprodução | Buffs</title>
        <meta
          name="description"
          content="Controle de reprodução e gestão reprodutiva"
        />
      </Head>

      <div className="p-6 flex flex-col gap-8">
        {/* Header - Controle de Reprodução */}
        <div className="w-full flex flex-col bg-white rounded-xl p-6 gap-6 box-border border border-[#e0e0e0] shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Controle de Reprodução
            </h1>
            <p className="text-gray-600 text-lg">
              Gerencie o ciclo reprodutivo do rebanho, registre inseminações e
              acompanhe prenhezes.
            </p>
          </div>

          {/* Resumo da Reprodução */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">
                  Reproduções em Andamento
                </h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">
                  Status
                </span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">
                {loadingReproStats ? "..." : reproStats?.totalEmAndamento ?? "-"}
              </p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                Reproduções não concluídas
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">
                  Reproduções Confirmadas
                </h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">
                  Status
                </span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">
                {loadingReproStats ? "..." : reproStats?.totalConfirmada ?? "-"}
              </p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                Gestação confirmada
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">
                  Reproduções com Falha
                </h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">
                  Status
                </span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">
                {loadingReproStats ? "..." : reproStats?.totalFalha ?? "-"}
              </p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                Falha na reprodução
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">
                  Última Reprodução
                </h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">
                  Data
                </span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">
                {loadingReproStats ? "..." : reproStats?.ultimaDataReproducao
                  ? new Date(reproStats.ultimaDataReproducao).toLocaleDateString()
                  : "-"}
              </p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                Data da última reprodução
              </p>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-6 box-border border border-[#e0e0e0] shadow-sm">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Análises Unitárias
              </h2>
              <p className="text-gray-600">
                Comparativo de matrizes e touros — melhor primeiro.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-white to-orange-50 p-6 rounded-xl shadow border border-orange-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                Top 5 Búfalas para Reprodução
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Classificadas por prontidão, idade, histórico e período ideal
                para cobertura.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse min-w-[650px] bg-white rounded-lg overflow-hidden shadow-sm">
                  <thead className="bg-[#f0f0f0]">
                    <tr>
                      <th className="p-3 text-center font-medium text-gray-800 text-sm">
                        Rank
                      </th>
                      <th className="p-3 text-left font-medium text-gray-800 text-sm">
                        Nome/Brinco
                      </th>
                      <th className="p-3 text-center font-medium text-gray-800 text-sm">
                        Idade
                      </th>
                      <th className="p-3 text-center font-medium text-gray-800 text-sm">
                        Raça
                      </th>
                      <th className="p-3 text-center font-medium text-gray-800 text-sm">
                        Status
                      </th>
                      <th className="p-3 text-center">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingFemeasDisponiveis ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="p-8 text-center text-gray-500"
                        >
                          <div className="flex items-center justify-center gap-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#CE7D0A]"></div>
                            <span>Carregando fêmeas disponíveis...</span>
                          </div>
                        </td>
                      </tr>
                    ) : femeasDisponiveis.length === 0 ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="p-8 text-center text-gray-500"
                        >
                          Nenhuma fêmea disponível para reprodução.
                        </td>
                      </tr>
                    ) : (
                      femeasDisponiveis.map((femea, i) => {
                        const rankBadge =
                          i === 0
                            ? "1º"
                            : i === 1
                            ? "2º"
                            : i === 2
                            ? "3º"
                            : `${i + 1}º`;
                        const rankBadgeColor =
                          i === 0
                            ? "bg-yellow-500 text-white"
                            : i === 1
                            ? "bg-gray-400 text-white"
                            : i === 2
                            ? "bg-orange-700 text-white"
                            : "bg-gray-300 text-gray-700";
                        const scoreColor =
                          femea.score >= 80
                            ? "text-green-600 font-bold"
                            : femea.score >= 60
                            ? "text-orange-600 font-semibold"
                            : "text-gray-600";

                        return (
                          <tr
                            key={femea.id_bufalo || i}
                            className={
                              i === 0
                                ? "bg-[#FFF4E0]"
                                : i % 2 === 0
                                ? "bg-[#fafafa]"
                                : "bg-white"
                            }
                          >
                            <td className="p-3 text-center text-gray-800 text-base font-bold">
                              <div className="flex items-center justify-center">
                                <span
                                  className={`px-2 py-1 rounded-md text-xs font-bold ${rankBadgeColor}`}
                                >
                                  {rankBadge}
                                </span>
                              </div>
                            </td>
                            <td className="p-3 text-left text-gray-800 text-sm font-semibold">
                              <div>
                                <div>
                                  {femea.nome || `Fêmea #${femea.id_bufalo}`}
                                </div>
                                {femea.brinco && (
                                  <div className="text-xs text-gray-500">
                                    {femea.brinco}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="p-3 text-center text-gray-800 text-sm">
                              {femea.idade_meses
                                ? `${Math.floor(femea.idade_meses / 12)}a ${
                                    femea.idade_meses % 12
                                  }m`
                                : "-"}
                            </td>
                            <td className="p-3 text-center text-gray-800 text-sm">
                              {femea.raca || "-"}
                            </td>
                            <td className="p-3 text-center text-gray-800 text-sm">
                              {femea.dados_reprodutivos?.status || "-"}
                            </td>
                            <td className="p-3 text-center">
                              <span
                                className={`text-base font-bold ${scoreColor}`}
                              >
                                {femea.score || 0}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl shadow border border-blue-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                Top 5 Touros para Reprodução
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Classificados por idade, histórico, taxa de sucesso e qualidade
                genética.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse min-w-[650px] bg-white rounded-lg overflow-hidden shadow-sm">
                  <thead className="bg-[#f0f0f0]">
                    <tr>
                      <th className="p-3 text-center font-medium text-gray-800 text-sm">
                        Rank
                      </th>
                      <th className="p-3 text-left font-medium text-gray-800 text-sm">
                        Nome/Brinco
                      </th>
                      <th className="p-3 text-center font-medium text-gray-800 text-sm">
                        Idade
                      </th>
                      <th className="p-3 text-center font-medium text-gray-800 text-sm">
                        Raça
                      </th>
                      <th className="p-3 text-center font-medium text-gray-800 text-sm">
                        Status
                      </th>
                      <th className="p-3 text-center font-medium text-gray-800 text-sm">
                        Score
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingMachos ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="p-8 text-center text-gray-500"
                        >
                          <div className="flex items-center justify-center gap-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                            <span>Carregando touros disponíveis...</span>
                          </div>
                        </td>
                      </tr>
                    ) : errorMachos ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="p-8 text-center text-red-500"
                        >
                          {errorMachos}
                        </td>
                      </tr>
                    ) : machosDisponiveis.length === 0 ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="p-8 text-center text-gray-500"
                        >
                          Nenhum touro disponível para reprodução.
                        </td>
                      </tr>
                    ) : (
                      machosDisponiveis.slice(0, 5).map((macho, i) => {
                        const rankBadgeColor =
                          i === 0
                            ? "bg-blue-500 text-white"
                            : i === 1
                            ? "bg-blue-400 text-white"
                            : i === 2
                            ? "bg-blue-300 text-white"
                            : "bg-gray-200 text-gray-800";

                        return (
                          <tr
                            key={macho.id_bufalo || i}
                            className={
                              i === 0
                                ? "bg-[#E0F7FF]"
                                : i % 2 === 0
                                ? "bg-[#fafafa]"
                                : "bg-white"
                            }
                          >
                            <td className="p-3 text-center text-gray-800 text-base font-bold">
                              <div className="flex items-center justify-center">
                                <span
                                  className={`px-2 py-1 rounded-md text-xs font-bold ${rankBadgeColor}`}
                                >
                                  {i + 1}
                                </span>
                              </div>
                            </td>
                            <td className="p-3 text-left text-gray-800 text-sm font-semibold">
                              <div>
                                <div>
                                  {macho.nome || `Touro #${macho.id_bufalo}`}
                                </div>
                                {macho.brinco && (
                                  <div className="text-xs text-gray-500">
                                    {macho.brinco}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="p-3 text-center text-gray-800 text-sm">
                              {macho.idade_meses
                                ? `${Math.floor(macho.idade_meses / 12)}a ${
                                    macho.idade_meses % 12
                                  }m`
                                : "-"}
                            </td>
                            <td className="p-3 text-center text-gray-800 text-sm">
                              {macho.raca || "-"}
                            </td>
                            <td className="p-3 text-center text-gray-800 text-sm">
                              {macho.dados_reprodutivos?.status || "-"}
                            </td>
                            <td className="p-3 text-center">
                              <span className="text-base font-bold text-gray-800">
                                {macho.score}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Painel de Simulação de Acasalamento componentizado */}
        <SimulacaoAcasalamentoPanel propriedadeId={propriedadeId} />

        <ReproducaoTable 
          registros={reproducaoRegistros} 
          loading={loadingReproducao}
          page={page}
          setPage={setPage}
        />
      </div>
    </>
  );
}