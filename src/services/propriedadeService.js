// src/services/propriedadeService.js
import { apiFetch } from "@/lib/apiClient";

/**
 * Lista todas as propriedades do usuário autenticado.
 * @param {string} token - JWT do usuário
 * @returns {Promise<Array>} - Lista de propriedades
 */
const listarPropriedades = async (token) => {
  try {
    const data = await apiFetch(`/propriedades`, {
      method: "GET",
      token,
    });
    if (!Array.isArray(data)) {
      console.warn("Resposta inesperada em /propriedades:", data);
      return [];
    }
    console.log("✅ Propriedades carregadas:", data);
    return data;
  } catch (error) {
    console.error("❌ Erro ao listar propriedades:", error);
    throw error;
  }
};

/**
 * (Opcional) Busca uma propriedade específica por ID.
 * @param {number|string} idPropriedade
 * @param {string} token
 */
const buscarPropriedadePorId = async (idPropriedade, token) => {
  try {
    const data = await apiFetch(`/propriedades/${idPropriedade}`, {
      method: "GET",
      token,
    });
    console.log("✅ Propriedade carregada:", data);
    return data;
  } catch (error) {
    console.error("❌ Erro ao buscar propriedade:", error);
    throw error;
  }
};

/**
 * Cria uma nova propriedade para o usuário logado.
 * Fluxo esperado: antes, crie o endereço via POST /enderecos e use o id_endereco retornado aqui.
 *
 * @param {Object} payload
 * @param {string} payload.nome
 * @param {string} [payload.cnpj]
 * @param {number} payload.id_endereco
 * @param {boolean} [payload.p_abcb]
 * @param {"P"|"E"|"I"|string} [payload.tipo_manejo] // P = Pasto (exemplo), ajuste conforme seu domínio
 * @param {string} token - JWT do usuário autenticado
 * @returns {Promise<Object>} - Objeto da propriedade criada (esperado 201)
 */
const criarPropriedade = async (payload, token) => {
  try {
    // validações mínimas (evita 400 desnecessário)
    if (!payload?.nome) throw new Error("Campo 'nome' é obrigatório.");
    if (!payload?.id_endereco && payload?.id_endereco !== 0)
      throw new Error("Campo 'id_endereco' é obrigatório.");

    const body = {
      nome: payload.nome,
      cnpj: payload.cnpj ?? null,
      id_endereco: Number(payload.id_endereco),
      p_abcb: Boolean(payload.p_abcb),
      tipo_manejo: payload.tipo_manejo ?? null,
    };

    const data = await apiFetch(`/propriedades`, {
      method: "POST",
      token,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    console.log("✅ Propriedade criada com sucesso:", data);
    return data;
  } catch (error) {
    console.error("❌ Erro ao criar propriedade:", error);
    throw error;
  }
};

export default {
  listarPropriedades,
  buscarPropriedadePorId,
  criarPropriedade, 
};
