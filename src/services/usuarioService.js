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

/**
 * Cria o perfil inicial do usuário (proprietário).
 * Cargo será automaticamente definido como PROPRIETARIO.
 * Email e auth_id são extraídos do token JWT.
 *
 * @param {Object} data - Dados do usuário
 * @param {string} data.nome - Nome completo do usuário
 * @param {string} data.telefone - Telefone do usuário
 * @param {number} data.id_endereco - ID do endereço já existente
 * @param {string} token - JWT do usuário autenticado
 * @returns {Promise<Object>} - Dados do usuário criado
 */
const createProfile = async (data, token) => {
  try {
    const response = await apiFetch("/usuarios", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    });
    console.log("✅ Perfil criado com sucesso:", response);
    return { success: true, data: response };
  } catch (error) {
    console.error("❌ Erro ao criar perfil:", error);
    return {
      success: false,
      error: error.message || "Erro inesperado ao criar perfil",
    };
  }
};

const usuarioService = {
  listarUsuarios,
  createProfile,
};

export default usuarioService;
