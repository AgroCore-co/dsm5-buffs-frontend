import React from "react";

export default function DeleteColetaModal({ isOpen, onClose, onConfirm, loading, error, coleta }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[1013] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative flex flex-col gap-4 border border-[#e0e0e0]">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
          onClick={onClose}
          aria-label="Fechar"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Excluir Coleta</h2>
        <p className="text-gray-700">Tem certeza que deseja excluir a coleta <span className="font-bold">{coleta?.id_coleta}</span>?
          {coleta?.nome_empresa && (
            <> <br/>Empresa: <span className="font-bold">{coleta.nome_empresa}</span></>
          )}
          {coleta?.quantidade != null && (
            <> <br/>Quantidade: <span className="font-bold">{coleta.quantidade} L</span></>
          )}
          <br/>Esta ação não pode ser desfeita.
        </p>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="flex gap-3 mt-2 justify-end">
          <button
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded font-bold hover:bg-gray-300 transition-colors"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded font-bold hover:bg-red-700 transition-colors"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </div>
    </div>
  );
}
