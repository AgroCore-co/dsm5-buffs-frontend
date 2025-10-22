import { get } from "@/lib/apiClient";

/**
 * Lista coletas por propriedade com paginação.
 * GET /coletas/propriedade/{id_propriedade}?page={page}&limit={limit}
 *
 * @param {string} idPropriedade - ID da propriedade (obrigatório)
 * @param {number} [page=1] - Número da página (opcional, padrão 1)
 * @param {number} [limit=10] - Itens por página (opcional, padrão 10)
 * @returns {Promise<{ data: Array, meta: Object }>} Lista paginada de coletas
 */
const listarColetasPorPropriedade = async (idPropriedade, page = 1, limit = 10) => {
  if (!idPropriedade) throw new Error("ID da propriedade é obrigatório");
  const safePage = Number.isInteger(Number(page)) && Number(page) > 0 ? Number(page) : 1;
  let safeLimit = Number.isInteger(Number(limit)) && Number(limit) > 0 ? Number(limit) : 10;
  if (safeLimit > 100) safeLimit = 100;
  const response = await get(`/coletas/propriedade/${idPropriedade}?page=${safePage}&limit=${safeLimit}`);
  return response.data;
};

export default {
  listarColetasPorPropriedade,
};
