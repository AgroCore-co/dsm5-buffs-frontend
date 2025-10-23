import { post } from "@/lib/apiClient";
import { get } from "@/lib/apiClient";

/**
 * Simula acasalamento e prevê potencial genético da prole
 * @param {Object} data { id_macho, id_femea }
 * @returns {Promise<Object>} Predição da prole
 */
export async function simularAcasalamento(data) {
  if (!data?.id_macho || !data?.id_femea) throw new Error("id_macho e id_femea são obrigatórios");
  const response = await post("/reproducao/simulacao", data);
  return response.data;
}

/**
 * Busca machos compatíveis para uma fêmea baseado na consanguinidade
 * @param {string} idFemea - UUID da búfala fêmea
 * @param {number} [maxConsanguinidade] - Consanguinidade máxima aceitável em %
 * @returns {Promise<Array<{id_bufalo: string, consanguinidade_macho: number}>>}
 */
export async function buscarMachosCompativeis(idFemea, maxConsanguinidade) {
  if (!idFemea) throw new Error("idFemea é obrigatório");
  const url = `/reproducao/simulacao/machos-compativeis/${idFemea}` +
    (maxConsanguinidade !== undefined ? `?max_consanguinidade=${maxConsanguinidade}` : "");
  const response = await get(url);
  return response.data;
}
