import axios from "axios";
import 'dotenv/config'; // Certifique-se de carregar as variáveis de ambiente

console.log("API_URL:", process.env.NEXT_PUBLIC_API_URL); // Adicione esta linha para depuração

// Cria o cliente Axios
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000, // timeout aumentado para 60s
});

// Interceptor de requisição: adiciona token JWT se existir
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;

    console.log(`[API] ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de resposta: tratamento global de erros
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(
        `[API] Erro ${error.response.status} em ${error.config.url}:`,
        error.response.data
      );

      if (error.response.status === 401) {
        const token = localStorage.getItem("token");
        if (token) {
          localStorage.removeItem("token");
          window.location.href = "/auth/login";
        }
        // Se não há token, não redireciona (ex: tentativa de login com senha errada)
      }
    } else {
      console.error("[API] Erro de rede:", error.message);
    }
    return Promise.reject(error);
  }
);

// Métodos utilitários com assinatura consistente
const get = (url, config = {}) => apiClient.get(url, config);
const post = (url, data = {}, config = {}) => apiClient.post(url, data, config);
const put = (url, data = {}, config = {}) => apiClient.put(url, data, config);
const del = (url, config = {}) => apiClient.delete(url, config);
const patch = (url, data = {}, config = {}) =>
  apiClient.patch(url, data, config);

// Exporta métodos e cliente
export { get, post, put, del, patch };
export default apiClient;
