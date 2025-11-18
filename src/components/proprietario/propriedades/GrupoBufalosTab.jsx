import React, { useEffect, useState } from "react";
import bufaloService from "@/services/bufaloService";

export default function GrupoBufalosTab({ grupoInfo }) {
  const [bufalos, setBufalos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    async function fetchBufalos() {
      setLoading(true);
      setError("");
      try {
        if (grupoInfo?.id_grupo) {
          const res = await bufaloService.listarBufalosPorGrupo(grupoInfo.id_grupo, page, limit);
          setBufalos(res.data || []);
          setPagination(res.meta || null);
        } else {
          setBufalos([]);
          setPagination(null);
        }
      } catch (e) {
        setError("Erro ao buscar búfalos do grupo.");
        setBufalos([]);
        setPagination(null);
      } finally {
        setLoading(false);
      }
    }
    fetchBufalos();
  }, [grupoInfo, page, limit]);

  if (loading) {
    return <div className="text-gray-500 p-8">Carregando búfalos...</div>;
  }
  if (error) {
    return <div className="text-red-500 p-8">{error}</div>;
  }
  if (!bufalos.length) {
    return <div className="text-gray-500 p-8">Nenhum búfalo neste grupo.</div>;
  }

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Búfalos do Grupo</h3>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full border-collapse bg-white">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="p-3 text-left font-semibold text-gray-700 text-sm">Nome</th>
              <th className="p-3 text-left font-semibold text-gray-700 text-sm">Brinco</th>
              <th className="p-3 text-left font-semibold text-gray-700 text-sm">Nascimento</th>
              <th className="p-3 text-left font-semibold text-gray-700 text-sm">Raça</th>
              <th className="p-3 text-center font-semibold text-gray-700 text-sm">Sexo</th>
            </tr>
          </thead>
          <tbody>
            {bufalos.map((b, idx) => (
              <tr key={b.id_bufalo} className={`border-b border-gray-100 hover:bg-blue-50/30 transition-colors ${idx % 2 === 0 ? "" : "bg-gray-50/50"}`}>
                <td className="p-3 text-gray-900 text-sm">
                  <div className="flex items-center gap-2">
                    {/* Ícone pode ser adicionado aqui se quiser igual ao de ordenhas */}
                    <span className="font-medium">{b.nome}</span>
                  </div>
                </td>
                <td className="p-3 text-gray-700 text-sm">{b.brinco}</td>
                <td className="p-3 text-gray-700 text-sm">{b.dt_nascimento ? new Date(b.dt_nascimento).toLocaleDateString("pt-BR") : "-"}</td>
                <td className="p-3 text-gray-700 text-sm">{b.raca?.nome || "-"}</td>
                <td className="p-3 text-center text-sm">
                  {b.sexo === 'M' ? (
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">Macho</span>
                  ) : (
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-pink-100 text-pink-800 border border-pink-200">Fêmea</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Paginação */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 py-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={pagination.page <= 1}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${pagination.page <= 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#FFCF78] hover:bg-[#F2B84D] text-gray-800"}`}
          >
            Anterior
          </button>
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-10 h-10 rounded-lg font-medium transition-colors ${pagination.page === p ? "bg-[#CE7D0A] text-white" : "bg-gray-200 hover:bg-[#FFCF78] text-gray-800"}`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            disabled={pagination.page >= pagination.totalPages}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${pagination.page >= pagination.totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#FFCF78] hover:bg-[#F2B84D] text-gray-800"}`}
          >
            Próximo
          </button>
        </div>
      )}
    </div>
  );
}
