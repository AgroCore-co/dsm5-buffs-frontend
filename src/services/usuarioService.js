import { apiFetch } from "@/lib/apiClient";


/**
 * Lista todos os usuários do sistema.
 * Apenas usuários autenticados podem usar.
 *
 * @param {string} token - JWT do usuário autenticado
 * @returns {Promise<Array>} - Lista de usuários
 */
const listarUsuarios = async (token) => {
  try {
    const response = await apiFetch("/usuarios", {
      method: "GET",
      token,
    });
    console.log("📋 Usuários listados:", response);
    return Array.isArray(response) ? response : [];
  } catch (error) {
    throw error;
  }
};

export default {
  listarUsuarios,
};
