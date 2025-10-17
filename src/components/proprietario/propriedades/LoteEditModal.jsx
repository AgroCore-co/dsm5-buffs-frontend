"use client";

import React, { useState, useEffect } from 'react';
import loteService from '@/services/loteService';

export default function LoteEditModal({ isOpen, onClose, loteId, initialData = {}, grupos = [], propriedadeId, onUpdated }) {
  const [form, setForm] = useState({ nome_lote: '', id_grupo: '', tipo_lote: '', status: 'ativo', descricao: '', qtd_max: '', area_m2: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setError('');
    }
    if (isOpen && initialData) {
      // Normalize possible id fields coming from API (id_grupo, id, nested grupo)
      const normalizedGrupoId = (initialData.id_grupo ?? initialData.id ?? initialData.grupo?.id_grupo ?? initialData.grupo?.id ?? '');
      setForm({
        nome_lote: initialData.nome_lote || '',
        id_grupo: normalizedGrupoId + '',
        tipo_lote: initialData.tipo_lote || '',
        status: initialData.status || 'ativo',
        descricao: initialData.descricao || '',
        qtd_max: initialData.qtd_max || '',
        area_m2: initialData.area_m2 || ''
      });
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!loteId) {
      setError('ID do lote ausente');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = {
        nome_lote: form.nome_lote,
        id_propriedade: propriedadeId,
        // If user selected "Sem grupo" the form.id_grupo is an empty string; send explicit null so backend clears the FK
        id_grupo: form.id_grupo === '' ? null : (form.id_grupo || undefined),
        tipo_lote: form.tipo_lote || undefined,
        status: form.status || undefined,
        descricao: form.descricao || undefined,
        qtd_max: form.qtd_max ? Number(form.qtd_max) : undefined,
        area_m2: form.area_m2 ? Number(form.area_m2) : undefined,
      };
      const updated = await loteService.atualizarLote(loteId, payload);
      // Ensure updated has id_lote and attach grupo object locally when server doesn't return nested grupo
      if (updated) {
        if (!updated.id_lote) updated.id_lote = loteId;
        if (!updated.grupo && form.id_grupo) {
          const matched = grupos.find(g => ((g.id_grupo ?? g.id ?? g._id) + '') === (form.id_grupo + ''));
          if (matched) {
            updated.grupo = {
              id_grupo: matched.id_grupo ?? matched.id ?? matched._id,
              nome_grupo: matched.nome_grupo,
              color: matched.color
            };
          }
        }
      }
      if (onUpdated) onUpdated(updated);
      onClose();
    } catch (err) {
      console.error('Erro ao atualizar lote', err);
      setError(err?.message || 'Erro ao atualizar lote');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[1010] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative flex flex-col gap-4 border border-[#e0e0e0]">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
          onClick={onClose}
          aria-label="Fechar"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Editar Lote</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Lote *</label>
            <input
              type="text"
              required
              value={form.nome_lote}
              onChange={e => setForm(f => ({ ...f, nome_lote: e.target.value }))}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Ex: Pasto da Sede"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Grupo</label>
            <select
              value={form.id_grupo || ''}
              onChange={e => setForm(f => ({ ...f, id_grupo: e.target.value }))}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">Sem grupo</option>
              {grupos.map(g => {
                const gv = (g.id_grupo ?? g.id ?? g._id) + '';
                return <option key={gv} value={gv}>{g.nome_grupo}</option>;
              })}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Lote</label>
            <input
              type="text"
              value={form.tipo_lote}
              onChange={e => setForm(f => ({ ...f, tipo_lote: e.target.value }))}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Ex: Pasto, Piquete, Currais"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={form.status}
              onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade Máxima</label>
            <input
              type="number"
              min="0"
              value={form.qtd_max}
              onChange={e => setForm(f => ({ ...f, qtd_max: e.target.value }))}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Ex: 50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Área (m²)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.area_m2}
              onChange={e => setForm(f => ({ ...f, area_m2: e.target.value }))}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Ex: 10000.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea
              value={form.descricao}
              onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows={3}
            />
          </div>

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
