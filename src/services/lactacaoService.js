import { get } from "@/lib/apiClient";

/**
 * Busca o resumo de produção de uma búfala específica (ciclo atual + histórico).
 * GET /lactacao/bufala/{id}/resumo-producao
 *
 * @param {string} idBufala - ID da búfala (UUID, obrigatório)
 * @returns {Promise<Object>} Resumo completo de produção contendo:
 *   - bufala: { id, nome, brinco }
 *   - ciclo_atual: dados do ciclo de lactação atual
 *   - comparativo_ciclos: histórico de ciclos anteriores
 *   - grafico_producao: dados para gráfico de produção diária
 */
const buscarResumoProducaoPorBufala = async (idBufala) => {
  if (!idBufala) throw new Error("ID da búfala é obrigatório");
  try {
    console.log(`[lactacaoService] Buscando resumo de produção para búfala: ${idBufala}`);
    const response = await get(`/lactacao/bufala/${idBufala}/resumo-producao`);
    console.log(`[lactacaoService] Resposta recebida:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`[lactacaoService] Erro ao buscar resumo de produção:`, error);
    throw error;
  }
};

const lactacaoService = {
  buscarResumoProducaoPorBufala,
};

export default lactacaoService;
