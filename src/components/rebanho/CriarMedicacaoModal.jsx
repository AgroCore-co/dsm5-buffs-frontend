"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function CriarMedicacaoModal({ open, onClose, onSubmit, initialData }) {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (erro) setErro(null);
    if (sucesso) setSucesso(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErro(null);
    setSucesso(false);
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Token não disponível");
      await onSubmit(formData, token);
      setSucesso(true);
      setFormData({ tipo_tratamento: "", medicacao: "", descricao: "" });
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      console.error("❌ Erro ao salvar medicação:", err);
      setErro(err.message || "Erro ao salvar medicação.");
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
              Cadastrar Medicação
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
          {/* Mensagens */}
          {erro && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
              <p className="font-semibold">Erro</p>
              <p>{erro}</p>
            </div>
          )}
          {sucesso && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-700">
              <p className="font-semibold">Sucesso</p>
              <p>Medicação cadastrada com sucesso!</p>
            </div>
          )}

          {/* Formulário de cadastro */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Tipo de Tratamento*
              </label>
              <select
                name="tipo_tratamento"
                value={formData.tipo_tratamento}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="">Selecione...</option>
                <optgroup label="Controle Parasitário">
                  <option value="Vermifugação">Vermifugação</option>
                  <option value="Carrapaticida">Carrapaticida</option>
                  <option value="Bernicida">Bernicida</option>
                </optgroup>
                <optgroup label="Tratamentos Medicamentosos">
                  <option value="Antibiótico">Antibiótico</option>
                  <option value="Anti-inflamatório">Anti-inflamatório</option>
                  <option value="Antitérmico">Antitérmico</option>
                  <option value="Antidiarreico">Antidiarreico</option>
                  <option value="Antitóxico">Antitóxico</option>
                </optgroup>
                <optgroup label="Prevenção">
                  <option value="Vacina">Vacina</option>
                  <option value="Profilaxia">Profilaxia</option>
                </optgroup>
                <optgroup label="Suplementação">
                  <option value="Suplemento Mineral">Suplemento Mineral</option>
                  <option value="Suplemento Vitamínico">Suplemento Vitamínico</option>
                  <option value="Suplemento Energético">Suplemento Energético</option>
                  <option value="Probiótico">Probiótico</option>
                </optgroup>
                <optgroup label="Outros">
                  <option value="Hormonal">Hormonal</option>
                  <option value="Tópico">Tópico</option>
                  <option value="Outro">Outro</option>
                </optgroup>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Nome da Medicação*
              </label>
              <input
                type="text"
                name="medicacao"
                value={formData.medicacao}
                onChange={handleChange}
                required
                placeholder="Ex: Ivermectina"
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Descrição
              </label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                rows={3}
                placeholder="Detalhes adicionais..."
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg bg-amber-500 text-white font-medium hover:bg-amber-600 disabled:opacity-50"
              >
                {isSubmitting ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
