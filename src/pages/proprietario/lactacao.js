import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  ReferenceLine,
  LabelList,
} from "recharts";
import dashboardService from "@/services/dashboardService";
import cicloLactacaoService from "@/services/cicloLactacaoService";
import { usePropriedade } from "@/contexts/propriedadeContext";

export default function Lactacao() {
  const { propriedadeId } = usePropriedade();
  const router = useRouter();

  // ==== estados locais ====
  const [viewMode, setViewMode] = React.useState("monthly"); // 'monthly' | 'yearly'
  const [lacPage, setLacPage] = React.useState(1); // paginação da tabela
  const [lactacaoStats, setLactacaoStats] = React.useState(null); // dados do endpoint
  const [ciclosData, setCiclosData] = React.useState([]);
  const [ciclosMeta, setCiclosMeta] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  // Exemplo: pegar idPropriedade do router ou contexto
  const idPropriedade = propriedadeId;
  const anoAtual = 2025; // ou use new Date().getFullYear()

  React.useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      setError(null);
      try {
        if (!idPropriedade) return;
        const data = await dashboardService.getLactacaoStatsByPropriedadeId(idPropriedade, anoAtual);
        setLactacaoStats(data);
      } catch (err) {
        setError("Erro ao buscar dados de lactação");
      } finally {
        setLoading(false);
      }
    }
    if (idPropriedade) fetchStats();
  }, [idPropriedade]);

  React.useEffect(() => {
    async function fetchCiclos() {
      setLoading(true);
      setError(null);
      try {
        if (!idPropriedade) return;
        const res = await cicloLactacaoService.listarCiclosPorPropriedade(idPropriedade, lacPage, 10);
        setCiclosData(res.data || []);
        setCiclosMeta(res.meta || null);
      } catch (err) {
        setError("Erro ao buscar ciclos de lactação");
      } finally {
        setLoading(false);
      }
    }
    if (idPropriedade) fetchCiclos();
  }, [idPropriedade, lacPage]);

  // ==== paginação da tabela removida ====
  // Exibe todos os ciclos de lactação sem paginação
  const lactacoesPageData = ciclosData;

  // (opcional) diário — se quiser usar em outro gráfico
  const dailyProductionData = [
    { day: 1, producao: 12.5 },
    { day: 2, producao: 13.2 },
    { day: 3, producao: 11.8 },
    { day: 4, producao: 14.1 },
    { day: 5, producao: 12.9 },
    { day: 6, producao: 13.7 },
    { day: 7, producao: 12.3 },
    { day: 8, producao: 13.8 },
    { day: 9, producao: 14.2 },
    { day: 10, producao: 12.6 },
    { day: 11, producao: 13.4 },
    { day: 12, producao: 11.9 },
    { day: 13, producao: 13.1 },
    { day: 14, producao: 14.0 },
    { day: 15, producao: 12.8 },
    { day: 16, producao: 13.5 },
    { day: 17, producao: 12.4 },
    { day: 18, producao: 13.9 },
    { day: 19, producao: 14.3 },
    { day: 20, producao: 12.7 },
    { day: 21, producao: 13.3 },
    { day: 22, producao: 12.1 },
    { day: 23, producao: 13.6 },
    { day: 24, producao: 14.4 },
    { day: 25, producao: 12.9 },
    { day: 26, producao: 13.8 },
    { day: 27, producao: 12.2 },
    { day: 28, producao: 13.7 },
    { day: 29, producao: 14.1 },
    { day: 30, producao: 12.5 },
  ];

  // ==== helpers de UI ====
  const getStatusColor = (status) => {
    switch (status) {
      case "Ativa":
        return "bg-[#9DFFBE] text-gray-800";
      case "Em observação":
        return "bg-[#FFCF78] text-gray-800";
      case "Inativa":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const formatStatus = (status) => status || "Desconhecido";

  return (
    <>
      <Head>
        <title>Lactação | Buffs</title>
        <meta name="description" content="Dashboard de lactação e produção de leite" />
      </Head>

      <div className="p-6 flex flex-col gap-8">
        {/* Header - Dashboard de Lactação */}
        <div className="w-full flex flex-col bg-white rounded-xl p-6 gap-6 box-border border border-[#e0e0e0] shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard de Lactação</h1>
            <p className="text-gray-600 text-lg">
              Monitore a produção de leite e gerencie o controle individual de lactação.
            </p>
          </div>

          {/* Cards de estatísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">Produção Diária</h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">Hoje</span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">1.250</p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">Litros produzidos</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">Produção Semanal</h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">7 dias</span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">8.750</p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">Litros na semana</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">Produção Mensal</h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">30 dias</span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">37.500</p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">Litros no mês</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">Búfalas Ativas</h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">Em lactação</span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">70</p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">Produzindo leite</p>
            </div>
          </div>
        </div>

        {/* Análise geral por grupo (estático, sem lógica) */}
        <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-1">
            <h2 className="text-xl font-bold text-gray-800">Análise geral por grupo</h2>

            {/* "Filtros" visuais (somente layout) */}
            <div className="flex flex-wrap gap-2">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button className="px-3 py-1 rounded-md text-sm font-medium bg-white text-gray-800 shadow-sm">Grupo</button>
                <button className="px-3 py-1 rounded-md text-sm font-medium text-gray-600 hover:text-gray-800">Sexo</button>
                <button className="px-3 py-1 rounded-md text-sm font-medium text-gray-600 hover:text-gray-800">Raça</button>
                <button className="px-3 py-1 rounded-md text-sm font-medium text-gray-600 hover:text-gray-800">Maturidade</button>
              </div>
            </div>
          </div>

          {(() => {
            // Ranking de destaques por grupo
            const RANKING_GRUPOS = [
              { grupo: "Lote 1", melhorAnimal: "Búfala A-031", mediaL: 1050, variacaoVsGrupo: +12.5, tendencia: "↑" },
              { grupo: "Lote 2", melhorAnimal: "Búfalo M-014", mediaL: 980, variacaoVsGrupo: +9.2, tendencia: "↑" },
              { grupo: "Lote 3", melhorAnimal: "Búfala F-022", mediaL: 845, variacaoVsGrupo: +7.1, tendencia: "↑" },
              { grupo: "Lote 4", melhorAnimal: "Búfala A-050", mediaL: 910, variacaoVsGrupo: +5.4, tendencia: "→" },
            ];

            // Variação por animal dentro de um grupo (positivo = acima da média do grupo)
            const VARIACAO_GRUPO_EXEMPLO = [
              { animal: "A-031", variacao: +18 },
              { animal: "A-028", variacao: +11 },
              { animal: "A-017", variacao: +6 },
              { animal: "A-043", variacao: -4 },
              { animal: "A-052", variacao: -9 },
              { animal: "A-059", variacao: -15 },
              { animal: "A-061", variacao: +14 },
              { animal: "A-064", variacao: +3 },
              { animal: "A-070", variacao: -2 },
              { animal: "A-073", variacao: -6 },
              { animal: "A-078", variacao: +9 },
              { animal: "A-082", variacao: -11 },
            ];

            return (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Ranking por grupo */}
                <div className="bg-white p-5 rounded-lg shadow border border-[#e0e0e0]">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Destaques por grupo</h3>
                    <span className="text-xs text-gray-500">*dados estáticos de exemplo</span>
                  </div>

                  <div className="flex flex-col gap-3">
                    {RANKING_GRUPOS.map((g, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                      >
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-gray-900">{g.grupo}</div>
                          <div className="text-xs text-gray-600">
                            Melhor animal:&nbsp;<span className="font-medium">{g.melhorAnimal}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm font-bold text-gray-900">{g.mediaL} L</div>
                            <div className={`text-xs font-semibold ${g.variacaoVsGrupo >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                              {g.tendencia} {g.variacaoVsGrupo.toFixed(1)}%
                            </div>
                          </div>

                          {/* Barra compacta */}
                          <div className="w-28 h-2 bg-gray-100 rounded overflow-hidden">
                            <div
                              className={`${g.variacaoVsGrupo >= 0 ? "bg-emerald-400" : "bg-red-400"}`}
                              style={{ width: `${Math.min(100, Math.abs(g.variacaoVsGrupo) * 4)}%`, height: "100%" }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 text-xs text-gray-600">
                    <span className="font-medium">Dica:</span> use este ranking para avaliar quem está acima da média do grupo — bons
                    candidatos para realocação, referência genética e manejo.
                  </div>
                </div>

                {/* Variação (bom x ruim) dentro de um grupo */}
                <div className="bg-white p-5 rounded-lg shadow border border-[#e0e0e0]">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Variação por animal (Grupo Lote 1)</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <i className="w-2 h-2 rounded-full bg-emerald-500" /> Lado bom
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <i className="w-2 h-2 rounded-full bg-red-500" /> Lado ruim
                      </span>
                    </div>
                  </div>

                  <div className="w-full" style={{ height: 320 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={VARIACAO_GRUPO_EXEMPLO} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="animal" />
                        <YAxis tickFormatter={(v) => `${v}%`} />
                        <Tooltip formatter={(v) => [`${v}%`, "Variação vs média"]} />
                        <ReferenceLine y={0} stroke="#9CA3AF" />
                        <Bar dataKey="variacao" radius={[4, 4, 0, 0]} fill="#FFCF78">
                          <LabelList dataKey="variacao" position="top" formatter={(v) => `${v > 0 ? "+" : ""}${v}%`} className="text-xs" />
                          {VARIACAO_GRUPO_EXEMPLO.map((row, idx) => (
                            <Cell key={idx} fill={row.variacao >= 0 ? "#34D399" : "#F87171"} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Lado bom x lado ruim */}
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="rounded-lg border border-gray-200 p-3">
                      <div className="text-sm font-semibold text-emerald-700 mb-2">Lado bom (acima da média)</div>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {VARIACAO_GRUPO_EXEMPLO.filter((x) => x.variacao > 0).map((x, i) => (
                          <li key={i} className="flex items-center justify-between">
                            <span>Animal {x.animal}</span>
                            <span className="font-semibold text-emerald-700">+{x.variacao}%</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-3">
                      <div className="text-sm font-semibold text-red-700 mb-2">Lado ruim (abaixo da média)</div>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {VARIACAO_GRUPO_EXEMPLO.filter((x) => x.variacao < 0).map((x, i) => (
                          <li key={i} className="flex items-center justify-between">
                            <span>Animal {x.animal}</span>
                            <span className="font-semibold text-red-700">{x.variacao}%</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-gray-600">
                    <span className="font-medium">Interpretação rápida:</span> barras positivas = acima da média (manter/espalhar),
                    barras negativas = revisar manejo/troca de lote.
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Tabela de Lactações (sem paginação) */}
        <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold text-gray-800">Controle Individual de Lactação</h2>
              {/* Botão de ação, se necessário */}
            </div>
            <p className="text-gray-600">
              {loading ? "Carregando..." : error ? error : `Lista de ciclos de lactação com ${ciclosMeta?.total || 0} registros.`}
            </p>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full border-collapse min-w-[800px] bg-white rounded-lg overflow-hidden shadow-sm">
              <thead className="bg-[#f0f0f0]">
                <tr>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">ID</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">ID Bufala</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Parto</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Dias Padrão</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Secagem Real</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Status</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Observação</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="text-center p-6 text-gray-500">Carregando ciclos...</td>
                  </tr>
                ) : ciclosData.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center p-6 text-gray-500">Nenhum ciclo encontrado</td>
                  </tr>
                ) : (
                  ciclosData.map((ciclo, idx) => (
                    <tr key={ciclo.id_ciclo_lactacao} className={idx % 2 === 0 ? "bg-white" : "bg-[#fafafa]"}>
                      <td className="p-3 text-center text-gray-800 text-base font-medium">{ciclo.id_ciclo_lactacao}</td>
                      <td className="p-3 text-center text-gray-800 text-base">{ciclo.id_bufala}</td>
                      <td className="p-3 text-center text-gray-800 text-base">{ciclo.dt_parto ? new Date(ciclo.dt_parto).toLocaleDateString() : '-'}</td>
                      <td className="p-3 text-center text-gray-800 text-base">{ciclo.padrao_dias}</td>
                      <td className="p-3 text-center text-gray-800 text-base">{ciclo.dt_secagem_real ? new Date(ciclo.dt_secagem_real).toLocaleDateString() : '-'}</td>
                      <td className="p-3 text-center text-gray-800 text-base">{ciclo.status}</td>
                      <td className="p-3 text-center text-gray-800 text-base">{ciclo.observacao}</td>
                      <td className="p-3 text-center">
                        <button className="bg-[#FFCF78] hover:bg-[#F2B84D] text-black px-3 py-1 rounded-lg text-sm font-medium">
                          Ver detalhes
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Paginação igual tela de rebanho */}
          {ciclosMeta && ciclosMeta.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-4">
              <button
                onClick={() => setLacPage((p) => Math.max(1, p - 1))}
                disabled={ciclosMeta.page <= 1}
                className={`px-4 py-2 rounded-lg font-medium ${ciclosMeta.page <= 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#FFCF78] hover:bg-[#F2B84D] text-gray-800"}`}
              >
                Anterior
              </button>

              {Array.from({ length: ciclosMeta.totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setLacPage(p)}
                  className={`w-10 h-10 rounded-lg font-medium ${ciclosMeta.page === p ? "bg-[#CE7D0A] text-white" : "bg-gray-200 hover:bg-[#FFCF78] text-gray-800"}`}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => setLacPage((p) => Math.min(ciclosMeta.totalPages, p + 1))}
                disabled={ciclosMeta.page >= ciclosMeta.totalPages}
                className={`px-4 py-2 rounded-lg font-medium ${ciclosMeta.page >= ciclosMeta.totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#FFCF78] hover:bg-[#F2B84D] text-gray-800"}`}
              >
                Próximo
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}