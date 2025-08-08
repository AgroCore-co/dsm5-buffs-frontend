import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
import { 
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
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";

export default function Reproducao() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  // Dados mockados para reprodução
  const [viewMode, setViewMode] = React.useState('monthly'); // 'monthly' ou 'yearly'
  
  const inseminacoesDataMonthly = [
    { name: "Jan", inseminacoes: 25, prenhezes: 18 },
    { name: "Fev", inseminacoes: 28, prenhezes: 22 },
    { name: "Mar", inseminacoes: 30, prenhezes: 24 },
    { name: "Abr", inseminacoes: 27, prenhezes: 21 },
    { name: "Mai", inseminacoes: 32, prenhezes: 26 },
    { name: "Jun", inseminacoes: 29, prenhezes: 23 },
    { name: "Jul", inseminacoes: 31, prenhezes: 25 },
    { name: "Ago", inseminacoes: 26, prenhezes: 20 },
    { name: "Set", inseminacoes: 33, prenhezes: 27 },
    { name: "Out", inseminacoes: 30, prenhezes: 24 },
    { name: "Nov", inseminacoes: 28, prenhezes: 22 },
    { name: "Dez", inseminacoes: 35, prenhezes: 28 },
  ];

  const inseminacoesDataYearly = [
    { name: "2020", inseminacoes: 280, prenhezes: 220 },
    { name: "2021", inseminacoes: 320, prenhezes: 260 },
    { name: "2022", inseminacoes: 350, prenhezes: 290 },
    { name: "2023", inseminacoes: 380, prenhezes: 310 },
    { name: "2024", inseminacoes: 400, prenhezes: 330 },
  ];

  const inseminacoesData = viewMode === 'monthly' ? inseminacoesDataMonthly : inseminacoesDataYearly;

  const statusReprodutivoData = [
    { name: "Lactando", value: 45, color: "#FFCF78" },
    { name: "Prenha", value: 35, color: "#CE7D0A" },
    { name: "No cio", value: 15, color: "#F2B84D" },
    { name: "Em secagem", value: 5, color: "#FCA90F" },
  ];

  const taxaConcepcaoData = [
    { mes: "Jan", taxa: 72.0 },
    { mes: "Fev", taxa: 78.6 },
    { mes: "Mar", taxa: 80.0 },
    { mes: "Abr", taxa: 77.8 },
    { mes: "Mai", taxa: 81.3 },
    { mes: "Jun", taxa: 79.3 },
    { mes: "Jul", taxa: 80.6 },
    { mes: "Ago", taxa: 76.9 },
    { mes: "Set", taxa: 81.8 },
    { mes: "Out", taxa: 80.0 },
    { mes: "Nov", taxa: 78.6 },
    { mes: "Dez", taxa: 80.0 },
  ];

  const bufalasEmCio = [
    { tag: "BUF001", ultimoCio: "15/12/2024", diasCiclo: 21, status: "Pronta para inseminação" },
    { tag: "BUF045", ultimoCio: "14/12/2024", diasCiclo: 18, status: "Aguardando" },
    { tag: "BUF023", ultimoCio: "13/12/2024", diasCiclo: 22, status: "Pronta para inseminação" },
    { tag: "BUF067", ultimoCio: "12/12/2024", diasCiclo: 19, status: "Aguardando" },
    { tag: "BUF089", ultimoCio: "11/12/2024", diasCiclo: 20, status: "Pronta para inseminação" },
  ];

  const reproducoesMock = [
    { tag: "BUF001", vetResponsavel: "Dr. Silva", dataInseminacao: "15/11/2024", tipoInseminacao: "IA", status: "Prenha", dataStatus: "15/12/2024" },
    { tag: "BUF002", vetResponsavel: "Dra. Santos", dataInseminacao: "10/11/2024", tipoInseminacao: "IA", status: "Lactando", dataStatus: "10/12/2024" },
    { tag: "BUF003", vetResponsavel: "Dr. Costa", dataInseminacao: "05/11/2024", tipoInseminacao: "Monta Natural", status: "No cio", dataStatus: "05/12/2024" },
    { tag: "BUF004", vetResponsavel: "Dra. Oliveira", dataInseminacao: "01/11/2024", tipoInseminacao: "IA", status: "Em secagem", dataStatus: "01/12/2024" },
    { tag: "BUF005", vetResponsavel: "Dr. Pereira", dataInseminacao: "28/10/2024", tipoInseminacao: "IA", status: "Prenha", dataStatus: "28/11/2024" },
    { tag: "BUF006", vetResponsavel: "Dra. Ferreira", dataInseminacao: "25/10/2024", tipoInseminacao: "Monta Natural", status: "Lactando", dataStatus: "25/11/2024" },
    { tag: "BUF007", vetResponsavel: "Dr. Rodrigues", dataInseminacao: "20/10/2024", tipoInseminacao: "IA", status: "No cio", dataStatus: "20/11/2024" },
    { tag: "BUF008", vetResponsavel: "Dra. Almeida", dataInseminacao: "15/10/2024", tipoInseminacao: "IA", status: "Prenha", dataStatus: "15/11/2024" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Lactando":
        return "bg-[#9DFFBE] text-gray-800";
      case "Prenha":
        return "bg-[#FFCF78] text-gray-800";
      case "No cio":
        return "bg-[#F2B84D] text-gray-800";
      case "Em secagem":
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
        <title>Controle de Reprodução | Buffs</title>
        <meta name="description" content="Controle de reprodução e gestão reprodutiva" />
      </Head>
      
      <div className="p-6 flex flex-col gap-8">
        {/* Header - Controle de Reprodução */}
        <div className="w-full flex flex-col bg-white rounded-xl p-6 gap-6 box-border border border-[#e0e0e0] shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Controle de Reprodução 🐄</h1>
            <p className="text-gray-600 text-lg">
              Gerencie o ciclo reprodutivo do rebanho e otimize a taxa de concepção.
            </p>
          </div>
          
          {/* Estatísticas de Reprodução */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">Búfalas em Reprodução</h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">Ativas</span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">100</p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">Em ciclo reprodutivo</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">Taxa de Concepção</h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">Média</span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">79.5%</p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">Últimos 12 meses</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">Búfalas Prenhas</h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">Confirmadas</span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">35</p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">Gestação em andamento</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">Próximo Cio</h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">Previsto</span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">15</p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">Búfalas em 7 dias</p>
            </div>
          </div>
        </div>

        {/* Análise Financeira */}
        <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Análise Financeira</h2>
            <p className="text-gray-600">
              Búfalas com impacto financeiro negativo - não estão lactando nem entrando no cio.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">Búfalas Problemáticas</h2>
                <span className="text-xs font-medium text-red-600">⚠️ Atenção</span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-red-600">12</p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">Não lactando nem em cio</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">Percentual Crítico</h2>
                <span className="text-xs font-medium text-red-600">Do total</span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-red-600">12.0%</p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">Impacto financeiro</p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="text-red-600 text-lg">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-semibold text-red-800">Ação Requerida</h3>
                <p className="text-sm text-red-700 mt-1">
                  12 búfalas não estão lactando nem entrando no cio. Isso representa uma perda financeira significativa. 
                  Recomenda-se avaliação veterinária urgente e possível descarte se não houver melhora em 30 dias.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos de Reprodução */}
        <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Análise Reprodutiva</h2>
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
            {/* Gráfico de Inseminações vs Prenhezes */}
            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Inseminações vs Prenhezes {viewMode === 'monthly' ? 'Mensal' : 'Anual'}
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={inseminacoesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value} búfalas`} />
                  <Legend />
                  <Bar 
                    dataKey="inseminacoes" 
                    fill="#FFCF78" 
                    name="Inseminações"
                  />
                  <Bar 
                    dataKey="prenhezes" 
                    fill="#CE7D0A" 
                    name="Prenhezes"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Status Reprodutivo */}
            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Status Reprodutivo Atual</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusReprodutivoData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {statusReprodutivoData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} búfalas`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Tabela de Reproduções */}
        <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Controle de Reproduções</h2>
            <p className="text-gray-600">
              Lista completa de reproduções com {reproducoesMock.length} registros ativos.
            </p>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full border-collapse min-w-[650px] bg-white rounded-lg overflow-hidden shadow-sm">
              <thead className="bg-[#f0f0f0]">
                <tr>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">TAG</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Vet Responsável</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Data Inseminação</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Tipo</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Status</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Data Status</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Ações</th>
                </tr>
              </thead>
              <tbody>
                {reproducoesMock.map((reproducao, idx) => (
                  <tr key={reproducao.tag} className={idx % 2 === 0 ? "bg-[#fafafa]" : "bg-white"}>
                    <td className="p-3 text-center text-gray-800 text-base font-medium">{reproducao.tag}</td>
                    <td className="p-3 text-center text-gray-800 text-base">{reproducao.vetResponsavel}</td>
                    <td className="p-3 text-center text-gray-800 text-base">{reproducao.dataInseminacao}</td>
                    <td className="p-3 text-center text-gray-800 text-base">{reproducao.tipoInseminacao}</td>
                    <td className="p-3 text-center text-gray-800 text-base">
                      <span className={`px-2.5 py-1.5 rounded-full text-sm font-bold inline-block w-28 ${getStatusColor(reproducao.status)}`}>
                        {formatStatus(reproducao.status)}
                      </span>
                    </td>
                    <td className="p-3 text-center text-gray-800 text-base">{reproducao.dataStatus}</td>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Taxa de Concepção */}
            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Taxa de Concepção Mensal</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={taxaConcepcaoData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis domain={[60, 90]} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Area 
                    type="monotone" 
                    dataKey="taxa" 
                    stroke="#FFCF78" 
                    fill="#FFCF78" 
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Búfalas em Cio */}
            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Búfalas em Cio</h3>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Total identificado</span>
                  <span className="text-lg font-bold text-[#CE7D0A]">{bufalasEmCio.length} Búfalas</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Prontas para inseminação</span>
                  <span className="text-lg font-bold text-green-600">3</span>
                </div>
              </div>
              
              <div className="bg-[#fff8f0] border border-[#FFCF78] rounded-lg p-3 mb-4">
                <h4 className="text-sm font-semibold text-[#CE7D0A] mb-1">Atenção requerida</h4>
                <p className="text-xs text-gray-700">
                  {bufalasEmCio.filter(b => b.status === "Pronta para inseminação").length} búfalas prontas para inseminação.
                </p>
              </div>

              <div className="space-y-2 max-h-32 overflow-y-auto">
                {bufalasEmCio.slice(0, 3).map((bufala, index) => (
                  <div key={bufala.tag} className="flex justify-between items-center text-sm">
                    <span className="font-medium">{bufala.tag}</span>
                    <span className={bufala.status === "Pronta para inseminação" ? "text-green-600" : "text-orange-600"}>
                      {bufala.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
