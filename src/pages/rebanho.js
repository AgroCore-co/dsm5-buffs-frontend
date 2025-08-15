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
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import BuffaloModal from "@/components/rebanho/BuffaloModal";
import Button from "@/components/Button";
import buffaloService from "@/services/bufaloService";

// ==================== DADOS MOCK ====================
const ITEMS_PER_PAGE = 10;

const CHART_DATA = {
  maturidade: [
    { name: "Novilhas", value: 35, color: "#FFCF78" },
    { name: "Vacas", value: 70, color: "#CE7D0A" },
    { name: "Touros", value: 25, color: "#F2B84D" },
    { name: "Bezerros", value: 20, color: "#FCA90F" },
  ],
  sexo: [
    { name: "Fêmeas", value: 105, color: "#FFCF78" },
    { name: "Machos", value: 45, color: "#CE7D0A" },
  ],
  racas: [
    { name: "Murrah", value: 60, color: "#FFCF78" },
    { name: "Jafarabadi", value: 45, color: "#CE7D0A" },
    { name: "Mediterrâneo", value: 30, color: "#F2B84D" },
    { name: "Surti", value: 15, color: "#FCA90F" },
  ],
};

const HEALTH_DATA = {
  doencasRecorrentes: [
    { nome: "Brucelose", percentual: 14.2 },
    { nome: "Mastite", percentual: 11.8 },
    { nome: "Febre Aftosa", percentual: 9.5 },
    { nome: "Tuberculose", percentual: 7.3 },
    { nome: "Dermatite", percentual: 6.1 },
  ],
  doencasPorMaturidade: [
    { categoria: "Bezerros", percentual: 45.0 },
    { categoria: "Novilhos", percentual: 20.0 },
    { categoria: "Adultos", percentual: 30.0 },
    { categoria: "Idosos", percentual: 5.0 },
  ],
};

