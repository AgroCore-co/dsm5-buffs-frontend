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

export default function Lactacao() {
  // obter id da propriedade via context
  const { propriedadeId } = usePropriedade();

  // Estado para búfalas lactando
  const [bufalasLactando, setBufalasLactando] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    }
  }, [propriedadeId]);

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
  const graficoProducaoMes = [
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
  ];

  // ==== MOCK: painel de alertas ====
  const alertasLactacao = [
    { tipo: "Baixa produção", mensagem: "Búfala Hera está 20% abaixo da média do grupo." },
    { tipo: "Alta produção", mensagem: "Búfala Atena está 15% acima da média do grupo." },
  ];

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
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={graficoProducaoMes} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip formatter={(v) => [`${v} L`, "Litros"]} />
                <Line type="monotone" dataKey="litros" stroke="#34D399" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl p-5 box-border border border-[#e0e0e0] shadow-sm flex flex-col gap-3">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Alertas de Lactação</h2>
            {alertasLactacao.length === 0 ? (
              <div className="text-gray-500 text-sm">Nenhum alerta no momento.</div>
            ) : (
              <ul className="space-y-2">
                {alertasLactacao.map((a, i) => (
                  <li key={i} className="border-l-4 pl-3 py-2 text-sm" style={{ borderColor: a.tipo === "Baixa produção" ? "#F87171" : "#34D399" }}>
                    <span className="font-semibold">{a.tipo}:</span> {a.mensagem}
                  </li>
                ))}
              </ul>
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