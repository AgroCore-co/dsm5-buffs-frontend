import bufaloService from './bufaloService';

/**
 * Serviço para geração de relatórios
 */

/**
 * Busca todos os búfalos de uma propriedade (sem paginação)
 * para geração de relatório completo
 * 
 * @param {string} idPropriedade - ID da propriedade
 * @returns {Promise<Object>} Dados dos búfalos e metadados
 */
const buscarDadosRelatorioRebanho = async (idPropriedade) => {
  if (!idPropriedade) throw new Error("ID da propriedade é obrigatório");

  try {
    // Buscar com um limite alto para pegar todos os registros
    // Idealmente o backend deveria ter um endpoint específico para relatórios
    const response = await bufaloService.listarBufalosPorPropriedade(idPropriedade, 1, 1000);
    return response;
  } catch (error) {
    console.error("Erro ao buscar dados para relatório:", error);
    throw error;
  }
};

/**
 * Busca dados filtrados para relatório
 * 
 * @param {Object} filtros - Filtros avançados
 * @returns {Promise<Object>} Dados filtrados dos búfalos
 */
const buscarDadosRelatorioFiltrado = async (filtros) => {
  if (!filtros.idPropriedade) throw new Error("ID da propriedade é obrigatório");

  try {
    const response = await bufaloService.filtrarBufalosAvancado({
      ...filtros,
      limit: 1000 // Limite alto para relatórios
    });
    return response;
  } catch (error) {
    console.error("Erro ao buscar dados filtrados para relatório:", error);
    throw error;
  }
};

const relatorioService = {
  buscarDadosRelatorioRebanho,
  buscarDadosRelatorioFiltrado,
};

export default relatorioService;
