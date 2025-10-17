import React from 'react';

export default function DeleteLoteModal({ isOpen, onClose, onConfirm, loading, error }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[1009] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative flex flex-col gap-4 border border-[#e0e0e0]">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
          onClick={onClose}
          aria-label="Fechar"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Excluir Lote</h2>
        <p className="text-gray-700">Tem certeza que deseja excluir este lote? Esta ação não pode ser desfeita.</p>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="flex gap-3 mt-2">
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
