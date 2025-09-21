"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function ApagarMedicacaoModal({ open, onClose, onSubmit, initialData }) {
  const { getAccessToken } = useAuth();
  const [formData, setFormData] = useState({
    tipo_tratamento: "",
    medicacao: "",
    descricao: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        tipo_tratamento: initialData.tipo_tratamento || "",
        medicacao: initialData.medicacao || "",
        descricao: initialData.descricao || "",
      });
      setErro(null);
      setSucesso(false);
    }
  }, [initialData]);

  const stop = useCallback((e) => e.stopPropagation(), []);
  if (!open) return null;

  const handleDelete = async () => {
    setIsSubmitting(true);
    setErro(null);
    setSucesso(false);
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Token não disponível");
      await onSubmit(initialData, token);
      setSucesso(true);
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      setErro(err.message || "Erro ao apagar medicação.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
              Apagar Medicação
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
          {erro && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
              <p className="font-semibold">Erro</p>
              <p>{erro}</p>
            </div>
          )}
          {sucesso && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-700">
              <p className="font-semibold">Sucesso</p>
              <p>Medicação apagada com sucesso!</p>
            </div>
          )}
          <div className="space-y-5">
            <div className="text-lg text-red-700 font-semibold mb-2">Tem certeza que deseja apagar esta medicação?</div>
            <div><span className="font-semibold text-gray-700">Tipo de Tratamento:</span> <span className="text-gray-900">{formData.tipo_tratamento}</span></div>
            <div><span className="font-semibold text-gray-700">Medicação:</span> <span className="text-gray-900">{formData.medicacao}</span></div>
            <div><span className="font-semibold text-gray-700">Descrição:</span> <span className="text-gray-900">{formData.descricao}</span></div>
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 disabled:opacity-50"
              >
                {isSubmitting ? "Apagando..." : "Apagar"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
