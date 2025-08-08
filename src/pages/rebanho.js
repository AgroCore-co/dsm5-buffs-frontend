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
  Cell
} from "recharts";

export default function Rebanho() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  // Dados mockados para o rebanho
  const maturidadeData = [
    { name: "Novilhas", value: 35, color: "#FFCF78" },
    { name: "Vacas", value: 70, color: "#CE7D0A" },
    { name: "Touros", value: 25, color: "#F2B84D" },
    { name: "Bezerros", value: 20, color: "#FCA90F" },
  ];

  const sexoData = [
    { name: "Fêmeas", value: 105, color: "#FFCF78" },
    { name: "Machos", value: 45, color: "#CE7D0A" },
  ];

  const racasData = [
    { name: "Murrah", value: 60, color: "#FFCF78" },
    { name: "Jafarabadi", value: 45, color: "#CE7D0A" },
    { name: "Mediterrâneo", value: 30, color: "#F2B84D" },
    { name: "Surti", value: 15, color: "#FCA90F" },
  ];

  const doencasRecorrentes = [
    { nome: "Brucelose", percentual: 14.2 },
    { nome: "Mastite", percentual: 11.8 },
    { nome: "Febre Aftosa", percentual: 9.5 },
    { nome: "Tuberculose", percentual: 7.3 },
    { nome: "Dermatite", percentual: 6.1 },
  ];

  const doencasPorMaturidade = [
    { categoria: "Bezerros", percentual: 45.0 },
    { categoria: "Novilhos", percentual: 20.0 },
    { categoria: "Adultos", percentual: 30.0 },
    { categoria: "Idosos", percentual: 5.0 },
  ];

  const buffalosMock = [
    { tag: "BUF001", nome: "Búfala Maria", peso: 650, raca: "Murrah", sexo: "Fêmea", maturidade: "Vaca", ultimaAtualizacao: "15/12/2024", status: "Ativo" },
    { tag: "BUF002", nome: "Touro João", peso: 850, raca: "Jafarabadi", sexo: "Macho", maturidade: "Touro", ultimaAtualizacao: "14/12/2024", status: "Ativo" },
    { tag: "BUF003", nome: "Novilha Ana", peso: 450, raca: "Murrah", sexo: "Fêmea", maturidade: "Novilha", ultimaAtualizacao: "13/12/2024", status: "Ativo" },
    { tag: "BUF004", nome: "Bezerro Pedro", peso: 120, raca: "Mediterrâneo", sexo: "Macho", maturidade: "Bezerro", ultimaAtualizacao: "12/12/2024", status: "Ativo" },
    { tag: "BUF005", nome: "Búfala Clara", peso: 680, raca: "Surti", sexo: "Fêmea", maturidade: "Vaca", ultimaAtualizacao: "11/12/2024", status: "Ativo" },
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
        <title>Rebanho | Buffs</title>
        <meta name="description" content="Gestão do rebanho de búfalos" />
      </Head>
      
      <div className="p-6 flex flex-col gap-8">
        {/* Header - Gestão do Rebanho */}
        <div className="w-full flex flex-col bg-white rounded-xl p-6 gap-6 box-border border border-[#e0e0e0] shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestão do Rebanho </h1>
            <p className="text-gray-600 text-lg">
              Gerencie seu rebanho de búfalos, registre informações zootécnicas e sanitárias.
            </p>
          </div>
          
          {/* Resumo do Rebanho */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">Total do Rebanho</h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">Ativos</span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">150</p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">Búfalos no sistema</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">Fêmeas</h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">Percentual</span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">105</p>
              <p className="text-sm font-semibold text-[var(--color-primary-dark)] mt-1">70% do rebanho</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">Machos</h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">Percentual</span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">45</p>
              <p className="text-sm font-semibold text-[var(--color-primary-dark)] mt-1">30% do rebanho</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">Vacas Produtoras</h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">Ativas</span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">70</p>
              <p className="text-sm font-medium text-[var(--color-text-tertiary)] mt-1">Em lactação</p>
            </div>
          </div>
        </div>

        {/* Gráficos de Distribuição */}
        <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Distribuição do Rebanho</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Maturidade */}
            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Maturidade do Rebanho</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={maturidadeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {maturidadeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} búfalos`} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Sexo */}
            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Distribuição por Sexo</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={sexoData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {sexoData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} búfalos`} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Raças */}
            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Distribuição por Raças</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={racasData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value} búfalos`} />
                  <Bar dataKey="value" fill="#FFCF78">
                    {racasData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={[
                          '#FFCF78', // Amarelo dourado
                          '#CE7D0A', // Laranja escuro
                          '#F2B84D', // Laranja médio
                          '#FCA90F'  // Laranja claro
                        ][index % 4]} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Tabela de Búfalos */}
        <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Registro de Búfalos</h2>
            <p className="text-gray-600">
              Lista completa do rebanho com {buffalosMock.length} búfalo{buffalosMock.length !== 1 ? "s" : ""}(as) ativos.
            </p>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full border-collapse min-w-[650px] bg-white rounded-lg overflow-hidden shadow-sm">
              <thead className="bg-[#f0f0f0]">
                <tr>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">TAG</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Nome</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Peso (kg)</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Raça</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Sexo</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Maturidade</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Última Atualização</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Status</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Ações</th>
                </tr>
              </thead>
              <tbody>
                {buffalosMock.map((b, idx) => (
                  <tr key={b.tag} className={idx % 2 === 0 ? "bg-[#fafafa]" : "bg-white"}>
                    <td className="p-3 text-center text-gray-800 text-base">{b.tag}</td>
                    <td className="p-3 text-center text-gray-800 text-base">{b.nome}</td>
                    <td className="p-3 text-center text-gray-800 text-base">{b.peso}</td>
                    <td className="p-3 text-center text-gray-800 text-base">{b.raca}</td>
                    <td className="p-3 text-center text-gray-800 text-base">{b.sexo}</td>
                    <td className="p-3 text-center text-gray-800 text-base">{b.maturidade}</td>
                    <td className="p-3 text-center text-gray-800 text-base">{b.ultimaAtualizacao}</td>
                    <td className="p-3 text-center text-gray-800 text-base">
                      <span className="px-2.5 py-1.5 rounded-full text-sm font-bold inline-block w-28 bg-[#9DFFBE] text-gray-800">
                        {b.status}
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

        {/* Doenças Recorrentes */}
        <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Análise de Saúde do Rebanho</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Doenças recorrentes */}
            <div className="bg-white rounded-lg shadow border border-[#e0e0e0] p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Doenças Recorrentes</h3>
              <p className="text-sm text-gray-600 mb-6">Doenças recorrentes registradas no rebanho</p>

              <div className="flex flex-col gap-4">
                {doencasRecorrentes.map((doenca, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-800">{doenca.nome}</span>
                      <span className="text-sm font-medium text-gray-800">{doenca.percentual.toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-6 bg-gray-100 rounded overflow-hidden">
                      <div
                        className="h-full bg-[#FFCF78] rounded flex items-center justify-end pr-2"
                        style={{ width: `${doenca.percentual}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Doenças por maturidade */}
            <div className="bg-white rounded-lg shadow border border-[#e0e0e0] p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Doenças por Nível de Maturidade</h3>
              <p className="text-sm text-gray-600 mb-6">Distribuição de doenças por faixa etária</p>

              <div className="flex flex-col gap-4">
                {doencasPorMaturidade.map((item, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-800">{item.categoria}</span>
                      <span className="text-sm font-medium text-gray-800">{item.percentual.toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-6 bg-gray-100 rounded overflow-hidden">
                      <div
                        className="h-full bg-[#CE7D0A] rounded flex items-center justify-end pr-2"
                        style={{ width: `${item.percentual}%` }}
                      ></div>
                    </div>
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
