"use client";

import React, { useState } from "react";
import Head from "next/head";

export default function Reproducao() {
  const [viewMode, setViewMode] = useState("monthly"); // 'monthly' | 'yearly'
  const [selectedMale, setSelectedMale] = useState("");
  const [selectedFemale, setSelectedFemale] = useState("");
  const [simulationResult, setSimulationResult] = useState(null);

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
      male: { tag: "Zeus #1045", symbol: "♂" },
      female: { tag: "Luna #1052", symbol: "♀" },
      score: 92,
    },
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
      male: { tag: "Atlas #1051", symbol: "♂" },
      female: { tag: "Diva #1037", symbol: "♀" },
      score: 82,
    },
    {
      male: { tag: "Hades #1029", symbol: "♂" },
      female: { tag: "Jade #1044", symbol: "♀" },
      score: 79,
    },
  ];

  const availableMales = [
    { id: "zeus-1045", name: "Zeus #1045", breed: "Murrah" },
    { id: "apolo-1033", name: "Apolo #1033", breed: "Jafarabadi" },
    { id: "thor-1028", name: "Thor #1028", breed: "Híbrido" },
    { id: "valente-1024", name: "Valente #1024", breed: "Híbrido" },
    { id: "atlas-1051", name: "Atlas #1051", breed: "Murrah" },
  ];

  const availableFemales = [
    { id: "estrela-1031", name: "Estrela #1031", breed: "Murrah" },
    { id: "luna-1052", name: "Luna #1052", breed: "Jafarabadi" },
    { id: "safira-1048", name: "Safira #1048", breed: "Híbrido" },
    { id: "bella-1041", name: "Bella #1041", breed: "Murrah" },
    { id: "diva-1037", name: "Diva #1037", breed: "Jafarabadi" },
  ];

  const handleSimulation = () => {
    if (!selectedMale || !selectedFemale) return;

    // Mock simulation results
    const mockResults = [
      {
        confidence: 91,
        estimatedProduction: 2847,
        inbreeding: 23,
        resistance: "Alta",
        geneticScore: 8.2,
        alert: "Consanguinidade acima do recomendado (>20%)",
        recommendation:
          "Considere cruzar com Luna #1052 (Jafarabadi) para reduzir consanguinidade para 8% mantendo produção estimada de 2.920L.",
      },
      {
        confidence: 88,
        estimatedProduction: 2920,
        inbreeding: 8,
        resistance: "Muito Alta",
        geneticScore: 8.7,
        alert: null,
        recommendation:
          "Excelente combinação genética com baixa consanguinidade.",
      },
      {
        confidence: 85,
        estimatedProduction: 2650,
        inbreeding: 15,
        resistance: "Alta",
        geneticScore: 7.9,
        alert: null,
        recommendation: "Boa combinação com produção equilibrada.",
      },
    ];

    // Random result for demo
    const randomResult =
      mockResults[Math.floor(Math.random() * mockResults.length)];
    setSimulationResult(randomResult);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Prenha":
        return "bg-[#9DFFBE] text-gray-800";
      case "No cio":
        return "bg-[#FFCF78] text-gray-800";
      case "Em processo":
        return "bg-[#F2B84D] text-gray-800";
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
        <div className="w-full flex flex-col bg-white rounded-xl p-6 gap-6 box-border border border-[#e0e0e0] shadow-sm">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Controle de Reprodução
              </h1>
              <p className="text-gray-600 text-lg">
                Gerencie o ciclo reprodutivo do rebanho e otimize a taxa de
                concepção.
              </p>
            </div>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("monthly")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "monthly"
                    ? "bg-white text-gray-800 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Mensal
              </button>
              <button
                onClick={() => setViewMode("yearly")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "yearly"
                    ? "bg-white text-gray-800 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Anual
              </button>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-row gap-4 p-5 bg-white rounded-xl box-border border border-[#e0e0e0] shadow-sm">
          <div className="flex-1 bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
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

          <div className="flex-1 bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
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

          <div className="flex-1 bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
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

          <div className="flex-1 bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
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

        <div className="w-full flex flex-col bg-white rounded-2xl p-8 gap-8 border border-gray-200 shadow-sm">
          {/* Header */}
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

          {/* Lista de Recomendações */}
          <div className="divide-y divide-gray-100">
            {recommendationsMock.map((rec, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 hover:bg-gray-50 transition rounded-lg px-2"
              >
                {/* Pares */}
                <div className="flex items-center gap-3 flex-1">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm font-medium">
                    {rec.male.symbol} {rec.male.tag}
                  </span>
                  <span className="text-gray-500">×</span>
                  <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-md text-sm font-medium">
                    {rec.female.symbol} {rec.female.tag}
                  </span>
                </div>

                {/* Score */}
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
        </div>

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
                ♂ Touro / Reprodutor
              </h3>
              <div className="space-y-3">
                {availableMales.map((male) => (
                  <label
                    key={male.id}
                    className={`flex items-center gap-3 p-4 rounded-lg border transition cursor-pointer
              ${
                selectedMale === male.id
                  ? "border-orange-500 bg-orange-50 shadow-sm"
                  : "border-gray-200 hover:bg-gray-100"
              }`}
                  >
                    <input
                      type="radio"
                      name="male"
                      value={male.id}
                      checked={selectedMale === male.id}
                      onChange={(e) => setSelectedMale(e.target.value)}
                      className="accent-orange-600"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{male.name}</p>
                      <p className="text-sm text-gray-500">{male.breed}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Fêmea */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                ♀ Matriz / Receptora
              </h3>
              <div className="space-y-3">
                {availableFemales.map((female) => (
                  <label
                    key={female.id}
                    className={`flex items-center gap-3 p-4 rounded-lg border transition cursor-pointer
              ${
                selectedFemale === female.id
                  ? "border-pink-500 bg-pink-50 shadow-sm"
                  : "border-gray-200 hover:bg-gray-100"
              }`}
                  >
                    <input
                      type="radio"
                      name="female"
                      value={female.id}
                      checked={selectedFemale === female.id}
                      onChange={(e) => setSelectedFemale(e.target.value)}
                      className="accent-pink-600"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{female.name}</p>
                      <p className="text-sm text-gray-500">{female.breed}</p>
                    </div>
                  </label>
                ))}
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
            {simulationResult ? (
              <div className="bg-gradient-to-br from-white to-orange-50 rounded-xl p-6 border border-orange-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-5 text-center">
                  Resultado da Simulação
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Confiança</span>
                      <span className="font-bold text-gray-900">
                        {simulationResult.confidence}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Produção Estimada</span>
                      <span className="font-bold text-gray-900">
                        {simulationResult.estimatedProduction.toLocaleString()}{" "}
                        L
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Consanguinidade</span>
                      <span
                        className={`font-bold ${
                          simulationResult.inbreeding > 20
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {simulationResult.inbreeding}%
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Resistência</span>
                      <span className="font-bold text-gray-900">
                        {simulationResult.resistance}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Score Genético</span>
                      <span className="font-bold text-gray-900">
                        {simulationResult.geneticScore}
                      </span>
                    </div>
                  </div>
                </div>

                {simulationResult.alert && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                    <p className="font-medium text-yellow-800">⚠️ Alerta:</p>
                    <p className="text-yellow-700 text-sm mt-1">
                      {simulationResult.alert}
                    </p>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                  <p className="font-medium text-blue-800 mb-1">
                    Recomendação:
                  </p>
                  <p className="text-blue-700 text-sm">
                    {simulationResult.recommendation}
                  </p>
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
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Registro Geral de Reproduções
            </h2>
            <p className="text-gray-600">
              Lista completa de reproduções com {reproducoesMock.length}{" "}
              registros ativos.
            </p>
          </div>

          {(() => {
            function TabelaReproducoesPaginada() {
              const [page, setPage] = useState(1);
              const [pageSize, setPageSize] = useState(10);

              const total = reproducoesMock.length;
              const totalPages = Math.max(1, Math.ceil(total / pageSize));

              React.useEffect(() => {
                const newTotalPages = Math.max(
                  1,
                  Math.ceil(reproducoesMock.length / pageSize)
                );
                if (page > newTotalPages) setPage(newTotalPages);
              }, [pageSize, total, page]);

              const startIndex = (page - 1) * pageSize;
              const endIndex = Math.min(startIndex + pageSize, total);
              const pageData = reproducoesMock.slice(startIndex, endIndex);

              const goFirst = () => setPage(1);
              const goPrev = () => setPage((p) => Math.max(1, p - 1));
              const goNext = () => setPage((p) => Math.min(totalPages, p + 1));
              const goLast = () => setPage(totalPages);

              const around = 2;
              const startPage = Math.max(1, page - around);
              const endPage = Math.min(totalPages, page + around);
              const pages = [];
              for (let p = startPage; p <= endPage; p++) pages.push(p);

              return (
                <>
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="text-sm text-gray-700">
                      Mostrando{" "}
                      <span className="font-semibold">{startIndex + 1}</span>–
                      <span className="font-semibold">{endIndex}</span> de{" "}
                      <span className="font-semibold">{total}</span> registros
                    </div>

                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="page-size"
                        className="text-sm text-gray-700"
                      >
                        Itens por página:
                      </label>
                      <select
                        id="page-size"
                        className="border border-[#e0e0e0] rounded-md px-2 py-1 text-sm"
                        value={pageSize}
                        onChange={(e) => {
                          setPageSize(Number(e.target.value));
                          setPage(1);
                        }}
                      >
                        {[5, 10, 20, 50, 100].map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="overflow-x-auto w-full">
                    <table className="w-full border-collapse min-w-[700px] bg-white rounded-lg overflow-hidden shadow-sm">
                      <thead className="bg-[#f0f0f0]">
                        <tr>
                          <th className="p-3 text-center font-medium text-gray-800 text-base">
                            TAG
                          </th>
                          <th className="p-3 text-center font-medium text-gray-800 text-base">
                            Vet Responsável
                          </th>
                          <th className="p-3 text-center font-medium text-gray-800 text-base">
                            Data Inseminação
                          </th>
                          <th className="p-3 text-center font-medium text-gray-800 text-base">
                            Tipo
                          </th>
                          <th className="p-3 text-center font-medium text-gray-800 text-base">
                            Status
                          </th>
                          <th className="p-3 text-center font-medium text-gray-800 text-base">
                            Data Status
                          </th>
                          <th className="p-3 text-center font-medium text-gray-800 text-base">
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {pageData.map((r, idx) => (
                          <tr
                            key={`${r.tag}-${r.dataInseminacao}`}
                            className={
                              (startIndex + idx) % 2 === 0
                                ? "bg-[#fafafa]"
                                : "bg-white"
                            }
                          >
                            <td className="p-3 text-center text-gray-800 text-sm font-semibold">
                              {r.tag}
                            </td>
                            <td className="p-3 text-center text-gray-800 text-sm">
                              {r.vetResponsavel}
                            </td>
                            <td className="p-3 text-center text-gray-800 text-sm">
                              {r.dataInseminacao}
                            </td>
                            <td className="p-3 text-center text-gray-800 text-sm">
                              {r.tipoInseminacao}
                            </td>
                            <td className="p-3 text-center">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(
                                  r.status
                                )}`}
                              >
                                {formatStatus(r.status)}
                              </span>
                            </td>
                            <td className="p-3 text-center text-gray-800 text-sm">
                              {r.dataStatus}
                            </td>
                            <td className="p-3 text-center">
                              <button className="bg-[#FFCF78] text-gray-800 py-1 px-3 rounded text-xs font-bold hover:bg-[#F2B84D] transition-colors">
                                Ver detalhes
                              </button>
                            </td>
                          </tr>
                        ))}
                        {pageData.length === 0 && (
                          <tr>
                            <td
                              colSpan={7}
                              className="p-6 text-center text-gray-500 text-sm"
                            >
                              Nenhum registro para exibir nesta página.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex flex-col items-center justify-center mt-3 gap-3">
                    <div className="text-sm text-gray-700 text-center">
                      Página <span className="font-semibold">{page}</span> de{" "}
                      <span className="font-semibold">{totalPages}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={goFirst}
                        disabled={page === 1}
                        className={`px-3 py-1.5 text-sm rounded-md border border-[#e0e0e0] ${
                          page === 1
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-[#f7f7f7]"
                        }`}
                        aria-label="Primeira página"
                        title="Primeira página"
                      >
                        «
                      </button>
                      <button
                        onClick={goPrev}
                        disabled={page === 1}
                        className={`px-3 py-1.5 text-sm rounded-md border border-[#e0e0e0] ${
                          page === 1
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-[#f7f7f7]"
                        }`}
                        aria-label="Anterior"
                        title="Anterior"
                      >
                        ‹
                      </button>

                      {startPage > 1 && (
                        <button
                          onClick={() => setPage(1)}
                          className="px-3 py-1.5 text-sm rounded-md border border-[#e0e0e0] hover:bg-[#f7f7f7]"
                        >
                          1
                        </button>
                      )}
                      {startPage > 2 && (
                        <span className="px-2 text-gray-500">…</span>
                      )}

                      {pages.map((p) => (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`px-3 py-1.5 text-sm rounded-md border border-[#e0e0e0] ${
                            p === page
                              ? "bg-[#FFCF78] font-bold"
                              : "hover:bg-[#f7f7f7]"
                          }`}
                        >
                          {p}
                        </button>
                      ))}

                      {endPage < totalPages - 1 && (
                        <span className="px-2 text-gray-500">…</span>
                      )}
                      {endPage < totalPages && (
                        <button
                          onClick={() => setPage(totalPages)}
                          className="px-3 py-1.5 text-sm rounded-md border border-[#e0e0e0] hover:bg-[#f7f7f7]"
                        >
                          {totalPages}
                        </button>
                      )}

                      <button
                        onClick={goNext}
                        disabled={page === totalPages}
                        className={`px-3 py-1.5 text-sm rounded-md border border-[#e0e0e0] ${
                          page === totalPages
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-[#f7f7f7]"
                        }`}
                        aria-label="Próxima"
                        title="Próxima"
                      >
                        ›
                      </button>
                      <button
                        onClick={goLast}
                        disabled={page === totalPages}
                        className={`px-3 py-1.5 text-sm rounded-md border border-[#e0e0e0] ${
                          page === totalPages
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-[#f7f7f7]"
                        }`}
                        aria-label="Última página"
                        title="Última página"
                      >
                        »
                      </button>
                    </div>
                  </div>
                </>
              );
            }

            return <TabelaReproducoesPaginada />;
          })()}
        </div>
      </div>
    </>
  );
}
