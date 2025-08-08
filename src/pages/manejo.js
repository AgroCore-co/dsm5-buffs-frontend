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

export default function Manejo() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  // Dados mockados para manejo

  const statusLotesData = [
    { name: "Em uso", value: 8, color: "#FFCF78" },
    { name: "Disponível", value: 3, color: "#CE7D0A" },
    { name: "Manutenção", value: 1, color: "#F2B84D" },
  ];

  const distribuicaoPorTipoData = [
    { tipo: "Lactação", quantidade: 45, percentual: 30 },
    { tipo: "Gestação", quantidade: 35, percentual: 23 },
    { tipo: "Recria", quantidade: 25, percentual: 17 },
    { tipo: "Terminação", quantidade: 20, percentual: 13 },
    { tipo: "Reprodução", quantidade: 15, percentual: 10 },
    { tipo: "Quarentena", quantidade: 10, percentual: 7 },
  ];

  const lotesMock = [
    { id: 1, nome: "Lote A - Lactação", capacidade: 50, ocupacao: 45, area: 5000, unidade: "m²", status: "Em uso", propriedade: "Fazenda Principal" },
    { id: 2, nome: "Lote B - Gestação", capacidade: 40, ocupacao: 35, area: 4000, unidade: "m²", status: "Em uso", propriedade: "Fazenda Principal" },
    { id: 3, nome: "Lote C - Recria", capacidade: 30, ocupacao: 25, area: 3000, unidade: "m²", status: "Em uso", propriedade: "Fazenda Secundária" },
    { id: 4, nome: "Lote D - Terminação", capacidade: 25, ocupacao: 20, area: 2500, unidade: "m²", status: "Em uso", propriedade: "Fazenda Secundária" },
    { id: 5, nome: "Lote E - Reprodução", capacidade: 20, ocupacao: 15, area: 2000, unidade: "m²", status: "Em uso", propriedade: "Fazenda Principal" },
    { id: 6, nome: "Lote F - Quarentena", capacidade: 15, ocupacao: 10, area: 1500, unidade: "m²", status: "Em uso", propriedade: "Fazenda Principal" },
    { id: 7, nome: "Lote G - Disponível", capacidade: 35, ocupacao: 0, area: 3500, unidade: "m²", status: "Disponível", propriedade: "Fazenda Secundária" },
    { id: 8, nome: "Lote H - Manutenção", capacidade: 25, ocupacao: 0, area: 2500, unidade: "m²", status: "Manutenção", propriedade: "Fazenda Principal" },
  ];

  const ciclosMock = [
    { id: 1, nome: "Ciclo de Lactação 2024/1", periodo: "01/01/2024 - 30/06/2024", grupo: "Búfalas Lactantes A", status: "Em andamento", lote: "Lote A - Lactação" },
    { id: 2, nome: "Ciclo de Gestação 2024/1", periodo: "01/02/2024 - 01/11/2024", grupo: "Búfalas Gestantes", status: "Em andamento", lote: "Lote B - Gestação" },
    { id: 3, nome: "Ciclo de Recria 2024/1", periodo: "01/03/2024 - 31/08/2024", grupo: "Bezerros em Recria", status: "Em andamento", lote: "Lote C - Recria" },
    { id: 4, nome: "Ciclo de Terminação 2024/1", periodo: "01/04/2024 - 30/09/2024", grupo: "Búfalos em Terminação", status: "Em andamento", lote: "Lote D - Terminação" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Em uso":
        return "bg-[#9DFFBE] text-gray-800";
      case "Disponível":
        return "bg-[#FFCF78] text-gray-800";
      case "Manutenção":
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
        <title>Manejo do Rebanho | Buffs</title>
        <meta name="description" content="Gestão de lotes e manejo do rebanho" />
      </Head>
      
      <div className="p-6 flex flex-col gap-8">
        {/* Mapa dos Piquetes */}
        <div className="w-full flex flex-col bg-white rounded-xl p-6 gap-6 box-border border border-[#e0e0e0] shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Mapa dos Piquetes </h2>
            <p className="text-gray-600">
              Visualização geográfica dos lotes e piquetes da propriedade.
            </p>
          </div>
          
          {/* Área do Mapa */}
          <div className="w-full bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center" style={{ height: '400px' }}>
            <div className="text-center">
              <div className="text-6xl mb-4"> 

                {/* mapa */}
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Mapa dos Piquetes</h3>
              <p className="text-gray-500 text-sm">
                Aqui será exibido o mapa interativo com a localização dos piquetes
              </p>
              <p className="text-gray-400 text-xs mt-2">
                Funcionalidade será implementada no futuro
              </p>
            </div>
          </div>
        </div>

        {/* Header - Manejo do Rebanho */}
        <div className="w-full flex flex-col bg-white rounded-xl p-6 gap-6 box-border border border-[#e0e0e0] shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Manejo do Rebanho 

            </h1>
            <p className="text-gray-600 text-lg">
              Gerencie lotes, piquetes e controle a distribuição do rebanho.
            </p>
          </div>
          
          {/* Estatísticas de Manejo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">Total de Lotes</h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">Ativos</span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">12</p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">Lotes disponíveis</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">Ocupação Média</h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">Atual</span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">88%</p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">Capacidade utilizada</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">Búfalos Alojados</h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">Total</span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">150</p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">Em lotes ativos</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">Área Total</h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">Disponível</span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">24.5</p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">Hectares</p>
            </div>
          </div>
        </div>

                 {/* Gráficos de Manejo */}
         <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm">
           <div className="mb-4">
             <h2 className="text-xl font-bold text-gray-800">Análise de Distribuição</h2>
             <p className="text-gray-600 text-sm">Visão geral da distribuição dos lotes e búfalos</p>
           </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                         {/* Gráfico de Distribuição por Propriedade */}
             <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
               <h3 className="text-lg font-bold text-gray-800 mb-4">
                 Distribuição por Propriedade
               </h3>
               <ResponsiveContainer width="100%" height={300}>
                 <BarChart data={[
                   { propriedade: "Fazenda Principal", lotes: 5, búfalos: 120, area: 12.5 },
                   { propriedade: "Fazenda Secundária", lotes: 3, búfalos: 30, area: 12.0 }
                 ]}>
                   <CartesianGrid strokeDasharray="3 3" />
                   <XAxis dataKey="propriedade" />
                   <YAxis />
                   <Tooltip formatter={(value, name) => [value, name === 'lotes' ? 'Lotes' : name === 'búfalos' ? 'Búfalos' : 'Área (ha)']} />
                   <Legend />
                   <Bar dataKey="lotes" fill="#FFCF78" name="Lotes" radius={[4, 4, 0, 0]} />
                   <Bar dataKey="búfalos" fill="#CE7D0A" name="Búfalos" radius={[4, 4, 0, 0]} />
                 </BarChart>
               </ResponsiveContainer>
             </div>

            {/* Status dos Lotes */}
            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Status dos Lotes</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusLotesData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {statusLotesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} lotes`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Visão Geral dos Lotes */}
        <div className="w-full flex flex-col bg-white rounded-xl p-4 gap-3 box-border border border-[#e0e0e0] shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Visão Geral dos Lotes </h2>
              <p className="text-sm text-gray-600">
                {lotesMock.length} lotes ativos
              </p>
            </div>
            <button className="bg-[#FFCF78] text-gray-800 py-1 px-3 rounded text-xs font-bold hover:bg-[#F2B84D] transition-colors">
              Ver Todos
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {lotesMock.slice(0, 6).map((lote) => (
              <div key={lote.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:bg-gray-100 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-semibold text-gray-800 truncate">{lote.nome}</h3>
                  <span className={`w-2 h-2 rounded-full ${lote.status === 'Em uso' ? 'bg-green-500' : lote.status === 'Disponível' ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
                </div>
                
                <div className="space-y-2">
                  {/* Ocupação Compacta */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-600">Ocup.</span>
                      <span className="text-xs font-bold text-[#CE7D0A]">
                        {calcularOcupacaoPercentual(lote.ocupacao, lote.capacidade)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-[#FFCF78] h-1 rounded-full"
                        style={{ width: `${calcularOcupacaoPercentual(lote.ocupacao, lote.capacidade)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Informações Mínimas */}
                  <div className="text-xs text-gray-600">
                    <div>{lote.ocupacao}/{lote.capacidade} búfalos</div>
                    <div className="truncate">{lote.area} {lote.unidade}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Análise Detalhada */}
        <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Análise Detalhada 📊</h2>
            <p className="text-gray-600">
              Insights visuais sobre a distribuição e performance dos lotes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Distribuição por Tipo */}
            <div className="bg-gradient-to-br from-white to-orange-50 p-6 rounded-xl shadow border border-orange-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                📈 Distribuição por Tipo de Lote
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={distribuicaoPorTipoData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="tipo" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value) => `${value} búfalos`}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="quantidade" radius={[4, 4, 0, 0]}>
                    {distribuicaoPorTipoData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={[
                          '#FFCF78', // Amarelo dourado
                          '#CE7D0A', // Laranja escuro
                          '#F2B84D', // Laranja médio
                          '#FCA90F', // Laranja claro
                          '#E6A23C', // Laranja dourado
                          '#D4A574'  // Marrom claro
                        ][index % 6]} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              
              {/* Resumo dos Dados */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-[#CE7D0A]">
                    {distribuicaoPorTipoData.reduce((sum, item) => sum + item.quantidade, 0)}
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
                      {ciclosMock.filter(c => c.status === "Em andamento").length}
                    </div>
                    <div className="text-sm text-gray-600">Em Andamento</div>
                  </div>
                </div>
                
                {/* Alert de Status */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div>
                      <h4 className="text-sm font-semibold text-green-800 mb-1">Sistema Operacional</h4>
                      <p className="text-xs text-green-700">
                        {ciclosMock.filter(c => c.status === "Em andamento").length} ciclos ativos funcionando perfeitamente.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Lista de Ciclos */}
                <div className="bg-white rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Ciclos em Execução</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {ciclosMock.slice(0, 3).map((ciclo, index) => (
                      <div key={ciclo.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-sm font-medium text-gray-800 truncate">{ciclo.nome}</span>
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

        {/* Tabela de Ciclos */}
        <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Ciclos de Manejo Ativos </h2>
            <p className="text-gray-600">
              Controle de ciclos de manejo com {ciclosMock.length} ciclos ativos.
            </p>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full border-collapse min-w-[650px] bg-white rounded-lg overflow-hidden shadow-sm">
              <thead className="bg-[#f0f0f0]">
                <tr>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Nome do Ciclo</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Período</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Grupo</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Lote</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Status</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Ações</th>
                </tr>
              </thead>
              <tbody>
                {ciclosMock.map((ciclo) => (
                  <tr key={ciclo.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="p-3 text-center">
                      <div className="text-sm font-medium text-gray-800">{ciclo.nome}</div>
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
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(ciclo.status)}`}>
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
      </div>
    </>
  );
}
