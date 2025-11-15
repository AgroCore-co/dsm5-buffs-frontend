import { get, post } from "@/lib/apiClient";
/**
 * Registra movimentação física de um grupo para novo lote
 * @param {Object} dadosMovimentacao - Dados da movimentação física
 * @returns {Promise<Object>} Objeto da movimentação registrada
 */
const registrarMovimentacaoGrupo = async (dadosMovimentacao) => {
  if (!dadosMovimentacao || typeof dadosMovimentacao !== "object") {
    throw new Error("Dados da movimentação são obrigatórios e devem ser um objeto");
  }
  try {
    const response = await post("/mov-lote", dadosMovimentacao);
    return response.data;
  } catch (err) {
    throw err;
  }
};

/**
 * Verifica o status atual de localização de um grupo
 * @param {string} idGrupo - ID do grupo para verificar status atual
 * @returns {Promise<Object>} Objeto contendo informações sobre a localização atual do grupo ou mensagem amigável se não houver movimentações
 */
const verificarStatusGrupo = async (idGrupo) => {
  if (!idGrupo) throw new Error("ID do grupo é obrigatório");

  try {
    const response = await get(`/mov-lote/status/grupo/${idGrupo}`);
    return response.data;
  } catch (err) {
    // Se for erro 404, retorna mensagem amigável
    if (err?.response?.status === 404 && err?.response?.data?.message) {
      return {
        grupo_id: idGrupo,
        localizacao_atual: null,
        mensagem: err.response.data.message,
        notFound: true,
      };
    }
    // Outros erros
    throw err;
  }
};


/**
 * Busca o histórico de movimentações de um grupo
 * @param {string} idGrupo - ID do grupo para buscar histórico
 * @returns {Promise<Object>} Objeto contendo o histórico de movimentações do grupo
 */
const buscarHistoricoGrupo = async (idGrupo) => {
  if (!idGrupo) throw new Error("ID do grupo é obrigatório");
  try {
    const response = await get(`/mov-lote/historico/grupo/${idGrupo}`);
    return response.data;
  } catch (err) {
    throw err;
  }
};


/**
 * Busca uma movimentação pelo ID
 * @param {string} idMovimentacao - ID da movimentação
 * @returns {Promise<Object>} Objeto contendo os dados da movimentação
 */
const buscarMovimentacaoPorId = async (idMovimentacao) => {
  if (!idMovimentacao) throw new Error("ID da movimentação é obrigatório");
  try {
    const response = await get(`/mov-lote/${idMovimentacao}`);
    return response.data;
  } catch (err) {
    // Se for erro 404, retorna null
    if (err?.response?.status === 404) {
      return null;
    }
    throw err;
  }
};

const movLoteService = {
  verificarStatusGrupo,
  buscarHistoricoGrupo,
  buscarMovimentacaoPorId,
  registrarMovimentacaoGrupo,
};

export default movLoteService;
