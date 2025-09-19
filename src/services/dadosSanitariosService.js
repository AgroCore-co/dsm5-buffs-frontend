import { apiFetch } from "@/lib/apiClient";

/**
 * Lista todos os dados sanitários de um búfalo específico.
 *
 * @param {number} idBufalo - ID do búfalo
 * @param {string} token - JWT do usuário autenticado
 * @returns {Promise<Array>} - Lista de registros sanitários
 */
const listarDadosSanitariosPorBufalo = async (idBufalo, token) => {
  try {
    console.log(`🔍 Buscando dados sanitários do búfalo ID ${idBufalo}...`);
    console.log(`🔑 Token disponível: ${token ? 'Sim' : 'Não'}`);
    console.log(`🌐 URL da API: ${process.env.NEXT_PUBLIC_API_URL}`);

    const response = await apiFetch(`/dados-sanitarios/bufalo/${idBufalo}`, {
      method: "GET",
      token,
    });

    console.log("✅ Dados sanitários recebidos:", response);
    console.log(`📊 Total de registros: ${Array.isArray(response) ? response.length : 'N/A'}`);
    return response;
  } catch (error) {
    console.error(
      `❌ Erro ao buscar dados sanitários do búfalo ID ${idBufalo}:`,
      error
    );
    console.error(`📝 Detalhes do erro:`, {
      message: error.message,
      status: error.status,
      stack: error.stack
    });
    throw error;
  }
};

const dadosSanitariosService = {
  listarDadosSanitariosPorBufalo,
};

export default dadosSanitariosService;
