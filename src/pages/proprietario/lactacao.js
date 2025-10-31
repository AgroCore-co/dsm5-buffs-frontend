import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { usePropriedade } from "@/contexts/propriedadeContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import dashboardService from "@/services/dashboardService";
import alertaService from "@/services/alertaService";

export default function Lactacao() {
  // obter id da propriedade via context
  const { propriedadeId } = usePropriedade();

  // Estado para búfalas lactando
  const [bufalasLactando, setBufalasLactando] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertasLactacao, setAlertasLactacao] = useState([]);
  const [alertasLoading, setAlertasLoading] = useState(false);
  const [alertasError, setAlertasError] = useState(null);
  const [alertasSummary, setAlertasSummary] = useState(null); // quando backend retorna apenas o resumo da verificação
  // paginação
  const [alertasPage, setAlertasPage] = useState(1);
  const [alertasLimit, setAlertasLimit] = useState(5);
  const [alertasTotal, setAlertasTotal] = useState(null); // total vindo do servidor (se houver)

  // Função para buscar alertas de produção
  const fetchAlertasProducao = async (page = alertasPage, limit = alertasLimit) => {
    if (!propriedadeId) return;
    setAlertasLoading(true);
    setAlertasError(null);
    try {
      const data = await alertaService.listarAlertasPorPropriedade(propriedadeId, "PRODUCAO", page, limit);

      // Se o backend retornou apenas o resumo da verificação (POST /alertas/verificar)
      if (data && typeof data.success === 'boolean' && (data.alertas_criados !== undefined || data.nichos_verificados !== undefined)) {
        setAlertasSummary(data);
        setAlertasLactacao([]);
        setAlertasTotal(0);
        setAlertasLoading(false);
        return;
      }

      // Otherwise limpa summary e processa listas
      setAlertasSummary(null);

      // Se o backend devolve um objeto com { data, meta }
      if (data && data.data && Array.isArray(data.data)) {
        setAlertasLactacao(sortAndNormalizeAlertas(data.data));
        if (data.meta && typeof data.meta.total === 'number') setAlertasTotal(data.meta.total);
        else setAlertasTotal(null);
      } else if (Array.isArray(data)) {
        // Recebeu array direto (backend sem paginação) -> armazenar e paginar client-side
        setAlertasLactacao(sortAndNormalizeAlertas(data));
        setAlertasTotal(data.length);
      } else if (data && Array.isArray(data.alertas)) {
        setAlertasLactacao(sortAndNormalizeAlertas(data.alertas));
        setAlertasTotal(Array.isArray(data.alertas) ? data.alertas.length : null);
      } else {
        setAlertasLactacao([]);
        setAlertasTotal(0);
      }
    } catch (err) {
      setAlertasError("Não foi possível carregar alertas de produção.");
      setAlertasLactacao([]);
      setAlertasTotal(0);
    } finally {
      setAlertasLoading(false);
    }
  };

  // ordena por data decrescente (se houver) e normaliza campos
  const sortAndNormalizeAlertas = (arr) => {
    const normalized = arr.map((a) => ({
      tipo: a.tipo || a.titulo || a.level || null,
      mensagem: a.mensagem || a.descricao || a.texto || a.message || '',
      data: getAlertDate(a),
      raw: a,
    }));
    normalized.sort((x, y) => {
      if (x.data && y.data) return new Date(y.data) - new Date(x.data);
      if (x.data) return -1;
      if (y.data) return 1;
      return 0;
    });
    return normalized;
  };

  const getAlertDate = (a) => {
    if (!a) return null;
    const candidates = ['created_at','createdAt','dt_registro','data','dt','timestamp','data_alerta'];
    for (const k of candidates) {
      if (a[k]) return a[k];
    }
    // try nested
    if (a.raw && a.raw.data) return a.raw.data;
    return null;
  };

  // Dispara verificação/geração de alertas apenas para produção e recarrega a lista
  const verificarAlertasProducao = async () => {
    if (!propriedadeId) return;
    setAlertasLoading(true);
    setAlertasError(null);
    try {
      await alertaService.verificarAlertasPorPropriedade(propriedadeId, "PRODUCAO");
      await fetchAlertasProducao();
    } catch (err) {
      setAlertasError("Erro ao verificar alertas de produção.");
    } finally {
      setAlertasLoading(false);
    }
  };

  useEffect(() => {
    if (propriedadeId) {
      setLoading(true);
      dashboardService.getDashboardStatsByPropriedadeId(propriedadeId)
        .then((data) => {
          setBufalasLactando(data.qtd_bufalas_lactando);
          setLoading(false);
        })
        .catch(() => {
          setError("Erro ao carregar búfalas lactando.");
          setLoading(false);
        });
      // Buscar alertas de produção ao carregar a página (primeira página)
      setAlertasPage(1);
      fetchAlertasProducao(1, alertasLimit);
    }
  }, [propriedadeId]);

  // Recarrega quando página ou limite mudarem
  useEffect(() => {
    if (!propriedadeId) return;
    fetchAlertasProducao(alertasPage, alertasLimit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alertasPage, alertasLimit]);

  // Corrigir erro: definir totalBufalasLactando a partir do estado
  const totalBufalasLactando = bufalasLactando ?? 0;

  // ==== MOCKS: indicadores header ====
  // Exemplo de uso do idPropriedade
  // const idPropriedade = propriedadeId || "ID_EXEMPLO";
  const litrosMesAtual = 4200;
  const litrosMesAnterior = 4000;
  const variacaoMes = ((litrosMesAtual - litrosMesAnterior) / litrosMesAnterior) * 100;
  const variacaoMesLabel = variacaoMes >= 0 ? `+${variacaoMes.toFixed(1)}%` : `${variacaoMes.toFixed(1)}%`;
  const variacaoMesColor = variacaoMes >= 0 ? "text-emerald-700" : "text-red-700";

  // ==== MOCK: gráfico mês a mês ====
  const graficoProducaoMes = React.useMemo(() => [
    { mes: "Jan", litros: 3200 },
    { mes: "Fev", litros: 3100 },
    { mes: "Mar", litros: 3500 },
    { mes: "Abr", litros: 3700 },
    { mes: "Mai", litros: 3900 },
    { mes: "Jun", litros: 4100 },
    { mes: "Jul", litros: 4300 },
    { mes: "Ago", litros: 4200 },
    { mes: "Set", litros: 4000 },
    { mes: "Out", litros: 4150 },
    { mes: "Nov", litros: 4300 },
    { mes: "Dez", litros: 4400 },
  ], []);

  // Memoized chart component to avoid re-render when parent state (like alertas pagination) changes
  const ProductionChart = React.useMemo(() => React.memo(function ProductionChartInner({ data }) {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip formatter={(v) => [`${v} L`, "Litros"]} />
          <Line type="monotone" dataKey="litros" stroke="#34D399" strokeWidth={3} dot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    );
  }), []);


  // ==== MOCK: ranking bufalas ====
  const lactacoesPageData = [
    {
      id_ciclo_lactacao: "1",
      id_bufala: "A-031",
      nome_bufala: "Hera",
      numero_parto: 1,
      dt_parto: "2024-09-01",
      dt_secagem_real: "2025-07-03",
      dias_em_lactacao: 305,
      media_lactacao: 7.62,
      lactacao_total: 182.9,
      classificacao: "Ótima",
    },
    {
      id_ciclo_lactacao: "2",
      id_bufala: "A-032",
      nome_bufala: "Atena",
      numero_parto: 1,
      dt_parto: "2024-09-05",
      dt_secagem_real: "2025-07-07",
      dias_em_lactacao: 305,
      media_lactacao: 7.54,
      lactacao_total: 180.9,
      classificacao: "Ótima",
    },
    {
      id_ciclo_lactacao: "3",
      id_bufala: "A-033",
      nome_bufala: "Artemis",
      numero_parto: 1,
      dt_parto: "2024-09-30",
      dt_secagem_real: "2025-08-01",
      dias_em_lactacao: 305,
      media_lactacao: 5.52,
      lactacao_total: 132.6,
      classificacao: "Boa",
    },
  ];
  const rankingBufalas = [...lactacoesPageData].sort((a, b) => b.media_lactacao - a.media_lactacao);

  return (
    <>
      <Head>
        <title>Lactação | Buffs</title>
        <meta name="description" content="Dashboard de lactação e produção de leite" />
      </Head>
      <div className="p-6 flex flex-col gap-8">
        {/* Header - Indicadores de Lactação */}
        <div className="w-full flex flex-col bg-white rounded-xl p-6 gap-6 box-border border border-[#e0e0e0] shadow-sm">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Lactação - Indicadores</h1>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0] flex flex-col gap-1">
              <span className="text-sm font-semibold text-[var(--color-text-secondary)]">Búfalas Lactando</span>
              {loading ? (
                <span className="text-gray-500">Carregando...</span>
              ) : error ? (
                <span className="text-red-500">{error}</span>
              ) : (
                <span className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">{totalBufalasLactando}</span>
              )}
            </div>  
            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0] flex flex-col gap-1">
              <span className="text-sm font-semibold text-[var(--color-text-secondary)]">Leite produzido (mês atual)</span>
              <span className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">{litrosMesAtual} L</span>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0] flex flex-col gap-1">
              <span className="text-sm font-semibold text-[var(--color-text-secondary)]">Comparação mês anterior</span>
              <span className={`text-2xl font-bold ${variacaoMesColor}`}>{variacaoMesLabel}</span>
              <span className="text-xs text-gray-500">{litrosMesAnterior} L no mês anterior</span>
            </div>
          </div>
        </div>

        {/* Gráfico produção mês a mês + painel de alertas */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-2 bg-white rounded-xl p-5 box-border border border-[#e0e0e0] shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Produção mês a mês (2025)</h2>
            {/* Memoized chart: won't re-render when alertas pagination changes */}
            <ProductionChart data={graficoProducaoMes} />
          </div>
          <div className="bg-white rounded-xl p-5 box-border border border-[#e0e0e0] shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Alertas de Lactação</h2>
              <div className="flex items-center gap-2">
                <button onClick={verificarAlertasProducao} className="text-sm bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600">Verificar produção</button>
              </div>
            </div>

            {alertasLoading ? (
              <div className="text-gray-500 text-sm">Carregando alertas...</div>
            ) : alertasError ? (
              <div className="text-red-500 text-sm">{alertasError}</div>
            ) : alertasSummary ? (
              // Quando backend retorna apenas o resumo da verificação
              <div className="text-sm text-gray-700">
                <div className="font-semibold">{alertasSummary.message}</div>
                <div className="mt-2">Propriedade: {alertasSummary.propriedade}</div>
                <div>Nichos verificados: {Array.isArray(alertasSummary.nichos_verificados) ? alertasSummary.nichos_verificados.join(', ') : (alertasSummary.nichos_verificados || '')}</div>
                <div>Alertas criados: {alertasSummary.alertas_criados ?? 0}</div>
                {alertasSummary.detalhes && Object.keys(alertasSummary.detalhes).length > 0 && (
                  <pre className="mt-2 text-xs bg-gray-50 p-2 rounded overflow-x-auto">{JSON.stringify(alertasSummary.detalhes, null, 2)}</pre>
                )}
              </div>
            ) : alertasLactacao.length === 0 ? (
              <div className="text-gray-500 text-sm">Nenhum alerta no momento.</div>
            ) : (
              <>
                <ul className="space-y-2">
                  {/** Se backend devolveu paginação real, alertasLactacao já contém apenas a página atual. Caso contrário, usamos slice client-side */}
                  {(Array.isArray(alertasLactacao) ? alertasLactacao : []).map((a, i) => (
                    <li key={i} className="border-l-4 pl-3 py-2 text-sm" style={{ borderColor: a.tipo && String(a.tipo).toLowerCase().includes("baixa") ? "#F87171" : "#34D399" }}>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold">{a.tipo || 'Alerta'}:</span>
                          <span className="ml-2">{a.mensagem}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {a.data ? new Date(a.data).toLocaleString() : ''}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Paginação simples */}
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-sm text-gray-600">Exibindo página {alertasPage}{alertasTotal ? ` de ${Math.max(1, Math.ceil(alertasTotal / alertasLimit))}` : ''}</div>
                  <div className="flex items-center gap-2">
                    <button disabled={alertasPage <= 1} onClick={() => setAlertasPage((p) => Math.max(1, p - 1))} className={`py-1 px-3 rounded ${alertasPage <= 1 ? 'bg-gray-200 text-gray-400' : 'bg-white border'}`}>
                      Anterior
                    </button>
                    <button onClick={() => setAlertasPage((p) => p + 1)} className={`py-1 px-3 rounded bg-white border`}>Próxima</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Tabela ranking das melhores búfalas */}
        <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Ranking de Búfalas em Lactação</h2>
          <p className="text-gray-600">Lista completa de búfalas em lactação com {rankingBufalas.length} animais.</p>
          <div className="overflow-x-auto w-full">
            <table className="w-full border-collapse min-w-[650px] bg-white rounded-lg overflow-hidden shadow-sm">
              <thead className="bg-[#f0f0f0]">
                <tr>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Nome</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Parto</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Data Parto</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Data Secagem</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Dias em Lactação</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Média Lactação</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Total Lactação</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Classificação</th>
                  <th className="p-3 text-center font-medium text-gray-800 text-base">Prontuário</th>
                </tr>
              </thead>
              <tbody>
                {rankingBufalas.map((ciclo, idx) => (
                  <tr key={ciclo.id_ciclo_lactacao} className={idx % 2 === 0 ? "bg-[#fafafa]" : "bg-white"}>
                    <td className="p-3 text-center text-gray-800 text-base font-medium">{ciclo.nome_bufala}</td>
                    <td className="p-3 text-center text-gray-800 text-base">{ciclo.numero_parto}</td>
                    <td className="p-3 text-center text-gray-800 text-base">{ciclo.dt_parto}</td>
                    <td className="p-3 text-center text-gray-800 text-base">{ciclo.dt_secagem_real}</td>
                    <td className="p-3 text-center text-gray-800 text-base">{ciclo.dias_em_lactacao}</td>
                    <td className="p-3 text-center text-gray-800 text-base">{ciclo.media_lactacao} L</td>
                    <td className="p-3 text-center text-gray-800 text-base">{ciclo.lactacao_total} L</td>
                    <td className="p-3 text-center text-gray-800 text-base">{ciclo.classificacao}</td>
                    <td className="p-3 text-center text-base">
                      <Link href={`/lactacao/bufala/${ciclo.id_bufala}/resumo-producao`}>
                        <span className="bg-[#FFCF78] border-none text-gray-800 py-2 px-3.5 rounded-lg cursor-pointer text-sm font-bold hover:bg-[#F2B84D] transition-colors" style={{ display: 'inline-block', textAlign: 'center' }}>
                          Prontuário
                        </span>
                      </Link>
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