// src/services/propriedadeService.js
import { apiFetch } from "@/lib/apiClient";

/**
 * Busca os dados de uma propriedade pelo ID.
 * Apenas usuários autenticados podem usar.
 *
 * @param {number} idPropriedade - ID da propriedade a ser consultada
 * @param {string} token - JWT do usuário autenticado
 * @returns {Promise<Object>} - Dados da propriedade
 */
const buscarPropriedade = async (idPropriedade, token) => {
  try {
    const response = await apiFetch(`/propriedades/${idPropriedade}`, {
      method: "GET",
      token,
    });
    console.log("✅ Propriedade carregada:", response);
    return response;
  } catch (error) {
    console.error("❌ Erro ao buscar propriedade:", error);
    throw error;
  }
};

export default {
  buscarPropriedade,
};
