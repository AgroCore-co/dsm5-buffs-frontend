// src/contexts/PropertyContext.js
import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import propriedadeService from "../services/propriedadeService";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../hooks/useAuth";

export const PropertyContext = createContext();

const LS_SELECTED_ID = "selectedPropertyId";
const DEV_SKIP_DUP_MS = 2000;
let __dev_lastUserId = null;
let __dev_lastLoadAt = 0;

const PropertyProvider = ({ children }) => {
  const [propriedades, setPropriedades] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [propriedadeSelecionada, setPropriedadeSelecionada] = useState(null);
  const [loadingPropriedade, setLoadingPropriedade] = useState(false);
  const [erroPropriedade, setErroPropriedade] = useState("");
  const inFlightRef = useRef(false);
  const { isAuthenticated, needsProfile, authLoading, userProfile, getAccessToken } = useAuth();

  const selectProperty = useCallback(
    (id) => {
      const idStr = id != null ? String(id) : null;
      setSelectedId(idStr);
      if (!idStr) {
        setPropriedadeSelecionada(null);
        if (typeof window !== "undefined") localStorage.removeItem(LS_SELECTED_ID);
        if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
          console.log("[DEBUG] Removendo selectedPropertyId do localStorage");
        }
        return;
      }
      if (typeof window !== "undefined") {
        localStorage.setItem(LS_SELECTED_ID, idStr);
        if (process.env.NODE_ENV !== "production") {
          console.log("[DEBUG] Salvando selectedPropertyId no localStorage:", idStr);
        }
      }
      const found =
        propriedades.find((p) => String(p.id_propriedade) === idStr) ||
        null;
      setPropriedadeSelecionada(found);
      if (found && process.env.NODE_ENV !== "production") {
        console.log("🟢 Propriedade selecionada manualmente:", {
          id: found.id_propriedade,
          nome: found.nome,
          cnpj: found.cnpj,
        });
      }
    },
    [propriedades]
  );
  const carregarPropriedades = useCallback(async () => {
    if (inFlightRef.current) return;
    // Não carrega propriedades se não houver perfil de usuário válido
    if (!isAuthenticated || needsProfile || authLoading || !userProfile || !userProfile.id) {
      setPropriedades([]);
      setSelectedId(null);
      setPropriedadeSelecionada(null);
      if (typeof window !== "undefined") localStorage.removeItem(LS_SELECTED_ID);
      return;
    }
    inFlightRef.current = true;
    setLoadingPropriedade(true);
    setErroPropriedade("");
    try {
      // Obtém o token usando o mesmo método do useAuth
      const token = await (typeof getAccessToken === "function" ? getAccessToken() : null);
      const userId = userProfile?.id || "anon";
      // Guard de DEV: ignora carregamentos duplicados do mesmo user numa janela curta
      if (process.env.NODE_ENV === "development") {
        const now = Date.now();
        if (__dev_lastUserId === userId && now - __dev_lastLoadAt < DEV_SKIP_DUP_MS) {
          setLoadingPropriedade(false);
          inFlightRef.current = false;
          return;
        }
        __dev_lastUserId = userId;
        __dev_lastLoadAt = now;
      }
      if (!token) {
        setPropriedades([]);
        setSelectedId(null);
        setPropriedadeSelecionada(null);
        if (typeof window !== "undefined") localStorage.removeItem(LS_SELECTED_ID);
        return;
      }
      const lista = await propriedadeService.listarPropriedades(token);
      const arr = Array.isArray(lista) ? lista : [];
      if (process.env.NODE_ENV !== "production") {
        console.log("[DEBUG] IDs das propriedades recebidas:", arr.map(p => p.id_propriedade));
      }
      if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
        console.log("[DEBUG] Valor salvo no localStorage[selectedPropertyId]:", localStorage.getItem(LS_SELECTED_ID));
      }
      if (process.env.NODE_ENV !== "production") {
        console.log("✅ Propriedades carregadas:", arr);
      }
      setPropriedades(arr);

      let nextId = selectedId;
      if (typeof window !== "undefined" && nextId == null) {
        const saved = localStorage.getItem(LS_SELECTED_ID);
        if (saved) nextId = saved;
      }

      // Só seleciona automaticamente se não houver nada salvo
      let found = null;
      if (nextId) {
        found = arr.find((p) => String(p.id_propriedade) === String(nextId)) || null;
        if (process.env.NODE_ENV !== "production") {
          console.log("[DEBUG] Tentando restaurar seleção pelo ID:", nextId, "Encontrado:", !!found);
        }
      }
      if (!nextId && arr.length) {
        // Primeiro acesso: seleciona a primeira
        nextId = String(arr[0].id_propriedade);
        found = arr[0];
        setSelectedId(nextId);
        if (typeof window !== "undefined")
          localStorage.setItem(LS_SELECTED_ID, nextId);
        setPropriedadeSelecionada(found);
        if (found && process.env.NODE_ENV !== "production") {
          console.log("✅ Propriedade selecionada automaticamente:", {
            id: found.id_propriedade,
            nome: found.nome,
            cnpj: found.cnpj,
          });
        }
      } else if (found) {
        setSelectedId(nextId);
        setPropriedadeSelecionada(found);
        if (process.env.NODE_ENV !== "production") {
          console.log("[DEBUG] Seleção restaurada pelo localStorage:", found);
        }
      } else {
        // Não seleciona nada se o ID salvo não existir
        setSelectedId(null);
        setPropriedadeSelecionada(null);
        if (typeof window !== "undefined") localStorage.removeItem(LS_SELECTED_ID);
        if (process.env.NODE_ENV !== "production") {
          console.log("[DEBUG] Nenhuma propriedade selecionada após verificação de localStorage.");
        }
      }
    } catch (e) {
      setErroPropriedade(e?.message || "Erro ao carregar propriedades.");
      setPropriedades([]);
      setSelectedId(null);
      setPropriedadeSelecionada(null);
    } finally {
      setLoadingPropriedade(false);
    }
  }, [selectedId, isAuthenticated, needsProfile, authLoading, userProfile]);
  // Remove duplicidade da definição de selectProperty
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (propriedadeSelecionada) {
      console.log("🎯 Propriedade atualmente selecionada:", {
        id: propriedadeSelecionada.id_propriedade,
        nome: propriedadeSelecionada.nome,
        cnpj: propriedadeSelecionada.cnpj,
      });
    } else {
      console.log("ℹ️ Nenhuma propriedade selecionada.");
    }
  }, [propriedadeSelecionada]);

  // Atualiza objeto selecionado quando a lista mudar (ex.: após refresh)
  useEffect(() => {
    if (!selectedId) {
      setPropriedadeSelecionada(null);
      return;
    }
    const found =
      propriedades.find(
        (p) => Number(p.id_propriedade) === Number(selectedId)
      ) || null;
    setPropriedadeSelecionada(found);
  }, [propriedades, selectedId]);

  // Uma única fonte: eventos de auth do Supabase
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (
        (event === "INITIAL_SESSION" && session) ||
        event === "SIGNED_IN" ||
        event === "TOKEN_REFRESHED"
      ) {
        void carregarPropriedades();
      }
      if (event === "SIGNED_OUT") {
        setPropriedades([]);
        setSelectedId(null);
        setPropriedadeSelecionada(null);
        if (typeof window !== "undefined") localStorage.removeItem(LS_SELECTED_ID);
      }
    });
    return () => sub.subscription?.unsubscribe();
  }, [carregarPropriedades]);

  // Load properties when user completes profile
  useEffect(() => {
    if (isAuthenticated && !needsProfile && !authLoading && userProfile) {
      void carregarPropriedades();
    }
  }, [isAuthenticated, needsProfile, authLoading, userProfile, carregarPropriedades]);

  useEffect(() => {
    console.log("[PropertyProvider] propriedades:", propriedades);
    console.log("[PropertyProvider] selectedId:", selectedId);
    console.log("[PropertyProvider] propriedadeSelecionada:", propriedadeSelecionada);
  }, [propriedades, selectedId, propriedadeSelecionada]);

  return (
    <PropertyContext.Provider
      value={{
        // lista e seleção
        propriedades,
        selectedId,
        propriedadeSelecionada,
        // alias p/ retrocompatibilidade
        propriedade: propriedadeSelecionada,
        // estados
        loadingPropriedade,
        erroPropriedade,
        // ações
        selectProperty,
        refresh: carregarPropriedades,
      }}
    >
      {(!propriedadeSelecionada && propriedades.length > 0) && (
        <div style={{background:'#ffe0e0',color:'#900',padding:'8px',textAlign:'center',zIndex:9999}}>
          Nenhuma propriedade selecionada!
        </div>
      )}
      {children}
    </PropertyContext.Provider>
  );
  // Fim do PropertyProvider
};

export default PropertyProvider;
