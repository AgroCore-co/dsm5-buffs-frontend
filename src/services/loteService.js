// src/services/loteService.js
import { apiFetch } from "@/lib/apiClient";

/**
 * Lista todos os lotes (piquetes) georreferenciados.
 * @param {string} token - JWT do usuário
 * @returns {Promise<Array>} - Lista de lotes
 */
const listarLotes = async (token) => {
  try {
    const data = await apiFetch(`/lotes`, {
      method: "GET",
      token,
    });
    if (!Array.isArray(data)) {
      console.warn("Resposta inesperada em /lotes:", data);
      return [];
    }
    console.log("✅ Lotes carregados:", data);
    return data;
  } catch (error) {
    console.error("❌ Erro ao listar lotes:", error);
    throw error;
  }
};

/**
 * Cria um novo lote (piquete) georreferenciado.
 * @param {Object} payload
 * @param {string} payload.nome_lote
 * @param {number} payload.id_propriedade
 * @param {string} [payload.descricao]
 * @param {Object} payload.geo_mapa - GeoJSON Polygon
 * @param {string} token - JWT do usuário autenticado
 * @returns {Promise<Object>} - Objeto do lote criado
 */
const criarLote = async (payload, token) => {
  try {
    if (!payload?.nome_lote) throw new Error("Campo 'nome_lote' é obrigatório.");
    if (!payload?.id_propriedade && payload?.id_propriedade !== 0)
      throw new Error("Campo 'id_propriedade' é obrigatório.");
    if (!payload?.geo_mapa) throw new Error("Campo 'geo_mapa' é obrigatório.");

    const body = {
      nome_lote: payload.nome_lote,
      id_propriedade: Number(payload.id_propriedade),
      descricao: payload.descricao ?? null,
      geo_mapa: payload.geo_mapa,
    };

    const data = await apiFetch(`/lotes`, {
      method: "POST",
      token,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    console.log("✅ Lote criado com sucesso:", data);
    return data;
  } catch (error) {
    console.error("❌ Erro ao criar lote:", error);
    throw error;
  }
};

export default {
  listarLotes,
  criarLote,
};
