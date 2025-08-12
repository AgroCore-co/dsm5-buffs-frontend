// Configurações do sistema de tradução
export const TRANSLATION_CONFIG = {
  // API do LibreTranslate
  API_URL: 'https://libretranslate.com/translate',
  
  // Idioma base da aplicação
  BASE_LANGUAGE: 'pt-BR',
  
  // Idiomas suportados
  SUPPORTED_LANGUAGES: {
    'pt-BR': {
      name: 'Português (Brasil)',
      code: 'pt',
      flag: '🇧🇷',
      isBase: true
    },
    'en-US': {
      name: 'English (US)',
      code: 'en',
      flag: '🇺🇸',
      isBase: false
    },
    'es-ES': {
      name: 'Español',
      code: 'es',
      flag: '🇪🇸',
      isBase: false
    }
  },
  
  // Configurações de cache
  CACHE: {
    // Tempo de vida do cache em milissegundos (5 minutos)
    TTL: 5 * 60 * 1000,
    // Tamanho máximo do cache
    MAX_SIZE: 1000
  },
  
  // Configurações da API
  API: {
    // Timeout da requisição em milissegundos (10 segundos)
    TIMEOUT: 10000,
    // Número máximo de tentativas
    MAX_RETRIES: 3,
    // Delay entre tentativas em milissegundos
    RETRY_DELAY: 1000
  },
  
  // Textos padrão para loading e erros
  UI: {
    LOADING: 'Traduzindo...',
    ERROR: 'Erro na tradução',
    CACHE_CLEARED: 'Cache limpo',
    LANGUAGE_CHANGED: 'Idioma alterado'
  }
};

// Função para obter configuração de idioma
export const getLanguageConfig = (locale) => {
  return TRANSLATION_CONFIG.SUPPORTED_LANGUAGES[locale] || TRANSLATION_CONFIG.SUPPORTED_LANGUAGES[TRANSLATION_CONFIG.BASE_LANGUAGE];
};

// Função para verificar se um idioma é suportado
export const isLanguageSupported = (locale) => {
  return Object.keys(TRANSLATION_CONFIG.SUPPORTED_LANGUAGES).includes(locale);
};

// Função para obter lista de idiomas disponíveis
export const getAvailableLanguages = () => {
  return Object.entries(TRANSLATION_CONFIG.SUPPORTED_LANGUAGES).map(([code, config]) => ({
    code,
    ...config
  }));
};
