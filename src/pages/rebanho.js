"use client";

import { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/lib/apiClient";

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
import CreateBuffaloModal from "@/components/rebanho/CreateBuffaloModal";
import GerenciadorMedicacoes from "@/components/rebanho/GerenciadorMedicacoes";
import Button from "@/components/Button";
import buffaloService from "@/services/bufaloService";
import racaService from "@/services/racaService";
import medicacaoService from "@/services/medicacaoService";
import HerdHealthAnalysis from "@/components/rebanho/HerdHealthAnalysis";

// ==================== DADOS MOCK ====================

// Alguns dados mock ainda são necessários para os gráficos e análise de saúde
const records = [
  {
    id: "A-001",
    grupo: "Lote 1",
    sexo: "Fêmea",
    raca: "Murrah",
    maturidade: "Adulto",
    doencas: [{ nome: "Mastite" }, { nome: "Claudicação" }],
  },
  {
    id: "A-002",
    grupo: "Lote 2",
    sexo: "Macho",
    raca: "Jafarabadi",
    maturidade: "Jovem",
    doencas: [{ nome: "Verminose" }],
  },
  // ...
];

const ITEMS_PER_PAGE = 10;

// Dados para os gráficos (alguns ainda mockados)
const CHART_DATA = {
  // maturidade: removido - agora usa dados reais da API
  // sexo: removido - agora usa dados reais da API
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

// ==================== FUNÇÕES UTILITÁRIAS ====================
const getStatusColor = (status) => {
  // Verificar se status é undefined, null ou não é uma string
  if (status === undefined || status === null || typeof status !== "string") {
    console.warn("Aviso: Status inválido recebido em getStatusColor:", status);
    return "bg-gray-200 text-gray-800"; // Retornar estilo padrão
  }

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

// ==================== COMPONENTE PRINCIPAL ====================
export default function Rebanho() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout, token, getAccessToken } = useAuth();

  // Estados para dados crus
  const [bufalosRaw, setBufalosRaw] = useState([]);
  const [racasRaw, setRacasRaw] = useState([]);

  // Estados para dados tratados
  const [bufalos, setBufalos] = useState([]);
  const [racas, setRacas] = useState([]);
  const [carregandoBufalos, setCarregandoBufalos] = useState(false);
  const [carregandoRacas, setCarregandoRacas] = useState(false);

  // Buscar raças cruas
  const fetchRacas = useCallback(async () => {
    try {
      setCarregandoRacas(true);
      const token = await getAccessToken();
      if (!token) return;
      const data = await racaService.listarRacas(token);
      setRacasRaw(Array.isArray(data) ? data : []);
    } catch (error) {
      setRacasRaw([]);
    } finally {
      setCarregandoRacas(false);
    }
  }, [getAccessToken]);

  // Buscar búfalos crus
  const fetchBufalos = useCallback(async () => {
    try {
      setCarregandoBufalos(true);
      const token = await getAccessToken();
      if (!token) return;
      const data = await apiFetch("/bufalos", { method: "GET", token });
      setBufalosRaw(Array.isArray(data) ? data : []);
    } catch (error) {
      setBufalosRaw([]);
    } finally {
      setCarregandoBufalos(false);
    }
  }, [getAccessToken]);

  // Buscar dados crus apenas uma vez (removendo dependência de propriedade)
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      fetchRacas();
      fetchBufalos();
    }
  }, [isAuthenticated, isLoading]); // Removido fetchRacas e fetchBufalos das dependências

  // Tratar dados quando ambos estiverem carregados
  useEffect(() => {
    if (bufalosRaw.length > 0 && racasRaw.length > 0) {
      // Correlacionar búfalos com raças
      const mapRacas = racasRaw.reduce((map, raca) => {
        map[raca.id_raca] = raca;
        return map;
      }, {});
      const bufalosComRacas = bufalosRaw.map((bufalo) => {
        const racaDetalhes = mapRacas[bufalo.id_raca] || null;
        return {
          ...bufalo,
          raca: racaDetalhes
            ? { id: racaDetalhes.id_raca, nome: racaDetalhes.nome }
            : null,
        };
      });
      setBufalos(bufalosComRacas);
      setRacas(racasRaw);
    } else {
      setBufalos([]);
      setRacas(racasRaw);
    }
  }, [bufalosRaw, racasRaw]);

  // Função para obter valores únicos para os filtros (agora dentro do componente)
  const getUniqueValues = (field) => {
    if (bufalos.length === 0) {
      return [];
    }

    // Mapear campos para os equivalentes na API
    const fieldMap = {
      sexo: (b) =>
        b.sexo === "M" ? "Macho" : b.sexo === "F" ? "Fêmea" : b.sexo,
      raca: (b) => {
        // Usar o nome da raça do objeto raca já correlacionado
        if (b.raca?.nome) return b.raca.nome;

        // Se não tiver raca mas tiver id_raca, tentar buscar no array de raças
        if (b.id_raca) {
          const racaEncontrada = racas.find((r) => r.id_raca === b.id_raca);
          return racaEncontrada ? racaEncontrada.nome : `Raça ${b.id_raca}`;
        }

        return "";
      },
      maturidade: (b) => {
        if (b.maturidade) return b.maturidade;
        if (b.nivel_maturidade === "N") return "Novilho(a)";
        if (b.nivel_maturidade === "B") return "Bezerro(a)";
        if (b.nivel_maturidade === "A") return "Adulto";
        return b.nivel_maturidade || "";
      },
      status: (b) => (b.status === true ? "Ativo" : "Inativo"),
    };

    // Usar mapeador se existir, caso contrário usar campo direto
    const valueGetter = fieldMap[field] || ((b) => b[field]);

    // Obter valores únicos
    const values = [
      ...new Set(bufalos.map(valueGetter).filter(Boolean)),
    ];
    return values.sort();
  };

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
  const [showViewModal, setShowViewModal] = useState(false); // modal de visualizar (BuffaloModal)
  const [showCreateModal, setShowCreateModal] = useState(false); // modal de criar (CreateBuffaloModal)

  // Filtrar búfalos ativos para os indicadores
  const bufalosAtivos = bufalos.filter((b) => b.status === true);

  // Lógica de filtros e paginação
  const getFilteredBuffalos = () => {
    const dataSource = bufalos.length > 0 ? bufalos : [];

    // Filtrar búfalos de acordo com os filtros selecionados
    const filtered = dataSource.filter((buffalo) => {
      return (
        (filters.sexo === "" ||
          buffalo.sexo === filters.sexo ||
          (buffalo.sexo === "M" && filters.sexo === "Macho") ||
          (buffalo.sexo === "F" && filters.sexo === "Fêmea")) &&
        (filters.raca === "" ||
          buffalo.raca === filters.raca ||
          buffalo.raca?.nome === filters.raca ||
          buffalo.id_raca?.toString() === filters.raca) &&
        (filters.maturidade === "" ||
          buffalo.maturidade === filters.maturidade ||
          buffalo.nivel_maturidade === filters.maturidade) &&
        (filters.status === "" ||
          (buffalo.status === true && filters.status === "Ativo") ||
          (buffalo.status === false && filters.status === "Inativo"))
      );
    });

    // Ordenar para mostrar primeiro os búfalos ativos, depois por ID
    return filtered.sort((a, b) => {
      if (a.status !== b.status) {
        return b.status - a.status; // true (1) vem antes de false (0)
      }
      // Ordenar por ID (id_bufalo)
      const idA = a.id_bufalo || 0;
      const idB = b.id_bufalo || 0;
      return idA - idB;
    });
  };

  const filteredBuffalos = getFilteredBuffalos();
  const totalPages = Math.ceil(filteredBuffalos.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentBuffalos = filteredBuffalos.slice(startIndex, endIndex);

  // abrir ao clicar na linha da tabela
  const handleViewBuffalo = (buffalo) => {
    setSelectedBuffalo(buffalo);
    setActiveTab("info");
    setShowViewModal(true);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
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
                <span className="text-xs font-medium text-[var(--color-primary-dark]">
                  Ativos
                </span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark]">
                {bufalosAtivos.length || "-"}
              </p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                {carregandoBufalos
                  ? "Carregando..."
                  : "Búfalos ativos no sistema"}
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
              {carregandoBufalos ? (
                <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">
                  -
                </p>
              ) : (
                <>
                  <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">
                    {bufalosAtivos.filter((b) => b.sexo === "F").length}
                  </p>
                  <p className="text-sm font-semibold text-[var(--color-primary-dark)] mt-1">
                    {bufalosAtivos.length > 0
                      ? `${Math.round(
                          (bufalosAtivos.filter((b) => b.sexo === "F").length /
                            bufalosAtivos.length) *
                            100
                        )}% do rebanho`
                      : "0% do rebanho"}
                  </p>
                </>
              )}
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
              {carregandoBufalos ? (
                <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">
                  -
                </p>
              ) : (
                <>
                  <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">
                    {bufalosAtivos.filter((b) => b.sexo === "M").length}
                  </p>
                  <p className="text-sm font-semibold text-[var(--color-primary-dark)] mt-1">
                    {bufalosAtivos.length > 0
                      ? `${Math.round(
                          (bufalosAtivos.filter((b) => b.sexo === "M").length /
                            bufalosAtivos.length) *
                            100
                        )}% do rebanho`
                      : "0% do rebanho"}
                  </p>
                </>
              )}
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
              {carregandoBufalos ? (
                <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">
                  -
                </p>
              ) : (
                <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">
                  {
                    bufalosAtivos.filter(
                      (b) =>
                        b.sexo === "F" &&
                        (b.nivel_maturidade === "A" ||
                          b.nivel_maturidade === "V" ||
                          b.nivel_maturidade === "adulto" ||
                          b.nivel_maturidade === "Adulto")
                    ).length
                  }
                </p>
              )}
              <p className="text-sm font-medium text-[var(--color-text-tertiary)] mt-1">
                Em lactação
              </p>
            </div>
          </div>
        </div>

        {/* Gráficos de Análise */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gráfico de Maturidade - com dados reais da API */}
          <div className="bg-white rounded-xl p-5 border border-[#e0e0e0] shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Distribuição por Maturidade
            </h2>
            <div className="flex flex-col items-center justify-center h-[200px] text-center">
              {carregandoBufalos ? (
                <p className="text-gray-400 text-sm mt-10">
                  Carregando dados...
                </p>
              ) : bufalosAtivos.length === 0 ? (
                <p className="text-gray-400 text-sm mt-10">
                  Nenhum dado disponível
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={[
                        {
                          name: "Bezerros",
                          value: bufalosAtivos.filter(
                            (b) => b.nivel_maturidade === "B"
                          ).length,
                          color: "#FCA90F",
                        },
                        {
                          name: "Novilhos",
                          value: bufalosAtivos.filter(
                            (b) => b.nivel_maturidade === "N"
                          ).length,
                          color: "#FFCF78",
                        },
                        {
                          name: "Adultos",
                          value: bufalosAtivos.filter(
                            (b) => b.nivel_maturidade === "A"
                          ).length,
                          color: "#CE7D0A",
                        },
                        {
                          name: "Outros",
                          value: bufalosAtivos.filter(
                            (b) => !["A", "B", "N"].includes(b.nivel_maturidade)
                          ).length,
                          color: "#F2B84D",
                        },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) =>
                        value > 0 ? `${name}: ${value}` : ""
                      }
                    >
                      {[
                        { name: "Bezerros", color: "#FCA90F" },
                        { name: "Novilhos", color: "#FFCF78" },
                        { name: "Adultos", color: "#CE7D0A" },
                        { name: "Outros", color: "#F2B84D" },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Gráfico de Sexo - com dados reais da API */}
          <div className="bg-white rounded-xl p-5 border border-[#e0e0e0] shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Distribuição por Sexo
            </h2>
            <div className="flex flex-col items-center justify-center h-[200px] text-center">
              {carregandoBufalos ? (
                <p className="text-gray-400 text-sm mt-10">
                  Carregando dados...
                </p>
              ) : bufalos.length === 0 ? (
                <p className="text-gray-400 text-sm mt-10">
                  Nenhum dado disponível
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={[
                        {
                          name: "Fêmeas",
                          value: bufalos.filter(
                            (b) => b.sexo === "F"
                          ).length,
                          color: "#FFCF78",
                        },
                        {
                          name: "Machos",
                          value: bufalos.filter(
                            (b) => b.sexo === "M"
                          ).length,
                          color: "#CE7D0A",
                        },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {[
                        { name: "Fêmeas", color: "#FFCF78" },
                        { name: "Machos", color: "#CE7D0A" },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Gráfico de Raças */}
          <div className="bg-white rounded-xl p-5 border border-[#e0e0e0] shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Distribuição por Raça
            </h2>
            <div className="flex flex-col items-center justify-center h-[200px] text-center">
              {carregandoBufalos ? (
                <p className="text-gray-400 text-sm mt-10">
                  Carregando dados...
                </p>
              ) : bufalos.length === 0 ? (
                <p className="text-gray-400 text-sm mt-10">
                  Nenhum dado disponível
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart
                    data={(() => {
                      // Criar um mapa de raças para acesso rápido por ID
                      const mapRacas = racas.reduce((map, raca) => {
                        map[raca.id_raca] = raca.nome;
                        return map;
                      }, {});

                      // Calcular dados de raça a partir dos dados reais
                      const contagem = {};
                      bufalos.forEach((b) => {
                        // Usar o nome da raça do objeto raca já correlacionado, ou buscar no mapa
                        // se ainda não estiver correlacionado, ou usar 'Sem Raça' como último recurso
                        const racaNome =
                          b.raca?.nome ||
                          (b.id_raca
                            ? mapRacas[b.id_raca] || `${mapRacas[b.id_raca]}`
                            : "Sem Raça");
                        contagem[racaNome] = (contagem[racaNome] || 0) + 1;
                      });

                      // Converter para o formato esperado pelo gráfico
                      return Object.entries(contagem)
                        .sort(([, a], [, b]) => b - a) // Ordenar por quantidade (maior para menor)
                        .map(([nome, quantidade], index) => ({
                          name: nome,
                          value: quantidade,
                          color: ["#FFCF78", "#CE7D0A", "#F2B84D", "#FCA90F"][
                            index % 4
                          ],
                        }))
                        .slice(0, 6); // Limitar a 6 raças para melhor visualização
                    })()}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10 }}
                      tickFormatter={(value) =>
                        value.length > 12
                          ? `${value.substring(0, 10)}...`
                          : value
                      }
                    />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name, props) => [
                        `${value} búfalos`,
                        props.payload.name,
                      ]}
                    />
                    <Bar dataKey="value" fill="#FFCF78" name="Quantidade">
                      {bufalos.length > 0 &&
                        Object.entries(
                          (() => {
                            // Criar um mapa de raças para acesso rápido por ID
                            const mapRacas = racas.reduce((map, raca) => {
                              map[raca.id_raca] = raca.nome;
                              return map;
                            }, {});

                            const contagem = {};
                            bufalos.forEach((b) => {
                              const racaNome =
                                b.raca?.nome ||
                                (b.id_raca
                                  ? mapRacas[b.id_raca] ||
                                    `${mapRacas[b.id_raca]}`
                                  : "Sem Raça");
                              contagem[racaNome] =
                                (contagem[racaNome] || 0) + 1;
                            });
                            return contagem;
                          })()
                        )
                          .sort(([, a], [, b]) => b - a)
                          .slice(0, 6)
                          .map(([nome], index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                ["#FFCF78", "#CE7D0A", "#F2B84D", "#FCA90F"][
                                  index % 4
                                ]
                              }
                            />
                          ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Tabela de Búfalos com Filtros e Paginação (estilo zebra) */}
        <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold text-gray-800">
                Registro de Búfalos
              </h2>

              <Button onClick={() => setShowCreateModal(true)}>
                + Adicionar Búfalo
              </Button>
            </div>

            <p className="text-gray-600">
              {carregandoBufalos
                ? "Carregando dados do rebanho..."
                : bufalos.length > 0
                ? filteredBuffalos.length === bufalos.length
                  ? `Lista completa do rebanho com ${bufalos.length} búfalo${
                      bufalos.length !== 1 ? "s" : ""
                    } registrados.`
                  : `Mostrando ${filteredBuffalos.length} de ${
                      bufalos.length
                    } búfalo${bufalos.length !== 1 ? "s" : ""} ativos.`
                : "Nenhum dado de rebanho disponível."}
              {totalPages > 0 && ` Página ${currentPage} de ${totalPages}`}
            </p>
          </div>

          {/* Filtros */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex flex-wrap items-center gap-4">
              <h3 className="text-sm font-semibold text-gray-700 mr-2">
                Filtros:
              </h3>

              {/* Sexo */}
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

              {/* Raça */}
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

              {/* Maturidade */}
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

              {/* Status */}
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

          {/* Tabela ou vazio */}
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
              <div className="overflow-x-auto w-full">
                <table className="w-full border-collapse min-w-[800px] bg-white rounded-lg overflow-hidden shadow-sm">
                  <thead className="bg-[#f0f0f0]">
                    <tr>
                      <th className="p-3 text-center font-medium text-gray-800 text-base">
                        TAG
                      </th>
                      <th className="p-3 text-center font-medium text-gray-800 text-base">
                        Nome
                      </th>
                      <th className="p-3 text-center font-medium text-gray-800 text-base">
                        Sexo
                      </th>
                      <th className="p-3 text-center font-medium text-gray-800 text-base">
                        Raça
                      </th>
                      <th className="p-3 text-center font-medium text-gray-800 text-base">
                        Maturidade
                      </th>

                      <th className="p-3 text-center font-medium text-gray-800 text-base">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {currentBuffalos.map((buffalo) => (
                      <tr
                        key={buffalo.id_bufalo || buffalo.tag}
                        className="odd:bg-white even:bg-[#fafafa] hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleViewBuffalo(buffalo)}
                      >
                        <td className="p-3 text-center text-gray-800 text-base font-medium">
                          {buffalo.brinco || buffalo.tag}
                        </td>
                        <td className="p-3 text-center text-gray-800 text-base">
                          {buffalo.nome}
                        </td>
                        <td className="p-3 text-center text-gray-800 text-base">
                          {buffalo.sexo === "M"
                            ? "Macho"
                            : buffalo.sexo === "F"
                            ? "Fêmea"
                            : buffalo.sexo}
                        </td>
                        <td className="p-3 text-center text-gray-800 text-base">
                          {buffalo.raca?.nome ||
                            (buffalo.id_raca
                              ? (racas.find(r => r.id_raca === buffalo.id_raca)?.nome || `Raça ${buffalo.id_raca}`)
                              : "N/D")}
                        </td>
                        <td className="p-3 text-center text-gray-800 text-base">
                          {(() => {
                            if (buffalo.maturidade) return buffalo.maturidade;
                            switch (buffalo.nivel_maturidade) {
                              case "B": return "Bezerro(a)";
                              case "N": return "Novilho(a)";
                              case "V": return "Vaca Produtora";
                              case "T": return "Touro";
                              case "A": return "Adulto";
                              default: return buffalo.nivel_maturidade || "N/D";
                            }
                          })()}
                        </td>
                        <td className="p-3 text-center text-gray-800 text-base">
                          <span
                            className={`px-2.5 py-1.5 rounded-full text-sm font-bold inline-block w-28 ${getStatusColor(
                              buffalo.status === true ? "Ativo" : "Inativo"
                            )}`}
                          >
                            {buffalo.status === true ? "Ativo" : "Inativo"}
                          </span>
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

        {/* Gerenciador de Medicações */}
        <GerenciadorMedicacoes
          token={token || (isAuthenticated ? getAccessToken() : null)}
        />

        {/* <HerdHealthAnalysis records={records} /> */}

        {/* Modal do Búfalo */}
        <BuffaloModal
          open={showViewModal}
          buffalo={selectedBuffalo}
          onClose={closeViewModal}
          getStatusColor={getStatusColor}
          getSexIcon={getSexIcon}
        />

        {/* Modal de criar búfalo */}
        <CreateBuffaloModal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          racas={racas}
          token={token}
        />
      </div>
    </>
  );
}
