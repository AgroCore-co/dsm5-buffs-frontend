import { get } from "@/lib/apiClient";

/**
 * Lista todos os registros sanitários de um búfalo com paginação.
 * GET /dados-sanitarios/bufalo/{id_bufalo}?page={page}&limit={limit}
 *
 * @param {string} idBufalo - ID do búfalo (obrigatório)
 * @param {number} [page=1] - Número da página (opcional, padrão 1)
 * @param {number} [limit=10] - Itens por página (opcional, padrão 10)
 * @returns {Promise<{ data: Array, meta: Object }>} Lista paginada de registros sanitários
 */
const listarDadosSanitariosPorBufalo = async (idBufalo, page = 1, limit = 10) => {
  if (!idBufalo) throw new Error("ID do búfalo é obrigatório");
  const safePage = Number.isInteger(Number(page)) && Number(page) > 0 ? Number(page) : 1;
  let safeLimit = Number.isInteger(Number(limit)) && Number(limit) > 0 ? Number(limit) : 10;
  if (safeLimit > 100) safeLimit = 100;
  const response = await get(`/dados-sanitarios/bufalo/${idBufalo}?page=${safePage}&limit=${safeLimit}`);
  return response.data;
};

const dadosSanitariosService = {
  listarDadosSanitariosPorBufalo,
};

export default dadosSanitariosService;