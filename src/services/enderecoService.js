// src/services/enderecoService.js
import { apiFetch } from "@/lib/apiClient";

/**
 * Cria um novo endereço.
 * @param {Object} payload
 * @param {string} payload.pais
 * @param {string} payload.estado
 * @param {string} payload.cidade
 * @param {string} payload.bairro
 * @param {string} payload.rua
 * @param {string} payload.cep
 * @param {string|number} [payload.numero]
 * @param {string} [payload.ponto_referencia]
 * @param {string} token - JWT do usuário autenticado
 * @returns {Promise<Object>} Endereço criado (com id)
 */
const criarEndereco = async (payload, token) => {
  try {
    // validações mínimas para evitar 400 desnecessário
    const obrigatorios = ["pais", "estado", "cidade", "bairro", "rua", "cep"];
    for (const campo of obrigatorios) {
      if (!payload?.[campo]) {
        throw new Error(`Campo '${campo}' é obrigatório.`);
      }
    }

    const body = {
      pais: payload.pais,
      estado: payload.estado,
      cidade: payload.cidade,
      bairro: payload.bairro,
      rua: payload.rua,
      cep: payload.cep,
      numero: payload?.numero ?? null,
      ponto_referencia: payload?.ponto_referencia ?? null,
    };

    const data = await apiFetch(`/enderecos`, {
      method: "POST",
      token,
      body: body,
    });

    console.log("✅ Endereço criado com sucesso:", data);
    return data;
  } catch (error) {
    console.error("❌ Erro ao criar endereço:", error);
    throw error;
  }
};

/**
 * Lista todos os endereços.
 * @param {string} token - JWT do usuário autenticado
 * @returns {Promise<Array>} Lista de endereços
 */
const listarEnderecos = async (token) => {
  try {
    const data = await apiFetch(`/enderecos`, {
      method: "GET",
      token,
    });
    if (!Array.isArray(data)) {
      console.warn("Resposta inesperada em /enderecos:", data);
      return [];
    }
    console.log("✅ Endereços carregados:", data);
    return data;
  } catch (error) {
    console.error("❌ Erro ao listar endereços:", error);
    throw error;
  }
};

/**
 * Busca um endereço por ID.
 * @param {number|string} idEndereco
 * @param {string} token
 * @returns {Promise<Object>} Endereço encontrado
 */
const buscarEnderecoPorId = async (idEndereco, token) => {
  try {
    const data = await apiFetch(`/enderecos/${idEndereco}`, {
      method: "GET",
      token,
    });
    console.log("✅ Endereço carregado:", data);
    return data;
  } catch (error) {
    console.error("❌ Erro ao buscar endereço:", error);
    throw error;
  }
};

/**
 * Atualiza um endereço por ID.
 * @param {number|string} idEndereco
 * @param {Object} payload - Campos que deseja atualizar
 * @param {string} [payload.pais]
 * @param {string} [payload.estado]
 * @param {string} [payload.cidade]
 * @param {string} [payload.bairro]
 * @param {string} [payload.rua]
 * @param {string} [payload.cep]
 * @param {string|number} [payload.numero]
 * @param {string} [payload.ponto_referencia]
 * @param {string} token
 * @returns {Promise<Object>} Endereço atualizado
 */
const atualizarEndereco = async (idEndereco, payload, token) => {
  try {
    // payload pode ser parcial; apenas envia o que veio
    const data = await apiFetch(`/enderecos/${idEndereco}`, {
      method: "PATCH",
      token,
      body: payload ?? {},
    });
    console.log("✅ Endereço atualizado com sucesso:", data);
    return data;
  } catch (error) {
    console.error("❌ Erro ao atualizar endereço:", error);
    throw error;
  }
};

/**
 * Remove um endereço por ID.
 * @param {number|string} idEndereco
 * @param {string} token
 * @returns {Promise<Object>} Resposta do backend (mensagem de sucesso)
 */
const deletarEndereco = async (idEndereco, token) => {
  try {
    const data = await apiFetch(`/enderecos/${idEndereco}`, {
      method: "DELETE",
      token,
    });
    console.log("✅ Endereço deletado com sucesso:", data);
    return data;
  } catch (error) {
    console.error("❌ Erro ao deletar endereço:", error);
    throw error;
  }
};

const enderecoService = {
  criarEndereco,
  listarEnderecos,
  buscarEnderecoPorId,
  atualizarEndereco,
  deletarEndereco,
};

export default enderecoService;
