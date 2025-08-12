import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

const TranslatedText = ({ 
  children, 
  fallback = null, 
  className = "", 
  as: Component = "span",
  ...props 
}) => {
  const { t, currentLanguage, isLoading } = useTranslation();
  const [translatedText, setTranslatedText] = useState(children);

  useEffect(() => {
    const translateText = async () => {
      if (currentLanguage === 'pt-BR') {
        setTranslatedText(children);
        return;
      }

      try {
        const translated = await t(children, fallback);
        setTranslatedText(translated);
      } catch (error) {
        console.error('Erro ao traduzir texto:', error);
        setTranslatedText(fallback || children);
      }
    };

    translateText();
  }, [children, currentLanguage, t, fallback]);

  // Mostra loading apenas se estiver traduzindo e não for português
  const showLoading = isLoading && currentLanguage !== 'pt-BR';

  return (
    <Component 
      className={className} 
      {...props}
      title={showLoading ? "Traduzindo..." : undefined}
    >
      {showLoading ? (
        <span className="opacity-60 italic">Traduzindo...</span>
      ) : (
        translatedText
      )}
    </Component>
  );
};

export default TranslatedText;
