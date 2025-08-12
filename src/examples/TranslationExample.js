import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import TranslatedText from '@/components/TranslatedText';

// Exemplo 1: Usando o hook useTranslation diretamente
export function ExampleWithHook() {
  const { t, currentLanguage, isLoading } = useTranslation();
  const [translatedTitle, setTranslatedTitle] = React.useState('Dashboard');

  React.useEffect(() => {
    const translateTitle = async () => {
      const translated = await t('Dashboard', 'Dashboard');
      setTranslatedTitle(translated);
    };
    
    if (currentLanguage !== 'pt-BR') {
      translateTitle();
    }
  }, [t, currentLanguage]);

  return (
    <div>
      <h1>{translatedTitle}</h1>
      {isLoading && <span>Traduzindo...</span>}
    </div>
  );
}

// Exemplo 2: Usando o componente TranslatedText (RECOMENDADO)
export function ExampleWithComponent() {
  return (
    <div>
      <h1>
        <TranslatedText>Dashboard</TranslatedText>
      </h1>
      
      <p>
        <TranslatedText>
          Bem-vindo ao painel de controle da plataforma Buffs
        </TranslatedText>
      </p>
      
      <button>
        <TranslatedText>Ver relatórios</TranslatedText>
      </button>
    </div>
  );
}

// Exemplo 3: Traduzindo múltiplos textos de uma vez
export function ExampleMultipleTranslations() {
  const { translateMultiple, currentLanguage } = useTranslation();
  const [translatedTexts, setTranslatedTexts] = React.useState({
    title: 'Dashboard',
    subtitle: 'Painel de controle',
    button: 'Ver relatórios'
  });

  React.useEffect(() => {
    const translateAll = async () => {
      if (currentLanguage === 'pt-BR') return;
      
      const texts = ['Dashboard', 'Painel de controle', 'Ver relatórios'];
      const translated = await translateMultiple(texts);
      
      setTranslatedTexts({
        title: translated[0],
        subtitle: translated[1],
        button: translated[2]
      });
    };
    
    translateAll();
  }, [translateMultiple, currentLanguage]);

  return (
    <div>
      <h1>{translatedTexts.title}</h1>
      <p>{translatedTexts.subtitle}</p>
      <button>{translatedTexts.button}</button>
    </div>
  );
}

// Exemplo 4: Traduzindo com fallback
export function ExampleWithFallback() {
  return (
    <div>
      <h1>
        <TranslatedText fallback="Dashboard">
          Dashboard
        </TranslatedText>
      </h1>
      
      <p>
        <TranslatedText fallback="Welcome to Buffs platform">
          Bem-vindo à plataforma Buffs
        </TranslatedText>
      </p>
    </div>
  );
}

// Exemplo 5: Traduzindo elementos HTML
export function ExampleWithHTML() {
  return (
    <div>
      <h1>
        <TranslatedText as="h1" className="text-2xl font-bold">
          Dashboard
        </TranslatedText>
      </h1>
      
      <div>
        <TranslatedText as="p" className="text-gray-600">
          Este é um parágrafo traduzido
        </TranslatedText>
      </div>
    </div>
  );
}
