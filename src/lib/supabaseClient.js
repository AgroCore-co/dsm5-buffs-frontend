import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,     // Persiste a sessão no localStorage
      autoRefreshToken: true,   // Atualiza automaticamente o token da sessão 
      storageKey: "sb-auth-token", // Chave para armazenar o token da sessão
      detectSessionInUrl: true, // Detecta tokens de autenticação na URL
      flowType: 'pkce',         // Usa PKCE para maior segurança
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
    global: {
      headers: {
        'X-Client-Info': 'dsm5-buffs-frontend',
      },
    },
  }
);
