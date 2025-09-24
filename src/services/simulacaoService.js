import { apiFetch } from "@/lib/apiClient";

/**
 * Simula um acasalamento e prevê o potencial genético da prole.
 * @param {Object} params
 * @param {number} params.id_macho - ID do macho
 * @param {number} params.id_femea - ID da fêmea
 * @param {string} token - JWT do usuário autenticado
 * @returns {Promise<Object>} - Resultado da simulação
 */
const simularAcasalamento = async ({ id_macho, id_femea }, token) => {
  try {
    const response = await apiFetch("/reproducao/simulacao", {
      method: "POST",
      token,
      data: { id_macho, id_femea },
    });
    return response;
  } catch (error) {
    console.error("❌ Erro ao simular acasalamento:", error);
    throw error;
  }
};

const simulacaoService = {
  simularAcasalamento,
};

export default simulacaoService;
