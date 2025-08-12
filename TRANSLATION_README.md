# Sistema de Tradução Dinâmica - Buffs Frontend

Este projeto implementa um sistema de tradução dinâmica usando a API do [LibreTranslate](https://libretranslate.com), permitindo que a interface seja traduzida automaticamente para diferentes idiomas.

## 🚀 Como Funciona

O sistema funciona da seguinte forma:

1. **Texto Base**: Todo o texto da interface é escrito em português (pt-BR)
2. **Tradução Automática**: Quando o usuário seleciona outro idioma, o sistema usa a API do LibreTranslate para traduzir automaticamente
3. **Cache Inteligente**: As traduções são armazenadas em cache para melhor performance
4. **Fallback**: Em caso de erro na API, o sistema volta ao texto original

## 📁 Estrutura dos Arquivos

```
src/
├── services/
│   └── translationService.js    # Serviço principal de tradução
├── hooks/
│   └── useTranslation.js        # Hook personalizado para traduções
├── components/
│   └── TranslatedText.js        # Componente React para texto traduzido
└── examples/
    └── TranslationExample.js    # Exemplos de uso
```

## 🛠️ Como Usar

### 1. Usando o Componente TranslatedText (RECOMENDADO)

```jsx
import TranslatedText from '@/components/TranslatedText';

function MinhaPagina() {
  return (
    <div>
      <h1>
        <TranslatedText>Dashboard</TranslatedText>
      </h1>
      
      <p>
        <TranslatedText>
          Bem-vindo à plataforma Buffs
        </TranslatedText>
      </p>
      
      <button>
        <TranslatedText>Ver relatórios</TranslatedText>
      </button>
    </div>
  );
}
```

### 2. Usando o Hook useTranslation

```jsx
import { useTranslation } from '@/hooks/useTranslation';

function MinhaPagina() {
  const { t, currentLanguage, isLoading } = useTranslation();
  const [translatedTitle, setTranslatedTitle] = useState('Dashboard');

  useEffect(() => {
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
```

### 3. Traduzindo Múltiplos Textos

```jsx
import { useTranslation } from '@/hooks/useTranslation';

function MinhaPagina() {
  const { translateMultiple, currentLanguage } = useTranslation();
  const [texts, setTexts] = useState({
    title: 'Dashboard',
    subtitle: 'Painel de controle'
  });

  useEffect(() => {
    const translateAll = async () => {
      if (currentLanguage === 'pt-BR') return;
      
      const originalTexts = ['Dashboard', 'Painel de controle'];
      const translated = await translateMultiple(originalTexts);
      
      setTexts({
        title: translated[0],
        subtitle: translated[1]
      });
    };
    
    translateAll();
  }, [translateMultiple, currentLanguage]);

  return (
    <div>
      <h1>{texts.title}</h1>
      <p>{texts.subtitle}</p>
    </div>
  );
}
```

## ⚙️ Configurações

### Idiomas Suportados

- **pt-BR**: Português (Brasil) - Idioma base
- **en-US**: Inglês (Estados Unidos)
- **es-ES**: Espanhol

### Adicionando Novos Idiomas

Para adicionar um novo idioma:

1. Adicione a opção no select da página de configurações
2. O sistema automaticamente detectará o código do idioma (ex: `fr-FR` → `fr`)

## 🔧 Funcionalidades

### Cache de Traduções
- As traduções são armazenadas em memória para evitar chamadas repetidas à API
- O cache é limpo automaticamente ao mudar o idioma
- Botão manual para limpar o cache na página de configurações

### Indicadores de Loading
- Mostra "Traduzindo..." enquanto a tradução está em andamento
- Indicador visual com spinner na página de configurações

### Tratamento de Erros
- Em caso de falha na API, retorna o texto original
- Logs de erro no console para debugging

## 📱 Página de Configurações

A página de configurações (`/configuracoes`) inclui:

- Seletor de idioma
- Informações sobre o sistema de tradução
- Botão para limpar cache
- Indicadores de status
- Loading visual durante traduções

## 🚨 Limitações e Considerações

### API LibreTranslate
- **Gratuita**: A API pública tem limites de uso
- **Offline**: Pode ser hospedada localmente para uso em produção
- **Latência**: Primeira tradução pode demorar alguns segundos

### Performance
- Cache reduz chamadas à API
- Traduções são feitas sob demanda
- Considerar implementar traduções estáticas para textos muito comuns

## 🔮 Melhorias Futuras

1. **Traduções Estáticas**: Arquivos de tradução para textos comuns
2. **Hospedagem Local**: Instalar LibreTranslate no servidor
3. **Mais Idiomas**: Suporte para francês, alemão, etc.
4. **Tradução de Arquivos**: Suporte para traduzir documentos
5. **Histórico**: Manter histórico de traduções do usuário

## 📚 Exemplos Completos

Veja o arquivo `src/examples/TranslationExample.js` para exemplos completos de todas as funcionalidades.

## 🆘 Suporte

Em caso de problemas:

1. Verifique o console do navegador para erros
2. Teste a conectividade com a API do LibreTranslate
3. Limpe o cache de traduções
4. Verifique se o idioma está sendo salvo corretamente no localStorage
