// src/contexts/PropertyContext.js
import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import propriedadeService from "@/services/propriedadeService";
import { supabase } from "@/lib/supabaseClient";

export const PropertyContext = createContext(null);

const LS_SELECTED_ID = "selectedPropertyId";

// --- Dedup só em DESENVOLVIMENTO (evita duplicidade do StrictMode/HMR) ---
const DEV_SKIP_DUP_MS = 2000;
let __dev_lastUserId = null;
let __dev_lastLoadAt = 0;
// -------------------------------------------------------------------------

export const PropertyProvider = ({ children }) => {
  const [propriedades, setPropriedades] = useState([]); // lista do usuário
  const [propriedadeSelecionada, setPropriedadeSelecionada] = useState(null); // objeto selecionado
  const [selectedId, setSelectedId] = useState(null); // id da selecionada (persistido)
  const [loadingPropriedade, setLoadingPropriedade] = useState(false);
  const [erroPropriedade, setErroPropriedade] = useState("");

  // evita chamadas concorrentes/duplicadas
  const inFlightRef = useRef(false);

  const carregarPropriedades = useCallback(async () => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setLoadingPropriedade(true);
    setErroPropriedade("");

    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw new Error(error.message || "Falha ao obter sessão");
      const token = data.session?.access_token;
      const userId = data.session?.user?.id || "anon";

      // Guard de DEV: ignora carregamentos duplicados do mesmo user numa janela curta
      if (process.env.NODE_ENV === "development") {
        const now = Date.now();
        if (__dev_lastUserId === userId && now - __dev_lastLoadAt < DEV_SKIP_DUP_MS) {
          if (process.env.NODE_ENV !== "production") {
          }
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
        console.log("✅ Propriedades carregadas:", arr);
      }
      setPropriedades(arr);

      // 1) tenta restaurar seleção prévia do localStorage
      let nextId = selectedId;
      if (typeof window !== "undefined" && nextId == null) {
        const saved = localStorage.getItem(LS_SELECTED_ID);
        if (saved) nextId = Number(saved);
      }

      // 2) se não houver selecionada OU id salvo não existe mais, selecione a primeira
      const exists =
        nextId && arr.some((p) => Number(p.id_propriedade) === Number(nextId));
      if (!exists) {
        nextId = arr.length ? Number(arr[0].id_propriedade) : null;
      }

      // 3) aplica seleção final
      if (nextId) {
        setSelectedId(nextId);
        if (typeof window !== "undefined")
          localStorage.setItem(LS_SELECTED_ID, String(nextId));
        const found =
          arr.find((p) => Number(p.id_propriedade) === Number(nextId)) || null;
        setPropriedadeSelecionada(found);

        if (found && process.env.NODE_ENV !== "production") {
          console.log("✅ Propriedade selecionada automaticamente:", {
            id: found.id_propriedade,
            nome: found.nome,
            cnpj: found.cnpj,
          });
        }
      } else {
        setSelectedId(null);
        setPropriedadeSelecionada(null);
        if (typeof window !== "undefined") localStorage.removeItem(LS_SELECTED_ID);
      }
    } catch (e) {
      setErroPropriedade(e?.message || "Erro ao carregar propriedades.");
      setPropriedades([]);
      setSelectedId(null);
      setPropriedadeSelecionada(null);
    } finally {
      setLoadingPropriedade(false);
      inFlightRef.current = false;
    }
  }, [selectedId]);

  // Seleção manual exposta no contexto
  const selectProperty = useCallback(
    (id) => {
      setSelectedId(id ?? null);
      if (!id) {
        setPropriedadeSelecionada(null);
        if (typeof window !== "undefined") localStorage.removeItem(LS_SELECTED_ID);
        return;
      }
      if (typeof window !== "undefined")
        localStorage.setItem(LS_SELECTED_ID, String(id));
      const found =
        propriedades.find((p) => Number(p.id_propriedade) === Number(id)) ||
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

  // Log sempre que a selecionada mudar
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
      {children}
    </PropertyContext.Provider>
  );
};