const BUFFALOS_MOCK = [
  {
    tag: "BUF001",
    nome: "Búfala Maria",
    peso: 650,
    raca: "Murrah",
    sexo: "Fêmea",
    maturidade: "Vaca",
    ultimaAtualizacao: "15/12/2024",
    status: "Ativo",
    nascimento: "15/03/2020",
    pai: "Touro Antônio",
    mae: "Vaca Francisca",
  },
  {
    tag: "BUF002",
    nome: "Touro João",
    peso: 850,
    raca: "Jafarabadi",
    sexo: "Macho",
    maturidade: "Touro",
    ultimaAtualizacao: "14/12/2024",
    status: "Ativo",
    nascimento: "22/01/2019",
    pai: "Touro Benedito",
    mae: "Vaca Carmem",
  },
  {
    tag: "BUF003",
    nome: "Novilha Ana",
    peso: 450,
    raca: "Murrah",
    sexo: "Fêmea",
    maturidade: "Novilha",
    ultimaAtualizacao: "13/12/2024",
    status: "Ativo",
    nascimento: "10/08/2022",
    pai: "Touro João",
    mae: "Búfala Maria",
  },
  {
    tag: "BUF004",
    nome: "Bezerro Pedro",
    peso: 120,
    raca: "Mediterrâneo",
    sexo: "Macho",
    maturidade: "Bezerro",
    ultimaAtualizacao: "12/12/2024",
    status: "Ativo",
    nascimento: "05/06/2024",
    pai: "Touro Mário",
    mae: "Vaca Antonia",
  },
  {
    tag: "BUF005",
    nome: "Búfala Clara",
    peso: 680,
    raca: "Surti",
    sexo: "Fêmea",
    maturidade: "Vaca",
    ultimaAtualizacao: "11/12/2024",
    status: "Ativo",
    nascimento: "18/11/2020",
    pai: "Touro Ricardo",
    mae: "Vaca Silvia",
  },
  {
    tag: "BUF006",
    nome: "Touro Carlos",
    peso: 900,
    raca: "Jafarabadi",
    sexo: "Macho",
    maturidade: "Touro",
    ultimaAtualizacao: "10/12/2024",
    status: "Ativo",
    nascimento: "30/04/2018",
    pai: "Touro Benedito",
    mae: "Vaca Lúcia",
  },
  {
    tag: "BUF007",
    nome: "Novilha Lucia",
    peso: 480,
    raca: "Murrah",
    sexo: "Fêmea",
    maturidade: "Novilha",
    ultimaAtualizacao: "09/12/2024",
    status: "Ativo",
    nascimento: "12/09/2022",
    pai: "Touro João",
    mae: "Búfala Clara",
  },
  {
    tag: "BUF008",
    nome: "Bezerra Joana",
    peso: 150,
    raca: "Surti",
    sexo: "Fêmea",
    maturidade: "Bezerra",
    ultimaAtualizacao: "08/12/2024",
    status: "Ativo",
    nascimento: "20/07/2024",
    pai: "Touro Carlos",
    mae: "Búfala Clara",
  },
  {
    tag: "BUF009",
    nome: "Touro Mário",
    peso: 820,
    raca: "Mediterrâneo",
    sexo: "Macho",
    maturidade: "Touro",
    ultimaAtualizacao: "07/12/2024",
    status: "Ativo",
    nascimento: "14/02/2019",
    pai: "Touro Sebastião",
    mae: "Vaca Rosa",
  },
  {
    tag: "BUF010",
    nome: "Vaca Helena",
    peso: 700,
    raca: "Murrah",
    sexo: "Fêmea",
    maturidade: "Vaca",
    ultimaAtualizacao: "06/12/2024",
    status: "Ativo",
    nascimento: "25/05/2020",
    pai: "Touro Antônio",
    mae: "Vaca Francisca",
  },
  {
    tag: "BUF011",
    nome: "Novilho José",
    peso: 550,
    raca: "Jafarabadi",
    sexo: "Macho",
    maturidade: "Novilho",
    ultimaAtualizacao: "05/12/2024",
    status: "Ativo",
    nascimento: "08/10/2022",
    pai: "Touro Carlos",
    mae: "Vaca Lúcia",
  },
  {
    tag: "BUF012",
    nome: "Bezerra Rosa",
    peso: 130,
    raca: "Surti",
    sexo: "Fêmea",
    maturidade: "Bezerra",
    ultimaAtualizacao: "04/12/2024",
    status: "Ativo",
    nascimento: "15/08/2024",
    pai: "Touro Mário",
    mae: "Búfala Clara",
  },
  {
    tag: "BUF013",
    nome: "Vaca Antonia",
    peso: 720,
    raca: "Mediterrâneo",
    sexo: "Fêmea",
    maturidade: "Vaca",
    ultimaAtualizacao: "03/12/2024",
    status: "Ativo",
    nascimento: "03/07/2019",
    pai: "Touro Sebastião",
    mae: "Vaca Rosa",
  },
  {
    tag: "BUF014",
    nome: "Touro Bruno",
    peso: 880,
    raca: "Murrah",
    sexo: "Macho",
    maturidade: "Touro",
    ultimaAtualizacao: "02/12/2024",
    status: "Ativo",
    nascimento: "17/12/2018",
    pai: "Touro Antônio",
    mae: "Vaca Francisca",
  },
  {
    tag: "BUF015",
    nome: "Novilha Rita",
    peso: 470,
    raca: "Jafarabadi",
    sexo: "Fêmea",
    maturidade: "Novilha",
    ultimaAtualizacao: "01/12/2024",
    status: "Ativo",
    nascimento: "28/11/2022",
    pai: "Touro Bruno",
    mae: "Vaca Lúcia",
  },
];

// ==================== FUNÇÕES UTILITÁRIAS ====================
const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "ativo":
      return "bg-[#9DFFBE] text-gray-800";
    case "inativo":
      return "bg-red-200 text-red-800";
    case "doente":
      return "bg-yellow-200 text-yellow-800";
    default:
      return "bg-gray-200 text-gray-800";
  }
};

const getSexIcon = (sexo) => {
  return sexo === "Fêmea" ? "♀" : "♂";
};

const getUniqueValues = (field) => {
  const values = [...new Set(BUFFALOS_MOCK.map((buffalo) => buffalo[field]))];
  return values.sort();
};

