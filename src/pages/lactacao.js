import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
import { 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";

export default function Lactacao() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  // Dados mockados para lactação
  const [viewMode, setViewMode] = React.useState('monthly'); // 'monthly' ou 'yearly'
  
  const productionDataMonthly = [
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

  const productionDataYearly = [
    { name: "2020", producao: 68000 },
    { name: "2021", producao: 78200 },
    { name: "2022", producao: 88200 },
    { name: "2023", producao: 99700 },
    { name: "2024", producao: 112000 },
  ];

  const productionData = viewMode === 'monthly' ? productionDataMonthly : productionDataYearly;

  const dailyProductionData = [
    { day: 1, producao: 12.5 },
    { day: 2, producao: 13.2 },
    { day: 3, producao: 11.8 },
    { day: 4, producao: 14.1 },
    { day: 5, producao: 12.9 },
    { day: 6, producao: 13.7 },
    { day: 7, producao: 12.3 },
    { day: 8, producao: 13.8 },
    { day: 9, producao: 14.2 },
    { day: 10, producao: 12.6 },
    { day: 11, producao: 13.4 },
    { day: 12, producao: 11.9 },
    { day: 13, producao: 13.1 },
    { day: 14, producao: 14.0 },
    { day: 15, producao: 12.8 },
    { day: 16, producao: 13.5 },
    { day: 17, producao: 12.4 },
    { day: 18, producao: 13.9 },
    { day: 19, producao: 14.3 },
    { day: 20, producao: 12.7 },
    { day: 21, producao: 13.3 },
    { day: 22, producao: 12.1 },
    { day: 23, producao: 13.6 },
    { day: 24, producao: 14.4 },
    { day: 25, producao: 12.9 },
    { day: 26, producao: 13.8 },
    { day: 27, producao: 12.2 },
    { day: 28, producao: 13.7 },
    { day: 29, producao: 14.1 },
    { day: 30, producao: 12.5 },
  ];

  const bufalasComQueda = [
    { tag: "BUF001", variacao: -15.2, ultimaOrdenha: "15/12/2024", status: "Em observação" },
    { tag: "BUF045", variacao: -12.8, ultimaOrdenha: "14/12/2024", status: "Ativa" },
    { tag: "BUF023", variacao: -10.5, ultimaOrdenha: "13/12/2024", status: "Ativa" },
    { tag: "BUF067", variacao: -8.9, ultimaOrdenha: "12/12/2024", status: "Ativa" },
    { tag: "BUF089", variacao: -7.3, ultimaOrdenha: "11/12/2024", status: "Ativa" },
  ];

  const lactacoesMock = [
    { tag: "BUF001", mediaDiaria: 12.5, mediaSemanal: 87.5, ultimaOrdenha: "15/12/2024", variacao: -15.2, status: "Em observação" },
    { tag: "BUF002", mediaDiaria: 13.8, mediaSemanal: 96.6, ultimaOrdenha: "15/12/2024", variacao: 5.2, status: "Ativa" },
    { tag: "BUF003", mediaDiaria: 11.2, mediaSemanal: 78.4, ultimaOrdenha: "14/12/2024", variacao: -2.1, status: "Ativa" },
    { tag: "BUF004", mediaDiaria: 14.1, mediaSemanal: 98.7, ultimaOrdenha: "15/12/2024", variacao: 8.7, status: "Ativa" },
    { tag: "BUF005", mediaDiaria: 12.9, mediaSemanal: 90.3, ultimaOrdenha: "13/12/2024", variacao: 3.4, status: "Ativa" },
    { tag: "BUF006", mediaDiaria: 13.5, mediaSemanal: 94.5, ultimaOrdenha: "15/12/2024", variacao: 6.8, status: "Ativa" },
    { tag: "BUF007", mediaDiaria: 11.8, mediaSemanal: 82.6, ultimaOrdenha: "14/12/2024", variacao: -1.5, status: "Ativa" },
    { tag: "BUF008", mediaDiaria: 14.3, mediaSemanal: 100.1, ultimaOrdenha: "15/12/2024", variacao: 12.1, status: "Ativa" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Ativa":
        return "bg-[#9DFFBE] text-gray-800";
      case "Em observação":
        return "bg-[#FFCF78] text-gray-800";
      case "Inativa":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatus = (status) => {
    return status || "Desconhecido";
  };

  useEffect(() => {
    // Redirecionar para login se não estiver autenticado (mas só após carregar)
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Não mostrar nada se estiver carregando ou não autenticado
  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Lactação | Buffs</title>
        <meta name="description" content="Dashboard de lactação e produção de leite" />
      </Head>
      
      <div className="p-6 flex flex-col gap-8">
        {/* Header - Dashboard de Lactação */}
        <div className="w-full flex flex-col bg-white rounded-xl p-6 gap-6 box-border border border-[#e0e0e0] shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard de Lactação 🥛</h1>
            <p className="text-gray-600 text-lg">
              Monitore a produção de leite e gerencie o controle individual de lactação.
            </p>
          </div>
          
          {/* Estatísticas de Produção */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">Produção Diária</h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">Hoje</span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">1.250</p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">Litros produzidos</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">Produção Semanal</h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">7 dias</span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">8.750</p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">Litros na semana</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">Produção Mensal</h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">30 dias</span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">37.500</p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">Litros no mês</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">Búfalas Ativas</h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">Em lactação</span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">70</p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">Produzindo leite</p>
            </div>
          </div>
        </div>

        {/* Gráficos de Produção */}
        <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Análise de Produção</h2>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('monthly')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'monthly'
                    ? 'bg-white text-gray-800 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Mensal
              </button>
              <button
                onClick={() => setViewMode('yearly')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'yearly'
                    ? 'bg-white text-gray-800 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Anual
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Produção */}
            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Produção {viewMode === 'monthly' ? 'Mensal' : 'Anual'}
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={productionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value} L`} />
                  <Area 
                    type="monotone" 
                    dataKey="producao" 
                    stroke="#FFCF78" 
                    fill="#FFCF78" 
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Búfalas com Queda */}
            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Búfalas com Queda na Produção</h3>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Total identificado</span>
                  <span className="text-lg font-bold text-[#CE7D0A]">{bufalasComQueda.length} Búfalas</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Queda média</span>
                  <span className="text-lg font-bold text-red-600">-11.0%</span>
                </div>
              </div>
              
              <div className="bg-[#fff8f0] border border-[#FFCF78] rounded-lg p-3 mb-4">
                <h4 className="text-sm font-semibold text-[#CE7D0A] mb-1">Atenção requerida</h4>
                <p className="text-xs text-gray-700">
                  {bufalasComQueda.length} búfalas apresentam queda na produção. Verifique alimentação e saúde.
                </p>
              </div>

              <div className="space-y-2 max-h-32 overflow-y-auto">
                {bufalasComQueda.slice(0, 3).map((bufala, index) => (
                  <div key={bufala.tag} className="flex justify-between items-center text-sm">
                    <span className="font-medium">{bufala.tag}</span>
                    <span className="text-red-600">{bufala.variacao}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabela de Lactações */}
        <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Controle Individual de Lactação</h2>
            <p className="text-gray-600">
              Lista completa de búfalas em lactação com {lactacoesMock.length} animais ativos.
            </p>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full border-collapse min-w-[650px] bg-white rounded-lg overflow-hidden shadow-sm">
              <thead className="bg-[#f0f0f0]">
                <tr>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">TAG</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Média Diária (7d)</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Média Semanal</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Última Ordenha</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Variação</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Status</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Ações</th>
                </tr>
              </thead>
              <tbody>
                {lactacoesMock.map((lactacao, idx) => (
                  <tr key={lactacao.tag} className={idx % 2 === 0 ? "bg-[#fafafa]" : "bg-white"}>
                    <td className="p-3 text-center text-gray-800 text-base font-medium">{lactacao.tag}</td>
                    <td className="p-3 text-center text-gray-800 text-base">{lactacao.mediaDiaria} L</td>
                    <td className="p-3 text-center text-gray-800 text-base">{lactacao.mediaSemanal} L</td>
                    <td className="p-3 text-center text-gray-800 text-base">{lactacao.ultimaOrdenha}</td>
                    <td className="p-3 text-center text-gray-800 text-base">
                      <span className={lactacao.variacao >= 0 ? "text-green-600" : "text-red-600"}>
                        {lactacao.variacao >= 0 ? "+" : ""}{lactacao.variacao}%
                      </span>
                    </td>
                    <td className="p-3 text-center text-gray-800 text-base">
                      <span className={`px-2.5 py-1.5 rounded-full text-sm font-bold inline-block w-28 ${getStatusColor(lactacao.status)}`}>
                        {formatStatus(lactacao.status)}
                      </span>
                    </td>
                    <td className="p-3 text-center text-base">
                      <button className="bg-[#FFCF78] border-none text-gray-800 py-2 px-3.5 rounded-lg cursor-pointer text-sm font-bold hover:bg-[#F2B84D] transition-colors">
                        Ver detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Análise Detalhada */}
        <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Análise Detalhada de Produção</h2>
          <div className="w-full">
            {/* Produção Diária (30 dias) */}
            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Produção Diária (30 dias)</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={dailyProductionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fontSize: 10, fill: '#666' }}
                    tickLine={{ stroke: '#ccc' }}
                    axisLine={{ stroke: '#ccc' }}
                    interval={0}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#666' }}
                    tickLine={{ stroke: '#ccc' }}
                    axisLine={{ stroke: '#ccc' }}
                    domain={['dataMin - 1', 'dataMax + 1']}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value} L`, 'Produção']}
                    labelFormatter={(label) => `Dia ${label}`}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #ccc',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="producao" 
                    stroke="#FFCF78" 
                    strokeWidth={2}
                    dot={{ 
                      fill: "#CE7D0A", 
                      stroke: "#FFCF78", 
                      strokeWidth: 2, 
                      r: 3,
                      strokeOpacity: 0.8
                    }}
                    activeDot={{ 
                      fill: "#CE7D0A", 
                      stroke: "#FFCF78", 
                      strokeWidth: 3, 
                      r: 5 
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
