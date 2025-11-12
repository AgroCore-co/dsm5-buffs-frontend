import { get } from "@/lib/apiClient";

/**
 * Verifica o status atual de localização de um grupo
 * @param {string} idGrupo - ID do grupo para verificar status atual
 * @returns {Promise<Object>} Objeto contendo informações sobre a localização atual do grupo
 */
const verificarStatusGrupo = async (idGrupo) => {
  if (!idGrupo) throw new Error("ID do grupo é obrigatório");

  const response = await get(`/mov-lote/status/grupo/${idGrupo}`);
  return response.data;
};

const movLoteService = {
  verificarStatusGrupo,
};

export default movLoteService;
