"use client";

import { useState, useEffect, useCallback } from "react";

export default function VisualizarMedicacaoModal({ open, onClose, initialData }) {
  const [formData, setFormData] = useState({
    tipo_tratamento: "",
    medicacao: "",
    descricao: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        tipo_tratamento: initialData.tipo_tratamento || "",
        medicacao: initialData.medicacao || "",
        descricao: initialData.descricao || "",
      });
    }
  }, [initialData]);

  const stop = useCallback((e) => e.stopPropagation(), []);
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-[min(95vw,600px)] max-h-[92vh] bg-white rounded-3xl shadow-2xl ring-1 ring-gray-200 flex flex-col overflow-hidden"
        onClick={stop}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 border-b bg-white rounded-t-3xl">
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-2xl font-bold text-amber-700 tracking-tight">
              Visualizar Medicação
            </h2>
            <button
              onClick={onClose}
              className="h-10 w-10 grid place-items-center rounded-xl border border-gray-200 hover:bg-gray-50 text-xl font-bold text-gray-600"
              aria-label="Fechar modal"
            >
              ×
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-5 text-lg">
            <div><span className="font-semibold text-gray-700">Tipo de Tratamento:</span> <span className="text-gray-900">{formData.tipo_tratamento}</span></div>
            <div><span className="font-semibold text-gray-700">Medicação:</span> <span className="text-gray-900">{formData.medicacao}</span></div>
            <div><span className="font-semibold text-gray-700">Descrição:</span> <span className="text-gray-900">{formData.descricao}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
