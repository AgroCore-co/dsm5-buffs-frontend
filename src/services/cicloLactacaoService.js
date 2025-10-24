import { get } from "@/lib/apiClient";

/**
 * Lista ciclos de lactação por propriedade com paginação.
 * GET /ciclos-lactacao/propriedade/{id_propriedade}?page={page}&limit={limit}
 *
 * @param {string} idPropriedade - ID da propriedade (obrigatório)
 * @param {number} [page=1] - Número da página (opcional, padrão 1)
 * @param {number} [limit=10] - Itens por página (opcional, padrão 10)
 * @returns {Promise<{ data: Array, meta: Object }>} Lista paginada de ciclos de lactação
 */
const listarCiclosPorPropriedade = async (idPropriedade, page = 1, limit = 10) => {
  if (!idPropriedade) throw new Error("ID da propriedade é obrigatório");
  const safePage = Number.isInteger(Number(page)) && Number(page) > 0 ? Number(page) : 1;
  let safeLimit = Number.isInteger(Number(limit)) && Number(limit) > 0 ? Number(limit) : 10;
  if (safeLimit > 100) safeLimit = 100;
  const response = await get(`/ciclos-lactacao/propriedade/${idPropriedade}?page=${safePage}&limit=${safeLimit}`);
  return response.data;
};

export default {
  listarCiclosPorPropriedade,
};
