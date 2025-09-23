import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
import { useProperty } from "@/hooks/useProperty";
import usuarioService from "@/services/usuarioService";
import { 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import VisualizarUsuarioModal from "@/components/usuarios/VisualizarUsuarioModal";
import { FiUserX, FiUserPlus } from "react-icons/fi";
import ConfirmarDesvinculoModal from "@/components/usuarios/ConfirmarDesvinculoModal";

const ITEMS_PER_PAGE = 10;

export default function Equipe() {
  const router = useRouter();
  const { getAccessToken } = useAuth();
  const { propriedadeSelecionada } = useProperty();
  
  // Estados necessários (você precisa adicionar estes se não existirem)
  const [funcionarios, setFuncionarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCriarOpen, setModalCriarOpen] = useState(false);
  const [modalDesvinculoOpen, setModalDesvinculoOpen] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [funcionarioParaDesvincular, setFuncionarioParaDesvincular] = useState(null);
  const [removendoId, setRemovendoId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [enderecos, setEnderecos] = useState([]);

  // Cálculos de paginação
  const totalPages = Math.ceil(funcionarios.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentFuncionarios = funcionarios.slice(startIndex, endIndex);

  // useEffect para carregar dados iniciais
  useEffect(() => {
    const carregarFuncionarios = async () => {
      if (!propriedadeSelecionada?.id_propriedade) return;
      try {
        setCarregando(true);
        const token = await getAccessToken();
        const lista = await usuarioService.listarFuncionariosPorPropriedade(
          propriedadeSelecionada.id_propriedade,
          token
        );
        setFuncionarios(lista);
      } catch (err) {
        console.error("Erro ao carregar funcionários:", err);
      } finally {
        setCarregando(false);
      }
    };

    carregarFuncionarios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propriedadeSelecionada]);

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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestão da Equipe</h1>
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
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">{funcionarios.length}</p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">Funcionários na equipe</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">Cargos Diferentes</h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">Tipos</span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">
                {[...new Set(funcionarios.map(f => f.cargo))].length}
              </p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">Diferentes cargos</p>
            </div>
          </div>
        </div>

        {/* Tabela de Funcionários */}
        <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold text-gray-800">Registro de Funcionários</h2>
            {/* Botão de adicionar funcionário removido */}
          </div>
          
          <div>
            <p className="text-gray-600">
              {carregando
                ? "Carregando funcionários..."
                : funcionarios.length > 0
                ? `Equipe da propriedade: ${funcionarios.length} funcionários.`
                : "Nenhum funcionário encontrado para esta propriedade."}
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
                {currentFuncionarios.map((funcionario, idx) => (
                  <tr key={funcionario.id_usuario} className={idx % 2 === 0 ? "bg-[#fafafa]" : "bg-white"}>
                    <td className="p-3 text-center text-gray-800 text-base font-medium">{funcionario.nome}</td>
                    <td className="p-3 text-center text-gray-800 text-base">{funcionario.email}</td>
                    <td className="p-3 text-center text-gray-800 text-base">{funcionario.cargo}</td>
                    <td className="p-3 text-center text-gray-800 text-base">{funcionario.telefone}</td>
                    <td className="p-3 text-center text-gray-800 text-base">
                      {new Date(funcionario.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-center text-gray-800 text-base">
                      <span className="px-2.5 py-1.5 rounded-full text-sm font-bold inline-block w-20 bg-[#9DFFBE] text-gray-800">
                        Ativo
                      </span>
                    </td>
                    <td className="p-3 text-center text-base flex flex-row gap-2 items-center justify-center">
                      <button
                        className="bg-[#FFCF78] border-none text-gray-800 py-2 px-3.5 rounded-lg cursor-pointer text-sm font-bold hover:bg-[#F2B84D] transition-colors"
                        onClick={() => {
                          setUsuarioSelecionado(funcionario);
                          setModalOpen(true);
                        }}
                      >
                        Ver detalhes
                      </button>
                      <button
                        title="Desvincular funcionário da propriedade"
                        className={`ml-2 p-2 rounded-full border-none bg-red-100 hover:bg-red-200 text-red-600 transition-colors ${
                          removendoId === funcionario.id_usuario ? "opacity-60 cursor-not-allowed" : ""
                        }`}
                        disabled={removendoId === funcionario.id_usuario}
                        onClick={() => {
                          setFuncionarioParaDesvincular(funcionario);
                          setModalDesvinculoOpen(true);
                        }}
                      >
                        <FiUserX size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-6">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-[#FFCF78] hover:bg-[#F2B84D] text-gray-800"
                }`}
              >
                Anterior
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                    currentPage === page
                      ? "bg-[#CE7D0A] text-white"
                      : "bg-gray-200 hover:bg-[#FFCF78] text-gray-800"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-[#FFCF78] hover:bg-[#F2B84D] text-gray-800"
                }`}
              >
                Próximo
              </button>
            </div>
          )}

          {totalPages > 0 && (
            <div className="text-center text-sm text-gray-600 mt-4">
              Mostrando {startIndex + 1} a {Math.min(endIndex, funcionarios.length)} de {funcionarios.length} funcionários
            </div>
          )}
        </div>
      </div>

      {/* Modal de criação de funcionário removido */}

      {/* Modal de Visualização do Usuário */}
      <VisualizarUsuarioModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        usuario={usuarioSelecionado}
      />

      {/* Modal de confirmação de desvincular funcionário */}
      <ConfirmarDesvinculoModal
        open={modalDesvinculoOpen}
        onClose={() => {
          setModalDesvinculoOpen(false);
          setFuncionarioParaDesvincular(null);
        }}
        funcionario={funcionarioParaDesvincular}
        propriedade={propriedadeSelecionada}
        onConfirm={async () => {
          if (!funcionarioParaDesvincular) return;
          setRemovendoId(funcionarioParaDesvincular.id_usuario);
          try {
            const token = await getAccessToken();
            await usuarioService.desvincularFuncionarioDePropriedade(
              funcionarioParaDesvincular.id_usuario,
              propriedadeSelecionada.id_propriedade,
              token
            );
            // Atualiza lista após remoção
            const lista = await usuarioService.listarFuncionariosPorPropriedade(
              propriedadeSelecionada.id_propriedade,
              token
            );
            setFuncionarios(lista);
            setModalDesvinculoOpen(false);
            setFuncionarioParaDesvincular(null);
          } catch (err) {
            alert("Erro ao desvincular funcionário.");
          } finally {
            setRemovendoId(null);
          }
        }}
      />
    </>
  );
}