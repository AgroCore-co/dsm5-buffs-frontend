// pages/propriedade/[id].jsx
"use client";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import dynamic from "next/dynamic";
import loteService from "@/services/loteService";
import TodosPiquetesModal from "@/components/propriedades/TodosPiquetesModal";

const MapaPiquetes = dynamic(() => import("@/components/MapaPiquetes"), {
  ssr: false, // desativa renderização no servidor
});

export default function PropriedadePage() {
  const { user, isLoading, isAuthenticated, getAccessToken } = useAuth();
  const [activeTab, setActiveTab] = useState("propriedade");
  const [lotes, setLotes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const router = useRouter();
  const { id } = router.query || {};

  useEffect(() => {
    // Redirecionar para login se não estiver autenticado (mas só após carregar)
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    async function fetchLotes() {
      if (id) {
        try {
          const lotesData = await loteService.listarLotesPorPropriedade(id);
          setLotes(lotesData);
        } catch (err) {
          setLotes([]);
        }
      }
    }
    fetchLotes();
  }, [id]);

  const lotesMock = [
    {
      id: 1,
      nome: "Lote A - Lactação",
      capacidade: 50,
      ocupacao: 45,
      area: 5000,
      unidade: "m²",
      status: "Em uso",
      propriedade: "Fazenda Principal",
    },
    {
      id: 2,
      nome: "Lote B - Gestação",
      capacidade: 40,
      ocupacao: 35,
      area: 4000,
      unidade: "m²",
      status: "Em uso",
      propriedade: "Fazenda Principal",
    },
    {
      id: 3,
      nome: "Lote C - Recria",
      capacidade: 30,
      ocupacao: 25,
      area: 3000,
      unidade: "m²",
      status: "Em uso",
      propriedade: "Fazenda Secundária",
    },
    {
      id: 4,
      nome: "Lote D - Terminação",
      capacidade: 25,
      ocupacao: 20,
      area: 2500,
      unidade: "m²",
      status: "Em uso",
      propriedade: "Fazenda Secundária",
    },
    {
      id: 5,
      nome: "Lote E - Reprodução",
      capacidade: 20,
      ocupacao: 15,
      area: 2000,
      unidade: "m²",
      status: "Em uso",
      propriedade: "Fazenda Principal",
    },
    {
      id: 6,
      nome: "Lote F - Quarentena",
      capacidade: 15,
      ocupacao: 10,
      area: 1500,
      unidade: "m²",
      status: "Em uso",
      propriedade: "Fazenda Principal",
    },
    {
      id: 7,
      nome: "Lote G - Disponível",
      capacidade: 35,
      ocupacao: 0,
      area: 3500,
      unidade: "m²",
      status: "Disponível",
      propriedade: "Fazenda Secundária",
    },
    {
      id: 8,
      nome: "Lote H - Manutenção",
      capacidade: 25,
      ocupacao: 0,
      area: 2500,
      unidade: "m²",
      status: "Manutenção",
      propriedade: "Fazenda Principal",
    },
  ];

  const ciclosMock = [
    {
      id: 1,
      nome: "Ciclo de Lactação 2024/1",
      periodo: "01/01/2024 - 30/06/2024",
      grupo: "Búfalas Lactantes A",
      status: "Em andamento",
      lote: "Lote A - Lactação",
    },
    {
      id: 2,
      nome: "Ciclo de Gestação 2024/1",
      periodo: "01/02/2024 - 01/11/2024",
      grupo: "Búfalas Gestantes",
      status: "Em andamento",
      lote: "Lote B - Gestação",
    },
    {
      id: 3,
      nome: "Ciclo de Recria 2024/1",
      periodo: "01/03/2024 - 31/08/2024",
      grupo: "Bezerros em Recria",
      status: "Em andamento",
      lote: "Lote C - Recria",
    },
    {
      id: 4,
      nome: "Ciclo de Terminação 2024/1",
      periodo: "01/04/2024 - 30/09/2024",
      grupo: "Búfalos em Terminação",
      status: "Em andamento",
      lote: "Lote D - Terminação",
    },
  ];

  const distribuicaoPorTipoData = [
    { tipo: "Lactação", quantidade: 45, percentual: 30 },
    { tipo: "Gestação", quantidade: 35, percentual: 23 },
    { tipo: "Recria", quantidade: 25, percentual: 17 },
    { tipo: "Terminação", quantidade: 20, percentual: 13 },
    { tipo: "Reprodução", quantidade: 15, percentual: 10 },
    { tipo: "Quarentena", quantidade: 10, percentual: 7 },
  ];

  const alimentacaoMock = [
    {
      id: 1,
      tipo: "Ração Concentrada",
      quantidade: "500 kg",
      consumoDiario: "25 kg/dia",
      estoque: "20 dias",
      status: "Normal",
    },
    {
      id: 2,
      tipo: "Silagem de Milho",
      quantidade: "2000 kg",
      consumoDiario: "100 kg/dia",
      estoque: "20 dias",
      status: "Normal",
    },
    {
      id: 3,
      tipo: "Feno de Capim",
      quantidade: "300 kg",
      consumoDiario: "50 kg/dia",
      estoque: "6 dias",
      status: "Baixo",
    },
    {
      id: 4,
      tipo: "Suplemento Mineral",
      quantidade: "50 kg",
      consumoDiario: "2 kg/dia",
      estoque: "25 dias",
      status: "Normal",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Em uso":
        return "bg-[#9DFFBE] text-gray-800";
      case "Disponível":
        return "bg-[#FFCF78] text-gray-800";
      case "Manutenção":
        return "bg-red-100 text-red-800";
      case "Normal":
        return "bg-green-100 text-green-800";
      case "Baixo":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatus = (status) => {
    return status || "Desconhecido";
  };

  const calcularOcupacaoPercentual = (ocupacao, capacidade) => {
    return capacidade > 0 ? Math.round((ocupacao / capacidade) * 100) : 0;
  };

  const PropriedadeTab = () => (
    <>
      {/* Estatísticas Gerais */}
      <div className="w-full flex flex-row gap-4 p-5 bg-white rounded-xl box-border border border-[#e0e0e0] shadow-sm ">
        <div className="flex-1 bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">
              Total búfalos
            </h2>
            <span className="text-xs font-medium text-[var(--color-primary-dark)]">
              Cadastradas
            </span>
          </div>
          <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">
            150
          </p>
          <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
            Animais na propriedade
          </p>
        </div>

        <div className="flex-1 bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">
              Área Total
            </h2>
            <span className="text-xs font-medium text-[var(--color-primary-dark)]">
              Hectares
            </span>
          </div>
          <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">
            24.5
          </p>
          <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
            Hectares disponíveis
          </p>
        </div>

        <div className="flex-1 bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">
              Total de Lotes
            </h2>
            <span className="text-xs font-medium text-[var(--color-primary-dark)]">
              Ativos
            </span>
          </div>
          <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">
            12
          </p>
          <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
            Lotes disponíveis
          </p>
        </div>

        <div className="flex-1 bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">
              Ocupação Média
            </h2>
            <span className="text-xs font-medium text-[var(--color-primary-dark)]">
              Atual
            </span>
          </div>
          <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">
            88%
          </p>
          <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
            Capacidade utilizada
          </p>
        </div>
      </div>

      {/* Análise Detalhada */}
      <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Análise Detalhada
          </h2>
          <p className="text-gray-600">
            Insights visuais sobre a distribuição e performance dos lotes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Distribuição por Tipo */}
          <div className="bg-gradient-to-br from-white to-orange-50 p-6 rounded-xl shadow border border-orange-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              Distribuição por Tipo de Lote
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={distribuicaoPorTipoData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="tipo" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => `${value} búfalos`}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar dataKey="quantidade" radius={[4, 4, 0, 0]}>
                  {distribuicaoPorTipoData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        [
                          "#FFCF78", // Amarelo dourado
                          "#CE7D0A", // Laranja escuro
                          "#F2B84D", // Laranja médio
                          "#FCA90F", // Laranja claro
                          "#E6A23C", // Laranja dourado
                          "#D4A574", // Marrom claro
                        ][index % 6]
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Resumo dos Dados */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-[#CE7D0A]">
                  {distribuicaoPorTipoData.reduce(
                    (sum, item) => sum + item.quantidade,
                    0
                  )}
                </p>
                <p className="text-sm text-gray-600">Total de Búfalos</p>
              </div>
              <div className="bg-white rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-[#FFCF78]">
                  {distribuicaoPorTipoData.length}
                </p>
                <p className="text-sm text-gray-600">Tipos de Lote</p>
              </div>
            </div>
          </div>

          {/* Resumo de Ciclos */}
          <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl shadow border border-blue-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              Resumo de Ciclos Ativos
            </h3>

            <div className="space-y-4">
              {/* Cards de Estatísticas */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-3xl font-bold text-[#CE7D0A] mb-1">
                    {ciclosMock.length}
                  </div>
                  <div className="text-sm text-gray-600">Total de Ciclos</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {
                      ciclosMock.filter((c) => c.status === "Em andamento")
                        .length
                    }
                  </div>
                  <div className="text-sm text-gray-600">Em Andamento</div>
                </div>
              </div>

              {/* Alert de Status */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div>
                    <h4 className="text-sm font-semibold text-green-800 mb-1">
                      Sistema Operacional
                    </h4>
                    <p className="text-xs text-green-700">
                      {
                        ciclosMock.filter((c) => c.status === "Em andamento")
                          .length
                      }{" "}
                      ciclos ativos funcionando perfeitamente.
                    </p>
                  </div>
                </div>
              </div>

              {/* Lista de Ciclos */}
              <div className="bg-white rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Ciclos em Execução
                </h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {ciclosMock.slice(0, 3).map((ciclo, index) => (
                    <div
                      key={ciclo.id}
                      className="flex justify-between items-center p-2 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-sm font-medium text-gray-800 truncate">
                          {ciclo.nome}
                        </span>
                      </div>
                      <span className="text-xs text-green-600 font-semibold">
                        {ciclo.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const PiquetesTab = () => (
    <>
      {/* Mapa dos Piquetes */}
      <div className="w-full flex flex-col bg-white rounded-xl p-6 gap-6 box-border border border-[#e0e0e0] shadow-sm mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Mapa dos Piquetes</h2>
          <p className="text-gray-600">Visualização geográfica dos lotes e piquetes da propriedade.</p>
        </div>
        {/* Área do Mapa */}
        <MapaPiquetes propriedadeId={id} lotesExternos={lotes} />
      </div>
      {/* Visão Geral dos Lotes */}
      <div className="w-full flex flex-col bg-white rounded-xl p-4 gap-3 box-border border border-[#e0e0e0] shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Visão Geral dos Lotes</h2>
            <p className="text-sm text-gray-600">{lotes.length} lotes ativos</p>
          </div>
          <button className="bg-[#FFCF78] text-gray-800 py-1 px-3 rounded text-xs font-bold hover:bg-[#F2B84D] transition-colors" onClick={() => setModalOpen(true)}>
            Ver Todos
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {lotes.slice(0, 6).map((lote) => (
            <div key={lote.id_lote} className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:bg-gray-100 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-semibold text-gray-800 truncate">{lote.nome_lote}</h3>
                <span className={`w-2 h-2 rounded-full ${lote.status === "Em uso" ? "bg-green-500" : lote.status === "Disponível" ? "bg-yellow-500" : "bg-red-500"}`}></span>
              </div>
              <div className="space-y-2">
                {/* Ocupação Compacta */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-600">Ocup.</span>
                    <span className="text-xs font-bold text-[#CE7D0A]">{lote.qtd_max || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div className="bg-[#FFCF78] h-1 rounded-full" style={{ width: `${lote.qtd_max || 0}%` }}></div>
                  </div>
                </div>
                {/* Informações Mínimas */}
                <div className="text-xs text-gray-600">
                  <div>{lote.qtd_max || 0} búfalos</div>
                  <div className="truncate">{lote.area_m2 || "-"} m²</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <TodosPiquetesModal open={modalOpen} onClose={() => setModalOpen(false)} lotes={lotes} />
      </div>
      {/* Tabela de Ciclos */}
      <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Ciclos de Manejo Ativos
          </h2>
          <p className="text-gray-600">
            Controle de ciclos de manejo com {ciclosMock.length} ciclos ativos.
          </p>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full border-collapse min-w-[650px] bg-white rounded-lg overflow-hidden shadow-sm">
            <thead className="bg-[#f0f0f0]">
              <tr>
                <th className="p-3 text-center font-medium text-gray-800 text-base">
                  Nome do Ciclo
                </th>
                <th className="p-3 text-center font-medium text-gray-800 text-base">
                  Período
                </th>
                <th className="p-3 text-center font-medium text-gray-800 text-base">
                  Grupo
                </th>
                <th className="p-3 text-center font-medium text-gray-800 text-base">
                  Lote
                </th>
                <th className="p-3 text-center font-medium text-gray-800 text-base">
                  Status
                </th>
                <th className="p-3 text-center font-medium text-gray-800 text-base">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {ciclosMock.map((ciclo) => (
                <tr
                  key={ciclo.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-3 text-center">
                    <div className="text-sm font-medium text-gray-800">
                      {ciclo.nome}
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <div className="text-sm text-gray-600">{ciclo.periodo}</div>
                  </td>
                  <td className="p-3 text-center">
                    <div className="text-sm text-gray-600">{ciclo.grupo}</div>
                  </td>
                  <td className="p-3 text-center">
                    <div className="text-sm text-gray-600">{ciclo.lote}</div>
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(
                        ciclo.status
                      )}`}
                    >
                      {formatStatus(ciclo.status)}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button className="bg-[#FFCF78] text-gray-800 py-1 px-3 rounded text-xs font-bold hover:bg-[#F2B84D] transition-colors">
                        Ver
                      </button>
                      <button className="bg-blue-500 text-white py-1 px-3 rounded text-xs font-bold hover:bg-blue-600 transition-colors">
                        Editar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const AlimentacaoTab = () => (
    <>
      {/* Estatísticas de Alimentação */}
      <div className="w-full flex flex-row gap-4 p-5 bg-white rounded-xl box-border border border-[#e0e0e0] shadow-sm">
        <div className="flex-1 bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">
              Tipos de Ração
            </h2>
            <span className="text-xs font-medium text-[var(--color-primary-dark)]">
              Disponíveis
            </span>
          </div>
          <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">
            {alimentacaoMock.length}
          </p>
          <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
            Tipos cadastrados
          </p>
        </div>

        <div className="flex-1 bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">
              Consumo Diário
            </h2>
            <span className="text-xs font-medium text-[var(--color-primary-dark)]">
              Total
            </span>
          </div>
          <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">
            177
          </p>
          <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
            kg por dia
          </p>
        </div>

        <div className="flex-1 bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">
              Estoque Crítico
            </h2>
            <span className="text-xs font-medium text-red-600">Atenção</span>
          </div>
          <p className="text-4xl font-extrabold tracking-tight text-red-600">
            1
          </p>
          <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
            Item com estoque baixo
          </p>
        </div>

        <div className="flex-1 bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">
              Custo Mensal
            </h2>
            <span className="text-xs font-medium text-[var(--color-primary-dark)]">
              Estimado
            </span>
          </div>
          <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">
            R$ 8.5k
          </p>
          <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
            Custo estimado
          </p>
        </div>
      </div>

      {/* Tabela de Alimentação */}
      <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Controle de Alimentação
          </h2>
          <p className="text-gray-600">
            Gestão de estoque e consumo de alimentos para os búfalos.
          </p>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full border-collapse min-w-[650px] bg-white rounded-lg overflow-hidden shadow-sm">
            <thead className="bg-[#f0f0f0]">
              <tr>
                <th className="p-3 text-center font-medium text-gray-800 text-base">
                  Tipo de Alimento
                </th>
                <th className="p-3 text-center font-medium text-gray-800 text-base">
                  Quantidade em Estoque
                </th>
                <th className="p-3 text-center font-medium text-gray-800 text-base">
                  Consumo Diário
                </th>
                <th className="p-3 text-center font-medium text-gray-800 text-base">
                  Duração do Estoque
                </th>
                <th className="p-3 text-center font-medium text-gray-800 text-base">
                  Status
                </th>
                <th className="p-3 text-center font-medium text-gray-800 text-base">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {alimentacaoMock.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-3 text-center">
                    <div className="text-sm font-medium text-gray-800">
                      {item.tipo}
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <div className="text-sm text-gray-600">
                      {item.quantidade}
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <div className="text-sm text-gray-600">
                      {item.consumoDiario}
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <div className="text-sm text-gray-600">{item.estoque}</div>
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {formatStatus(item.status)}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button className="bg-[#FFCF78] text-gray-800 py-1 px-3 rounded text-xs font-bold hover:bg-[#F2B84D] transition-colors">
                        Reabastecer
                      </button>
                      <button className="bg-blue-500 text-white py-1 px-3 rounded text-xs font-bold hover:bg-blue-600 transition-colors">
                        Editar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Planejamento de Alimentação */}
      <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Planejamento Nutricional
          </h2>
          <p className="text-gray-600">
            Planos alimentares por categoria de animal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <h3 className="text-lg font-bold text-green-800 mb-2">
              Búfalas Lactantes
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-green-700">Ração Concentrada:</span>
                <span className="font-semibold">8 kg/dia</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Silagem:</span>
                <span className="font-semibold">25 kg/dia</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Suplemento:</span>
                <span className="font-semibold">0.5 kg/dia</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <h3 className="text-lg font-bold text-blue-800 mb-2">
              Búfalas Gestantes
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">Ração Concentrada:</span>
                <span className="font-semibold">6 kg/dia</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Silagem:</span>
                <span className="font-semibold">20 kg/dia</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Suplemento:</span>
                <span className="font-semibold">0.3 kg/dia</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
            <h3 className="text-lg font-bold text-orange-800 mb-2">
              Animais em Recria
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-orange-700">Ração Concentrada:</span>
                <span className="font-semibold">4 kg/dia</span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-700">Feno:</span>
                <span className="font-semibold">15 kg/dia</span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-700">Suplemento:</span>
                <span className="font-semibold">0.2 kg/dia</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  if (!id) return <p>Carregando...</p>;

  return (
    <>
      <Head>
        <title>Gestão da propriedade {id} | Buffs</title>
        <meta
          name="description"
          content="Gestão e controle de propriedades rurais"
        />
      </Head>

      <div className="p-6 flex flex-col gap-8">
        {/* Header - Gestão de Propriedades */}
        <div className="w-full flex flex-col bg-white rounded-xl p-6 gap-6 box-border border border-[#e0e0e0] shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Gestão de Propriedades
            </h1>
            <p className="text-gray-600 text-lg">
              Controle e monitore todas as propriedades rurais do seu negócio.
            </p>
          </div>

          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("propriedade")}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "propriedade"
                  ? "border-[#FFCF78] text-[#CE7D0A] bg-orange-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Propriedade
            </button>
            <button
              onClick={() => setActiveTab("piquetes")}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "piquetes"
                  ? "border-[#FFCF78] text-[#CE7D0A] bg-orange-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Piquetes
            </button>
            <button
              onClick={() => setActiveTab("alimentacao")}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "alimentacao"
                  ? "border-[#FFCF78] text-[#CE7D0A] bg-orange-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Alimentação
            </button>
          </div>
        </div>

        {activeTab === "propriedade" && <PropriedadeTab />}
        {activeTab === "piquetes" && <PiquetesTab />}
        {activeTab === "alimentacao" && <AlimentacaoTab />}
      </div>
    </>
  );
}
