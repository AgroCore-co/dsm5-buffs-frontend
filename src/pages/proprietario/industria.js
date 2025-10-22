import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { usePropriedade } from "@/contexts/propriedadeContext";
import estoqueLeiteService from "@/services/estoqueLeiteService";
import coletaService from "@/services/coletaService";

export default function Industria() {
  const router = useRouter();
  const { propriedadeId } = usePropriedade();
  const [totalProduzido, setTotalProduzido] = useState(null);
  const [totalRetiradoMes, setTotalRetiradoMes] = useState(null);
  const [volumeRejeitadoMes, setVolumeRejeitadoMes] = useState(null);
  const [totalColetas, setTotalColetas] = useState(null);
  const [coletas, setColetas] = useState([]);
  const [metaColetas, setMetaColetas] = useState(null);
  const [loadingColetas, setLoadingColetas] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Busca totais e coletas paginadas
  useEffect(() => {
    async function fetchAll() {
      if (!propriedadeId) {
        setColetas([]);
        setMetaColetas(null);
        setTotalProduzido(null);
        setTotalColetas(null);
        setTotalRetiradoMes(null);
        return;
      }
      // Total produzido do mês atual
      try {
        const now = new Date();
        const ano = now.getFullYear();
        const mes = now.getMonth() + 1;
        let pageProd = 1;
        let totalProd = 0;
        let hasNext = true;
        const limitProd = 100;
        while (hasNext) {
          const res =
            await estoqueLeiteService.listarEstoqueLeitePorPropriedade(
              propriedadeId,
              pageProd,
              limitProd
            );
          if (Array.isArray(res.data)) {
            totalProd += res.data
              .filter((item) => {
                if (!item.data_producao) return false;
                const d = new Date(item.data_producao);
                return d.getFullYear() === ano && d.getMonth() + 1 === mes;
              })
              .reduce((acc, item) => acc + (Number(item.quantidade) || 0), 0);
          }
          hasNext = res.meta?.hasNextPage;
          pageProd++;
        }
        setTotalProduzido(totalProd);
      } catch (err) {
        setTotalProduzido("Erro");
      }
      // Total de coletas (meta)
      try {
        const res = await coletaService.listarColetasPorPropriedade(
          propriedadeId,
          1,
          1
        );
        setTotalColetas(res.meta?.total ?? 0);
      } catch (err) {
        setTotalColetas("Erro");
      }

      // Total retirado do mês atual
      try {
        const now = new Date();
        const ano = now.getFullYear();
        const mes = now.getMonth() + 1;
        let pageRet = 1;
        let totalRet = 0;
        let totalRej = 0;
        let hasNext = true;
        const limitRet = 100;
        while (hasNext) {
          const res =
            await estoqueLeiteService.listarEstoqueLeitePorPropriedade(
              propriedadeId,
              pageRet,
              limitRet
            );
          if (Array.isArray(res.data)) {
            // Retirado
            totalRet += res.data
              .filter((item) => {
                if (!item.data_retirada) return false;
                const d = new Date(item.data_retirada);
                return d.getFullYear() === ano && d.getMonth() + 1 === mes;
              })
              .reduce((acc, item) => acc + (Number(item.quantidade) || 0), 0);
            // Rejeitado
            totalRej += res.data
              .filter((item) => {
                if (!item.data_rejeicao) return false;
                const d = new Date(item.data_rejeicao);
                return d.getFullYear() === ano && d.getMonth() + 1 === mes;
              })
              .reduce((acc, item) => acc + (Number(item.quantidade) || 0), 0);
          }
          hasNext = res.meta?.hasNextPage;
          pageRet++;
        }
        setTotalRetiradoMes(totalRet);
        setVolumeRejeitadoMes(totalRej);
      } catch (err) {
        setTotalRetiradoMes("Erro");
        setVolumeRejeitadoMes("Erro");
      }
    }
    fetchAll();
  }, [propriedadeId]);

  // Busca coletas paginadas
  useEffect(() => {
    if (!propriedadeId) {
      setColetas([]);
      setMetaColetas(null);
      return;
    }
    let ignore = false;
    (async () => {
      setLoadingColetas(true);
      try {
        const res = await coletaService.listarColetasPorPropriedade(
          propriedadeId,
          page,
          limit
        );
        if (!ignore) {
          setColetas(res.data || []);
          setMetaColetas(res.meta || null);
        }
      } catch (err) {
        if (!ignore) {
          setColetas([]);
          setMetaColetas(null);
        }
      } finally {
        if (!ignore) setLoadingColetas(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [propriedadeId, page, limit]);

  return (
    <>
      <Head>
        <title>Indústria | Buffs</title>
        <meta name="description" content="Gestão da equipe de funcionários" />
      </Head>

      <div className="p-6 flex flex-col gap-8">
        {/* Header - Gestão da Indústria*/}
        <div className="w-full flex flex-col bg-white rounded-xl p-6 gap-6 box-border border border-[#e0e0e0] shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Controle de Produção{" "}
            </h1>
            <p className="text-gray-600 text-lg">
              Monitoramento da Produção de Leite de Búfalas.
            </p>
          </div>

          {/* Resumo da Indústria */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">
                  Total Produzido
                </h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">
                  Ativos
                </span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">
                {totalProduzido === null
                  ? "..."
                  : `${totalProduzido.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })} L`}
              </p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                Produção acumulada
              </p>
            </div>

            {/* Indicador de coletas */}
            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">
                  Total de Coletas
                </h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">
                  Registros
                </span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">
                {totalColetas === null ? "..." : totalColetas}
              </p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                Coletas realizadas
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">
                  Total Retirado
                </h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">
                  Mês atual
                </span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">
                {totalRetiradoMes === null
                  ? "..."
                  : `${totalRetiradoMes.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })} L`}
              </p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                Volume comercializado no mês
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">
                  Volume Rejeitado
                </h2>
                <span className="text-xs font-medium text-[var(--color-primary-dark)]">
                  Mês atual
                </span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-[var(--color-text-dark)]">
                {volumeRejeitadoMes === null
                  ? "..."
                  : `${volumeRejeitadoMes.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })} L`}
              </p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                Perdas registradas no mês
              </p>
            </div>
          </div>
        </div>

        {/* Gráfico de Distribuição
        <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Distribuição da Equipe
          </h2>
          <div className="w-full">
            <div className="bg-white p-4 rounded-lg shadow border border-[#e0e0e0]">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Distribuição por Cargos
              </h3>
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
        </div> */}

        {/* Tabela de Coletas */}
        <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Registro de Coletas
            </h2>
            <p className="text-gray-600">
              Monitoramento da Produção de leite de Búfalas -{" "}
              {totalColetas === null
                ? "..."
                : `${totalColetas} coletas registradas`}
            </p>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm text-center align-middle">
              <thead className="bg-[#f0f0f0]">
                <tr>
                  <th
                    className="p-3 font-medium text-gray-800 text-base whitespace-nowrap"
                    style={{
                      minWidth: "110px",
                      maxWidth: "140px",
                      width: "1%",
                    }}
                  >
                    Data da Coleta
                  </th>
                  <th className="p-3 font-medium text-gray-800 text-base whitespace-nowrap">
                    Empresa
                  </th>
                  <th className="p-3 font-medium text-gray-800 text-base whitespace-nowrap">
                    Quantidade
                  </th>
                  <th className="p-3 font-medium text-gray-800 text-base whitespace-nowrap">
                    Observação
                  </th>
                  <th className="p-3 font-medium text-gray-800 text-base whitespace-nowrap">
                    Status
                  </th>
                  <th className="p-3 font-medium text-gray-800 text-base whitespace-nowrap">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loadingColetas ? (
                  <tr>
                    <td colSpan="6" className="text-center p-6 text-gray-500">
                      Carregando coletas...
                    </td>
                  </tr>
                ) : coletas.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center p-6 text-gray-500">
                      Nenhuma coleta encontrada
                    </td>
                  </tr>
                ) : (
                  coletas.map((c) => (
                    <tr
                      key={c.id_coleta}
                      className="odd:bg-white even:bg-[#fafafa]"
                    >
                      <td
                        className="p-3 text-gray-800 text-base font-medium whitespace-nowrap"
                        style={{
                          minWidth: "110px",
                          maxWidth: "140px",
                          width: "1%",
                        }}
                      >
                        {c.dt_coleta
                          ? new Date(c.dt_coleta).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="p-3 text-gray-800 text-base whitespace-nowrap">
                        {c.id_industria?.slice(0, 8) || "-"}
                      </td>
                      <td className="p-3 text-gray-800 text-base whitespace-nowrap">
                        {c.quantidade != null
                          ? `${c.quantidade.toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })} L`
                          : "-"}
                      </td>
                      <td className="p-3 text-gray-800 text-base">
                        {c.observacao || "-"}
                      </td>
                      <td className="p-3 text-gray-800 text-base whitespace-nowrap">
                        {c.resultado_teste ? (
                          <span className="px-2.5 py-1.5 rounded-full text-sm font-bold inline-block w-25 bg-[#9DFFBE] text-gray-800">
                            Aprovado
                          </span>
                        ) : (
                          <span className="px-2.5 py-1.5 rounded-full text-sm font-bold inline-block w-25 bg-[#FF9D9D] text-gray-800">
                            Reprovado
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-gray-800 text-base whitespace-nowrap">
                        <button className="bg-[#FFCF78] border-none text-gray-800 py-2 px-3.5 rounded-lg cursor-pointer text-sm font-bold hover:bg-[#F2B84D] transition-colors">
                          Ver detalhes
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {/* Paginação dinâmica das coletas (janela de páginas, como rebanho.js, mas com elipses) */}
              {metaColetas && metaColetas.totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-4">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={metaColetas.page <= 1}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      metaColetas.page <= 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-[#FFCF78] hover:bg-[#F2B84D] text-gray-800"
                    }`}
                  >
                    Anterior
                  </button>

                  {/* Paginação dinâmica: mostra uma janela de páginas ao redor da atual, com elipses e sempre o primeiro/último */}
                  {(() => {
                    const total = metaColetas.totalPages;
                    const current = metaColetas.page;
                    const windowSize = 2; // páginas vizinhas de cada lado
                    let pages = [];
                    if (total <= 7) {
                      // Poucas páginas: mostra todas
                      pages = Array.from({ length: total }, (_, i) => i + 1);
                    } else {
                      // Muitas páginas: mostra 1 ... [window] ... total
                      pages.push(1);
                      let start = Math.max(2, current - windowSize);
                      let end = Math.min(total - 1, current + windowSize);
                      if (start > 2) pages.push("...");
                      for (let i = start; i <= end; i++) pages.push(i);
                      if (end < total - 1) pages.push("...");
                      pages.push(total);
                    }
                    return pages.map((p, idx) =>
                      p === "..." ? (
                        <span
                          key={"elip-" + idx}
                          className="w-10 h-10 flex items-center justify-center text-gray-400"
                        >
                          ...
                        </span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-10 h-10 rounded-lg font-medium ${
                            metaColetas.page === p
                              ? "bg-[#CE7D0A] text-white"
                              : "bg-gray-200 hover:bg-[#FFCF78] text-gray-800"
                          }`}
                        >
                          {p}
                        </button>
                      )
                    );
                  })()}

                  <button
                    onClick={() =>
                      setPage((p) => Math.min(metaColetas.totalPages, p + 1))
                    }
                    disabled={metaColetas.page >= metaColetas.totalPages}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      metaColetas.page >= metaColetas.totalPages
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-[#FFCF78] hover:bg-[#F2B84D] text-gray-800"
                    }`}
                  >
                    Próximo
                  </button>
                </div>
              )}
            </table>
          </div>
        </div>

        {/* Seção de Indústrias */}
        <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Industrias
            </h2>
            <p className="text-gray-600">
              Industrias parceiras cadastradas no sistema.
            </p>
          </div>
          <div className="overflow-x-auto w-full">
            <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm text-center align-middle">
              <thead className="bg-[#f0f0f0]">
                <tr>
                  <th className="p-3 font-medium text-gray-800 text-base whitespace-nowrap">Nome</th>
                  <th className="p-3 font-medium text-gray-800 text-base whitespace-nowrap">Representante</th>
                  <th className="p-3 font-medium text-gray-800 text-base whitespace-nowrap">Contato</th>
                  <th className="p-3 font-medium text-gray-800 text-base whitespace-nowrap">Observação</th>
                  <th className="p-3 font-medium text-gray-800 text-base whitespace-nowrap">Criado em</th>
                  <th className="p-3 font-medium text-gray-800 text-base whitespace-nowrap">Atualizado em</th>
                  <th className="p-3 font-medium text-gray-800 text-base whitespace-nowrap">ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="odd:bg-white even:bg-[#fafafa]">
                  <td className="p-3 text-gray-800 text-base font-medium whitespace-nowrap">Buffs Laticinio</td>
                  <td className="p-3 text-gray-800 text-base whitespace-nowrap">Gilberto</td>
                  <td className="p-3 text-gray-800 text-base whitespace-nowrap">(11) 99744-8877</td>
                  <td className="p-3 text-gray-800 text-base whitespace-nowrap">Principal cliente</td>
                  <td className="p-3 text-gray-800 text-base whitespace-nowrap">{new Date("2025-10-13T01:32:15.701988+00:00").toLocaleDateString()}</td>
                  <td className="p-3 text-gray-800 text-base whitespace-nowrap">{new Date("2025-10-13T01:32:15.701988+00:00").toLocaleDateString()}</td>
                  <td className="p-3 text-gray-800 text-base whitespace-nowrap">a8afbcf3-3a9e-4d14-8e88-d0596b185404</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
