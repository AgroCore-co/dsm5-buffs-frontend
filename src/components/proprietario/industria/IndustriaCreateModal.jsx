import React, { useState, useEffect } from "react";

export default function IndustriaCreateModal({ isOpen, onClose, propriedadeId, onSave, loading, error }) {
  const [form, setForm] = useState({
    nome: "",
    representante: "",
    contato: "",
    observacao: ""
  });

  useEffect(() => {
    if (isOpen) {
      setForm({
        nome: "",
        representante: "",
        contato: "",
        observacao: ""
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (onSave) onSave({ ...form, id_propriedade: propriedadeId });
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
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Cadastrar Indústria</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input name="nome" type="text" value={form.nome} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Representante</label>
            <input name="representante" type="text" value={form.representante} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contato</label>
            <input name="contato" type="text" value={form.contato} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Observação</label>
            <textarea name="observacao" value={form.observacao} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" rows={2} />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex gap-3 mt-2 justify-end">
            <button type="button" className="bg-gray-200 text-gray-800 px-4 py-2 rounded font-bold hover:bg-gray-300 transition-colors" onClick={onClose} disabled={loading}>Cancelar</button>
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700 transition-colors" disabled={loading}>{loading ? "Salvando..." : "Salvar"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
