import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import TranslatedText from "@/components/TranslatedText";
import { getAvailableLanguages } from "@/config/translation";

export default function Configuracoes() {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useAuth();
  const { currentLanguage, changeLanguage, clearCache, isLoading: isTranslating } = useTranslation();
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) return null;

  const handleLanguageChange = async (e) => {
    const newLang = e.target.value;
    
    try {
      await changeLanguage(newLang);
      setStatusMsg("Idioma atualizado com sucesso!");
      setTimeout(() => setStatusMsg(""), 3000);
    } catch (err) {
      setStatusMsg("Falha ao atualizar idioma");
      setTimeout(() => setStatusMsg(""), 3000);
    }
  };

  const handleClearCache = () => {
    clearCache();
    setStatusMsg("Cache de traduções limpo!");
    setTimeout(() => setStatusMsg(""), 3000);
  };

  return (
    <>
      <Head>
        <title>Configurações | Buffs</title>
        <meta name="description" content="Configurações da plataforma Buffs" />
      </Head>

      <div className="p-6">
        <div className="w-full bg-white rounded-xl p-5 box-border border border-[#e0e0e0] shadow-sm max-w-xl">
          <h2 className="text-xl font-bold text-gray-800">
            <TranslatedText>Idioma do sistema</TranslatedText>
          </h2>
          
          <p className="text-sm text-gray-600 mb-3">
            <TranslatedText>Selecione o idioma preferido da interface.</TranslatedText>
          </p>
          
          <div className="w-full mb-4">
            <select
              value={currentLanguage}
              onChange={handleLanguageChange}
              className="border border-[#e0e0e0] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#FFCF78] w-full"
              disabled={isTranslating}
            >
              {getAvailableLanguages().map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Informações sobre tradução */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              <TranslatedText>Sobre as traduções</TranslatedText>
            </h3>
            <p className="text-xs text-blue-700">
              <TranslatedText>
                As traduções são feitas automaticamente usando a API do LibreTranslate. 
                O primeiro acesso pode demorar alguns segundos.
              </TranslatedText>
            </p>
          </div>

          {/* Botão para limpar cache */}
          <div className="mb-4">
            <button
              onClick={handleClearCache}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm transition-colors"
              disabled={isTranslating}
            >
              <TranslatedText>Limpar cache de traduções</TranslatedText>
            </button>
          </div>

          {/* Status */}
          {statusMsg && (
            <div className="inline-block mt-3 text-sm font-medium text-gray-700 bg-green-100 px-3 py-2 rounded-lg">
              {statusMsg}
            </div>
          )}

          {/* Indicador de tradução */}
          {isTranslating && (
            <div className="mt-3 text-sm text-blue-600 flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              <TranslatedText>Traduzindo interface...</TranslatedText>
            </div>
          )}
        </div>
      </div>
    </>
  );
}


