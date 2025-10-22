import React from "react";

export default function ColetaDetalhesModal({ isOpen, onClose, coleta, loading, error }) {
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
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Prontuário da Coleta</h2>
        {loading ? (
          <div className="flex items-center justify-center p-6">Carregando detalhes...</div>
        ) : error ? (
          <div className="text-red-600 text-sm text-center">{error}</div>
        ) : coleta ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Dados Básicos */}
            <div className="relative rounded-xl border border-gray-200 bg-white">
              <div className="absolute left-0 top-0 h-full w-1.5 bg-amber-400 rounded-l-xl" />
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados Básicos</h3>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <p><span className="font-semibold text-gray-700">ID:</span> {coleta.id_coleta}</p>
                  <p><span className="font-semibold text-gray-700">Empresa:</span> {coleta.nome_empresa || coleta.id_industria || "-"}</p>
                  <p><span className="font-semibold text-gray-700">Quantidade:</span> {coleta.quantidade != null ? `${coleta.quantidade.toLocaleString(undefined, { maximumFractionDigits: 2 })} L` : "-"}</p>
                  <p><span className="font-semibold text-gray-700">Data da Coleta:</span> {coleta.dt_coleta ? new Date(coleta.dt_coleta).toLocaleString() : "-"}</p>
                  <p><span className="font-semibold text-gray-700">Observação:</span> {coleta.observacao || "-"}</p>
                </div>
              </div>
            </div>
            {/* Informações do Sistema */}
            <div className="relative rounded-xl border border-gray-200 bg-white">
              <div className="absolute left-0 top-0 h-full w-1.5 bg-blue-400 rounded-l-xl" />
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações do Sistema</h3>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <p><span className="font-semibold text-gray-700">ID Propriedade:</span> {coleta.id_propriedade || "-"}</p>
                  <p><span className="font-semibold text-gray-700">ID Funcionário:</span> {coleta.id_funcionario || "-"}</p>
                  <p><span className="font-semibold text-gray-700">Criado em:</span> {coleta.created_at ? new Date(coleta.created_at).toLocaleString() : "-"}</p>
                  <p><span className="font-semibold text-gray-700">Atualizado em:</span> {coleta.updated_at ? new Date(coleta.updated_at).toLocaleString() : "-"}</p>
                </div>
              </div>
            </div>
            {/* Status do Teste */}
            <div className="relative rounded-xl border border-gray-200 bg-white lg:col-span-2">
              <div className="absolute left-0 top-0 h-full w-1.5 bg-emerald-400 rounded-l-xl" />
              <div className="p-5 flex items-center gap-6">
                <div className="flex items-center gap-4">
                  {coleta.resultado_teste ? (
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#9DFFBE] text-green-700 text-3xl shadow">
                        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' className='w-8 h-8'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' /></svg>
                      </span>
                      <div>
                        <h3 className="text-xl font-bold text-green-700">Aprovado</h3>
                        <p className="text-sm text-gray-600">Leite aprovado no teste de qualidade.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#FF9D9D] text-red-700 text-3xl shadow">
                        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' className='w-8 h-8'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' /></svg>
                      </span>
                      <div>
                        <h3 className="text-xl font-bold text-red-700">Reprovado</h3>
                        <p className="text-sm text-gray-600">Leite reprovado no teste de qualidade.</p>
                      </div>
                    </div>
                  )}
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
