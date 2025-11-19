import { get } from "@/lib/apiClient";

/**
 * Lista coberturas por propriedade com paginação.
 * GET /cobertura/propriedade/{id_propriedade}?page={page}&limit={limit}
 *
 * @param {string} idPropriedade - ID da propriedade (obrigatório)
 * @param {number} [page=1] - Número da página (opcional, padrão 1)
 * @param {number} [limit=10] - Itens por página (opcional, padrão 10)
 * @returns {Promise<{ data: Array, meta: Object }>} Lista paginada de coberturas
 */
const listarCoberturasPorPropriedade = async (idPropriedade, page = 1, limit = 10) => {
  if (!idPropriedade) throw new Error("ID da propriedade é obrigatório");
  const safePage = Number.isInteger(Number(page)) && Number(page) > 0 ? Number(page) : 1;
  let safeLimit = Number.isInteger(Number(limit)) && Number(limit) > 0 ? Number(limit) : 10;
  if (safeLimit > 100) safeLimit = 100;
  const response = await get(`/cobertura/propriedade/${idPropriedade}?page=${safePage}&limit=${safeLimit}`);
  return response.data;
};

/**
 * Lista fêmeas disponíveis para reprodução.
 * GET /cobertura/femeas/disponiveis-reproducao/{id_propriedade}
 *
 * @param {string} idPropriedade - ID da propriedade (obrigatório)
 * @param {string} [filtro] - Filtro de disponibilidade (opcional)
 *   - 'todas' = todas fêmeas
 *   - 'solteiras' = sem cobertura
 *   - 'vazias' = cobertura falhou
 *   - 'aptas' = prontas para cobrir (padrão)
 * @returns {Promise<Array>} Lista de fêmeas disponíveis com informações reprodutivas
 * 
 * @example
 * // Buscar todas as fêmeas aptas para reprodução
 * const aptas = await listarFemeasDisponiveisReproducao('uuid-propriedade');
 * 
 * // Buscar apenas fêmeas sem cobertura
 * const solteiras = await listarFemeasDisponiveisReproducao('uuid-propriedade', 'solteiras');
 * 
 * // Buscar fêmeas com cobertura que falhou
 * const vazias = await listarFemeasDisponiveisReproducao('uuid-propriedade', 'vazias');
 */
const listarFemeasDisponiveisReproducao = async (idPropriedade, filtro = 'aptas') => {
  if (!idPropriedade) throw new Error("ID da propriedade é obrigatório");
  
  const filtrosValidos = ['todas', 'solteiras', 'vazias', 'aptas'];
  const filtroSeguro = filtrosValidos.includes(filtro) ? filtro : 'aptas';
  
  const response = await get(
    `/cobertura/femeas/disponiveis-reproducao/${idPropriedade}?filtro=${filtroSeguro}`
  );
  return response.data;
};

/**
 * Lista ranking de fêmeas recomendadas para acasalamento.
 * GET /cobertura/recomendacoes/femeas/{id_propriedade}
 *
 * Calcula score de prioridade baseado em critérios zootécnicos:
 * - Experiência reprodutiva (0-50 pts)
 * - Intervalo reprodutivo adequado (0-25 pts)
 * - Idade ideal (0-20 pts)
 * - Ausência de restrições (0-15 pts)
 * - Status de lactação (0-10 pts)
 *
 * @param {string} idPropriedade - ID da propriedade (obrigatório)
 * @param {number} [limit] - Limitar quantidade de resultados (ex: top 10)
 * @returns {Promise<Array>} Lista ordenada de fêmeas por score decrescente (0-100)
 * 
 * @example
 * // Buscar top 10 fêmeas recomendadas
 * const top10 = await listarRecomendacoesFemeas('uuid-propriedade', 10);
 * 
 * // Buscar todas as fêmeas recomendadas
 * const todas = await listarRecomendacoesFemeas('uuid-propriedade');
 */
const listarRecomendacoesFemeas = async (idPropriedade, limit) => {
  if (!idPropriedade) throw new Error("ID da propriedade é obrigatório");
  
  let url = `/cobertura/recomendacoes/femeas/${idPropriedade}`;
  
  // Adicionar limit à query string se fornecido
  if (limit && Number.isInteger(Number(limit)) && Number(limit) > 0) {
    url += `?limit=${limit}`;
  }
  
  const response = await get(url);
  return response.data;
};

/**
 * Lista ranking de machos recomendados para acasalamento.
 * GET /cobertura/recomendacoes/machos/{id_propriedade}
 *
 * Calcula score de prioridade baseado em critérios:
 * - Idade e maturidade (0-25 pts)
 * - Histórico de acasalamentos (0-25 pts)
 * - Taxa de sucesso (0-30 pts)
 * - Intervalo de descanso (0-10 pts)
 * - Qualidade genética ABCB (0-10 pts)
 *
 * @param {string} idPropriedade - ID da propriedade (obrigatório)
 * @param {number} [limit] - Limitar quantidade de resultados (ex: top 5)
 * @returns {Promise<Array>} Lista ordenada de machos por score decrescente (0-100)
 * 
 * @example
 * // Buscar top 5 machos recomendados
 * const top5 = await listarRecomendacoesMachos('uuid-propriedade', 5);
 * 
 * // Buscar todos os machos recomendados
 * const todos = await listarRecomendacoesMachos('uuid-propriedade');
 */
const listarRecomendacoesMachos = async (idPropriedade, limit) => {
  if (!idPropriedade) throw new Error("ID da propriedade é obrigatório");
  
  let url = `/cobertura/recomendacoes/machos/${idPropriedade}`;
  
  // Adicionar limit à query string se fornecido
  if (limit && Number.isInteger(Number(limit)) && Number(limit) > 0) {
    url += `?limit=${limit}`;
  }
  
  const response = await get(url);
  return response.data;
};

/**
 * Busca cobertura por ID.
 * GET /cobertura/{id}
 *
 * @param {string} idCobertura - ID da cobertura (obrigatório)
 * @returns {Promise<Object>} Dados da cobertura
 *
 * @example
 * const cobertura = await getCoberturaById('a567e702-f686-4baa-bd92-2223e06b261a');
 */
const getCoberturaById = async (idCobertura) => {
  if (!idCobertura) throw new Error("ID da cobertura é obrigatório");
  const response = await get(`/cobertura/${idCobertura}`);
  return response.data;
};

const coberturaService = {
  listarCoberturasPorPropriedade,
  listarFemeasDisponiveisReproducao,
  listarRecomendacoesFemeas,
  listarRecomendacoesMachos,
  getCoberturaById,
};

export default coberturaService;
