import { supabase } from "@/lib/supabaseClient";

/**
 * Utilitário para autenticação com Supabase
 */
export class SupabaseAuth {
  /**
   * Faz login com email e senha
   */
  static async login(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error("Erro no login:", error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Faz logout do usuário
   */
  static async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Erro no logout:", error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtém a sessão atual
   */
  static async getSession() {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) throw error;
      return { success: true, session };
    } catch (error) {
      console.error("Erro ao obter sessão:", error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtém o token de acesso atual
   */
  static async getAccessToken() {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) throw error;
      return session?.access_token || null;
    } catch (error) {
      console.error("Erro ao obter token de acesso:", error.message);
      return null;
    }
  }
}
