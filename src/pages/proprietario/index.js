import Head from "next/head";
import { getMyProfile } from "@/services/userService";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

import { useState, useEffect } from "react";
import dashboardService from "@/services/dashboardService";
import lactacaoService from "@/services/lactacaoService";

export default function Dashboard() {
  // ID da propriedade (fixo para exemplo, pode vir do contexto)
  const propriedadeId = "e7625c27-da8d-4ffa-a514-0c191b1fb1e3";
  const [userName, setUserName] = useState("");
  const anoAtual = new Date().getFullYear();
  const [lactationData, setLactationData] = useState([]);
  const [loadingLactation, setLoadingLactation] = useState(false);
  const [errorLactation, setErrorLactation] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loadingDashboardStats, setLoadingDashboardStats] = useState(false);
  const [errorDashboardStats, setErrorDashboardStats] = useState(null);
  useEffect(() => {
    getMyProfile()
      .then((data) => setUserName(data.nome))
      .catch(() => setUserName("Usuário"));
  }, []);

  useEffect(() => {
    setLoadingDashboardStats(true);
    dashboardService.getDashboardStatsByPropriedadeId(propriedadeId)
      .then((data) => setDashboardStats(data))
      .catch(() => setErrorDashboardStats("Erro ao carregar estatísticas do dashboard."))
      .finally(() => setLoadingDashboardStats(false));
  }, [propriedadeId]);

  useEffect(() => {
    setLoadingLactation(true);
    dashboardService.getProducaoMensalByPropriedadeId(propriedadeId, anoAtual)
      .then((data) => {
        if (data.serie_historica) {
          // Mapear para formato do gráfico
          // Garantir que os meses fiquem em ordem e o label seja sempre 2 dígitos
          const mapped = data.serie_historica.map((item) => {
            const [ano, mes] = item.mes.split("-");
            return {
              name: `${mes.padStart(2, "0")}/${ano.slice(2)}`,
              producao: item.total_litros,
              mesNum: parseInt(mes, 10)
            };
          });
          // Ordenar por número do mês
          mapped.sort((a, b) => a.mesNum - b.mesNum);
          setLactationData(mapped);
        } else {
          setLactationData([]);
        }
      })
      .catch(() => {
        setErrorLactation("Erro ao carregar produção mensal.");
        setLactationData([]);
      })
      .finally(() => setLoadingLactation(false));
  }, [propriedadeId, anoAtual]);

  const [topBuffalosData, setTopBuffalosData] = useState([]);
  const [loadingTopBuffalos, setLoadingTopBuffalos] = useState(false);
  const [errorTopBuffalos, setErrorTopBuffalos] = useState(null);

  useEffect(() => {
    setLoadingTopBuffalos(true);
    lactacaoService.listarFemeasEmLactacao(propriedadeId)
      .then((bufalas) => {
        // Ordena por média diária de produção (desc), pega as 5 primeiras
        const top5 = [...bufalas]
          .sort((a, b) => (b.producao_atual?.media_diaria ?? 0) - (a.producao_atual?.media_diaria ?? 0))
          .slice(0, 5)
          .map((bufala) => ({
            name: `${bufala.nome} (${bufala.brinco})`,
            leite: bufala.producao_atual?.media_diaria ?? 0,
            classificacao: bufala.classificacao
          }));
        setTopBuffalosData(top5);
        setErrorTopBuffalos(null);
      })
      .catch(() => {
        setTopBuffalosData([]);
        setErrorTopBuffalos("Erro ao carregar búfalas em lactação.");
      })
      .finally(() => setLoadingTopBuffalos(false));
  }, [propriedadeId]);

  const salesData = {
    lastCollection: {
      amount: 300,
      date: new Date(2024, 9, 1),
    },
    pricePerLiter: 3.5,
    estimatedRevenue: 1050,
  }; // <-- FECHAMENTO ADICIONADO AQUI

  const formatDate = (date) => date.toLocaleDateString("pt-BR");
  const formatCurrency = (value) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  return (
    <>
      <Head>
        <title>Dashboard | Buffs</title>
        <meta name="description" content="Dashboard da plataforma Buffs" />
      </Head>

      <div className="p-6 flex flex-col gap-8">
        {/* Header and Indicators */}
        <div className="w-full flex flex-col bg-white rounded-xl p-6 gap-6 box-border border border-[#e0e0e0] shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Olá, {userName || "Usuário"}!{" "}
            </h1>
            <p className="text-gray-600 text-lg">
              Bem-vindo ao dashboard da sua fazenda de búfalos. Aqui está o
              resumo de hoje.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total de Búfalos */}
            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">Total de Búfalos</h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">Total</span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">
                {loadingDashboardStats
                  ? '...'
                  : dashboardStats?.qtd_macho_ativos != null && dashboardStats?.qtd_femeas_ativas != null
                  ? dashboardStats.qtd_macho_ativos + dashboardStats.qtd_femeas_ativas
                  : '-'}
              </p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">Rebanho ativo</p>
            </div>

            {/* Total de Machos */}
            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">Total de Machos</h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">Ativos</span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">
                {loadingDashboardStats ? '...' : dashboardStats?.qtd_macho_ativos ?? '-'}
              </p>
              <p className="text-sm font-semibold text-[var(--color-primary-dark)] mt-1">
                {/* Exemplo: percentual dos machos no rebanho */}
                {dashboardStats?.qtd_bufalos_registradas && dashboardStats?.qtd_macho_ativos
                  ? `${Math.round((dashboardStats.qtd_macho_ativos / dashboardStats.qtd_bufalos_registradas) * 100)}% do rebanho`
                  : '-'}
              </p>
            </div>

            {/* Total de Fêmeas */}
            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">Total de Fêmeas</h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">Ativas</span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">
                {loadingDashboardStats ? '...' : dashboardStats?.qtd_femeas_ativas ?? '-'}
              </p>
              <p className="text-sm font-semibold text-[var(--color-primary-dark)] mt-1">
                {/* Exemplo: percentual das fêmeas no rebanho */}
                {dashboardStats?.qtd_bufalos_registradas && dashboardStats?.qtd_femeas_ativas
                  ? `${Math.round((dashboardStats.qtd_femeas_ativas / dashboardStats.qtd_bufalos_registradas) * 100)}% do rebanho`
                  : '-'}
              </p>
            </div>

            {/* Total de Usuários */}
            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">Total de Usuários</h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">Ativos</span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">
                {loadingDashboardStats ? '...' : dashboardStats?.qtd_usuarios ?? '-'}
              </p>
              <p className="text-sm font-medium text-[var(--color-text-tertiary)] mt-1">Funcionários ativos</p>
            </div>
          </div>
        </div>

        {/* Charts - First Row */}
        <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Milk Production Chart */}
            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Produção de Leite Mensal
                </h2>
                {/* Removido alternância mensal/anual, só mensal */}
              </div>
              <ResponsiveContainer width="100%" height={300}>
                {loadingLactation ? (
                  <div className="flex items-center justify-center h-full text-gray-500">Carregando produção mensal...</div>
                ) : errorLactation ? (
                  <div className="flex items-center justify-center h-full text-red-500">{errorLactation}</div>
                ) : (
                  <LineChart data={lactationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" interval={0} angle={-35} textAnchor="end" height={60} />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value} L`} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="producao"
                      stroke="#FFCF78"
                      strokeWidth={3}
                      name="Produção (L)"
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Top Buffaloes Chart */}
            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Top 5 Búfalas Produtoras
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                {loadingTopBuffalos ? (
                  <div className="flex items-center justify-center h-full text-gray-500">Carregando búfalas...</div>
                ) : errorTopBuffalos ? (
                  <div className="flex items-center justify-center h-full text-red-500">{errorTopBuffalos}</div>
                ) : topBuffalosData.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">Nenhuma búfala encontrada.</div>
                ) : (
                  <BarChart
                    data={topBuffalosData}
                    layout="vertical"
                    margin={{ left: 50 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip formatter={(value) => `${value} L/dia`} />
                    <Legend />
                    <Bar dataKey="leite" fill="#FFCF78" name="Leite (L/dia)">
                      {topBuffalosData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            [
                              "#FFCF78",
                              "#CE7D0A",
                              "#F2B84D",
                              "#FCA90F",
                              "#E6A23C",
                            ][index % 5]
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}