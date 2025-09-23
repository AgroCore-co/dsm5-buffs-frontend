import React from "react";

export default function ConfirmarDesvinculoModal({ open, onClose, onConfirm, funcionario, propriedade }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold"
          onClick={onClose}
          aria-label="Fechar"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-gray-800">Desvincular Funcionário</h2>
        <p className="mb-2 text-gray-700">
          Tem certeza que deseja <span className="font-bold text-red-600">desvincular</span> o funcionário <span className="font-semibold">{funcionario?.nome}</span> da propriedade <span className="font-semibold">{propriedade?.nome || propriedade?.nome_fazenda || "(sem nome)"}</span>?
        </p>
        {propriedade && (
          <div className="mb-4 text-gray-600 text-sm bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div><span className="font-semibold">Propriedade:</span> {propriedade.nome || propriedade.nome_fazenda || "(sem nome)"}</div>
            {propriedade.cidade && <div><span className="font-semibold">Cidade:</span> {propriedade.cidade}</div>}
            {propriedade.estado && <div><span className="font-semibold">Estado:</span> {propriedade.estado}</div>}
            {propriedade.id_propriedade && <div><span className="font-semibold">ID:</span> {propriedade.id_propriedade}</div>}
          </div>
        )}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-500 text-white font-bold hover:bg-red-600"
          >
            Desvincular
          </button>
        </div>
      </div>
    </div>
  );
}
