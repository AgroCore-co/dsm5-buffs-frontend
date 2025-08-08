import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
import { 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

export default function Equipe() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  // Dados mockados para equipe
  const distribuicaoCargos = [
    { name: "Veterinário", value: 3, color: "#FFCF78" },
    { name: "Gerente de Produção", value: 2, color: "#CE7D0A" },
    { name: "Auxiliar de Produção", value: 4, color: "#F2B84D" },
    { name: "Administrador", value: 1, color: "#FCA90F" },
    { name: "Técnico", value: 2, color: "#E6A23C" },
  ];



  const funcionariosMock = [
    { id: 1, nome: "Dr. João Silva", email: "joao.silva@buffs.com", cargo: "Veterinário", telefone: "(11) 99999-1111", status: "Ativo", dataAdmissao: "15/03/2023" },
    { id: 2, nome: "Maria Santos", email: "maria.santos@buffs.com", cargo: "Gerente de Produção", telefone: "(11) 99999-2222", status: "Ativo", dataAdmissao: "10/01/2023" },
    { id: 3, nome: "Pedro Oliveira", email: "pedro.oliveira@buffs.com", cargo: "Auxiliar de Produção", telefone: "(11) 99999-3333", status: "Ativo", dataAdmissao: "20/02/2023" },
    { id: 4, nome: "Ana Costa", email: "ana.costa@buffs.com", cargo: "Veterinário", telefone: "(11) 99999-4444", status: "Ativo", dataAdmissao: "05/04/2023" },
    { id: 5, nome: "Carlos Ferreira", email: "carlos.ferreira@buffs.com", cargo: "Técnico", telefone: "(11) 99999-5555", status: "Ativo", dataAdmissao: "12/05/2023" },
    { id: 6, nome: "Lucia Rodrigues", email: "lucia.rodrigues@buffs.com", cargo: "Auxiliar de Produção", telefone: "(11) 99999-6666", status: "Ativo", dataAdmissao: "18/06/2023" },
    { id: 7, nome: "Roberto Almeida", email: "roberto.almeida@buffs.com", cargo: "Administrador", telefone: "(11) 99999-7777", status: "Ativo", dataAdmissao: "01/01/2023" },
    { id: 8, nome: "Fernanda Lima", email: "fernanda.lima@buffs.com", cargo: "Veterinário", telefone: "(11) 99999-8888", status: "Ativo", dataAdmissao: "25/07/2023" },
    { id: 9, nome: "Ricardo Souza", email: "ricardo.souza@buffs.com", cargo: "Auxiliar de Produção", telefone: "(11) 99999-9999", status: "Ativo", dataAdmissao: "08/08/2023" },
    { id: 10, nome: "Patricia Gomes", email: "patricia.gomes@buffs.com", cargo: "Gerente de Produção", telefone: "(11) 99999-0000", status: "Ativo", dataAdmissao: "15/09/2023" },
    { id: 11, nome: "Marcos Santos", email: "marcos.santos@buffs.com", cargo: "Técnico", telefone: "(11) 99999-1112", status: "Ativo", dataAdmissao: "22/10/2023" },
    { id: 12, nome: "Juliana Costa", email: "juliana.costa@buffs.com", cargo: "Auxiliar de Produção", telefone: "(11) 99999-1113", status: "Ativo", dataAdmissao: "30/11/2023" },
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
        <title>Equipe | Buffs</title>
        <meta name="description" content="Gestão da equipe de funcionários" />
      </Head>
      
      <div className="p-6 flex flex-col gap-8">
        {/* Header - Gestão da Equipe */}
        <div className="w-full flex flex-col bg-white rounded-xl p-6 gap-6 box-border border border-[#e0e0e0] shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestão da Equipe 👥</h1>
            <p className="text-gray-600 text-lg">
              Gerencie sua equipe de funcionários e acompanhe o desempenho da equipe.
            </p>
          </div>
          
          {/* Resumo da Equipe */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">Total de Funcionários</h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">Ativos</span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">12</p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">Funcionários na equipe</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">Cargos Diferentes</h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">Tipos</span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">5</p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">Diferentes cargos</p>
            </div>


          </div>
        </div>

        {/* Gráfico de Distribuição */}
        <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Distribuição da Equipe</h2>
          <div className="w-full">
            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Distribuição por Cargos</h3>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={distribuicaoCargos}
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {distribuicaoCargos.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} funcionários`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>



        {/* Tabela de Funcionários */}
        <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Registro de Funcionários</h2>
            <p className="text-gray-600">
              Lista completa da equipe com {funcionariosMock.length} funcionários ativos.
            </p>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full border-collapse min-w-[800px] bg-white rounded-lg overflow-hidden shadow-sm">
              <thead className="bg-[#f0f0f0]">
                <tr>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Nome</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">E-mail</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Cargo</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Telefone</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Data Admissão</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Status</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Ações</th>
                </tr>
              </thead>
              <tbody>
                {funcionariosMock.map((funcionario, idx) => (
                  <tr key={funcionario.id} className={idx % 2 === 0 ? "bg-[#fafafa]" : "bg-white"}>
                    <td className="p-3 text-center text-gray-800 text-base font-medium">{funcionario.nome}</td>
                    <td className="p-3 text-center text-gray-800 text-base">{funcionario.email}</td>
                    <td className="p-3 text-center text-gray-800 text-base">{funcionario.cargo}</td>
                    <td className="p-3 text-center text-gray-800 text-base">{funcionario.telefone}</td>
                    <td className="p-3 text-center text-gray-800 text-base">{funcionario.dataAdmissao}</td>
                    <td className="p-3 text-center text-gray-800 text-base">
                      <span className="px-2.5 py-1.5 rounded-full text-sm font-bold inline-block w-20 bg-[#9DFFBE] text-gray-800">
                        {funcionario.status}
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
