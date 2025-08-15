"use client";

import { useEffect, useState } from "react";
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
  AreaChart,
  Area,
} from "recharts";

export default function Propriedades() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    status: "",
    tipo: "",
    cidade: "",
  });
  const [selectedPropriedade, setSelectedPropriedade] = useState(null);
  const [activeTab, setActiveTab] = useState("info");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState("cards"); // 'cards' ou 'table'

  const [formData, setFormData] = useState({
    nome: "",
    cnpj: "",
    proprietario: "",
    telefone: "",
    email: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    area_total: "",
    tipo: "",
    status: "Ativa",
  });

  const ITEMS_PER_PAGE = 12;

  // Dados mockados para propriedades
  const propriedadesMock = [
    {
      id: 1,
      nome: "Fazenda Principal",
      endereco: "Estrada Rural, Km 15, Zona Rural",
      cidade: "Parintins",
      estado: "AM",
      cep: "69151-000",
      area_total: 1250.5,
      area_util: 1100.0,
      area_pastagem: 950.0,
      area_reserva: 150.5,
      capacidade_animais: 200,
      animais_atuais: 120,
      lotes_ativos: 8,
      funcionarios: 15,
      status: "Ativa",
      proprietario: "João Lima Silva",
      telefone: "(92) 99999-9999",
      email: "joao@fazendaprincipal.com.br",
      data_cadastro: "2020-01-15",
      ultima_inspecao: "2024-11-15",
      certificacoes: ["Orgânico", "Bem-estar Animal"],
      tipo: "Pecuária Leiteira",
      cnpj: "12.345.678/0001-90",
    },
    {
      id: 2,
      nome: "Fazenda Secundária",
      endereco: "Rodovia AM-010, Km 45",
      cidade: "Manaus",
      estado: "AM",
      cep: "69000-000",
      area_total: 850.0,
      area_util: 750.0,
      area_pastagem: 650.0,
      area_reserva: 100.0,
      capacidade_animais: 150,
      animais_atuais: 85,
      lotes_ativos: 5,
      funcionarios: 8,
      status: "Ativa",
      proprietario: "Maria Santos",
      telefone: "(92) 88888-8888",
      email: "maria@fazendasecundaria.com.br",
      data_cadastro: "2021-06-20",
      ultima_inspecao: "2024-10-20",
      certificacoes: ["Orgânico"],
      tipo: "Pecuária Mista",
      cnpj: "23.456.789/0001-01",
    },
    {
      id: 3,
      nome: "Sítio Esperança",
      endereco: "Vicinal do Açaí, s/n",
      cidade: "Parintins",
      estado: "AM",
      cep: "69151-100",
      area_total: 450.0,
      area_util: 400.0,
      area_pastagem: 350.0,
      area_reserva: 50.0,
      capacidade_animais: 80,
      animais_atuais: 45,
      lotes_ativos: 3,
      funcionarios: 4,
      status: "Em Expansão",
      proprietario: "Carlos Oliveira",
      telefone: "(92) 77777-7777",
      email: "carlos@sitioesperanca.com.br",
      data_cadastro: "2022-03-10",
      ultima_inspecao: "2024-09-10",
      certificacoes: [],
      tipo: "Agricultura Familiar",
      cnpj: "34.567.890/0001-12",
    },
    {
      id: 4,
      nome: "Fazenda Inativa",
      endereco: "Estrada Velha, Km 30",
      cidade: "Itacoatiara",
      estado: "AM",
      cep: "69100-000",
      area_total: 600.0,
      area_util: 0.0,
      area_pastagem: 0.0,
      area_reserva: 600.0,
      capacidade_animais: 100,
      animais_atuais: 0,
      lotes_ativos: 0,
      funcionarios: 2,
      status: "Inativa",
      proprietario: "Pedro Costa",
      telefone: "(92) 66666-6666",
      email: "pedro@fazendainativa.com.br",
      data_cadastro: "2019-08-05",
      ultima_inspecao: "2023-12-01",
      certificacoes: [],
      tipo: "Pecuária",
      cnpj: "45.678.901/0001-23",
    },
    {
      id: 5,
      nome: "Fazenda Nova Esperança",
      endereco: "Estrada do Açaí, Km 25",
      cidade: "Parintins",
      estado: "AM",
      cep: "69151-200",
      area_total: 750.0,
      area_util: 650.0,
      area_pastagem: 550.0,
      area_reserva: 100.0,
      capacidade_animais: 120,
      animais_atuais: 95,
      lotes_ativos: 6,
      funcionarios: 10,
      status: "Ativa",
      proprietario: "Ana Silva",
      telefone: "(92) 55555-5555",
      email: "ana@novaesperanca.com.br",
      data_cadastro: "2023-01-10",
      ultima_inspecao: "2024-11-01",
      certificacoes: ["Orgânico"],
      tipo: "Pecuária Leiteira",
      cnpj: "56.789.012/0001-34",
    },
    {
      id: 6,
      nome: "Sítio São José",
      endereco: "Ramal do Cupim, s/n",
      cidade: "Manaus",
      estado: "AM",
      cep: "69000-100",
      area_total: 300.0,
      area_util: 250.0,
      area_pastagem: 200.0,
      area_reserva: 50.0,
      capacidade_animais: 60,
      animais_atuais: 40,
      lotes_ativos: 2,
      funcionarios: 3,
      status: "Ativa",
      proprietario: "José Santos",
      telefone: "(92) 44444-4444",
      email: "jose@saojose.com.br",
      data_cadastro: "2023-05-15",
      ultima_inspecao: "2024-10-15",
      certificacoes: [],
      tipo: "Agricultura Familiar",
      cnpj: "67.890.123/0001-45",
    },
  ];

  const getFilteredPropriedades = () => {
    return propriedadesMock.filter((propriedade) => {
      const matchStatus =
        !filters.status || propriedade.status === filters.status;
      const matchTipo = !filters.tipo || propriedade.tipo === filters.tipo;
      const matchCidade =
        !filters.cidade || propriedade.cidade === filters.cidade;
      return matchStatus && matchTipo && matchCidade;
    });
  };

  const filteredPropriedades = getFilteredPropriedades();
  const totalPages = Math.ceil(filteredPropriedades.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPropriedades = filteredPropriedades.slice(startIndex, endIndex);

  // Dados para gráficos
  const distribuicaoStatusData = [
    { name: "Ativas", value: 4, color: "#9DFFBE" },
    { name: "Em Expansão", value: 1, color: "#FFCF78" },
    { name: "Inativas", value: 1, color: "#ffcccb" },
  ];

  const capacidadeUtilizacaoData = propriedadesMock.map((prop) => ({
    nome: prop.nome.split(" ")[0] + " " + prop.nome.split(" ")[1],
    capacidade: prop.capacidade_animais,
    ocupacao: prop.animais_atuais,
    utilizacao: Math.round(
      (prop.animais_atuais / prop.capacidade_animais) * 100
    ),
  }));

  // Funções auxiliares
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

  const formatArea = (area) => {
    return `${area.toLocaleString("pt-BR", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })} ha`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const calcularTotais = () => {
    return propriedadesMock.reduce(
      (acc, prop) => ({
        area_total: acc.area_total + prop.area_total,
        area_util: acc.area_util + prop.area_util,
        capacidade_total: acc.capacidade_total + prop.capacidade_animais,
        animais_total: acc.animais_total + prop.animais_atuais,
        funcionarios_total: acc.funcionarios_total + prop.funcionarios,
        lotes_total: acc.lotes_total + prop.lotes_ativos,
      }),
      {
        area_total: 0,
        area_util: 0,
        capacidade_total: 0,
        animais_total: 0,
        funcionarios_total: 0,
        lotes_total: 0,
      }
    );
  };

  const totais = calcularTotais();

  const handleViewPropriedade = (propriedade) => {
    setSelectedPropriedade(propriedade);
    setActiveTab("info");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPropriedade(null);
    setActiveTab("info");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    setCurrentPage(1); // Reset para primeira página ao filtrar
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados da nova propriedade:", formData);
    // Aqui você implementaria a lógica para salvar a propriedade
    setIsCreateModalOpen(false);
    setFormData({
      nome: "",
      cnpj: "",
      proprietario: "",
      telefone: "",
      email: "",
      endereco: "",
      cidade: "",
      estado: "",
      cep: "",
      area_total: "",
      tipo: "",
      status: "Ativa",
    });
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
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">
                  Cadastradas
                </span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">
                {propriedadesMock.length}
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
                {totais.area_total.toLocaleString("pt-BR", {
                  maximumFractionDigits: 0,
                })}
              </p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                Hectares cadastrados
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">
                  Capacidade Total
                </h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">
                  Animais
                </span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">
                {totais.capacidade_total}
              </p>
              <p className="text-sm font-semibold text-[var(--color-primary-dark)] mt-1">
                {Math.round(
                  (totais.animais_total / totais.capacidade_total) * 100
                )}
                % ocupada
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">
                  Funcionários
                </h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">
                  Total
                </span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">
                {totais.funcionarios_total}
              </p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                Colaboradores ativos
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
                {filteredPropriedades.length} propriedades encontradas
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-[#FFCF78] text-gray-800 py-2 px-4 rounded-lg text-sm font-bold hover:bg-[#F2B84D] transition-colors"
              >
                + Nova Propriedade
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("cards")}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === "cards"
                      ? "bg-[#CE7D0A] text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Cards
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === "table"
                      ? "bg-[#CE7D0A] text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Tabela
                </button>
              </div>
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
                <option value="Pecuária Leiteira">Pecuária Leiteira</option>
                <option value="Pecuária Mista">Pecuária Mista</option>
                <option value="Agricultura Familiar">
                  Agricultura Familiar
                </option>
                <option value="Pecuária">Pecuária</option>
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

          {viewMode === "cards" ? (
            <>
              {/* Grid de Cards */}
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
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          propriedade.status
                        )}`}
                      >
                        {propriedade.status}
                      </span>
                    </div>

                    {/* Nome e informações principais */}
                    <div className="mb-3">
                      <h3 className="text-sm font-bold text-gray-800 mb-1 truncate">
                        {propriedade.nome}
                      </h3>
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>{propriedade.tipo}</span>
                        <span>{formatArea(propriedade.area_total)}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {propriedade.cidade}/{propriedade.estado}
                      </div>
                    </div>

                    {/* Informações de ocupação */}
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-600">Ocupação</span>
                        <span className="text-xs font-bold text-[#CE7D0A]">
                          {Math.round(
                            (propriedade.animais_atuais /
                              propriedade.capacidade_animais) *
                              100
                          )}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-[#FFCF78] h-1.5 rounded-full"
                          style={{
                            width: `${Math.round(
                              (propriedade.animais_atuais /
                                propriedade.capacidade_animais) *
                                100
                            )}%`,
                          }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {propriedade.animais_atuais}/
                        {propriedade.capacidade_animais} animais
                      </div>
                    </div>

                    {/* Informações adicionais */}
                    <div className="flex justify-between items-center text-xs text-gray-600">
                      <span>{propriedade.lotes_ativos} lotes</span>
                      <span>{propriedade.funcionarios} funcionários</span>
                    </div>
                  </div>
                ))}
              </div>

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
                  {Math.min(endIndex, filteredPropriedades.length)} de{" "}
                  {filteredPropriedades.length} propriedades
                </div>
              )}
            </>
          ) : (
            /* Tabela Detalhada */
            <div className="overflow-x-auto w-full">
              <table className="w-full border-collapse min-w-[1000px] bg-white rounded-lg overflow-hidden shadow-sm">
                <thead className="bg-[#f0f0f0]">
                  <tr>
                    <th className="p-3 text-left font-medium text-gray-800 text-sm">
                      Nome
                    </th>
                    <th className="p-3 text-center font-medium text-gray-800 text-sm">
                      Localização
                    </th>
                    <th className="p-3 text-center font-medium text-gray-800 text-sm">
                      Área Total
                    </th>
                    <th className="p-3 text-center font-medium text-gray-800 text-sm">
                      Capacidade
                    </th>
                    <th className="p-3 text-center font-medium text-gray-800 text-sm">
                      Ocupação
                    </th>
                    <th className="p-3 text-center font-medium text-gray-800 text-sm">
                      Funcionários
                    </th>
                    <th className="p-3 text-center font-medium text-gray-800 text-sm">
                      Status
                    </th>
                    <th className="p-3 text-center font-medium text-gray-800 text-sm">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentPropriedades.map((propriedade) => (
                    <tr
                      key={propriedade.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-3">
                        <div>
                          <div className="text-sm font-medium text-gray-800">
                            {propriedade.nome}
                          </div>
                          <div className="text-xs text-gray-600">
                            {propriedade.tipo}
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <div className="text-sm text-gray-600">
                          {propriedade.cidade}/{propriedade.estado}
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <div className="text-sm font-medium text-gray-800">
                          {formatArea(propriedade.area_total)}
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <div className="text-sm text-gray-600">
                          {propriedade.capacidade_animais} animais
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <div className="text-sm font-medium text-[#CE7D0A]">
                          {propriedade.animais_atuais} (
                          {Math.round(
                            (propriedade.animais_atuais /
                              propriedade.capacidade_animais) *
                              100
                          )}
                          %)
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <div className="text-sm text-gray-600">
                          {propriedade.funcionarios}
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            propriedade.status
                          )}`}
                        >
                          {propriedade.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleViewPropriedade(propriedade)}
                            className="bg-[#FFCF78] text-gray-800 py-1 px-3 rounded text-xs font-bold hover:bg-[#F2B84D] transition-colors"
                          >
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
          )}
        </div>

        {/* Gráficos de Análise */}
        <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Análise das Propriedades
            </h2>
            <p className="text-gray-600 text-sm">
              Visão geral da distribuição e performance das propriedades
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status das Propriedades */}
            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Status das Propriedades
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={distribuicaoStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {distribuicaoStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} propriedades`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Capacidade vs Utilização */}
            <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl shadow border border-blue-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Capacidade vs Utilização
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={capacidadeUtilizacaoData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nome" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      value,
                      name === "capacidade"
                        ? "Capacidade"
                        : name === "ocupacao"
                        ? "Ocupação Atual"
                        : "Utilização (%)",
                    ]}
                  />
                  <Legend />
                  <Bar
                    dataKey="capacidade"
                    fill="#e5e7eb"
                    name="Capacidade"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="ocupacao"
                    fill="#FFCF78"
                    name="Ocupação Atual"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
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
                        <label className="text-sm font-medium text-gray-700">
                          Status
                        </label>
                        <div className="mt-1">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                              selectedPropriedade.status
                            )}`}
                          >
                            {selectedPropriedade.status}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Área Total
                        </label>
                        <p className="mt-1 text-lg font-semibold text-gray-900">
                          {formatArea(selectedPropriedade.area_total)}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Área Útil
                        </label>
                        <p className="mt-1 text-gray-900">
                          {formatArea(selectedPropriedade.area_util)}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Área de Pastagem
                        </label>
                        <p className="mt-1 text-gray-900">
                          {formatArea(selectedPropriedade.area_pastagem)}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Capacidade de Animais
                        </label>
                        <p className="mt-1 text-lg font-semibold text-gray-900">
                          {selectedPropriedade.capacidade_animais} animais
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Animais Atuais
                        </label>
                        <p className="mt-1 text-gray-900">
                          {selectedPropriedade.animais_atuais} animais
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Taxa de Ocupação
                        </label>
                        <p className="mt-1 text-lg font-semibold text-[#CE7D0A]">
                          {Math.round(
                            (selectedPropriedade.animais_atuais /
                              selectedPropriedade.capacidade_animais) *
                              100
                          )}
                          %
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Lotes Ativos
                        </label>
                        <p className="mt-1 text-gray-900">
                          {selectedPropriedade.lotes_ativos} lotes
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "details" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          CNPJ
                        </label>
                        <p className="mt-1 text-gray-900">
                          {selectedPropriedade.cnpj}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Data de Cadastro
                        </label>
                        <p className="mt-1 text-gray-900">
                          {formatDate(selectedPropriedade.data_cadastro)}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Última Inspeção
                        </label>
                        <p className="mt-1 text-gray-900">
                          {formatDate(selectedPropriedade.ultima_inspecao)}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Funcionários
                        </label>
                        <p className="mt-1 text-gray-900">
                          {selectedPropriedade.funcionarios} colaboradores
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Área de Reserva
                        </label>
                        <p className="mt-1 text-gray-900">
                          {formatArea(selectedPropriedade.area_reserva)}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Certificações
                        </label>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {selectedPropriedade.certificacoes.length > 0 ? (
                            selectedPropriedade.certificacoes.map(
                              (cert, index) => (
                                <span
                                  key={index}
                                  className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full"
                                >
                                  {cert}
                                </span>
                              )
                            )
                          ) : (
                            <span className="text-gray-500 text-sm">
                              Nenhuma certificação
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "contact" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Proprietário
                        </label>
                        <p className="mt-1 text-lg font-semibold text-gray-900">
                          {selectedPropriedade.proprietario}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Telefone
                        </label>
                        <p className="mt-1 text-gray-900">
                          {selectedPropriedade.telefone}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          E-mail
                        </label>
                        <p className="mt-1 text-gray-900">
                          {selectedPropriedade.email}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Endereço
                        </label>
                        <p className="mt-1 text-gray-900">
                          {selectedPropriedade.endereco}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Cidade/Estado
                        </label>
                        <p className="mt-1 text-gray-900">
                          {selectedPropriedade.cidade}/
                          {selectedPropriedade.estado}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          CEP
                        </label>
                        <p className="mt-1 text-gray-900">
                          {selectedPropriedade.cep}
                        </p>
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
                <button className="px-4 py-2 bg-[#FFCF78] text-gray-800 rounded-lg hover:bg-[#F2B84D] transition-colors font-medium">
                  Editar Propriedade
                </button>
              </div>
            </div>
          </div>
        )}

        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">
                  Cadastrar Nova Propriedade
                </h2>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome da Propriedade
                    </label>
                    <input
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CNPJ
                    </label>
                    <input
                      type="text"
                      name="cnpj"
                      value={formData.cnpj}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Proprietário
                    </label>
                    <input
                      type="text"
                      name="proprietario"
                      value={formData.proprietario}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Endereço
                  </label>
                  <input
                    type="text"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cidade
                    </label>
                    <input
                      type="text"
                      name="cidade"
                      value={formData.cidade}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <select
                      name="estado"
                      value={formData.estado}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                    >
                      <option value="">Selecione</option>
                      <option value="AM">Amazonas</option>
                      <option value="AC">Acre</option>
                      <option value="RO">Rondônia</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CEP
                    </label>
                    <input
                      type="text"
                      name="cep"
                      value={formData.cep}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Área Total (hectares)
                    </label>
                    <input
                      type="number"
                      name="area_total"
                      value={formData.area_total}
                      onChange={handleChange}
                      step="0.1"
                      className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Propriedade
                    </label>
                    <select
                      name="tipo"
                      value={formData.tipo}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                      required
                    >
                      <option value="">Selecione o tipo</option>
                      <option value="Pecuária Leiteira">
                        Pecuária Leiteira
                      </option>
                      <option value="Pecuária Mista">Pecuária Mista</option>
                      <option value="Agricultura Familiar">
                        Agricultura Familiar
                      </option>
                      <option value="Pecuária">Pecuária</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="Ativa">Ativa</option>
                    <option value="Em Expansão">Em Expansão</option>
                    <option value="Inativa">Inativa</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#FFCF78] text-gray-800 rounded-lg hover:bg-[#F2B84D] transition-colors font-medium"
                  >
                    Cadastrar Propriedade
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
