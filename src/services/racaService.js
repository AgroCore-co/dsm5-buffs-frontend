import { apiFetch } from "@/lib/apiClient";

/**
 * Lista todas as raças de búfalos cadastradas no sistema.
 *
 * @param {string} token - JWT do usuário autenticado
 * @returns {Promise<Array>} - Lista de raças ordenadas alfabeticamente
 */
const listarRacas = async (token) => {
  try {


    const response = await apiFetch("/racas", {
      method: "GET",
      token,
    });

    console.log("✅ Lista de raças recebida:", response);
    if (Array.isArray(response)) {
      console.log(`📊 Total de ${response.length} raças recebidas`);
    } else {
      console.warn("⚠️ Resposta não é um array:", typeof response);
    }

    return response;
  } catch (error) {
    console.error("❌ Erro ao listar raças:", error);
    console.error("📝 Detalhes do erro:", {
      message: error.message,
      stack: error.stack,
      status: error.status,
    });
    throw error;
  }
};

/**
 * Correlaciona búfalos com suas respectivas raças.
 * 
 * @param {Array} bufalos - Lista de búfalos obtida do bufaloService
 * @param {Array} racas - Lista de raças obtida do racaService
 * @returns {Array} - Lista de búfalos com informações detalhadas da raça
 */
const correlacionarBufalosComRacas = (bufalos, racas) => {
  if (!Array.isArray(bufalos) || !Array.isArray(racas)) {
    console.warn("⚠️ Parâmetros inválidos para correlação");
    return bufalos;
  }

  try {
    console.log("🔍 Iniciando correlação de búfalos com raças...");
    
    // Criar um mapa de raças para acesso rápido por ID
    const mapRacas = racas.reduce((map, raca) => {
      map[raca.id_raca] = raca;
      return map;
    }, {});

    // Adicionar informação detalhada da raça a cada búfalo
    const bufalosComRacas = bufalos.map(bufalo => {
      const racaDetalhes = mapRacas[bufalo.id_raca] || null;
      return {
        ...bufalo,
        raca: racaDetalhes ? {
          id: racaDetalhes.id_raca,
          nome: racaDetalhes.nome,
        } : null
      };
    });

    console.log(`✅ Correlação concluída para ${bufalosComRacas.length} búfalos`);
    return bufalosComRacas;
  } catch (error) {
    console.error("❌ Erro ao correlacionar búfalos com raças:", error);
    return bufalos; // Retorna os búfalos originais em caso de erro
  }
};

const racaService = {
  listarRacas,
  correlacionarBufalosComRacas,
};

export default racaService;
