import { apiFetch } from "@/lib/apiClient";

/**
 * Lista todos os dados zootécnicos de um búfalo específico.
 *
 * @param {number} idBufalo - ID do búfalo
 * @param {string} token - JWT do usuário autenticado
 * @returns {Promise<Array>} - Lista de registros zootécnicos
 */
const listarDadosZootecnicosPorBufalo = async (idBufalo, token) => {
  try {
    console.log(`🔍 Buscando dados zootécnicos do búfalo ID ${idBufalo}...`);

    const response = await apiFetch(`/dados-zootecnicos/bufalo/${idBufalo}`, {
      method: "GET",
      token,
    });

    console.log("✅ Dados zootécnicos recebidos:", response);
    return response;
  } catch (error) {
    console.error(
      `❌ Erro ao buscar dados zootécnicos do búfalo ID ${idBufalo}:`,
      error
    );
    throw error;
  }
};

const dadosZootecnicosService = {
  listarDadosZootecnicosPorBufalo,
};

export default dadosZootecnicosService;
