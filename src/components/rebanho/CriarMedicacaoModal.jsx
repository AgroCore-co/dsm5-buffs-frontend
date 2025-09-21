"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import medicacaoService from "@/services/medicacaoService";

export default function CriarMedicacaoModal({ open, onClose, onMedicacaoCriada, initialData }) {
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
    let val = value;
    if (name === "medicacao" || name === "tipo_tratamento") {
      val = String(val).slice(0, 30);
    }
    setFormData((prev) => ({ ...prev, [name]: val }));
    if (erro) setErro(null);
    if (sucesso) setSucesso(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErro(null);
    setSucesso(false);
    // Validação local
    const tipo_tratamento = formData.tipo_tratamento?.trim() || "";
    const medicacao = formData.medicacao?.trim() || "";
    if (!tipo_tratamento) {
      setErro("O campo Tipo de Tratamento é obrigatório.");
      setIsSubmitting(false);
      return;
    }
    if (tipo_tratamento.length > 30) {
      setErro("Tipo de Tratamento deve ter no máximo 30 caracteres.");
      setIsSubmitting(false);
      return;
    }
    if (!medicacao) {
      setErro("O campo Nome da Medicação é obrigatório.");
      setIsSubmitting(false);
      return;
    }
    if (medicacao.length > 30) {
      setErro("Nome da Medicação deve ter no máximo 30 caracteres.");
      setIsSubmitting(false);
      return;
    }
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Token não disponível");
      // Sanitiza os valores para garantir que sejam string e <= 30 caracteres
      const payload = {
        tipo_tratamento: String(tipo_tratamento).slice(0, 30),
        medicacao: String(medicacao).slice(0, 30),
        descricao: formData.descricao || ""
      };
      const response = await medicacaoService.criarMedicacao(token, payload);
      setSucesso(true);
      setFormData({ tipo_tratamento: "", medicacao: "", descricao: "" });
      if (onMedicacaoCriada) onMedicacaoCriada(response);
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
            </div>

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
                className={`border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 ${!formData.tipo_tratamento ? "border-red-300 bg-red-50" : "border-gray-300"}`}
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
              <div className="text-xs text-gray-500 mt-1">{formData.tipo_tratamento.length}/30 caracteres</div>
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
                maxLength={30}
                placeholder="Ex: Ivermectina"
                className={`border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 ${!formData.medicacao ? "border-red-300 bg-red-50" : "border-gray-300"}`}
              />
              <div className="text-xs text-gray-500 mt-1">{formData.medicacao.length}/30 caracteres</div>
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
                disabled={isSubmitting || !formData.tipo_tratamento || !formData.medicacao}
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
