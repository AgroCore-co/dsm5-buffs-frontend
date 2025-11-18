import axios from "axios";
// import 'dotenv/config'; // Desnecessário no Next.js

// Configuração de Cache e TTL
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos
const LOCAL_CACHE_KEY = "apiClientCache_v1";

// --- OTIMIZAÇÃO 1: Cache em Memória & Controle de Escrita ---
let memoryCache = null;
let activeRequests = new Map(); // Deduplicação
let saveTimeout = null; // Para o Debounce

// Inicializa o cache
const loadCacheToMemory = () => {
  if (memoryCache) return memoryCache;
  if (typeof window === "undefined") return {};

  try {
    const raw = localStorage.getItem(LOCAL_CACHE_KEY);
    memoryCache = raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.warn("Erro ao carregar cache:", e);
    memoryCache = {};
  }
  return memoryCache;
};

// --- OTIMIZAÇÃO 2: Garbage Collection ---
// Remove itens expirados para não estourar o limite de 5MB do localStorage
const pruneExpiredCache = () => {
  if (!memoryCache) return;
  const now = Date.now();
  // Tolerância de 2x o TTL antes de deletar definitivamente
  const MAX_AGE = DEFAULT_TTL * 2; 

  Object.keys(memoryCache).forEach(key => {
    if (now - memoryCache[key].timestamp > MAX_AGE) {
      delete memoryCache[key];
    }
  });
};

// --- OTIMIZAÇÃO 3: Escrita Assíncrona (Debounce) ---
// Evita travar a UI salvando no disco a cada requisição. 
// Espera 2 segundos de inatividade nas requisições para salvar.
const scheduleSaveToDisk = () => {
  if (typeof window === "undefined" || !memoryCache) return;
  
  if (saveTimeout) clearTimeout(saveTimeout);
  
  saveTimeout = setTimeout(() => {
    pruneExpiredCache(); // Limpa lixo antes de salvar
    try {
      localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(memoryCache));
    } catch (e) {
      // Se quota excedida, tenta limpar tudo para recuperar
      console.warn("Storage quota excedida. Resetando cache.", e);
      memoryCache = {};
      try { localStorage.removeItem(LOCAL_CACHE_KEY); } catch {}
    }
  }, 2000);
};

// --- Correção de URL Base ---
// Remove a barra final se existir para evitar // duplas (ex: localhost:3000//api)
const getBaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

// --- Configuração do Axios ---
const apiClient = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

// Interceptores
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      
      // --- CORREÇÃO: Filtro de rotas públicas ---
      // Não envia token para login/signin/register para evitar problemas de CORS
      // se o servidor não esperar Authorization nessas rotas.
      const isPublicRoute = config.url && (
        config.url.includes('/auth/signin') || 
        config.url.includes('/auth/login') ||
        config.url.includes('/auth/register')
      );

      if (token && !isPublicRoute) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    if (process.env.NODE_ENV === 'development') {
       console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(
        `[API] Erro ${error.response.status} em ${error.config?.url}:`,
        error.response.data
      );

      if (error.response.status === 401) {
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("token");
          if (token) {
            localStorage.removeItem("token");
            // Redireciona apenas se não estivermos já na página de login
            if (!window.location.pathname.includes('/auth/')) {
               window.location.href = "/auth/login";
            }
          }
        }
      }
    } else {
      console.error("[API] Erro de rede ou CORS:", error.message);
    }
    return Promise.reject(error);
  }
);

// --- Função PEEK (Espiar) ---
const peek = (url, config = {}, ttl = DEFAULT_TTL) => {
  const { forceRefresh, ...axiosConfig } = config;
  
  const cacheKey = `${url}_${JSON.stringify(axiosConfig)}`;
  const cache = loadCacheToMemory();
  const cachedItem = cache[cacheKey];
  const now = Date.now();

  if (cachedItem && (now - cachedItem.timestamp < ttl)) {
    return cachedItem.data;
  }
  return null;
};

// --- Função GET Inteligente ---
const get = async (url, config = {}, ttl = DEFAULT_TTL) => {
  const { forceRefresh, ...axiosConfig } = config;
  
  const cacheKey = `${url}_${JSON.stringify(axiosConfig)}`;
  const now = Date.now();

  const cache = loadCacheToMemory();
  const cachedItem = cache[cacheKey];

  if (!forceRefresh && cachedItem && (now - cachedItem.timestamp < ttl)) {
    return Promise.resolve({ data: cachedItem.data, fromCache: true, status: 200 });
  }

  if (activeRequests.has(cacheKey)) {
    return activeRequests.get(cacheKey);
  }

  const requestPromise = apiClient.get(url, axiosConfig)
    .then((res) => {
      memoryCache[cacheKey] = { 
        data: res.data, 
        timestamp: Date.now() 
      };
      scheduleSaveToDisk();
      return res;
    })
    .finally(() => {
      activeRequests.delete(cacheKey);
    });

  activeRequests.set(cacheKey, requestPromise);

  return requestPromise;
};

// Outros métodos
const post = (url, data = {}, config = {}) => apiClient.post(url, data, config);
const put = (url, data = {}, config = {}) => apiClient.put(url, data, config);
const del = (url, config = {}) => apiClient.delete(url, config);
const patch = (url, data = {}, config = {}) => apiClient.patch(url, data, config);

export { get, post, put, del, patch, peek };
export default apiClient;