import { SupabaseAuth } from "@/utils/supabaseApi"

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
export const apiFetch = async (
  endpoint,
  { method = "GET", data = null, token = null } = {}
) => {
  try {
    // garante token
    if (!token) {
      token = await SupabaseAuth.getAccessToken()
      console.log("🔑 Token obtido:", token ? "✅ presente" : "❌ ausente")
      if (!token) {
        throw new Error("Usuário não autenticado.")
      }
    }

    // valida URL
    if (!process.env.NEXT_PUBLIC_API_URL) {
      throw new Error("URL da API não configurada")
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")}/${endpoint.replace(
      /^\//,
      ""
    )}`

    console.log("🌍 Chamando:", url, "| Método:", method)

    // requisição
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: data ? JSON.stringify(data) : undefined,
    }).catch((err) => {
      console.error("🚨 Falha de rede ou CORS:", err.message)
      throw new Error("Não foi possível conectar à API.")
    })

    // tenta parsear JSON
    let json = {}
    try {
      json = await response.json()
    } catch (error) {
      console.warn("⚠️ Resposta não veio em JSON válido")
    }

    // trata erro HTTP
    if (!response.ok) {
      const err = new Error(json.message || `Erro ${response.status}`)
      err.status = response.status
      throw err
    }

    return json
  } catch (error) {
    console.error("❌ Erro em apiFetch:", error.message)
    throw error
  }
}

const apiClient = { apiFetch }
export default apiClient
