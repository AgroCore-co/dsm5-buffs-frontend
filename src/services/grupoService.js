import { apiFetch } from "@/lib/apiClient";

/**
 * Lista todos os grupos de búfalos.
 *
 * @param {string} token - JWT do usuário autenticado
 * @returns {Promise<Array>} - Lista de grupos
 */
const listarGrupos = async (token) => {
  try {
    console.log("🔍 Iniciando busca de grupos...");
    console.log("🔑 Token fornecido:", token ? "Sim" : "Não");
    console.log("🌐 URL base:", process.env.NEXT_PUBLIC_API_URL);

    const response = await apiFetch("/grupos", {
      method: "GET",
      token,
    });

    console.log("✅ Lista de grupos recebida:", response);
    if (Array.isArray(response)) {
      console.log(`📊 Total de ${response.length} grupos recebidos`);
    } else {
      console.warn("⚠️ Resposta não é um array:", typeof response);
    }

    return response;
  } catch (error) {
    console.error("❌ Erro ao listar grupos:", error);
    console.error("📝 Detalhes do erro:", {
      message: error.message,
      stack: error.stack,
      status: error.status,
    });
    throw error;
  }
};

const grupoService = {
  listarGrupos,
};

export default grupoService;
