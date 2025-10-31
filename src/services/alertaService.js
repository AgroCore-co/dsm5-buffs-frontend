import { post, get } from "@/lib/apiClient";

/**
 * Verifica e cria alertas pendentes para uma propriedade específica.
 * POST /alertas/verificar/{id_propriedade}
 *
 * @param {string} idPropriedade - UUID da propriedade (obrigatório)
 * @param {Array<string>|string|undefined} nichos - Nichos a verificar. Pode ser um array de strings, uma string única, ou undefined para verificar todos.
 * @returns {Promise<Object>} Resultado do endpoint (payload do servidor)
 *
 * Exemplo de uso:
 * verificarAlertasPorPropriedade('uuid-da-propriedade')
 * verificarAlertasPorPropriedade('uuid-da-propriedade', ['REPRODUCAO','SANITARIO'])
 */
const verificarAlertasPorPropriedade = async (idPropriedade, nichos) => {
  if (!idPropriedade) throw new Error("ID da propriedade é obrigatório");

  // Normaliza nichos para array, aceita string única ou undefined
  let params = "";
  if (nichos !== undefined && nichos !== null) {
    const arr = Array.isArray(nichos) ? nichos : [nichos];
    // filtra valores inválidos
    const safe = arr
      .filter((n) => n !== null && n !== undefined && String(n).trim() !== "")
      .map((n) => `nichos=${encodeURIComponent(String(n).trim())}`);
    if (safe.length > 0) params = `?${safe.join("&")}`;
  }

  const url = `/alertas/verificar/${idPropriedade}${params}`;
  const response = await post(url);
  return response.data;
};

/**
 * Lista alertas de uma propriedade, opcionalmente filtrando por nicho.
 * GET /alertas/propriedade/{id_propriedade}?nicho=PRODUCAO
 */
/**
 * Lista alertas de uma propriedade, opcionalmente filtrando por nicho e com paginação.
 * GET /alertas/propriedade/{id_propriedade}?nicho=PRODUCAO&page=1&limit=10
 *
 * @param {string} idPropriedade
 * @param {string|undefined} nicho
 * @param {number} [page=1]
 * @param {number} [limit=10]
 */
const listarAlertasPorPropriedade = async (idPropriedade, nicho, page = 1, limit = 10) => {
  if (!idPropriedade) throw new Error("ID da propriedade é obrigatório");
  const parts = [];
  if (nicho) parts.push(`nicho=${encodeURIComponent(nicho)}`);
  if (page && Number.isInteger(Number(page)) && Number(page) > 0) parts.push(`page=${Number(page)}`);
  if (limit && Number.isInteger(Number(limit)) && Number(limit) > 0) parts.push(`limit=${Number(limit)}`);
  const q = parts.length > 0 ? `?${parts.join("&")}` : "";
  const response = await get(`/alertas/propriedade/${idPropriedade}${q}`);
  return response.data;
};

const alertaService = {
  verificarAlertasPorPropriedade,
  listarAlertasPorPropriedade,
};

export default alertaService;
