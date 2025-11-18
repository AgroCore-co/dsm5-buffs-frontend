import React, { useEffect, useState } from "react";
import { usePropriedade } from "@/contexts/propriedadeContext";
import coberturaService from "@/services/coberturaService";

export default function ReproducaoTable() {
  const { propriedadeId } = usePropriedade();
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    if (!propriedadeId) return;
    setLoading(true);
    coberturaService
      .listarCoberturasPorPropriedade(propriedadeId, page, limit)
      .then((res) => {
        setRegistros(Array.isArray(res.data) ? res.data : []);
        setMeta(res.meta || null);
      })
      .catch(() => {
        setRegistros([]);
        setMeta(null);
      })
      .finally(() => setLoading(false));
  }, [propriedadeId, page, limit]);

  return (
    <div className="w-full flex flex-col bg-white rounded-xl p-6 gap-6 box-border border border-[#e0e0e0] shadow-sm">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Registros de Reprodução</h2>
        <p className="text-gray-600">Visualização dos registros de coberturas e inseminações.</p>
      </div>
      <div className="w-full">
        <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
          <thead className="bg-[#f0f0f0]">
            <tr>
                <th className="px-4 py-2">Data do Evento</th>
                <th className="px-4 py-2">Matriz</th>
                <th className="px-4 py-2">Touro</th>
                <th className="px-4 py-2">Tipo de Inseminação</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Tipo de Parto</th>
                <th className="px-4 py-2">Ocorrência</th>
                <th className="px-4 py-2">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500">Carregando registros...</td>
              </tr>
            ) : registros.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500">Nenhum registro encontrado</td>
              </tr>
            ) : (
              registros.map((r) => (
                <tr key={r.id_reproducao} className="odd:bg-white even:bg-[#fafafa]">
                  <td className="p-3 text-center text-gray-800 text-base font-medium">{r.dt_evento ? new Date(r.dt_evento).toLocaleDateString() : '-'}</td>
                  <td className="p-3 text-center text-gray-800 text-base">{r.id_bufala || '-'}</td>
                  <td className="p-3 text-center text-gray-800 text-base">{r.id_bufalo || '-'}</td>
                  <td className="p-3 text-center text-gray-800 text-base">{r.tipo_inseminacao || '-'}</td>
                  <td className="p-3 text-center text-gray-800 text-base">
                    <span
                      className={`px-2.5 py-1.5 rounded-full text-sm font-bold inline-block w-28
                        ${r.status === 'Confirmada' ? 'bg-[#9DFFBE] text-gray-800'
                        : r.status === 'Abortada' ? 'bg-red-200 text-red-800'
                        : r.status === 'Falha' ? 'bg-red-500 text-white'
                        : 'bg-yellow-100 text-yellow-800'}`}
                    >
                      {r.status || '-'}
                    </span>
                  </td>
                    <td className="px-4 py-2 whitespace-nowrap">{r.tipo_parto || '-'}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{r.ocorrencia || '-'}</td>
                    <td className="p-3 text-center">
                      <button className="bg-[#FFCF78] hover:bg-[#F2B84D] text-black px-3 py-1 rounded-lg text-sm font-medium">Detalhes</button>
                    </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {meta && meta.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={meta.page <= 1}
            className={`px-4 py-2 rounded-lg font-medium ${meta.page <= 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#FFCF78] hover:bg-[#F2B84D] text-gray-800"}`}
          >
            Anterior
          </button>
          {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-10 h-10 rounded-lg font-medium ${meta.page === p ? "bg-[#CE7D0A] text-white" : "bg-gray-200 hover:bg-[#FFCF78] text-gray-800"}`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
            disabled={meta.page >= meta.totalPages}
            className={`px-4 py-2 rounded-lg font-medium ${meta.page >= meta.totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#FFCF78] hover:bg-[#F2B84D] text-gray-800"}`}
          >
            Próximo
          </button>
        </div>
      )}
    </div>
  );
}
