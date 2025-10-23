"use client";

import React, { useState, useEffect } from "react";
import Head from "next/head";
import { usePropriedade } from "@/contexts/propriedadeContext";
import coberturaService from "@/services/coberturaService";
import bufaloService from "@/services/bufaloService";
import * as simulacaoService from "@/services/simulacaoService";

export default function Reproducao() {
  const { propriedadeId } = usePropriedade();
  const [viewMode, setViewMode] = useState("monthly"); // 'monthly' | 'yearly'
  const [selectedMale, setSelectedMale] = useState("");
  const [selectedFemale, setSelectedFemale] = useState("");
  const [simulationResult, setSimulationResult] = useState(null);
  const [males, setMales] = useState([]);
  const [females, setFemales] = useState([]);
  const [loadingBufalos, setLoadingBufalos] = useState(true);
  const [loadingSimulacao, setLoadingSimulacao] = useState(false);
  // Estado para paginação dos registros de reprodução
  const [reproducaoRegistros, setReproducaoRegistros] = useState([]);
  const [metaReproducao, setMetaReproducao] = useState(null);
  const [loadingReproducao, setLoadingReproducao] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Paginação e filtro para touros e matrizes
  const MALES_PER_PAGE = 5;
  const FEMALES_PER_PAGE = 5;
  const [malePage, setMalePage] = useState(1);
  const [femalePage, setFemalePage] = useState(1);
  const [maleSearch, setMaleSearch] = useState("");
  const [femaleSearch, setFemaleSearch] = useState("");

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
        // Busca até 100 búfalos ativos da propriedade
        const res = await bufaloService.listarBufalosPorPropriedade(
          propriedadeId,
          1,
          100
        );
        const bufalos = Array.isArray(res?.data) ? res.data : [];
        // Garante que id_bufalo existe e status é true
        setMales(
          bufalos.filter((b) => b.sexo === "M" && b.status && b.id_bufalo)
        );
        setFemales(
          bufalos.filter((b) => b.sexo === "F" && b.status && b.id_bufalo)
        );
      } catch (err) {
        setMales([]);
        setFemales([]);
      } finally {
        setLoadingBufalos(false);
      }
    };
    fetchBufalos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propriedadeId]);

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

  // Tabela geral (lista base de reproduções)
  const reproducoesMock = [
    {
      tag: "BUF001",
      vetResponsavel: "Dr. Silva",
      dataInseminacao: "15/11/2024",
      tipoInseminacao: "IA",
      status: "Prenha",
      dataStatus: "15/12/2024",
    },
    {
      tag: "BUF002",
      vetResponsavel: "Dra. Santos",
      dataInseminacao: "10/11/2024",
      tipoInseminacao: "IA",
      status: "Prenha",
      dataStatus: "10/12/2024",
    },
    {
      tag: "BUF003",
      vetResponsavel: "Dr. Costa",
      dataInseminacao: "05/11/2024",
      tipoInseminacao: "Monta",
      status: "No cio",
      dataStatus: "05/12/2024",
    },
    {
      tag: "BUF004",
      vetResponsavel: "Dra. Oliveira",
      dataInseminacao: "01/11/2024",
      tipoInseminacao: "IA",
      status: "No cio",
      dataStatus: "01/12/2024",
    },
    {
      tag: "BUF005",
      vetResponsavel: "Dr. Pereira",
      dataInseminacao: "28/10/2024",
      tipoInseminacao: "IA",
      status: "Prenha",
      dataStatus: "28/11/2024",
    },
    {
      tag: "BUF006",
      vetResponsavel: "Dra. Ferreira",
      dataInseminacao: "25/10/2024",
      tipoInseminacao: "Monta",
      status: "Em processo",
      dataStatus: "25/11/2024",
    },
    {
      tag: "BUF007",
      vetResponsavel: "Dr. Rodrigues",
      dataInseminacao: "20/10/2024",
      tipoInseminacao: "IA",
      status: "Em processo",
      dataStatus: "20/11/2024",
    },
    {
      tag: "BUF008",
      vetResponsavel: "Dra. Almeida",
      dataInseminacao: "15/10/2024",
      tipoInseminacao: "IA",
      status: "Prenha",
      dataStatus: "15/11/2024",
    },
  ];

  const recommendationsMock = [
    {
      male: { tag: "Apolo #1033", symbol: "♂" },
      female: { tag: "Safira #1048", symbol: "♀" },
      score: 88,
    },
    {
      male: { tag: "Thor #1028", symbol: "♂" },
      female: { tag: "Bella #1041", symbol: "♀" },
      score: 85,
    },
    {
      male: { tag: "Hades #1029", symbol: "♂" },
      female: { tag: "Jade #1044", symbol: "♀" },
      score: 79,
    },
  ];

  // Os búfalos disponíveis agora vêm do backend (males, females)

  // Função de simulação de acasalamento via backend
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
        return "bg-[#9DFFBE] text-gray-800"; // verde claro
      case "em andamento":
      case "em processo":
        return "bg-[#F2B84D] text-gray-800"; // amarelo
      case "no cio":
        return "bg-[#FFCF78] text-gray-800"; // laranja claro
      case "abortada":
      case "abortado":
        return "bg-red-200 text-red-800"; // vermelho claro
      case "falha":
      case "falhou":
        return "bg-red-100 text-red-700"; // vermelho
      case "normal":
        return "bg-blue-100 text-blue-800"; // azul
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatus = (status) => status || "Desconhecido";

  const getScoreColor = (score) => {
    if (score >= 90) return "#CE7D0A"; // Using consistent orange theme
    if (score >= 80) return "#FFCF78"; // Using consistent orange theme
    return "#ef4444"; // red
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
                  Taxa de Concepção
                </h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">
                  Média 12m
                </span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">
                79.5%
              </p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                Últimos 12 meses
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">
                  Búfalas Prenhas
                </h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">
                  Confirmadas
                </span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">
                35
              </p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                Gestação em andamento
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">
                  Inseminações
                </h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">
                  {viewMode === "monthly" ? "Mês corrente" : "Ano atual"}
                </span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">
                {viewMode === "monthly" ? 30 : 400}
              </p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                Procedimentos realizados
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">
                  Prenhezes
                </h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">
                  {viewMode === "monthly" ? "Mês corrente" : "Ano atual"}
                </span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">
                {viewMode === "monthly" ? 24 : 330}
              </p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                Confirmações positivas
              </p>
            </div>
          </div>

          {/* ...seletor mensal/anual removido... */}
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
                Análise de Búfalas
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Todas as matrizes — melhor primeiro.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse min-w-[500px] bg-white rounded-lg overflow-hidden shadow-sm">
                  <thead className="bg-[#f0f0f0]">
                    <tr>
                      <th className="p-3 text-left font-medium text-gray-800 text-sm">
                        #
                      </th>
                      <th className="p-3 text-left font-medium text-gray-800 text-sm">
                        TAG
                      </th>
                      <th className="p-3 text-center font-medium text-gray-800 text-sm">
                        Tentativas
                      </th>
                      <th className="p-3 text-center font-medium text-gray-800 text-sm">
                        Concepções
                      </th>
                      <th className="p-3 text-center font-medium text-gray-800 text-sm">
                        Taxa
                      </th>
                      <th className="p-3 text-center font-medium text-gray-800 text-sm">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        tag: "BUF031",
                        tentativas: 5,
                        concepcoes: 4,
                        taxa: 80,
                        status: "Prenha",
                      },
                      {
                        tag: "BUF022",
                        tentativas: 4,
                        concepcoes: 3,
                        taxa: 75,
                        status: "Prenha",
                      },
                      {
                        tag: "BUF017",
                        tentativas: 3,
                        concepcoes: 2,
                        taxa: 66.7,
                        status: "Em processo",
                      },
                      {
                        tag: "BUF043",
                        tentativas: 6,
                        concepcoes: 4,
                        taxa: 66.7,
                        status: "Prenha",
                      },
                      {
                        tag: "BUF050",
                        tentativas: 5,
                        concepcoes: 3,
                        taxa: 60,
                        status: "No cio",
                      },
                      {
                        tag: "BUF064",
                        tentativas: 4,
                        concepcoes: 2,
                        taxa: 50,
                        status: "Em processo",
                      },
                    ].map((b, i) => (
                      <tr
                        key={b.tag}
                        className={
                          i === 0
                            ? "bg-[#FFF4E0]"
                            : i % 2 === 0
                            ? "bg-[#fafafa]"
                            : "bg-white"
                        }
                      >
                        <td className="p-3 text-left text-gray-800 text-sm font-semibold">
                          {i + 1}
                        </td>
                        <td className="p-3 text-left text-gray-800 text-sm font-semibold">
                          {b.tag}
                        </td>
                        <td className="p-3 text-center text-gray-800 text-sm">
                          {b.tentativas}
                        </td>
                        <td className="p-3 text-center text-gray-800 text-sm">
                          {b.concepcoes}
                        </td>
                        <td className="p-3 text-center text-gray-800 text-sm font-bold">
                          {b.taxa}%
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(
                              b.status
                            )}`}
                          >
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl shadow border border-blue-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                Análise de Touros
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Todos os touros — melhor primeiro.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse min-w-[520px] bg-white rounded-lg overflow-hidden shadow-sm">
                  <thead className="bg-[#f0f0f0]">
                    <tr>
                      <th className="p-3 text-left font-medium text-gray-800 text-sm">
                        #
                      </th>
                      <th className="p-3 text-left font-medium text-gray-800 text-sm">
                        Touro
                      </th>
                      <th className="p-3 text-center font-medium text-gray-800 text-sm">
                        Coberturas
                      </th>
                      <th className="p-3 text-center font-medium text-gray-800 text-sm">
                        Prenhezes
                      </th>
                      <th className="p-3 text-center font-medium text-gray-800 text-sm">
                        Taxa
                      </th>
                      <th className="p-3 text-center font-medium text-gray-800 text-sm">
                        Intervalo
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        nome: "Touro Titan",
                        coberturas: 40,
                        prenhezes: 32,
                        taxa: 80,
                        mediaIntervaloDias: 19,
                      },
                      {
                        nome: "Touro Atlas",
                        coberturas: 36,
                        prenhezes: 27,
                        taxa: 75,
                        mediaIntervaloDias: 21,
                      },
                      {
                        nome: "Touro Brutus",
                        coberturas: 28,
                        prenhezes: 20,
                        taxa: 71.4,
                        mediaIntervaloDias: 22,
                      },
                      {
                        nome: "Touro Magnus",
                        coberturas: 25,
                        prenhezes: 17,
                        taxa: 68,
                        mediaIntervaloDias: 23,
                      },
                    ].map((t, i) => (
                      <tr
                        key={t.nome}
                        className={
                          i === 0
                            ? "bg-[#FFF4E0]"
                            : i % 2 === 0
                            ? "bg-[#fafafa]"
                            : "bg-white"
                        }
                      >
                        <td className="p-3 text-left text-gray-800 text-sm font-semibold">
                          {i + 1}
                        </td>
                        <td className="p-3 text-left text-gray-800 text-sm font-semibold">
                          {t.nome}
                        </td>
                        <td className="p-3 text-center text-gray-800 text-sm">
                          {t.coberturas}
                        </td>
                        <td className="p-3 text-center text-gray-800 text-sm">
                          {t.prenhezes}
                        </td>
                        <td className="p-3 text-center text-gray-800 text-sm font-bold">
                          {t.taxa}%
                        </td>
                        <td className="p-3 text-center text-gray-800 text-sm">
                          {t.mediaIntervaloDias} dias
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="w-full flex flex-col bg-white rounded-2xl p-8 gap-8 border border-gray-200 shadow-sm">
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Recomendações Automáticas
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Top acasalamentos sugeridos para seus objetivos genéticos
              </p>
            </div>
            <button className="bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold text-sm px-5 py-2 rounded-lg transition">
              Ver Todas
            </button>
          </header>

          <div className="divide-y divide-gray-100">
            {recommendationsMock.map((rec, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 hover:bg-gray-50 transition rounded-lg px-2"
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm font-medium">
                    {rec.male.symbol} {rec.male.tag}
                  </span>
                  <span className="text-gray-500">×</span>
                  <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-md text-sm font-medium">
                    {rec.female.symbol} {rec.female.tag}
                  </span>
                </div>

                <div className="flex items-center gap-3 min-w-[150px]">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 transition-all duration-300 ease-out"
                      style={{ width: `${rec.score}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-10 text-right">
                    {rec.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div> */}

        <div className="w-full flex flex-col bg-white rounded-2xl p-8 gap-8 border border-gray-200 shadow-sm">
          {/* Header */}
          <header className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Simulação de Acasalamento
            </h2>
            <p className="text-gray-600 text-sm mt-2">
              Escolha o reprodutor e a matriz para visualizar predições
              genéticas
            </p>
          </header>

          {/* Painel de Seleção */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Macho */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Touro / Reprodutor
              </h3>
              <div className="space-y-3">
                <select
                  value={selectedMale}
                  onChange={(e) => setSelectedMale(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="">Selecione um touro...</option>
                  {males.map((male) => {
                    const id = String(male.id_bufalo || male.id);
                    return (
                      <option key={id} value={id}>
                        {male.nome || male.name}{" "}
                        {male.brinco ? `- ${male.brinco}` : ""}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Fêmea */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Matriz / Receptora
              </h3>
              <div className="space-y-3">
                <select
                  value={selectedFemale}
                  onChange={(e) => setSelectedFemale(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                >
                  <option value="">Selecione uma matriz...</option>
                  {females.map((female) => {
                    const id = String(female.id_bufalo || female.id);
                    return (
                      <option key={id} value={id}>
                        {female.nome || female.name}{" "}
                        {female.brinco ? `- ${female.brinco}` : ""}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </section>

          {/* Botão */}
          <div className="text-center">
            <button
              onClick={handleSimulation}
              disabled={!selectedMale || !selectedFemale}
              className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed
        text-white py-3 px-8 rounded-lg font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Simular Acasalamento
            </button>
          </div>

          {/* Painel de Resultados */}
          <section>
            {loadingSimulacao ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-400 mb-4"></div>
                <p className="text-orange-600 font-semibold text-lg">
                  Processando simulação...
                </p>
              </div>
            ) : simulationResult ? (
              <div className="bg-gradient-to-br from-white to-orange-50 rounded-xl p-8 border border-orange-200 shadow-lg">
                <div className="flex items-center justify-center gap-2 mb-6">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  <h3 className="text-xl font-bold text-gray-900 text-center">
                    Resultado da Simulação
                  </h3>
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                </div>

                {/* <CHANGE> Added parent animals section with better visual hierarchy */}
                <div className="bg-white rounded-lg p-5 mb-6 border border-orange-100 shadow-sm">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                    Animais Selecionados
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-bold text-sm">
                          ♂
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 mb-1">Macho</p>
                        <p className="font-semibold text-gray-900 truncate">
                          {(() => {
                            const macho = males.find(
                              (m) =>
                                String(m.id_bufalo || m.id) ===
                                String(simulationResult.raw?.macho_id)
                            );
                            return macho
                              ? `${macho.nome || macho.name}${
                                  macho.brinco ? ` - ${macho.brinco}` : ""
                                }`
                              : "-";
                          })()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-pink-600 font-bold text-sm">
                          ♀
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 mb-1">Fêmea</p>
                        <p className="font-semibold text-gray-900 truncate">
                          {(() => {
                            const femea = females.find(
                              (f) =>
                                String(f.id_bufalo || f.id) ===
                                String(simulationResult.raw?.femea_id)
                            );
                            return femea
                              ? `${femea.nome || femea.name}${
                                  femea.brinco ? ` - ${femea.brinco}` : ""
                                }`
                              : "-";
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <CHANGE> Reorganized metrics with visual indicators and better spacing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-orange-300 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">
                        Consanguinidade Macho
                      </span>
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        ♂
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {simulationResult.raw?.consanguinidade_macho}%
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-orange-300 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">
                        Consanguinidade Fêmea
                      </span>
                      <span className="text-xs font-medium text-pink-600 bg-pink-50 px-2 py-1 rounded">
                        ♀
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {simulationResult.raw?.consanguinidade_femea}%
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-orange-300 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">
                        Parentesco dos Pais
                      </span>
                      
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {simulationResult.raw?.parentesco_pais}%
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-orange-300 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">
                        Consanguinidade da Prole
                      </span>
                      
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {simulationResult.raw?.consanguinidade_prole}%
                    </p>
                  </div>
                </div>

                {/* <CHANGE> Enhanced recommendation section with prominent styling */}
                <div className="space-y-4">
                  <div
                    className={`rounded-lg p-5 border-2 ${
                      simulationResult.raw?.risco_consanguinidade === "Baixo"
                        ? "bg-green-50 border-green-300"
                        : simulationResult.raw?.risco_consanguinidade ===
                          "Médio"
                        ? "bg-yellow-50 border-yellow-300"
                        : "bg-red-50 border-red-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">
                        Risco de Consanguinidade
                      </span>
                      <span
                        className={`text-lg font-bold px-4 py-1.5 rounded-full ${
                          simulationResult.raw?.risco_consanguinidade ===
                          "Baixo"
                            ? "bg-green-600 text-white"
                            : simulationResult.raw?.risco_consanguinidade ===
                              "Médio"
                            ? "bg-yellow-600 text-white"
                            : "bg-red-600 text-white"
                        }`}
                      >
                        {simulationResult.raw?.risco_consanguinidade}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <p className="text-xs text-gray-600 mb-1 font-medium">
                          Recomendação
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {simulationResult.raw?.recomendacao}
                        </p>
                      </div>
                    </div>
                  </div>

                  {simulationResult.raw?.predicao_producao_femea &&
                    simulationResult.raw.predicao_producao_femea !== "-" && (
                      <div className="bg-white rounded-lg p-5 border border-indigo-200">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">📊</span>
                          <span className="text-sm font-medium text-gray-700">
                            Predição de Produção da Fêmea
                          </span>
                        </div>
                        <p className="text-xl font-bold text-indigo-600 ml-7">
                          {simulationResult.raw.predicao_producao_femea}
                        </p>
                      </div>
                    )}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-200">
                <p className="text-gray-600">
                  Selecione um touro e uma matriz para ver a predição do
                  acasalamento
                </p>
              </div>
            )}
          </section>
        </div>

        <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold text-gray-800">
                Registro Geral de Reproduções
              </h2>
              <button className="bg-[#FFCF78] hover:bg-[#F2B84D] text-gray-800 font-medium py-2 px-4 rounded-lg">
                + Adicionar Reprodução
              </button>
            </div>
            <p className="text-gray-600">
              Lista dinâmica de registros reprodutivos.
            </p>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full border-collapse min-w-[1200px] bg-white rounded-lg overflow-hidden shadow-sm">
              <thead className="bg-[#f0f0f0]">
                <tr>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">
                    id_reproducao
                  </th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">
                    id_ovulo
                  </th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">
                    id_semen
                  </th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">
                    id_bufala
                  </th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">
                    id_bufalo
                  </th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">
                    tipo_inseminacao
                  </th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">
                    status
                  </th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">
                    tipo_parto
                  </th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">
                    dt_evento
                  </th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">
                    ocorrencia
                  </th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">
                    created_at
                  </th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">
                    updated_at
                  </th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loadingReproducao ? (
                  <tr>
                    <td colSpan="13" className="text-center p-6 text-gray-500">
                      Carregando reproduções...
                    </td>
                  </tr>
                ) : reproducaoRegistros.length === 0 ? (
                  <tr>
                    <td colSpan="13" className="text-center p-6 text-gray-500">
                      Nenhuma reprodução encontrada
                    </td>
                  </tr>
                ) : (
                  reproducaoRegistros.map((r, idx) => (
                    <tr
                      key={r.id_reproducao}
                      className={idx % 2 === 0 ? "bg-white" : "bg-[#fafafa]"}
                    >
                      <td className="p-3 text-center text-gray-800 text-base">
                        {r.id_reproducao
                          ? String(r.id_reproducao).slice(0, 6)
                          : "-"}
                      </td>
                      <td className="p-3 text-center text-gray-800 text-base">
                        {r.id_ovulo ? String(r.id_ovulo).slice(0, 6) : "-"}
                      </td>
                      <td className="p-3 text-center text-gray-800 text-base">
                        {r.id_semen ? String(r.id_semen).slice(0, 6) : "-"}
                      </td>
                      <td className="p-3 text-center text-gray-800 text-base">
                        {r.id_bufala ? String(r.id_bufala).slice(0, 6) : "-"}
                      </td>
                      <td className="p-3 text-center text-gray-800 text-base">
                        {r.id_bufalo ? String(r.id_bufalo).slice(0, 6) : "-"}
                      </td>
                      <td className="p-3 text-center text-gray-800 text-base">
                        {r.tipo_inseminacao || "-"}
                      </td>
                      <td className="p-3 text-center text-gray-800 text-base">
                        <span
                          className={`px-2.5 py-1.5 rounded-full text-sm font-bold inline-block w-28 ${getStatusColor(
                            r.status
                          )}`}
                        >
                          {formatStatus(r.status)}
                        </span>
                      </td>
                      <td className="p-3 text-center text-gray-800 text-base">
                        {r.tipo_parto || "-"}
                      </td>
                      <td className="p-3 text-center text-gray-800 text-base">
                        {r.dt_evento
                          ? new Date(r.dt_evento).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="p-3 text-center text-gray-800 text-base">
                        {r.ocorrencia || "-"}
                      </td>
                      <td className="p-3 text-center text-gray-800 text-base">
                        {r.created_at
                          ? new Date(r.created_at).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="p-3 text-center text-gray-800 text-base">
                        {r.updated_at
                          ? new Date(r.updated_at).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="p-3 text-center">
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium">
                          Ver detalhes
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Paginação igual à de rebanho */}
          {metaReproducao && metaReproducao.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={metaReproducao.page <= 1}
                className={`px-4 py-2 rounded-lg font-medium ${
                  metaReproducao.page <= 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-[#FFCF78] hover:bg-[#F2B84D] text-gray-800"
                }`}
              >
                Anterior
              </button>

              {Array.from(
                { length: metaReproducao.totalPages },
                (_, i) => i + 1
              ).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-lg font-medium ${
                    metaReproducao.page === p
                      ? "bg-[#CE7D0A] text-white"
                      : "bg-gray-200 hover:bg-[#FFCF78] text-gray-800"
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() =>
                  setPage((p) => Math.min(metaReproducao.totalPages, p + 1))
                }
                disabled={metaReproducao.page >= metaReproducao.totalPages}
                className={`px-4 py-2 rounded-lg font-medium ${
                  metaReproducao.page >= metaReproducao.totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-[#FFCF78] hover:bg-[#F2B84D] text-gray-800"
                }`}
              >
                Próximo
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
