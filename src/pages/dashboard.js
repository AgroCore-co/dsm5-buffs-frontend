import React, { useEffect , useState} from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";

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
  PieChart,
  Pie,
  Cell,
} from "recharts";
// Removido: ícones de biblioteca. Vamos usar SVGs locais em /public/images

export default function Dashboard() {
  const [idPropriedade, setIdPropriedade] = useState(null);

  useEffect(() => {
    const storedId = localStorage.getItem("idPropriedade");
    if (storedId) setIdPropriedade(Number(storedId));
    console.log("ID da propriedade:", storedId);
  }, []);

  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  // Dados mockados para os gráficos
  const [viewMode, setViewMode] = React.useState("monthly"); // 'monthly' ou 'yearly'

  const lactationDataMonthly = [
    { name: "Jan", producao: 8500 },
    { name: "Fev", producao: 9200 },
    { name: "Mar", producao: 8800 },
    { name: "Abr", producao: 9500 },
    { name: "Mai", producao: 9800 },
    { name: "Jun", producao: 10200 },
    { name: "Jul", producao: 9900 },
    { name: "Ago", producao: 10500 },
    { name: "Set", producao: 10800 },
    { name: "Out", producao: 11200 },
    { name: "Nov", producao: 11500 },
    { name: "Dez", producao: 11800 },
  ];

  const lactationDataYearly = [
    { name: "2020", producao: 68000 },
    { name: "2021", producao: 78200 },
    { name: "2022", producao: 88200 },
    { name: "2023", producao: 99700 },
    { name: "2024", producao: 112000 },
  ];

  const lactationData =
    viewMode === "monthly" ? lactationDataMonthly : lactationDataYearly;

  const topBuffalosData = [
    { name: "Búfala 001", leite: 12.5 },
    { name: "Búfala 045", leite: 11.8 },
    { name: "Búfala 023", leite: 11.2 },
    { name: "Búfala 067", leite: 10.9 },
    { name: "Búfala 089", leite: 10.5 },
  ];

  const productionVsCollection = [
    { month: "Jan", producao: 8500, coleta: 8200 },
    { month: "Fev", producao: 9200, coleta: 8900 },
    { month: "Mar", producao: 8800, coleta: 8500 },
    { month: "Abr", producao: 9500, coleta: 9200 },
    { month: "Mai", producao: 9800, coleta: 9500 },
    { month: "Jun", producao: 10200, coleta: 9900 },
    { month: "Jul", producao: 9900, coleta: 9600 },
    { month: "Ago", producao: 10500, coleta: 10200 },
    { month: "Set", producao: 10800, coleta: 10500 },
    { month: "Out", producao: 11200, coleta: 10900 },
    { month: "Nov", producao: 11500, coleta: 11200 },
    { month: "Dez", producao: 11800, coleta: 11500 },
  ];

  const salesData = {
    lastCollection: {
      amount: 11500,
      date: new Date(2024, 11, 15),
    },
    pricePerLiter: 3.5,
    estimatedRevenue: 40250,
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("pt-BR");
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Removido: proteção de rota agora é feita pelo Layout

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
              Olá, João Lima!{" "}
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
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">
                  Total de Búfalos
                </h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">
                  Total
                </span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">
                150
              </p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                Rebanho completo
              </p>
            </div>

            {/* Total de Machos */}
            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">
                  Total de Machos
                </h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">
                  Percentual
                </span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">
                45
              </p>
              <p className="text-sm font-semibold text-[var(--color-primary-dark)] mt-1">
                30% do rebanho
              </p>
            </div>

            {/* Total de Fêmeas */}
            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">
                  Total de Fêmeas
                </h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">
                  Percentual
                </span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">
                105
              </p>
              <p className="text-sm font-semibold text-[var(--color-primary-dark)] mt-1">
                70% do rebanho
              </p>
            </div>

            {/* Total de Usuários */}
            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">
                  Total de Usuários
                </h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">
                  Ativos
                </span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">
                12
              </p>
              <p className="text-sm font-medium text-[var(--color-text-tertiary)] mt-1">
                Funcionários ativos
              </p>
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
                  Produção de Leite{" "}
                  {viewMode === "monthly" ? "Mensal" : "Anual"}
                </h2>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("monthly")}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      viewMode === "monthly"
                        ? "bg-white text-gray-800 shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    Mensal
                  </button>
                  <button
                    onClick={() => setViewMode("yearly")}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      viewMode === "yearly"
                        ? "bg-white text-gray-800 shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    Anual
                  </button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lactationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
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
              </ResponsiveContainer>
            </div>

            {/* Top Buffaloes Chart */}
            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Top 5 Búfalas Produtoras
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topBuffalosData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value} L/dia`} />
                  <Legend />
                  <Bar dataKey="leite" fill="#FFCF78" name="Leite (L/dia)">
                    {topBuffalosData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          [
                            "#FFCF78", // Amarelo dourado (primária)
                            "#CE7D0A", // Laranja escuro (primária escura)
                            "#F2B84D", // Laranja médio (hover)
                            "#FCA90F", // Laranja claro (primária light)
                            "#E6A23C", // Laranja dourado (variação)
                          ][index % 5]
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Sales Indicators */}
        <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Vendas para Indústria
            </h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <h2 className="text-sm font-medium text-gray-500">
                Última Coleta
              </h2>
              <p className="text-2xl font-bold text-gray-800">
                {salesData.lastCollection.amount.toLocaleString("pt-BR")} L
              </p>
              <h2 className="text-sm font-medium text-gray-500">
                Em {formatDate(salesData.lastCollection.date)}
              </h2>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <h2 className="text-sm font-medium text-gray-500">
                Valor por litro
              </h2>
              <p className="text-2xl font-bold text-gray-800">
                {formatCurrency(salesData.pricePerLiter)}
              </p>
              <p className="text-sm font-medium text-gray-500">
                Média das últimas vendas
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <h2 className="text-sm font-medium text-gray-500">
                Faturamento estimado
              </h2>
              <p className="text-2xl font-bold text-gray-800">
                {formatCurrency(salesData.estimatedRevenue)}
              </p>
              <p className="text-sm font-medium text-gray-500">
                Baseado na produção mensal
              </p>
            </div>
          </div>
        </div>

        {/* Production Collection Chart */}
        <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Produção vs Coleta Mensal
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={productionVsCollection}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
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
              <Line
                type="monotone"
                dataKey="coleta"
                stroke="#CE7D0A"
                strokeWidth={3}
                name="Coleta (L)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
