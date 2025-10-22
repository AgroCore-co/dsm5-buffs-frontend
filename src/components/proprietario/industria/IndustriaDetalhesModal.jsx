import React from "react";

export default function IndustriaDetalhesModal({ isOpen, onClose, industria, loading, error }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[1011] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-3xl relative flex flex-col gap-6 border border-[#e0e0e0]">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
          onClick={onClose}
          aria-label="Fechar"
        >
          &times;
        </button>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Detalhes da Indústria</h2>
        {loading ? (
          <div className="flex items-center justify-center p-6">Carregando detalhes...</div>
        ) : error ? (
          <div className="text-red-600 text-sm text-center">{error}</div>
        ) : industria ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Dados Básicos */}
            <div className="relative rounded-xl border border-gray-200 bg-white lg:col-span-2">
              <div className="absolute left-0 top-0 h-full w-1.5 bg-amber-400 rounded-l-xl" />
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados Básicos</h3>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <p><span className="font-semibold text-gray-700">ID:</span> {industria.id_industria}</p>
                  <p><span className="font-semibold text-gray-700">Nome:</span> {industria.nome || "-"}</p>
                  <p><span className="font-semibold text-gray-700">Representante:</span> {industria.representante || "-"}</p>
                  <p><span className="font-semibold text-gray-700">Contato:</span> {industria.contato || "-"}</p>
                  <p><span className="font-semibold text-gray-700">Observação:</span> {industria.observacao || "-"}</p>
                  <p><span className="font-semibold text-gray-700">Criado em:</span> {industria.created_at ? new Date(industria.created_at).toLocaleString() : "-"}</p>
                  <p><span className="font-semibold text-gray-700">Atualizado em:</span> {industria.updated_at ? new Date(industria.updated_at).toLocaleString() : "-"}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-500 text-center">Nenhum dado encontrado.</div>
        )}
        <div className="flex gap-3 mt-4 justify-end">
          <button
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded font-bold hover:bg-gray-300 transition-colors"
            onClick={onClose}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
