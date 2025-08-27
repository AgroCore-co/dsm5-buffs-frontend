"use client";

import { useEffect, useState, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
import propriedadeService from "@/services/propriedadeService";

import Loading from "@/components/Loading";
import PropriedadeCreateModal from "@/components/propriedades/PropriedadeCreateModal";

export default function Propriedades() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, getAccessToken } = useAuth();

  // Estado principal das propriedades carregadas da API
  const [propriedades, setPropriedades] = useState([]);
  const [loading, setLoading] = useState(true); // Indica carregamento da API
  const [error, setError] = useState(null); // Armazena erros de requisição
  const [currentPage, setCurrentPage] = useState(1); // Página atual para paginação
  const [filters, setFilters] = useState({
    status: "",
    tipo: "",
    cidade: "",
  }); // Filtros aplicáveis na listagem
  const [selectedPropriedade, setSelectedPropriedade] = useState(null); // Propriedade selecionada para modal
  const [activeTab, setActiveTab] = useState("info"); // Aba ativa do modal
  const [isModalOpen, setIsModalOpen] = useState(false); // Controla abertura do modal de detalhes
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // Controla abertura do modal de criação

  const hasLoadedRef = useRef(false); // Garante que o carregamento inicial aconteça apenas uma vez

  const ITEMS_PER_PAGE = 12; // Número de propriedades por página

  // ==========================
  // Função para carregar propriedades da API
  // ==========================
  const loadPropriedades = async () => {
    try {
      setLoading(true); // Começo do carregamento
      setError(null); // Reset do erro anterior

      // Obtendo token diretamente do hook de autenticação
      const token = await getAccessToken();
      if (!token) {
        setError("Usuário não autenticado. Faça login para acessar suas propriedades.");
        return;
      }

      // Requisição à API para listar propriedades
      const data = await propriedadeService.listarPropriedades(token);

      // Transformar os dados da API para o formato esperado pela interface
      const propriedadesFormatadas = data.map((prop) => ({
        id: prop.id_propriedade,
        nome: prop.nome,
        tipo_manejo: prop.tipo_manejo,
        tipo: prop.tipo_manejo === "P" ? "Pecuária" : prop.tipo_manejo === "E" ? "Extensivo" : prop.tipo_manejo === "I" ? "Intensivo" : "Não definido",
        cnpj: prop.cnpj,
        p_abcb: prop.p_abcb,
        id_endereco: prop.id_endereco,
        id_dono: prop.id_dono,
        created_at: prop.created_at,
        updated_at: prop.updated_at,
      }));

      setPropriedades(propriedadesFormatadas);
      hasLoadedRef.current = true; // Marca como carregado para não refazer
    } catch (err) {
      console.error("Erro ao carregar propriedades:", err);
      
      // Tratamento específico para erros de autenticação
      if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
        setError("Sessão expirada. Faça login novamente para acessar suas propriedades.");
      } else {
        setError(err.message || "Erro ao carregar propriedades. Tente novamente.");
      }
    } finally {
      setLoading(false); // Final do carregamento
    }
  };

  // ==========================
  // useEffect para carregar propriedades apenas quando autenticado
  // ==========================
  useEffect(() => {
    if (isAuthenticated && !hasLoadedRef.current) {
      loadPropriedades();
    }
  }, [isAuthenticated, getAccessToken]);

  // ==========================
  // Lógica de paginação e filtros aplicados
  // ==========================
  const propriedadesFiltradas = propriedades.filter((propriedade) => {
    const matchStatus = !filters.status || propriedade.status === filters.status;
    const matchTipo = !filters.tipo || propriedade.tipo === filters.tipo;
    const matchCidade = !filters.cidade || propriedade.cidade === filters.cidade;
    return matchStatus && matchTipo && matchCidade;
  });

  const totalPages = Math.ceil(propriedadesFiltradas.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPropriedades = propriedadesFiltradas.slice(startIndex, endIndex);

  // ==========================
  // Função para formatar datas
  // ==========================
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return "N/A";
    }
  };

  // ==========================
  // Função para formatar CNPJ
  // ==========================
  const formatCNPJ = (cnpj) => {
    if (!cnpj) return "N/A";
    // Se já estiver formatado, retorna como está
    if (cnpj.includes('.') || cnpj.includes('/')) return cnpj;
    // Formatação simples para CNPJ
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  };

  // ==========================
  // Função auxiliar para definir cores do status
  // ==========================
  const getStatusColor = (status) => {
    switch (status) {
      case "Ativa":
        return "bg-[#9DFFBE] text-gray-800";
      case "Em Expansão":
        return "bg-[#FFCF78] text-gray-800";
      case "Inativa":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // ==========================
  // Funções para modal de detalhes
  // ==========================
  const handleViewPropriedade = (propriedade) => {
    setSelectedPropriedade(propriedade);
    setActiveTab("info"); // Sempre abre na aba "info"
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPropriedade(null);
    setActiveTab("info");
  };

  // ==========================
  // Funções para modal de criação
  // ==========================
  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleCreateSuccess = () => {
    // Recarrega a lista de propriedades após criação bem-sucedida
    hasLoadedRef.current = false; // Permite novo carregamento
    loadPropriedades();
  };

  // ==========================
  // Funções de paginação e filtros
  // ==========================
  const handlePageChange = (page) => setCurrentPage(page);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    setCurrentPage(1); // Volta para a primeira página ao alterar filtro
  };

  // ==========================
  // Redireciona para login caso não autenticado
  // ==========================
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // ==========================
  // Retorno condicional da interface
  // ==========================
  if (isLoading || !isAuthenticated) return <Loading />; // Enquanto autenticação carrega

  if (loading) return <Loading />; // Carregamento de propriedades

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800 font-medium">Erro</div>
          <div className="text-red-600 text-sm mt-1">{error}</div>
          <button
            onClick={loadPropriedades}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Gestão de Propriedades | Buffs</title>
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

          {/* Estatísticas Gerais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">
                  Total de Propriedades
                </h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark]">
                  Cadastradas
                </span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">
                {propriedades.length}
              </p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                Propriedades no sistema
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">
                  Área Total
                </h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">
                  Hectares
                </span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">
                -
              </p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                Em breve
              </p>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Propriedades Cadastradas
              </h2>
              <p className="text-gray-600">
                {propriedadesFiltradas.length} propriedades encontradas
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleOpenCreateModal}
                className="bg-[#FFCF78] text-gray-800 py-2 px-4 rounded-lg text-sm font-bold hover:bg-[#F2B84D] transition-colors"
              >
                + Nova Propriedade
              </button>
            </div>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="">Todos</option>
                <option value="Ativa">Ativa</option>
                <option value="Em Expansão">Em Expansão</option>
                <option value="Inativa">Inativa</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                value={filters.tipo}
                onChange={(e) => handleFilterChange("tipo", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="">Todos</option>
                <option value="Pecuária">Pecuária</option>
                <option value="Agricultura">Agricultura</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Cidade
              </label>
              <select
                value={filters.cidade}
                onChange={(e) => handleFilterChange("cidade", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="">Todas</option>
                <option value="Parintins">Parintins</option>
                <option value="Manaus">Manaus</option>
                <option value="Itacoatiara">Itacoatiara</option>
              </select>
            </div>

            {(filters.status || filters.tipo || filters.cidade) && (
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setFilters({ status: "", tipo: "", cidade: "" });
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 bg-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-400 transition-colors"
                >
                  Limpar Filtros
                </button>
              </div>
            )}
          </div>

          {/* Grid de Cards */}
          {currentPropriedades.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-4">
                {propriedades.length === 0 
                  ? "Nenhuma propriedade cadastrada ainda."
                  : "Nenhuma propriedade encontrada com os filtros aplicados."
                }
              </div>
              {propriedades.length === 0 && (
                <button
                  onClick={handleOpenCreateModal}
                  className="bg-[#FFCF78] text-gray-800 py-2 px-4 rounded-lg text-sm font-bold hover:bg-[#F2B84D] transition-colors">
                  + Cadastrar Primeira Propriedade
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
              {currentPropriedades.map((propriedade) => (
                <div
                  key={propriedade.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleViewPropriedade(propriedade)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleViewPropriedade(propriedade);
                    }
                  }}
                  className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all p-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  {/* Header do Card */}
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-[#CE7D0A] bg-[#FFCF78]/30 px-2 py-1 rounded">
                      ID: {propriedade.id}
                    </span>
                    <div className="flex flex-col gap-1">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#9DFFBE] text-gray-800">
                        Ativa
                      </span>
                      {propriedade.p_abcb && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          ABCB
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Nome e informações principais */}
                  <div className="mb-3">
                    <h3 className="text-sm font-bold text-gray-800 mb-1 truncate">
                      {propriedade.nome}
                    </h3>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>{propriedade.tipo}</span>
                      <span className="text-xs text-gray-500">
                        {propriedade.tipo_manejo && `(${propriedade.tipo_manejo})`}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      CNPJ: {formatCNPJ(propriedade.cnpj)}
                    </div>
                  </div>

                  {/* Informações de datas */}
                  <div className="mb-3">
                    <div className="text-xs text-gray-500">
                      Cadastrada em: {formatDate(propriedade.created_at)}
                    </div>
                    {propriedade.updated_at !== propriedade.created_at && (
                      <div className="text-xs text-gray-500">
                        Atualizada: {formatDate(propriedade.updated_at)}
                      </div>
                    )}
                  </div>

                  {/* Informações adicionais */}
                  <div className="flex justify-between items-center text-xs text-gray-600">
                    <span>Endereço: #{propriedade.id_endereco}</span>
                    <span>Dono: #{propriedade.id_dono}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-6">
              {/* Botão Anterior */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-[#FFCF78] hover:bg-[#F2B84D] text-gray-800"
                }`}
              >
                Anterior
              </button>

              {/* Números das páginas */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                      currentPage === page
                        ? "bg-[#CE7D0A] text-white"
                        : "bg-gray-200 hover:bg-[#FFCF78] text-gray-800"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              {/* Botão Próximo */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
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

          {/* Informações da paginação */}
          {totalPages > 0 && (
            <div className="text-center text-sm text-gray-600 mt-4">
              Mostrando {startIndex + 1} a{" "}
              {Math.min(endIndex, propriedadesFiltradas.length)} de{" "}
              {propriedadesFiltradas.length} propriedades
            </div>
          )}
        </div>

        {isModalOpen && selectedPropriedade && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              {/* Header do Modal */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedPropriedade.nome}
                  </h2>
                  <p className="text-gray-600">{selectedPropriedade.tipo}</p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("info")}
                  className={`px-6 py-3 font-medium text-sm ${
                    activeTab === "info"
                      ? "border-b-2 border-[#CE7D0A] text-[#CE7D0A]"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Informações Gerais
                </button>
                <button
                  onClick={() => setActiveTab("details")}
                  className={`px-6 py-3 font-medium text-sm ${
                    activeTab === "details"
                      ? "border-b-2 border-[#CE7D0A] text-[#CE7D0A]"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Detalhes Técnicos
                </button>
                <button
                  onClick={() => setActiveTab("contact")}
                  className={`px-6 py-3 font-medium text-sm ${
                    activeTab === "contact"
                      ? "border-b-2 border-[#CE7D0A] text-[#CE7D0A]"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Contato
                </button>
              </div>

              {/* Conteúdo das Tabs */}
              <div className="p-6">
                {activeTab === "info" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Nome da Propriedade</label>
                        <p className="text-lg font-semibold text-gray-800">{selectedPropriedade.nome}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">CNPJ</label>
                        <p className="text-lg text-gray-800">{formatCNPJ(selectedPropriedade.cnpj)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Tipo de Manejo</label>
                        <p className="text-lg text-gray-800">{selectedPropriedade.tipo} ({selectedPropriedade.tipo_manejo})</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">ABCB</label>
                        <p className="text-lg text-gray-800">{selectedPropriedade.p_abcb ? "Sim" : "Não"}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">ID da Propriedade</label>
                        <p className="text-lg text-gray-800">#{selectedPropriedade.id}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">ID do Endereço</label>
                        <p className="text-lg text-gray-800">#{selectedPropriedade.id_endereco}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">ID do Proprietário</label>
                        <p className="text-lg text-gray-800">#{selectedPropriedade.id_dono}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Data de Cadastro</label>
                        <p className="text-lg text-gray-800">{formatDate(selectedPropriedade.created_at)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "details" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Última Atualização</label>
                        <p className="text-lg text-gray-800">{formatDate(selectedPropriedade.updated_at)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Status do Sistema</label>
                        <p className="text-lg text-gray-800">Ativo</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Informações Técnicas</label>
                        <p className="text-sm text-gray-600">Dados técnicos detalhados serão implementados em breve.</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "contact" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Informações de Contato</label>
                        <p className="text-sm text-gray-600">Detalhes de contato serão carregados do endereço #{selectedPropriedade.id_endereco}.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer do Modal */}
              <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Fechar
                </button>
                <button className="px-4 py-2 bg-[#FFCF78] text-gray-800 rounded-lg hover:bg-[#F2B84D] transition-colors font-medium"
                  onClick={() => {
                    // TODO: Implementar modal de edição de propriedade
                    console.log('TODO: Abrir modal de edição para propriedade:', selectedPropriedade.id);
                  }}
                >
                  Editar Propriedade
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Criação de Propriedade */}
        <PropriedadeCreateModal
          isOpen={isCreateModalOpen}
          onClose={handleCloseCreateModal}
          onSuccess={handleCreateSuccess}
        />
      </div>
    </>
  );
}
