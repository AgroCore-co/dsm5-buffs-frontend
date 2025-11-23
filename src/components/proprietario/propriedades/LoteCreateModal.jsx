"use client";

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import loteService from '@/services/loteService';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const parseGeoJSONPolygon = (geoJson) => {
  if (!geoJson) return null;
  try {
    if (geoJson.type === 'Polygon' && geoJson.coordinates) {
      const coordinates = geoJson.coordinates[0];
      return coordinates.map(([lng, lat]) => [lat, lng]);
    }
    return null;
  } catch (error) {
    console.error('Erro ao converter GeoJSON:', error);
    return null;
  }
};

const calcularCentro = (coordenadas) => {
  if (!coordenadas || coordenadas.length === 0) return [-24.738, -47.86];
  const latSum = coordenadas.reduce((sum, [lat]) => sum + lat, 0);
  const lngSum = coordenadas.reduce((sum, [, lng]) => sum + lng, 0);
  return [latSum / coordenadas.length, lngSum / coordenadas.length];
};

function MapCenterUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 15);
    }
  }, [center, map]);
  return null;
}

export default function LoteCreateModal({ isOpen, onClose, geo_mapa, area_m2: initialArea = null, propriedadeId, grupos = [], onCreated }) {
  const [form, setForm] = useState({ nome_lote: '', id_grupo: '', tipo_lote: '', status: 'ativo', descricao: '', qtd_max: '', area_m2: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setError('');
      setForm({ nome_lote: '', id_grupo: '', tipo_lote: '', status: 'ativo', descricao: '', qtd_max: '', area_m2: initialArea ? String(initialArea) : '' });
    }
  }, [isOpen, geo_mapa]);

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!geo_mapa) {
      setError('Geolocalização do lote ausente. Desenhe o polígono no mapa antes de criar.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = {
        nome_lote: form.nome_lote,
        id_propriedade: propriedadeId,
        id_grupo: form.id_grupo === '' ? null : (form.id_grupo || undefined),
        tipo_lote: form.tipo_lote || undefined,
        status: form.status || undefined,
        descricao: form.descricao || undefined,
        qtd_max: form.qtd_max ? Number(form.qtd_max) : undefined,
        area_m2: form.area_m2 ? Number(form.area_m2) : undefined,
        geo_mapa,
      };
      const created = await loteService.criarLote(payload);
      if (onCreated) onCreated(created);
      onClose();
    } catch (err) {
      console.error('Erro ao criar lote', err);
      setError(err?.message || 'Erro ao criar lote');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[1010] flex items-center justify-center bg-black/40">
      {/* Alterado max-w-lg para max-w-4xl para layout horizontal */}
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl relative flex flex-col gap-4 border border-[#e0e0e0]">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold z-10"
          onClick={onClose}
          aria-label="Fechar"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Criar Lote</h2>

        {/* Layout Grid para dividir Inputs (Esquerda) e Mapa (Direita) */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Coluna da Esquerda: Inputs */}
          <div className="flex flex-col gap-3">
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

            <div className="grid grid-cols-2 gap-3">
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

            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

            {/* Botões movidos para o final da coluna da esquerda */}
            <div className="flex gap-3 mt-4">
              <button
                type="button"
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded font-bold hover:bg-gray-300 transition-colors flex-1"
                onClick={onClose}
                disabled={saving}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded font-bold hover:bg-blue-600 transition-colors flex-1"
                disabled={saving}
              >
                {saving ? 'Salvando...' : 'Criar Lote'}
              </button>
            </div>
          </div>

          {/* Coluna da Direita: Mapa */}
          <div className="flex flex-col h-full min-h-[350px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Pré-visualização do Piquete</label>
            {geo_mapa ? (
              <div className="w-full border border-gray-200 rounded overflow-hidden flex-1 relative">
                <MapContainer
                  center={calcularCentro(parseGeoJSONPolygon(geo_mapa))}
                  zoom={15}
                  style={{ height: '100%', width: '100%', minHeight: '300px' }}
                >
                  <MapCenterUpdater center={calcularCentro(parseGeoJSONPolygon(geo_mapa))} />
                  <TileLayer
                    attribution="&copy; OpenStreetMap"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Polygon
                    positions={parseGeoJSONPolygon(geo_mapa)}
                    pathOptions={{
                      color: '#3B82F6',
                      fillColor: '#3B82F6',
                      fillOpacity: 0.3,
                      weight: 2,
                    }}
                  />
                </MapContainer>
              </div>
            ) : (
              <div className="w-full border border-gray-200 rounded px-3 py-2 bg-gray-50 text-sm text-gray-500 text-center flex-1 flex items-center justify-center min-h-[300px]">
                Desenhe um polígono no mapa para visualizar a posição do piquete
              </div>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}