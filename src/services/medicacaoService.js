import apiClient from "../lib/apiClient";

/**
 * Serviço para gerenciamento de medicações
 * 
 * Endpoints:
 * - POST /medicamentos - Cria uma nova medicação
 * - GET /medicamentos - Lista todas as medicações
 * - GET /medicamentos/{id} - Busca uma medicação pelo ID
 * - PATCH /medicamentos/{id} - Atualiza uma medicação
 * - DELETE /medicamentos/{id} - Remove uma medicação
 */
const medicacaoService = {
  /**
   * Lista todas as medicações cadastradas
   * @param {string} token - Token de autenticação
   * @returns {Promise<Array>} - Lista de medicações
   */
  listarMedicacoes: async (token) => {
    try {
      // Permitir que o apiClient use o token fornecido OU busque automaticamente do Supabase
      const response = await apiClient.apiFetch("medicamentos", {
        method: "GET",
        token: token || undefined,  // Passar undefined fará apiClient buscar o token
      });
      console.log("✅ Medicações listadas com sucesso");
      return response;
    } catch (error) {
      console.error("🔴 Erro ao listar medicações:", error.status || error.message);
      
      // Verificação específica de erro de autenticação
      if (error.status === 401) {
        console.error("⚠️ Erro de autenticação ao listar medicações");
      }
      
      throw error;
    }
  },

  /**
   * Busca uma medicação pelo ID
   * @param {string} token - Token de autenticação
   * @param {number} id - ID da medicação
   * @returns {Promise<Object>} - Dados da medicação
   */
  obterMedicacao: async (token, id) => {
    try {
      const response = await apiClient.apiFetch(`medicamentos/${id}`, {
        method: "GET",
        token: token || undefined,  // Passar undefined fará apiClient buscar o token
      });
      console.log(`✅ Medicação ${id} obtida com sucesso`);
      return response;
    } catch (error) {
      console.error(`🔴 Erro ao obter medicação ${id}:`, error.status || error.message);
      
      // Verificação de erro específico
      if (error.status === 404) {
        console.error(`⚠️ Medicação ${id} não encontrada`);
      } else if (error.status === 401) {
        console.error("⚠️ Erro de autenticação ao obter medicação");
      }
      
      throw error;
    }
  },

  /**
   * Cria uma nova medicação
   * @param {string} token - Token de autenticação
   * @param {Object} dados - Dados da medicação (tipo_tratamento, medicacao, descricao)
   * @returns {Promise<Object>} - Medicação criada
   */
  criarMedicacao: async (token, dados) => {
    try {
      const response = await apiClient.apiFetch("medicamentos", {
        method: "POST",
        token: token || undefined,  // Passar undefined fará apiClient buscar o token
        data: dados,
      });
      console.log("✅ Medicação criada com sucesso:", dados.medicacao);
      return response;
    } catch (error) {
      console.error("🔴 Erro ao criar medicação:", error.status || error.message);
      
      // Verificação de erro interno do servidor
      if (error.status === 500) {
        console.error("⚠️ Erro interno do servidor ao criar medicação");
      }
      
      throw error;
    }
  },

  /**
   * Atualiza uma medicação existente
   * @param {string} token - Token de autenticação
   * @param {number} id - ID da medicação
   * @param {Object} dados - Dados atualizados (tipo_tratamento, medicacao, descricao)
   * @returns {Promise<Object>} - Medicação atualizada
   */
  atualizarMedicacao: async (token, id, dados) => {
    try {
      // Usando PATCH conforme a documentação, não PUT
      const response = await apiClient.apiFetch(`medicamentos/${id}`, {
        method: "PATCH",
        token: token || undefined,  // Passar undefined fará apiClient buscar o token
        data: dados,
      });
      console.log(`✅ Medicação ${id} atualizada com sucesso`);
      return response;
    } catch (error) {
      console.error(`🔴 Erro ao atualizar medicação ${id}:`, error.status || error.message);
      
      // Verificação de erros específicos
      if (error.status === 404) {
        console.error(`⚠️ Medicação ${id} não encontrada para atualização`);
      } else if (error.status === 500) {
        console.error("⚠️ Erro interno do servidor ao atualizar medicação");
      }
      
      throw error;
    }
  },

  /**
   * Remove uma medicação
   * @param {string} token - Token de autenticação
   * @param {number} id - ID da medicação a ser removida
   * @returns {Promise<Object>} - Resposta da remoção
   */
  deletarMedicacao: async (token, id) => {
    try {
      const response = await apiClient.apiFetch(`medicamentos/${id}`, {
        method: "DELETE",
        token: token || undefined,  // Passar undefined fará apiClient buscar o token
      });
      console.log(`✅ Medicação ${id} removida com sucesso`);
      return response;
    } catch (error) {
      console.error(`🔴 Erro ao deletar medicação ${id}:`, error.status || error.message);
      
      // Verificação de erros específicos
      if (error.status === 404) {
        console.error(`⚠️ Medicação ${id} não encontrada para exclusão`);
      } else if (error.status === 500) {
        console.error("⚠️ Erro interno do servidor ao excluir medicação");
      }
      
      throw error;
    }
  },
};

export default medicacaoService;
