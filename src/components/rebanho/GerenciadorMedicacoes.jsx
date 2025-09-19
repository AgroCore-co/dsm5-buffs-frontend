import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import medicacaoService from "@/services/medicacaoService";
import Button from "@/components/Button";
import MedicacaoModal from "./MedicacaoModal";

const ITEMS_PER_PAGE = 5; // Número de medicações por página

export default function GerenciadorMedicacoes() {
  const [medicacoes, setMedicacoes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [medicacaoParaEditar, setMedicacaoParaEditar] = useState(null);
  const [token, setToken] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Sempre busca o token mais recente do Supabase
  useEffect(() => {
    const getToken = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setToken(session?.access_token || null);
    };
    getToken();
    // Atualiza token em mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => getToken());
    return () => subscription.unsubscribe();
  }, []);

  const fetchMedicacoes = async () => {
    if (!token) {
      setError("Sessão expirada ou não autenticada. Faça login novamente.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await medicacaoService.listarMedicacoes(token);
        if (Array.isArray(data)) {
          // Formatar os dados conforme esperado pela interface
          const formattedData = data.map(item => ({
            ...item,
            // Garantir que há uma data de cadastro, ou usar a data atual
            data_cadastro: item.data_cadastro || item.created_at || new Date().toISOString().split('T')[0]
          }));
          setMedicacoes(formattedData);
          return;
        } else if (data && typeof data === 'object') {
          // Se retornar um objeto único, transformá-lo em array
          const formattedData = [{
            ...data,
            data_cadastro: data.data_cadastro || data.created_at || new Date().toISOString().split('T')[0]
          }];
          setMedicacoes(formattedData);
          return;
        }
      } catch (apiError) {
        console.error("Erro na API de medicações:", apiError);
        
        // Usar dados fictícios se a API falhar ou retornar dados inválidos
        console.log("🔶 Usando dados fictícios para medicações");
        const mockData = [
          {
            id: 1,
            tipo_tratamento: "Vermifugação",
            medicacao: "Ivermectina",
            descricao: "Antiparasitário de amplo espectro",
            data_cadastro: "2025-08-15",
          },
          {
            id: 2,
            tipo_tratamento: "Vacina",
            medicacao: "Febre Aftosa",
            descricao: "Imunização contra febre aftosa",
            data_cadastro: "2025-09-01",
          },
          {
            id: 3,
            tipo_tratamento: "Antibiótico",
            medicacao: "Terramicina",
            descricao: "Para tratamento de infecções bacterianas",
            data_cadastro: "2025-08-28",
          }
        ];
        
        setMedicacoes(mockData);
      }
    } catch (err) {
      console.error("Erro ao buscar medicações:", err);
      setError("Não foi possível carregar as medicações. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicacoes();
  }, [token]);

  // Lógica de paginação
  const totalPages = Math.ceil(medicacoes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentMedicacoes = medicacoes.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Função para criar uma nova medicação
  const handleCreateMedicacao = async (formData) => {
    let novaMedicacao;
    try {
      // Criar medicação usando o endpoint POST /medicamentos
      novaMedicacao = await medicacaoService.criarMedicacao(token, formData);
      console.log("✅ Medicação criada com sucesso:", novaMedicacao);

      // Garantir que o objeto tenha uma data de cadastro para exibição
      if (!novaMedicacao.data_cadastro && !novaMedicacao.created_at) {
        novaMedicacao.data_cadastro = new Date().toISOString().split('T')[0];
      }

      // Adicionar à lista local
      setMedicacoes([...medicacoes, novaMedicacao]);
      setShowModal(false);
      setCurrentPage(1); // Resetar para primeira página
      return;
    } catch (apiError) {
      // Analisar erro específico
      if (apiError.response?.status === 500) {
        console.error("� Erro interno do servidor ao criar medicação");
        throw new Error("O servidor encontrou um erro ao processar sua solicitação. Tente novamente mais tarde.");
      } else if (apiError.response?.status === 401) {
        console.error("🔴 Erro de autenticação ao criar medicação");
        throw new Error("Sessão expirada. Por favor, faça login novamente.");
      } else {
        console.error("🔴 Erro na API ao criar medicação:", apiError);
        throw new Error("Não foi possível criar a medicação. Verifique sua conexão e tente novamente.");
      }
    }
  };

  const handleEditMedicacao = async (formData) => {
    try {
      if (!token) {
        throw new Error("Token de autenticação não disponível");
      }
      
      if (!medicacaoParaEditar || !medicacaoParaEditar.id) {
        throw new Error("Medicação para edição não especificada");
      }
      
      const id = medicacaoParaEditar.id;
      
      // Tentar atualizar usando a API conforme documentação
      try {
        // Atualizar medicação usando o endpoint PATCH /medicamentos/{id}
        const medicacaoAtualizada = await medicacaoService.atualizarMedicacao(token, id, formData);
        console.log(`✅ Medicação ${id} atualizada com sucesso:`, medicacaoAtualizada);
        
        // Atualizar na lista local
        setMedicacoes(medicacoes.map(med => 
          med.id === id 
            ? { 
                ...med, 
                ...medicacaoAtualizada, 
                // Preservar a data de cadastro original
                data_cadastro: med.data_cadastro 
              } 
            : med
        ));
        
        setMedicacaoParaEditar(null);
        setShowModal(false);
        return;
      } catch (apiError) {
        // Analisar erro específico
        if (apiError.response?.status === 404) {
          console.error(`🔴 Medicação ${id} não encontrada para atualização`);
          throw new Error("Esta medicação não existe mais ou já foi excluída.");
        } else if (apiError.response?.status === 500) {
          console.error(`🔴 Erro interno do servidor ao atualizar medicação ${id}`);
          throw new Error("O servidor encontrou um erro ao processar sua solicitação. Tente novamente mais tarde.");
        } else if (apiError.response?.status === 401) {
          console.error(`🔴 Erro de autenticação ao atualizar medicação ${id}`);
          throw new Error("Sessão expirada. Por favor, faça login novamente.");
        } else {
          console.error(`🔴 Erro na API ao atualizar medicação ${id}:`, apiError);
          throw new Error("Não foi possível atualizar a medicação. Verifique sua conexão e tente novamente.");
        }
      }
    } catch (err) {
      console.error("Erro ao atualizar medicação:", err);
      throw err; // Propaga o erro para ser tratado pelo componente do modal
    }
  };

  const handleDeleteMedicacao = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta medicação?")) {
      try {
        // Remover validação estrita de token, pois o apiClient pode buscar o token automaticamente
        // if (!token) {
        //   throw new Error("Token de autenticação não disponível");
        // }
        
        // Tentar excluir usando a API conforme documentação
        try {
          // Excluir medicação usando o endpoint DELETE /medicamentos/{id}
          await medicacaoService.deletarMedicacao(token, id);
          console.log(`✅ Medicação ${id} excluída com sucesso`);
          
          // Remover da lista local
          setMedicacoes(medicacoes.filter(med => med.id !== id));
        } catch (apiError) {
          // Analisar erro específico
          if (apiError.response?.status === 404) {
            console.error(`🔴 Medicação ${id} não encontrada para exclusão`);
            alert("Esta medicação não existe mais ou já foi excluída.");
            
            // Atualizar a lista local para remover a medicação não encontrada
            setMedicacoes(medicacoes.filter(med => med.id !== id));
          } else if (apiError.response?.status === 500) {
            console.error(`🔴 Erro interno do servidor ao excluir medicação ${id}`);
            alert("O servidor encontrou um erro ao processar sua solicitação. A medicação não foi excluída. Tente novamente mais tarde.");
          } else if (apiError.response?.status === 401) {
            console.error(`🔴 Erro de autenticação ao excluir medicação ${id}`);
            alert("Sua sessão expirou. Por favor, faça login novamente.");
          } else {
            console.error(`🔴 Erro na API ao excluir medicação ${id}:`, apiError);
            alert("Não foi possível excluir a medicação. Verifique sua conexão e tente novamente.");
          }
        }
      } catch (err) {
        console.error("Erro ao excluir medicação:", err);
        alert("Não foi possível excluir a medicação. Tente novamente.");
      }
    }
  };

  return (
    <div className="w-full flex flex-col bg-white rounded-xl p-5 gap-4 box-border border border-[#e0e0e0] shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Farmácia Veterinária
          </h2>
          <p className="text-gray-600">
            Cadastre e gerencie medicações disponíveis para tratamentos sanitários dos búfalos
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Mantenha um registro das medicações para facilitar a aplicação de protocolos sanitários e tratamentos veterinários
          </p>
        </div>
        <Button variant="primary" size="medium" onClick={() => setShowModal(true)}>
          + Nova Medicação
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#FFCF78] border-t-[#CE7D0A] mb-4"></div>
          <p className="text-gray-500">Carregando medicações...</p>
        </div>
      ) : medicacoes.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 mb-2">Nenhuma medicação cadastrada</p>
          <p className="text-gray-400 text-sm mb-4">
            Cadastre medicações para poder aplicá-las nos tratamentos dos animais
          </p>
          <Button
            variant="primary"
            size="small"
            onClick={() => setShowModal(true)}
          >
            Cadastrar Primeira Medicação
          </Button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead className="bg-[#f0f0f0]">
                <tr>
                  <th className="p-3 text-center font-medium text-gray-800">Tipo</th>
                  <th className="p-3 text-center font-medium text-gray-800">Medicação</th>
                  <th className="p-3 text-center font-medium text-gray-800">Descrição</th>
                  <th className="p-3 text-center font-medium text-gray-800">Data de Cadastro</th>
                  <th className="p-3 text-center font-medium text-gray-800">Ações</th>
                </tr>
              </thead>
            <tbody className="divide-y divide-gray-200">
              {currentMedicacoes.map((med, index) => (
                <tr key={med.id || `medicacao-${index}`} className="odd:bg-white even:bg-[#fafafa]">
                  <td className="p-3 text-center text-gray-800">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      med.tipo_tratamento === "Vermifugação"
                        ? "bg-green-100 text-green-800"
                        : med.tipo_tratamento === "Vacina"
                        ? "bg-blue-100 text-blue-800"
                        : med.tipo_tratamento === "Antibiótico"
                        ? "bg-purple-100 text-purple-800"
                        : med.tipo_tratamento === "Suplemento"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {med.tipo_tratamento}
                    </span>
                  </td>
                  <td className="p-3 text-center text-gray-800">{med.medicacao}</td>
                  <td className="p-3 text-center text-gray-800">{med.descricao}</td>
                  <td className="p-3 text-center text-gray-800">
                    {new Date(med.data_cadastro).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      {/* Ver detalhes */}
                      <button
                        onClick={() => {
                          // Tentar buscar detalhes completos usando o endpoint GET /medicamentos/{id}
                          if (token && med.id) {
                            setIsLoading(true);
                            medicacaoService.obterMedicacao(token, med.id)
                              .then(detalhes => {
                                alert(
                                  `Detalhes da medicação: ${detalhes.medicacao || med.medicacao}\n\n` +
                                  `Tipo: ${detalhes.tipo_tratamento || med.tipo_tratamento}\n` +
                                  `Descrição: ${detalhes.descricao || med.descricao}\n` +
                                  `Data de cadastro: ${new Date(detalhes.data_cadastro || med.data_cadastro).toLocaleDateString('pt-BR')}\n` +
                                  `ID: ${detalhes.id || med.id}`
                                );
                              })
                              .catch(err => {
                                console.error(`Erro ao buscar detalhes da medicação ${med.id}:`, err);
                                
                                // Mostrar detalhes locais em caso de erro
                                alert(
                                  `Detalhes da medicação: ${med.medicacao}\n\n` +
                                  `Tipo: ${med.tipo_tratamento}\n` +
                                  `Descrição: ${med.descricao}\n` +
                                  `Data de cadastro: ${new Date(med.data_cadastro).toLocaleDateString('pt-BR')}`
                                );
                              })
                              .finally(() => setIsLoading(false));
                          } else {
                            // Fallback para dados locais
                            alert(
                              `Detalhes da medicação: ${med.medicacao}\n\n` +
                              `Tipo: ${med.tipo_tratamento}\n` +
                              `Descrição: ${med.descricao}\n` +
                              `Data de cadastro: ${new Date(med.data_cadastro).toLocaleDateString('pt-BR')}`
                            );
                          }
                        }}
                        className="text-blue-600 hover:text-blue-800"
                        title="Ver detalhes"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            key="eye-path-1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            key="eye-path-2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                      
                      {/* Editar */}
                      <button
                        onClick={() => {
                          setMedicacaoParaEditar(med);
                          setShowModal(true);
                        }}
                        className="text-yellow-600 hover:text-yellow-800"
                        title="Editar medicação"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      
                      {/* Excluir */}
                      <button
                        onClick={() => handleDeleteMedicacao(med.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Excluir medicação"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#FFCF78] hover:bg-[#F2B84D] text-gray-800"
              }`}
            >
              Anterior
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                  currentPage === page
                    ? "bg-[#CE7D0A] text-white"
                    : "bg-gray-200 hover:bg-[#FFCF78] text-gray-800"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#FFCF78] hover:bg-[#F2B84D] text-gray-800"
              }`}
            >
              Próximo
            </button>
          </div>
        )}

        {totalPages > 0 && (
          <div className="text-center text-sm text-gray-600 mt-4">
            Mostrando {startIndex + 1} a {Math.min(endIndex, medicacoes.length)} de {medicacoes.length} medicações
          </div>
        )}
        </>
      )}

      <MedicacaoModal
        onClose={() => setShowModal(false)}
        onSubmit={medicacaoParaEditar ? handleEditMedicacao : handleCreateMedicacao}
        initialData={medicacaoParaEditar}
      />
    </div>
  );
}
