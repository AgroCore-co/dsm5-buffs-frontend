import React, { useState } from "react";

const PAGE_SIZE = 8;

export default function TodosPiquetesModal({ open, onClose, lotes }) {
  const [page, setPage] = useState(1);
  if (!open) return null;

  const totalPages = Math.ceil(lotes.length / PAGE_SIZE);
  const paginatedLotes = lotes.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="fixed inset-0 z-[1003] flex items-center justify-center bg-black/45">
      <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full p-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold"
          onClick={onClose}
          aria-label="Fechar"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Todos os Piquetes</h2>
        <div className="overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {paginatedLotes.map((lote) => (
              <div key={lote.id_lote} className="bg-gray-50 rounded-lg p-4 border border-gray-200 shadow hover:bg-gray-100 transition-colors flex flex-col gap-2">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-base font-semibold text-gray-800 truncate">{lote.nome_lote}</h3>
                  <span className={`w-2 h-2 rounded-full ${lote.status === "Em uso" ? "bg-green-500" : lote.status === "Disponível" ? "bg-yellow-500" : "bg-red-500"}`}></span>
                </div>
                <div className="text-xs text-gray-600 mb-2">{lote.descricao || "-"}</div>
                <div className="flex flex-col gap-1 text-xs">
                  <div><span className="font-bold text-[#CE7D0A]">Capacidade:</span> {lote.qtd_max || "-"}</div>
                  <div><span className="font-bold text-[#FFCF78]">Área:</span> {lote.area_m2 || "-"} m²</div>
                  <div><span className="font-bold">Status:</span> {lote.status || "-"}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Paginação */}
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            className="px-3 py-1 rounded bg-gray-200 text-gray-700 font-bold disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Anterior
          </button>
          <span className="text-sm text-gray-700">
            Página {page} de {totalPages}
          </span>
          <button
            className="px-3 py-1 rounded bg-gray-200 text-gray-700 font-bold disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
}
