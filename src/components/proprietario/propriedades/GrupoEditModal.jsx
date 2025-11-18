"use client";

import React, { useState, useEffect } from 'react';
import grupoService from '@/services/grupoService';

export default function GrupoEditModal({ isOpen, onClose, grupoId, initialData = {}, onUpdated }) {
  const [form, setForm] = useState({ nome_grupo: '', color: '#ffffff' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setError('');
    }
    if (isOpen && initialData) {
      setForm({
        nome_grupo: initialData.nome_grupo || '',
        color: initialData.color || '#ffffff'
      });
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!grupoId) {
      setError('ID do grupo ausente');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = { ...form };
      const updated = await grupoService.atualizarGrupo(grupoId, payload);
      if (onUpdated) onUpdated(updated);
      onClose();
    } catch (err) {
      setError(err?.message || 'Erro ao atualizar grupo');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[1005] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative flex flex-col gap-4 border border-[#e0e0e0]">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
          onClick={onClose}
          aria-label="Fechar"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Editar Grupo</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Grupo *</label>
            <input
              type="text"
              required
              value={form.nome_grupo}
              onChange={e => setForm(f => ({ ...f, nome_grupo: e.target.value }))}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Ex: Recria, Lactação"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cor</label>
            <input
              type="color"
              value={form.color}
              onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
              className="w-16 h-10 p-0 border border-gray-300 rounded"
              title="Escolha a cor do grupo"
            />
          </div>

          {/* Campo de nível de maturidade removido */}

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded font-bold hover:bg-gray-300 transition-colors"
              onClick={onClose}
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded font-bold hover:bg-blue-600 transition-colors"
              disabled={saving}
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
