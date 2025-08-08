import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
import { 
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  AreaChart,
  Area
} from "recharts";

export default function Alimentacao() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  // Dados mockados para alimentação
  const [viewMode, setViewMode] = React.useState('monthly'); // 'monthly' ou 'yearly'
  
  const consumoMensal = [
    { mes: "Jan", racao: 4500, silagem: 3200, concentrado: 1800, suplemento: 900 },
    { mes: "Fev", racao: 4800, silagem: 3400, concentrado: 1900, suplemento: 950 },
    { mes: "Mar", racao: 5200, silagem: 3600, concentrado: 2100, suplemento: 1000 },
    { mes: "Abr", racao: 5500, silagem: 3800, concentrado: 2200, suplemento: 1100 },
    { mes: "Mai", racao: 5800, silagem: 4000, concentrado: 2300, suplemento: 1150 },
    { mes: "Jun", racao: 6200, silagem: 4200, concentrado: 2400, suplemento: 1200 },
    { mes: "Jul", racao: 6000, silagem: 4100, concentrado: 2350, suplemento: 1180 },
    { mes: "Ago", racao: 6300, silagem: 4300, concentrado: 2450, suplemento: 1250 },
    { mes: "Set", racao: 6500, silagem: 4400, concentrado: 2500, suplemento: 1300 },
    { mes: "Out", racao: 6800, silagem: 4600, concentrado: 2600, suplemento: 1350 },
    { mes: "Nov", racao: 7000, silagem: 4800, concentrado: 2700, suplemento: 1400 },
    { mes: "Dez", racao: 7200, silagem: 5000, concentrado: 2800, suplemento: 1450 },
  ];

  const consumoAnual = [
    { ano: "2020", total: 58000 },
    { ano: "2021", total: 62000 },
    { ano: "2022", total: 68000 },
    { ano: "2023", total: 72000 },
    { ano: "2024", total: 78000 },
  ];

  const consumoData = viewMode === 'monthly' ? consumoMensal : consumoAnual;

  const distribuicaoTipos = [
    { name: "Ração", value: 45, color: "#FFCF78" },
    { name: "Silagem", value: 32, color: "#CE7D0A" },
    { name: "Concentrado", value: 18, color: "#F2B84D" },
    { name: "Suplemento", value: 5, color: "#FCA90F" },
  ];

  const distribuicaoGrupos = [
    { grupo: "Em lactação", quantidade: 2800, percentual: 40 },
    { grupo: "Secagem", quantidade: 1400, percentual: 20 },
    { grupo: "Seca", quantidade: 1050, percentual: 15 },
    { grupo: "Pré-parto", quantidade: 1050, percentual: 15 },
    { grupo: "Bezerros", quantidade: 700, percentual: 10 },
  ];

  

  const alimentacoesMock = [
    { id: 1, nome: "Ração Premium Lactação", tipo: "Sólido", quantidade: 5.5, unidade: "kg", grupo: "Em lactação", frequencia: 3, status: "Ativo" },
    { id: 2, nome: "Silagem de Milho", tipo: "Pastoso", quantidade: 15.0, unidade: "kg", grupo: "Todos", frequencia: 2, status: "Ativo" },
    { id: 3, nome: "Concentrado Energético", tipo: "Sólido", quantidade: 2.0, unidade: "kg", grupo: "Em lactação", frequencia: 2, status: "Ativo" },
    { id: 4, nome: "Suplemento Mineral", tipo: "Sólido", quantidade: 0.1, unidade: "kg", grupo: "Todos", frequencia: 1, status: "Ativo" },
    { id: 5, nome: "Ração Secagem", tipo: "Sólido", quantidade: 4.0, unidade: "kg", grupo: "Secagem", frequencia: 2, status: "Ativo" },
    { id: 6, nome: "Feno de Capim", tipo: "Sólido", quantidade: 8.0, unidade: "kg", grupo: "Seca", frequencia: 2, status: "Ativo" },
  ];

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
        <title>Alimentação | Buffs</title>
        <meta name="description" content="Gestão da alimentação do rebanho" />
      </Head>
      
      <div className="p-6 flex flex-col gap-8">
        {/* Header - Gestão da Alimentação */}
        <div className="w-full flex flex-col bg-white rounded-xl p-6 gap-6 box-border border border-[#e0e0e0] shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestão da Alimentação </h1>
            <p className="text-gray-600 text-lg">
              Controle o consumo de alimentos e distribuição por grupos do rebanho.
            </p>
          </div>
          
          {/* Resumo da Alimentação */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">Consumo Diário</h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">Hoje</span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">7.200</p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">kg de alimentos</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">Consumo Mensal</h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">Dezembro</span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">216.000</p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">kg no mês</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">Tipos de Alimento</h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">Cadastrados</span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">6</p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">Diferentes tipos</p>
            </div>

            
          </div>
        </div>

        {/* Gráficos de Consumo */}
        <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Análise de Consumo</h2>
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
            {/* Gráfico de Consumo por Tipo */}
            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Consumo {viewMode === 'monthly' ? 'Mensal' : 'Anual'} por Tipo
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                {viewMode === 'monthly' ? (
                  <BarChart data={consumoData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value} kg`} />
                    <Legend />
                    <Bar dataKey="racao" fill="#FFCF78" name="Ração" />
                    <Bar dataKey="silagem" fill="#CE7D0A" name="Silagem" />
                    <Bar dataKey="concentrado" fill="#F2B84D" name="Concentrado" />
                    <Bar dataKey="suplemento" fill="#FCA90F" name="Suplemento" />
                  </BarChart>
                ) : (
                  <AreaChart data={consumoData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="ano" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value} kg`} />
                    <Area 
                      type="monotone" 
                      dataKey="total" 
                      stroke="#FFCF78" 
                      fill="#FFCF78" 
                      fillOpacity={0.6}
                      name="Consumo Total"
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Distribuição por Tipos */}
            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Distribuição por Tipos de Alimento</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={distribuicaoTipos}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {distribuicaoTipos.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Distribuição por Grupos */}
        <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Distribuição por Grupos do Rebanho</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Barras */}
            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Quantidade por Grupo (kg/dia)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={distribuicaoGrupos}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="grupo" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value} kg`} />
                  <Bar dataKey="quantidade" fill="#FFCF78">
                    {distribuicaoGrupos.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={[
                          '#FFCF78', // Amarelo dourado
                          '#CE7D0A', // Laranja escuro
                          '#F2B84D', // Laranja médio
                          '#FCA90F', // Laranja claro
                          '#E6A23C'  // Laranja dourado
                        ][index % 5]} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Percentual por Grupo */}
            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Percentual de Consumo</h3>
              <div className="space-y-4">
                {distribuicaoGrupos.map((grupo, index) => (
                  <div key={grupo.grupo} className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-800">{grupo.grupo}</span>
                      <span className="text-sm font-medium text-gray-800">{grupo.percentual}%</span>
                    </div>
                    <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full flex items-center justify-end pr-2"
                        style={{ 
                          width: `${grupo.percentual}%`,
                          backgroundColor: [
                            '#FFCF78', '#CE7D0A', '#F2B84D', '#FCA90F', '#E6A23C'
                          ][index % 5]
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        

        {/* Tabela de Alimentações */}
        <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Registro de Alimentações</h2>
            <p className="text-gray-600">
              Lista completa de alimentações cadastradas com {alimentacoesMock.length} tipos diferentes.
            </p>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full border-collapse min-w-[800px] bg-white rounded-lg overflow-hidden shadow-sm">
              <thead className="bg-[#f0f0f0]">
                <tr>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Nome</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Tipo</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Quantidade</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Unidade</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Grupo Destinado</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Frequência</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Status</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Ações</th>
                </tr>
              </thead>
              <tbody>
                {alimentacoesMock.map((alimento, idx) => (
                  <tr key={alimento.id} className={idx % 2 === 0 ? "bg-[#fafafa]" : "bg-white"}>
                    <td className="p-3 text-center text-gray-800 text-base font-medium">{alimento.nome}</td>
                    <td className="p-3 text-center text-gray-800 text-base">{alimento.tipo}</td>
                    <td className="p-3 text-center text-gray-800 text-base">{alimento.quantidade}</td>
                    <td className="p-3 text-center text-gray-800 text-base">{alimento.unidade}</td>
                    <td className="p-3 text-center text-gray-800 text-base">{alimento.grupo}</td>
                    <td className="p-3 text-center text-gray-800 text-base">{alimento.frequencia}x/dia</td>
                    <td className="p-3 text-center text-gray-800 text-base">
                      <span className="px-2.5 py-1.5 rounded-full text-sm font-bold inline-block w-20 bg-[#9DFFBE] text-gray-800">
                        {alimento.status}
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
      </div>
    </>
  );
}
