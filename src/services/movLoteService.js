import { get } from "@/lib/apiClient";

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

const movLoteService = {
  verificarStatusGrupo,
};

export default movLoteService;
