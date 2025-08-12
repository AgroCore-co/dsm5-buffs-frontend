import { TRANSLATION_CONFIG } from '@/config/translation';

class TranslationService {
  constructor() {
    this.cache = new Map();
    this.baseLanguage = TRANSLATION_CONFIG.BASE_LANGUAGE;
    this.cacheExpiry = new Map();
  }

  // Traduz um texto usando a API do LibreTranslate
  async translateText(text, targetLang, sourceLang = 'auto') {
    if (!text || text.trim() === '') return text;
    
    // Verifica se já temos a tradução em cache e se ainda é válida
    const cacheKey = `${text}_${targetLang}`;
    if (this.cache.has(cacheKey)) {
      const expiry = this.cacheExpiry.get(cacheKey);
      if (expiry && Date.now() < expiry) {
        return this.cache.get(cacheKey);
      }
      // Cache expirado, remove
      this.cache.delete(cacheKey);
      this.cacheExpiry.delete(cacheKey);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TRANSLATION_CONFIG.API.TIMEOUT);

      const response = await fetch(TRANSLATION_CONFIG.API.URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: sourceLang,
          target: targetLang,
          format: 'text'
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.json();
      const translatedText = data.translatedText;

      // Salva no cache com TTL
      this.cache.set(cacheKey, translatedText);
      this.cacheExpiry.set(cacheKey, Date.now() + TRANSLATION_CONFIG.CACHE.TTL);
      
      // Limpa cache se exceder tamanho máximo
      if (this.cache.size > TRANSLATION_CONFIG.CACHE.MAX_SIZE) {
        this.clearCache();
      }
      
      return translatedText;
    } catch (error) {
      console.error('Erro na tradução:', error);
      // Retorna o texto original em caso de erro
      return text;
    }
  }

  // Traduz múltiplos textos de uma vez
  async translateMultipleTexts(texts, targetLang, sourceLang = 'auto') {
    const promises = texts.map(text => this.translateText(text, targetLang, sourceLang));
    return Promise.all(promises);
  }

  // Limpa o cache
  clearCache() {
    this.cache.clear();
    this.cacheExpiry.clear();
  }

  // Obtém o código de idioma para a API (converte pt-BR para pt, en-US para en, etc.)
  getLanguageCode(locale) {
    return locale.split('-')[0];
  }
}

export const translationService = new TranslationService();
export default translationService;
