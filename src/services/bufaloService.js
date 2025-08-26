import { apiFetch } from "@/lib/apiClient";

/**
 * Registra um novo búfalo no rebanho.
 * Apenas usuários autenticados podem usar.
 *
 * @param {Object} buffaloData - Dados do búfalo a ser cadastrado
 * @param {string} token - JWT do usuário autenticado
 * @returns {Promise<Object>} - Dados do búfalo cadastrado
 */
const registrarBuffalo = async (buffaloData, token) => {
  try {
    const response = await apiFetch("/bufalos", {
      method: "POST",
      token,
      body: buffaloData,
    });
    console.log("✅ Búfalo registrado:", response);
    return response;
  } catch (error) {
    console.error("❌ Erro ao registrar búfalo:", error);
    throw error;
  }
};

export default {
  registrarBuffalo,
};
