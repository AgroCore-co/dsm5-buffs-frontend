import { apiFetch } from "@/lib/apiClient";

/**
 * Lista todos os búfalos do usuário autenticado.
 *
 * @param {string} token - JWT do usuário autenticado
 * @returns {Promise<Array>} - Lista de búfalos
 */
const listarBufalos = async (token) => {
  try {
    console.log("🔍 Iniciando busca de búfalos...");
    console.log("🔑 Token fornecido:", token ? "Sim" : "Não");
    console.log("🌐 URL base:", process.env.NEXT_PUBLIC_API_URL);

    const response = await apiFetch("/bufalos", {
      method: "GET",
      token,
    });

    console.log("✅ Lista de búfalos recebida:", response);
    if (Array.isArray(response)) {
      console.log(`📊 Total de ${response.length} búfalos recebidos`);
    } else {
      console.warn("⚠️ Resposta não é um array:", typeof response);
    }

    return response;
  } catch (error) {
    console.error("❌ Erro ao listar búfalos:", error);
    console.error("📝 Detalhes do erro:", {
      message: error.message,
      stack: error.stack,
      status: error.status,
    });
    throw error;
  }
};

/**
 * Busca um búfalo específico pelo ID.
 *
 * @param {number} id - ID do búfalo
 * @param {string} token - JWT do usuário autenticado
 * @returns {Promise<Object>} - Dados do búfalo
 */
const getBufaloById = async (id, token) => {
  try {
    console.log(`🔍 Iniciando busca do búfalo com ID ${id}...`);

    const response = await apiFetch(`/bufalos/${id}`, {
      method: "GET",
      token,
    });

    console.log("✅ Dados do búfalo recebidos:", response);
    return response;
  } catch (error) {
    console.error(`❌ Erro ao buscar búfalo com ID ${id}:`, error);
    console.error("📝 Detalhes do erro:", {
      message: error.message,
      stack: error.stack,
      status: error.status,
    });
    throw error;
  }
};

/**
 * Cria um novo búfalo.
 *
 * @param {Object} bufaloData - Dados do búfalo
 * @param {string} token - JWT do usuário autenticado
 * @returns {Promise<Object>} - Búfalo criado
 */
const createBufalo = async (bufaloData, token) => {
  try {
    console.log("➕ Criando novo búfalo...");
    console.log("📦 Dados enviados:", bufaloData);

    const response = await apiFetch("/bufalos", {
      method: "POST",
      token,
      data: bufaloData, 
    });

    console.log("✅ Búfalo criado com sucesso:", response);
    return response;
  } catch (error) {
    console.error("❌ Erro ao criar búfalo:", error);
    console.error("📝 Detalhes do erro:", {
      message: error.message,
      stack: error.stack,
      status: error.status,
    });
    throw error;
  }
};

const bufaloService = {
  listarBufalos,
  getBufaloById,
  createBufalo,
};

export default bufaloService;
