import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
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

export default function Lactacao() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  // ==== estados locais ====
  const [viewMode, setViewMode] = React.useState("monthly"); // 'monthly' | 'yearly'
  const [lacPage, setLacPage] = React.useState(1); // paginação da tabela

  // ==== dados mockados (produção/cabeçalho) ====
  const productionDataMonthly = [
    { name: "Jan", producao: 8500 },
    { name: "Fev", producao: 9200 },
    { name: "Mar", producao: 8800 },
    { name: "Abr", producao: 9500 },
    { name: "Mai", producao: 9800 },
    { name: "Jun", producao: 10200 },
    { name: "Jul", producao: 9900 },
    { name: "Ago", producao: 10500 },
    { name: "Set", producao: 10800 },
    { name: "Out", producao: 11200 },
    { name: "Nov", producao: 11500 },
    { name: "Dez", producao: 11800 },
  ];
  const productionDataYearly = [
    { name: "2020", producao: 68000 },
    { name: "2021", producao: 78200 },
    { name: "2022", producao: 88200 },
    { name: "2023", producao: 99700 },
    { name: "2024", producao: 112000 },
  ];
  const productionData =
    viewMode === "monthly" ? productionDataMonthly : productionDataYearly;

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

  // ==== tabela de lactações (mock) ====
  const lactacoesMock = [
    { tag: "BUF001", mediaDiaria: 12.5, mediaSemanal: 87.5, ultimaOrdenha: "15/12/2024", variacao: -15.2, status: "Em observação" },
    { tag: "BUF002", mediaDiaria: 13.8, mediaSemanal: 96.6, ultimaOrdenha: "15/12/2024", variacao: 5.2, status: "Ativa" },
    { tag: "BUF003", mediaDiaria: 11.2, mediaSemanal: 78.4, ultimaOrdenha: "14/12/2024", variacao: -2.1, status: "Ativa" },
    { tag: "BUF004", mediaDiaria: 14.1, mediaSemanal: 98.7, ultimaOrdenha: "15/12/2024", variacao: 8.7, status: "Ativa" },
    { tag: "BUF005", mediaDiaria: 12.9, mediaSemanal: 90.3, ultimaOrdenha: "13/12/2024", variacao: 3.4, status: "Ativa" },
    { tag: "BUF006", mediaDiaria: 13.5, mediaSemanal: 94.5, ultimaOrdenha: "15/12/2024", variacao: 6.8, status: "Ativa" },
    { tag: "BUF007", mediaDiaria: 11.8, mediaSemanal: 82.6, ultimaOrdenha: "14/12/2024", variacao: -1.5, status: "Ativa" },
    { tag: "BUF008", mediaDiaria: 14.3, mediaSemanal: 100.1, ultimaOrdenha: "15/12/2024", variacao: 12.1, status: "Ativa" },
    // adicione mais se quiser testar paginação
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

  // ==== paginação da tabela ====
  const LAC_PER_PAGE = 10;
  const lacTotal = lactacoesMock.length;
  const lacTotalPages = Math.max(1, Math.ceil(lacTotal / LAC_PER_PAGE));
  const lacStartIdx = (lacPage - 1) * LAC_PER_PAGE;
  const lacEndIdx = Math.min(lacStartIdx + LAC_PER_PAGE, lacTotal);
  const lactacoesPageData = lactacoesMock.slice(lacStartIdx, lacEndIdx);

  // ==== auth/redirect ====
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) return null;

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

        {/* Tabela de Lactações (com paginação) */}
        <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Controle Individual de Lactação</h2>
            <p className="text-gray-600">Lista completa de búfalas em lactação com {lactacoesMock.length} animais ativos.</p>
          </div>

          {/* Controles de página (topo) */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Mostrando {lacTotal === 0 ? 0 : lacStartIdx + 1}–{lacEndIdx} de {lacTotal}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLacPage((p) => Math.max(1, p - 1))}
                disabled={lacPage === 1}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  lacPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#FFCF78] hover:bg-[#F2B84D] text-gray-800"
                }`}
              >
                Anterior
              </button>
              {Array.from({ length: lacTotalPages }, (_, i) => i + 1)
                .slice(Math.max(0, lacPage - 4), Math.max(0, lacPage - 4) + 7)
                .map((p) => (
                  <button
                    key={p}
                    onClick={() => setLacPage(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      p === lacPage ? "bg-[#CE7D0A] text-white" : "bg-gray-200 hover:bg-[#FFCF78] text-gray-800"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              <button
                onClick={() => setLacPage((p) => Math.min(lacTotalPages, p + 1))}
                disabled={lacPage === lacTotalPages}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  lacPage === lacTotalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#FFCF78] hover:bg-[#F2B84D] text-gray-800"
                }`}
              >
                Próximo
              </button>
            </div>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full border-collapse min-w-[650px] bg-white rounded-lg overflow-hidden shadow-sm">
              <thead className="bg-[#f0f0f0]">
                <tr>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">TAG</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Média Diária (7d)</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Média Semanal</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Última Ordenha</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Variação</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Status</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Ações</th>
                </tr>
              </thead>
              <tbody>
                {lactacoesPageData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-gray-500">
                      Nenhum registro encontrado.
                    </td>
                  </tr>
                ) : (
                  lactacoesPageData.map((lactacao, idx) => (
                    <tr key={lactacao.tag} className={idx % 2 === 0 ? "bg-[#fafafa]" : "bg-white"}>
                      <td className="p-3 text-center text-gray-800 text-base font-medium">{lactacao.tag}</td>
                      <td className="p-3 text-center text-gray-800 text-base">{lactacao.mediaDiaria} L</td>
                      <td className="p-3 text-center text-gray-800 text-base">{lactacao.mediaSemanal} L</td>
                      <td className="p-3 text-center text-gray-800 text-base">{lactacao.ultimaOrdenha}</td>
                      <td className="p-3 text-center text-gray-800 text-base">
                        <span className={lactacao.variacao >= 0 ? "text-green-600" : "text-red-600"}>
                          {lactacao.variacao >= 0 ? "+" : ""}
                          {lactacao.variacao}%
                        </span>
                      </td>
                      <td className="p-3 text-center text-gray-800 text-base">
                        <span className={`px-2.5 py-1.5 rounded-full text-sm font-bold inline-block w-28 ${getStatusColor(lactacao.status)}`}>
                          {formatStatus(lactacao.status)}
                        </span>
                      </td>
                      <td className="p-3 text-center text-base">
                        <button className="bg-[#FFCF78] border-none text-gray-800 py-2 px-3.5 rounded-lg cursor-pointer text-sm font-bold hover:bg-[#F2B84D] transition-colors">
                          Ver detalhes
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Controles de página (rodapé) */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Mostrando {lacTotal === 0 ? 0 : lacStartIdx + 1}–{lacEndIdx} de {lacTotal}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLacPage((p) => Math.max(1, p - 1))}
                disabled={lacPage === 1}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  lacPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#FFCF78] hover:bg-[#F2B84D] text-gray-800"
                }`}
              >
                Anterior
              </button>
              {Array.from({ length: lacTotalPages }, (_, i) => i + 1)
                .slice(Math.max(0, lacPage - 4), Math.max(0, lacPage - 4) + 7)
                .map((p) => (
                  <button
                    key={p}
                    onClick={() => setLacPage(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      p === lacPage ? "bg-[#CE7D0A] text-white" : "bg-gray-200 hover:bg-[#FFCF78] text-gray-800"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              <button
                onClick={() => setLacPage((p) => Math.min(lacTotalPages, p + 1))}
                disabled={lacPage === lacTotalPages}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  lacPage === lacTotalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#FFCF78] hover:bg-[#F2B84D] text-gray-800"
                }`}
              >
                Próximo
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
