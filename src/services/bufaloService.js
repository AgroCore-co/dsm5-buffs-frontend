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

const bufaloService = {
  listarBufalos,
};

export default bufaloService;
