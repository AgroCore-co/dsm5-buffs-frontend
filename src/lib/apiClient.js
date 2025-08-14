import { SupabaseAuth } from "@/utils/supabaseApi";

/**
 * Função genérica para fazer requisições à API com token JWT.
 *
 * @param {string} endpoint - Rota da API (ex: "/usuarios")
 * @param {Object} options
 * @param {string} options.method - GET, POST, PUT, DELETE
 * @param {Object} options.data - Dados a serem enviados no body
 * @param {string} options.token - Token JWT do usuário autenticado
 * @returns {Promise<Object>} - Resposta da API em JSON
 */
export const apiFetch = async (endpoint, { method = "GET", data = null, token = null } = {}) => {
  try {
    if (!token) {
      token = await SupabaseAuth.getAccessToken();
      if (!token) throw new Error("Usuário não autenticado.");
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    const json = await response.json().catch(() => ({}));

    if (!response.ok) {
      // Lança erro com status e message
      const err = new Error(json.message || `Erro ${response.status}`);
      err.status = response.status;
      throw err;
    }

    return json;
  } catch (error) {
    console.error("❌ Erro em apiFetch:", error.message);
    throw error;
  }
};

export default { apiFetch };
