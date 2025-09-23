/**
 * Cria um novo funcionário (conta no Supabase e perfil na aplicação).
 * Somente PROPRIETARIO ou GERENTE pode criar.
 * @param {Object} data - Dados do funcionário
 * @param {string} data.nome - Nome completo
 * @param {string} data.email - Email do funcionário
 * @param {string} data.password - Senha inicial
 * @param {string} data.telefone - Telefone
 * @param {string} data.cargo - Cargo (GERENTE, FUNCIONARIO, VETERINARIO)
 * @param {number} data.id_endereco - ID do endereço
 * @param {number} data.id_propriedade - ID da propriedade
 * @param {string} token - JWT do usuário autenticado
 * @returns {Promise<Object>} - Funcionário criado
 */
const criarFuncionario = async (data, token) => {
  try {
    const response = await apiFetch("/usuarios/funcionarios", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
/**
 * Desvincula um funcionário de uma propriedade específica.
 * @param {number|string} idUsuario - ID do funcionário
 * @param {number|string} idPropriedade - ID da propriedade
 * @param {string} token - JWT do usuário autenticado
 * @returns {Promise<Object>} - Resposta do backend
 */
const desvincularFuncionarioDePropriedade = async (idUsuario, idPropriedade, token) => {
  try {
    const response = await apiFetch(`/usuarios/funcionarios/${idUsuario}/propriedade/${idPropriedade}`, {
      method: "DELETE",
      token,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
/**
 * Edita os dados de um usuário específico.
 * @param {number|string} idUsuario - ID do usuário
 * @param {Object} data - Dados a atualizar (nome, telefone, id_endereco)
 * @param {string} token - JWT do usuário autenticado
 * @returns {Promise<Object>} - Dados do usuário atualizado
 */
const editarUsuario = async (idUsuario, data, token) => {
  try {
    const response = await apiFetch(`/usuarios/${idUsuario}`, {
      method: "PATCH",
      data,
      token,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
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


/**
 * Lista funcionários de uma propriedade específica.
 * @param {number|string} idPropriedade - ID da propriedade
 * @param {string} token - JWT do usuário autenticado
 * @returns {Promise<Array>} - Lista de funcionários
 */

const listarFuncionariosPorPropriedade = async (idPropriedade, token) => {
  try {
    const response = await apiFetch(`/usuarios/funcionarios/propriedade/${idPropriedade}`, {
      method: "GET",
      token,
    });
    console.log("👥 Funcionários da propriedade:", response);
    return Array.isArray(response) ? response : [];
  } catch (error) {
    throw error;
  }
};

/**
 * Busca detalhes de um usuário específico pelo id.
 * @param {number|string} idUsuario - ID do usuário
 * @param {string} [token] - JWT do usuário autenticado (opcional)
 * @returns {Promise<Object>} - Dados do usuário
 */
const buscarUsuarioPorId = async (idUsuario, token) => {
  try {
    const response = await apiFetch(`/usuarios/${idUsuario}`, {
      method: "GET",
      token,
    });
    return response;
  } catch (error) {
    throw error;
  }
};


const usuarioService = {
  listarUsuarios,
  createProfile,
  listarFuncionariosPorPropriedade,
  buscarUsuarioPorId,
  editarUsuario,
  desvincularFuncionarioDePropriedade,
  criarFuncionario,
};

export default usuarioService;