const getDadosZootecnicos = (buffalo) => ({
  producaoLeite:
    buffalo.sexo === "Fêmea" &&
    (buffalo.maturidade === "Vaca" || buffalo.maturidade === "Novilha")
      ? {
          producaoDiaria: Math.floor(Math.random() * 15) + 5 + " L",
          producaoMensal: Math.floor(Math.random() * 300) + 150 + " L",
          gordura: (Math.random() * 2 + 4).toFixed(1) + "%",
          proteina: (Math.random() * 1 + 3).toFixed(1) + "%",
        }
      : null,
  reproducao: {
    ultimoCio: buffalo.sexo === "Fêmea" ? "12/11/2024" : "N/A",
    gestante:
      buffalo.sexo === "Fêmea" ? (Math.random() > 0.7 ? "Sim" : "Não") : "N/A",
    ultimoParto:
      buffalo.sexo === "Fêmea" && buffalo.maturidade === "Vaca"
        ? "15/06/2024"
        : "N/A",
    numeroPartos:
      buffalo.sexo === "Fêmea" && buffalo.maturidade === "Vaca"
        ? Math.floor(Math.random() * 5) + 1
        : 0,
  },
  crescimento: {
    pesoNascimento:
      buffalo.maturidade === "Bezerro" || buffalo.maturidade === "Bezerra"
        ? "35 kg"
        : "N/A",
    ganhoPesoDiario:
      buffalo.maturidade === "Bezerro" || buffalo.maturidade === "Bezerra"
        ? "0.8 kg/dia"
        : "N/A",
    alturaGarupa: Math.floor(Math.random() * 30) + 120 + " cm",
    condicaoCorporal: Math.floor(Math.random() * 3) + 3 + "/5",
  },
});

const getDadosSanitarios = (buffalo) => ({
  vacinacao: [
    {
      vacina: "Febre Aftosa",
      data: "15/10/2024",
      proxima: "15/04/2025",
      status: "Em dia",
    },
    {
      vacina: "Brucelose",
      data: "20/08/2024",
      proxima: "20/08/2025",
      status: "Em dia",
    },
    {
      vacina: "Raiva",
      data: "10/09/2024",
      proxima: "10/09/2025",
      status: "Em dia",
    },
    {
      vacina: "Clostridiose",
      data: "05/11/2024",
      proxima: "05/05/2025",
      status: "Em dia",
    },
  ],
  vermifugacao: [
    {
      produto: "Ivermectina",
      data: "01/11/2024",
      proxima: "01/02/2025",
      status: "Em dia",
    },
    {
      produto: "Albendazol",
      data: "15/09/2024",
      proxima: "15/12/2024",
      status: "Atrasado",
    },
  ],
  exames: [
    {
      exame: "Brucelose",
      data: "10/10/2024",
      resultado: "Negativo",
      status: "Normal",
    },
    {
      exame: "Tuberculose",
      data: "10/10/2024",
      resultado: "Negativo",
      status: "Normal",
    },
    {
      exame: "Hemograma",
      data: "25/11/2024",
      resultado: "Normal",
      status: "Normal",
    },
  ],
  tratamentos:
    buffalo.status === "Doente"
      ? [
          {
            tratamento: "Antibiótico",
            inicio: "01/12/2024",
            fim: "10/12/2024",
            status: "Em andamento",
          },
        ]
      : [],
});

