import { get } from "@/lib/apiClient";
import { patch } from "@/lib/apiClient";

/**
 * Lista búfalos de uma propriedade com paginação.
 * GET /bufalos/propriedade/{id_propriedade}?page={page}&limit={limit}
 *
 * @param {string} idPropriedade - ID (UUID) da propriedade (obrigatório)
 * @param {number} [page=1] - Número da página (inicia em 1)
 * @param {number} [limit=10] - Itens por página (máximo 100)
 * @returns {Promise<{ data: Array, meta: Object }>} Retorna o payload completo do endpoint
 */
const listarBufalosPorPropriedade = async (idPropriedade, page = 1, limit = 10) => {
  if (!idPropriedade) throw new Error("ID da propriedade é obrigatório");

  const safePage = Number.isInteger(Number(page)) && Number(page) > 0 ? Number(page) : 1;
  let safeLimit = Number.isInteger(Number(limit)) && Number(limit) > 0 ? Number(limit) : 10;
  if (safeLimit > 100) safeLimit = 100;

  const response = await get(`/bufalos/propriedade/${idPropriedade}?page=${safePage}&limit=${safeLimit}`);
  return response.data;
};

/**
 * Busca um búfalo específico pelo ID.
 * GET /bufalos/{id}
 *
 * @param {string} idBufalo - ID do búfalo (UUID)
 * @returns {Promise<Object>} Dados do búfalo
 */
const buscarBufaloPorId = async (idBufalo) => {
  if (!idBufalo) throw new Error("ID do búfalo é obrigatório");
  const response = await get(`/bufalos/${idBufalo}`);
  return response.data;
};

/**
 * Edita os dados de um búfalo.
 * PATCH /bufalos/{id}
 *
 * @param {string} idBufalo - ID do búfalo (UUID)
 * @param {Object} dadosAtualizados - Dados para atualizar
 * @returns {Promise<Object>} Dados do búfalo atualizado
 */
const editarBufalo = async (idBufalo, dadosAtualizados) => {
  if (!idBufalo) throw new Error("ID do búfalo é obrigatório");
  const response = await patch(`/bufalos/${idBufalo}`, dadosAtualizados);
  return response.data;
};

export default {
  listarBufalosPorPropriedade,
  buscarBufaloPorId,
  editarBufalo,
};
