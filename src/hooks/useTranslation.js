import { useState, useEffect, useCallback } from 'react';
import translationService from '@/services/translationService';

export const useTranslation = () => {
  const [currentLanguage, setCurrentLanguage] = useState('pt-BR');
  const [translations, setTranslations] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Carrega o idioma salvo do localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("userSettings");
      const parsed = raw ? JSON.parse(raw) : null;
      const storedLang = parsed?.preferences?.language ?? parsed?.language ?? "pt-BR";
      setCurrentLanguage(storedLang);
    } catch (e) {
      setCurrentLanguage("pt-BR");
    }
  }, []);

  // Função para traduzir um texto
  const t = useCallback(async (text, fallbackText = null) => {
    if (!text || currentLanguage === 'pt-BR') {
      return fallbackText || text;
    }

    // Se já temos a tradução, retorna ela
    if (translations[text]) {
      return translations[text];
    }

    try {
      setIsLoading(true);
      const targetLang = translationService.getLanguageCode(currentLanguage);
      const translatedText = await translationService.translateText(text, targetLang, 'pt');
      
      // Salva a tradução no estado
      setTranslations(prev => ({
        ...prev,
        [text]: translatedText
      }));
      
      return translatedText;
    } catch (error) {
      console.error('Erro na tradução:', error);
      return fallbackText || text;
    } finally {
      setIsLoading(false);
    }
  }, [currentLanguage, translations]);

  // Função para traduzir múltiplos textos
  const translateMultiple = useCallback(async (texts) => {
    if (currentLanguage === 'pt-BR') {
      return texts;
    }

    try {
      setIsLoading(true);
      const targetLang = translationService.getLanguageCode(currentLanguage);
      const translatedTexts = await translationService.translateMultipleTexts(texts, targetLang, 'pt');
      
      // Salva as traduções no estado
      const newTranslations = {};
      texts.forEach((text, index) => {
        newTranslations[text] = translatedTexts[index];
      });
      
      setTranslations(prev => ({
        ...prev,
        ...newTranslations
      }));
      
      return translatedTexts;
    } catch (error) {
      console.error('Erro na tradução múltipla:', error);
      return texts;
    } finally {
      setIsLoading(false);
    }
  }, [currentLanguage]);

  // Função para alterar o idioma
  const changeLanguage = useCallback(async (newLanguage) => {
    setCurrentLanguage(newLanguage);
    
    // Salva no localStorage
    try {
      const raw = localStorage.getItem("userSettings");
      const parsed = raw ? JSON.parse(raw) : {};
      const next = {
        ...parsed,
        preferences: { ...(parsed.preferences || {}), language: newLanguage },
        language: newLanguage,
      };
      localStorage.setItem("userSettings", JSON.stringify(next));
    } catch (err) {
      console.error('Erro ao salvar idioma:', err);
    }

    // Limpa o cache de traduções ao mudar o idioma
    if (newLanguage !== 'pt-BR') {
      setTranslations({});
    }
  }, []);

  // Função para limpar o cache
  const clearCache = useCallback(() => {
    translationService.clearCache();
    setTranslations({});
  }, []);

  return {
    currentLanguage,
    t,
    translateMultiple,
    changeLanguage,
    clearCache,
    isLoading,
    isPortuguese: currentLanguage === 'pt-BR'
  };
};
