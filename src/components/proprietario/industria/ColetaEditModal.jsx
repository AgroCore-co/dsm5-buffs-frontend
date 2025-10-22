import React, { useState, useEffect } from "react";

export default function ColetaEditModal({ isOpen, onClose, coleta, industrias = [], onSave, loading, error }) {
  const [form, setForm] = useState({
    id_industria: coleta?.id_industria || "",
    resultado_teste: coleta?.resultado_teste || false,
    observacao: coleta?.observacao || "",
    quantidade: coleta?.quantidade || "",
    dt_coleta: coleta?.dt_coleta ? new Date(coleta.dt_coleta).toISOString().slice(0, 16) : ""
  });

  useEffect(() => {
    if (isOpen && coleta) {
      setForm({
        id_industria: coleta.id_industria || "",
        resultado_teste: coleta.resultado_teste || false,
        observacao: coleta.observacao || "",
        quantidade: coleta.quantidade || "",
        dt_coleta: coleta.dt_coleta ? new Date(coleta.dt_coleta).toISOString().slice(0, 16) : ""
      });
    }
  }, [isOpen, coleta]);

  if (!isOpen) return null;

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (onSave) onSave(form);
  }

  return (
    <div className="fixed inset-0 z-[1012] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg relative flex flex-col gap-6 border border-[#e0e0e0]">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
          onClick={onClose}
          aria-label="Fechar"
        >
          &times;
        </button>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Editar Coleta</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
            <select
              name="id_industria"
              value={form.id_industria}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            >
              <option value="">Selecione...</option>
              {industrias.map((ind) => (
                <option key={ind.id_industria} value={ind.id_industria}>{ind.nome}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade (L)</label>
            <input name="quantidade" type="number" step="0.01" value={form.quantidade} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data da Coleta</label>
            <input name="dt_coleta" type="datetime-local" value={form.dt_coleta} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Observação</label>
            <textarea name="observacao" value={form.observacao} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" rows={2} />
          </div>
          <div className="flex items-center gap-2">
            <input name="resultado_teste" type="checkbox" checked={form.resultado_teste} onChange={handleChange} id="resultado_teste" />
            <label htmlFor="resultado_teste" className="text-sm font-medium text-gray-700">Aprovado no teste</label>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex gap-3 mt-2 justify-end">
            <button type="button" className="bg-gray-200 text-gray-800 px-4 py-2 rounded font-bold hover:bg-gray-300 transition-colors" onClick={onClose} disabled={loading}>Cancelar</button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded font-bold hover:bg-blue-600 transition-colors" disabled={loading}>{loading ? "Salvando..." : "Salvar"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