// ==================== COMPONENTE PRINCIPAL ====================
export default function Rebanho() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  // Estados
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    sexo: "",
    raca: "",
    maturidade: "",
    status: "",
  });
  const [selectedBuffalo, setSelectedBuffalo] = useState(null);
  const [activeTab, setActiveTab] = useState("info");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // modal criar bufalo

 const [formData, setFormData] = useState({
    nome: "",
    brinco: "",
    dt_nascimento: "",
    nivel_maturidade: "",
    sexo: "",
    id_raca: "",
    id_propriedade: "",
    id_grupo: "",
    id_pai: "",
    id_mae: "",
    status: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await buffaloService.registrarBuffalo(formData, token);
      setIsModalOpen(false);
      alert("✅ Búfalo cadastrado com sucesso!");
    } catch (error) {
      alert("❌ Erro ao cadastrar búfalo");
    }
  };


  // fim modal criar bufalo

  // Lógica de filtros e paginação
  const getFilteredBuffalos = () => {
    return BUFFALOS_MOCK.filter((buffalo) => {
      return (
        (filters.sexo === "" || buffalo.sexo === filters.sexo) &&
        (filters.raca === "" || buffalo.raca === filters.raca) &&
        (filters.maturidade === "" ||
          buffalo.maturidade === filters.maturidade) &&
        (filters.status === "" || buffalo.status === filters.status)
      );
    });
  };

  const filteredBuffalos = getFilteredBuffalos();
  const totalPages = Math.ceil(filteredBuffalos.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentBuffalos = filteredBuffalos.slice(startIndex, endIndex);

  // Handlers
  const handleViewBuffalo = (buffalo) => {
    setSelectedBuffalo(buffalo);
    setActiveTab("info");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBuffalo(null);
    setActiveTab("info");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      sexo: "",
      raca: "",
      maturidade: "",
      status: "",
    });
    setCurrentPage(1);
  };

  // Effects
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Gestão do Rebanho
            </h1>
            <p className="text-gray-600 text-lg">
              Gerencie seu rebanho de búfalos, registre informações zootécnicas
              e sanitárias.
            </p>
          </div>

          {/* Resumo do Rebanho */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">
                  Total do Rebanho
                </h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">
                  Ativos
                </span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">
                150
              </p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                Búfalos no sistema
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">
                  Fêmeas
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

            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">
                  Machos
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

            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">
                  Vacas Produtoras
                </h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">
                  Ativas
                </span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">
                70
              </p>
              <p className="text-sm font-medium text-[var(--color-text-tertiary)] mt-1">
                Em lactação
              </p>
            </div>
          </div>
        </div>

        {/* Gráficos de Análise */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gráfico de Maturidade */}
          <div className="bg-white rounded-xl p-5 border border-[#e0e0e0] shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Distribuição por Maturidade
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={CHART_DATA.maturidade}
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {CHART_DATA.maturidade.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de Sexo */}
          <div className="bg-white rounded-xl p-5 border border-[#e0e0e0] shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Distribuição por Sexo
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={CHART_DATA.sexo}
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {CHART_DATA.sexo.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de Raças */}
          <div className="bg-white rounded-xl p-5 border border-[#e0e0e0] shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Distribuição por Raça
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={CHART_DATA.racas}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#FFCF78" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cards de Búfalos com Filtros e Paginação */}
        <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold text-gray-800">
                Registro de Búfalos
              </h2>
              <Button
                variant="primary"
                size="medium"
                onClick={() => setIsModalOpen(true)}
              >
                + Adicionar Búfalo
              </Button>
            </div>

            <p className="text-gray-600">
              {filteredBuffalos.length === BUFFALOS_MOCK.length
                ? `Lista completa do rebanho com ${
                    BUFFALOS_MOCK.length
                  } búfalo${BUFFALOS_MOCK.length !== 1 ? "s" : ""} ativos.`
                : `Mostrando ${filteredBuffalos.length} de ${
                    BUFFALOS_MOCK.length
                  } búfalo${BUFFALOS_MOCK.length !== 1 ? "s" : ""} ativos.`}
              {totalPages > 0 && ` Página ${currentPage} de ${totalPages}`}
            </p>
          </div>

          {/* Filtros */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex flex-wrap items-center gap-4">
              <h3 className="text-sm font-semibold text-gray-700 mr-2">
                Filtros:
              </h3>

              {/* Filtro por Sexo */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Sexo:</label>
                <select
                  value={filters.sexo}
                  onChange={(e) => handleFilterChange("sexo", e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFCF78]"
                >
                  <option value="">Todos</option>
                  {getUniqueValues("sexo").map((sexo) => (
                    <option key={sexo} value={sexo}>
                      {sexo}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por Raça */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Raça:</label>
                <select
                  value={filters.raca}
                  onChange={(e) => handleFilterChange("raca", e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFCF78]"
                >
                  <option value="">Todas</option>
                  {getUniqueValues("raca").map((raca) => (
                    <option key={raca} value={raca}>
                      {raca}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por Maturidade */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Maturidade:</label>
                <select
                  value={filters.maturidade}
                  onChange={(e) =>
                    handleFilterChange("maturidade", e.target.value)
                  }
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFCF78]"
                >
                  <option value="">Todas</option>
                  {getUniqueValues("maturidade").map((maturidade) => (
                    <option key={maturidade} value={maturidade}>
                      {maturidade}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por Status */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Status:</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFCF78]"
                >
                  <option value="">Todos</option>
                  {getUniqueValues("status").map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Botão para limpar filtros */}
              {(filters.sexo ||
                filters.raca ||
                filters.maturidade ||
                filters.status) && (
                <button
                  onClick={clearFilters}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm px-3 py-1 rounded-md transition-colors"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          </div>

          {/* Lista de Búfalos ou Mensagem de Vazio */}
          {filteredBuffalos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg mb-2">
                Nenhum búfalo encontrado
              </p>
              <p className="text-gray-400 text-sm">
                Tente ajustar os filtros para ver mais resultados
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 bg-[#FFCF78] hover:bg-[#F2B84D] text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            <>
              {/* Grid de Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {currentBuffalos.map((buffalo) => (
                  <div
                    key={buffalo.tag}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleViewBuffalo(buffalo)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleViewBuffalo(buffalo);
                      }
                    }}
                    className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all p-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    {/* Header do Card */}
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-bold text-[#CE7D0A] bg-[#FFCF78]/30 px-2 py-1 rounded">
                        {buffalo.tag}
                      </span>
                      <span className="text-lg text-[#CE7D0A]">
                        {getSexIcon(buffalo.sexo)}
                      </span>
                    </div>

                    {/* Nome e informações principais */}
                    <div className="mb-3">
                      <h3 className="text-sm font-bold text-gray-800 mb-1 truncate">
                        {buffalo.nome}
                      </h3>
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>{buffalo.raca}</span>
                        <span>{buffalo.peso}kg</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {buffalo.maturidade}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex justify-between items-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          buffalo.status
                        )}`}
                      >
                        {buffalo.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Componente de Paginação */}
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
                  {Math.min(endIndex, filteredBuffalos.length)} de{" "}
                  {filteredBuffalos.length} búfalos
                </div>
              )}
            </>
          )}
        </div>

        {/* Análise de Saúde do Rebanho */}
        <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Análise de Saúde do Rebanho
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Doenças recorrentes */}
            <div className="bg-white rounded-lg shadow border border-[#e0e0e0] p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Doenças Recorrentes
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Doenças recorrentes registradas no rebanho
              </p>

              <div className="flex flex-col gap-4">
                {HEALTH_DATA.doencasRecorrentes.map((doenca, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-800">
                        {doenca.nome}
                      </span>
                      <span className="text-sm font-medium text-gray-800">
                        {doenca.percentual.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full h-6 bg-gray-100 rounded overflow-hidden">
                      <div
                        className="h-full bg-[#FFCF78] rounded flex items-center justify-end pr-2"
                        style={{ width: `${doenca.percentual}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Doenças por maturidade */}
            <div className="bg-white rounded-lg shadow border border-[#e0e0e0] p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Doenças por Nível de Maturidade
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Distribuição de doenças por faixa etária
              </p>

              <div className="flex flex-col gap-4">
                {HEALTH_DATA.doencasPorMaturidade.map((item, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-800">
                        {item.categoria}
                      </span>
                      <span className="text-sm font-medium text-gray-800">
                        {item.percentual.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full h-6 bg-gray-100 rounded overflow-hidden">
                      <div
                        className="h-full bg-[#CE7D0A] rounded flex items-center justify-end pr-2"
                        style={{ width: `${item.percentual}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal do Búfalo */}
        <BuffaloModal
          open={isModalOpen}
          buffalo={selectedBuffalo}
          onClose={closeModal}
          getStatusColor={getStatusColor}
          getDadosZootecnicos={getDadosZootecnicos}
          getDadosSanitarios={getDadosSanitarios}
          getSexIcon={getSexIcon}
          buffalosMock={BUFFALOS_MOCK}
        />

        {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Cadastrar Búfalo</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="nome"
                placeholder="Nome"
                value={formData.nome}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                name="brinco"
                placeholder="Brinco"
                value={formData.brinco}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              <input
                type="date"
                name="dt_nascimento"
                value={formData.dt_nascimento}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              <select
                name="nivel_maturidade"
                value={formData.nivel_maturidade}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="">Selecione o nível</option>
                <option value="N">Novo</option>
                <option value="A">Adulto</option>
              </select>
              <select
                name="sexo"
                value={formData.sexo}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="">Selecione o sexo</option>
                <option value="M">Macho</option>
                <option value="F">Fêmea</option>
              </select>

              {/* Aqui você pode adicionar mais campos como id_raca, id_propriedade etc. */}

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Salvar
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
