import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import propriedadeService from "@/services/propriedadeService";
import enderecoService from "@/services/enderecoService";

export default function PropriedadeCreateModal({ isOpen, onClose, onSuccess }) {
  const { getAccessToken } = useAuth();
  
  // Estados do formulário
  const [formData, setFormData] = useState({
    // Dados da propriedade
    nome: "",
    cnpj: "",
    p_abcb: false,
    tipo_manejo: "",
    // Dados do endereço
    pais: "Brasil",
    estado: "",
    cidade: "",
    bairro: "",
    rua: "",
    cep: "",
    numero: "",
    ponto_referencia: "",
  });
  
  // Estados de UI
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Função para resetar o formulário
  const resetForm = () => {
    setFormData({
      // Dados da propriedade
      nome: "",
      cnpj: "",
      p_abcb: false,
      tipo_manejo: "",
      // Dados do endereço
      pais: "Brasil",
      estado: "",
      cidade: "",
      bairro: "",
      rua: "",
      cep: "",
      numero: "",
      ponto_referencia: "",
    });
    setError(null);
  };

  // Função para fechar o modal
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Função para validar dados de endereço
  const validateEnderecoData = (data) => {
    const errors = [];
    
    if (!data.pais || typeof data.pais !== 'string' || !data.pais.trim()) {
      errors.push('País é obrigatório e deve ser uma string válida');
    }
    if (!data.estado || typeof data.estado !== 'string' || !data.estado.trim()) {
      errors.push('Estado é obrigatório e deve ser uma string válida');
    }
    if (!data.cidade || typeof data.cidade !== 'string' || !data.cidade.trim()) {
      errors.push('Cidade é obrigatória e deve ser uma string válida');
    }
    if (!data.bairro || typeof data.bairro !== 'string' || !data.bairro.trim()) {
      errors.push('Bairro é obrigatório e deve ser uma string válida');
    }
    if (!data.rua || typeof data.rua !== 'string' || !data.rua.trim()) {
      errors.push('Rua é obrigatória e deve ser uma string válida');
    }
    if (!data.cep || typeof data.cep !== 'string' || !data.cep.trim()) {
      errors.push('CEP é obrigatório e deve ser uma string válida');
    }
    
    return errors;
  };

  // Função para atualizar campos do formulário
  const handleInputChange = (field, value) => {
    // Garantir que o valor sempre seja uma string
    const stringValue = value !== null && value !== undefined ? String(value) : "";
    
    setFormData(prev => ({
      ...prev,
      [field]: stringValue
    }));
    // Limpa erro quando usuário começa a digitar
    if (error) setError(null);
  };

  // Função para submeter o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação básica - Propriedade
    if (!formData.nome || !formData.nome.trim()) {
      setError("Nome da propriedade é obrigatório.");
      return;
    }

    if (!formData.tipo_manejo) {
      setError("Tipo de manejo é obrigatório.");
      return;
    }

    // Validação básica - Endereço
    const enderecoCamposObrigatorios = ['pais', 'estado', 'cidade', 'bairro', 'rua', 'cep'];
    for (const campo of enderecoCamposObrigatorios) {
      if (!formData[campo] || !formData[campo].toString().trim()) {
        setError(`Campo '${campo}' do endereço é obrigatório.`);
        return;
      }
    }

    try {
      setIsLoading(true);
      setError(null);

      // Obter token de autenticação
      const token = await getAccessToken();
      if (!token) {
        throw new Error("Usuário não autenticado. Faça login novamente.");
      }

      // 1º Passo: Criar endereço
      const payloadEndereco = {
        pais: String(formData.pais).trim(),
        estado: String(formData.estado).trim(),
        cidade: String(formData.cidade).trim(),
        bairro: String(formData.bairro).trim(),
        rua: String(formData.rua).trim(),
        cep: String(formData.cep).trim(),
        numero: formData.numero ? String(formData.numero).trim() : null,
        ponto_referencia: formData.ponto_referencia ? String(formData.ponto_referencia).trim() : null,
      };

      // Validação final dos dados do endereço
      const validationErrors = validateEnderecoData(payloadEndereco);
      if (validationErrors.length > 0) {
        throw new Error(`Erro de validação: ${validationErrors.join(', ')}`);
      }

      // Debug: Verificar payload antes de enviar
      console.log("Payload do endereço:", payloadEndereco);
      console.log("Tipos dos campos:", {
        pais: typeof payloadEndereco.pais,
        estado: typeof payloadEndereco.estado,
        cidade: typeof payloadEndereco.cidade,
        bairro: typeof payloadEndereco.bairro,
        rua: typeof payloadEndereco.rua,
        cep: typeof payloadEndereco.cep
      });

      console.log("Criando endereço...");
      const enderecoResponse = await enderecoService.criarEndereco(payloadEndereco, token);
      const id_endereco = enderecoResponse.id_endereco;

      if (!id_endereco) {
        throw new Error("Erro ao obter ID do endereço criado.");
      }

      // 2º Passo: Criar propriedade com o id_endereco obtido
      const payloadPropriedade = {
        nome: String(formData.nome).trim(),
        cnpj: formData.cnpj ? String(formData.cnpj).trim() : null,
        p_abcb: Boolean(formData.p_abcb),
        tipo_manejo: String(formData.tipo_manejo),
        id_endereco: Number(id_endereco),
      };

      console.log("Criando propriedade com endereço ID:", id_endereco);
      await propriedadeService.criarPropriedade(payloadPropriedade, token);
      
      // Sucesso - fechar modal e atualizar lista
      onSuccess();
      handleClose();
      
    } catch (err) {
      console.error("Erro ao criar propriedade e endereço:", err);
      
      // Tratamento de erros específicos
      if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
        setError("Sessão expirada. Faça login novamente.");
      } else if (err.message?.includes('400')) {
        setError("Dados inválidos. Verifique os campos e tente novamente.");
      } else {
        setError(err.message || "Erro ao criar propriedade. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Se o modal não estiver aberto, não renderiza nada
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1001] p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header do Modal */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Nova Propriedade
            </h2>
            <p className="text-gray-600">Cadastre uma nova propriedade e seu endereço no sistema</p>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Seção Propriedade */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Dados da Propriedade
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nome da Propriedade */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome da Propriedade *
                  </label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => handleInputChange("nome", e.target.value)}
                    disabled={isLoading}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:bg-gray-100 disabled:opacity-50"
                    placeholder="Digite o nome da propriedade"
                  />
                </div>

                {/* CNPJ */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CNPJ
                  </label>
                  <input
                    type="text"
                    value={formData.cnpj}
                    onChange={(e) => handleInputChange("cnpj", e.target.value)}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:bg-gray-100 disabled:opacity-50"
                    placeholder="00.000.000/0000-00 (opcional)"
                  />
                </div>

                {/* Tipo de Manejo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Manejo *
                  </label>
                  <select
                    value={formData.tipo_manejo}
                    onChange={(e) => handleInputChange("tipo_manejo", e.target.value)}
                    disabled={isLoading}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:bg-gray-100 disabled:opacity-50"
                  >
                    <option value="">Selecione o tipo de manejo</option>
                    <option value="P">P - Pecuária</option>
                    <option value="E">E - Extensivo</option>
                    <option value="I">I - Intensivo</option>
                  </select>
                </div>

                {/* ABCB */}
                <div className="md:col-span-2">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.p_abcb}
                      onChange={(e) => handleInputChange("p_abcb", e.target.checked)}
                      disabled={isLoading}
                      className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500 disabled:opacity-50"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Propriedade ABCB
                      </span>
                      <p className="text-xs text-gray-500">
                        Marque se a propriedade está registrada na ABCB
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Seção Endereço */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Endereço da Propriedade
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* País */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    País *
                  </label>
                  <input
                    type="text"
                    value={formData.pais}
                    onChange={(e) => handleInputChange("pais", e.target.value)}
                    disabled={isLoading}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:bg-gray-100 disabled:opacity-50"
                    placeholder="Brasil"
                  />
                </div>

                {/* Estado */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado *
                  </label>
                  <input
                    type="text"
                    value={formData.estado}
                    onChange={(e) => handleInputChange("estado", e.target.value)}
                    disabled={isLoading}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:bg-gray-100 disabled:opacity-50"
                    placeholder="São Paulo"
                  />
                </div>

                {/* Cidade */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    value={formData.cidade}
                    onChange={(e) => handleInputChange("cidade", e.target.value)}
                    disabled={isLoading}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:bg-gray-100 disabled:opacity-50"
                    placeholder="Presidente Prudente"
                  />
                </div>

                {/* Bairro */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bairro *
                  </label>
                  <input
                    type="text"
                    value={formData.bairro}
                    onChange={(e) => handleInputChange("bairro", e.target.value)}
                    disabled={isLoading}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:bg-gray-100 disabled:opacity-50"
                    placeholder="Centro"
                  />
                </div>

                {/* Rua */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rua *
                  </label>
                  <input
                    type="text"
                    value={formData.rua}
                    onChange={(e) => handleInputChange("rua", e.target.value)}
                    disabled={isLoading}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:bg-gray-100 disabled:opacity-50"
                    placeholder="Rua Principal"
                  />
                </div>

                {/* CEP */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CEP *
                  </label>
                  <input
                    type="text"
                    value={formData.cep}
                    onChange={(e) => handleInputChange("cep", e.target.value)}
                    disabled={isLoading}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:bg-gray-100 disabled:opacity-50"
                    placeholder="19000-000"
                  />
                </div>

                {/* Número */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número
                  </label>
                  <input
                    type="text"
                    value={formData.numero}
                    onChange={(e) => handleInputChange("numero", e.target.value)}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:bg-gray-100 disabled:opacity-50"
                    placeholder="123 (opcional)"
                  />
                </div>

                {/* Ponto de Referência */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ponto de Referência
                  </label>
                  <input
                    type="text"
                    value={formData.ponto_referencia}
                    onChange={(e) => handleInputChange("ponto_referencia", e.target.value)}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:bg-gray-100 disabled:opacity-50"
                    placeholder="Próximo à ponte (opcional)"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Exibição de erro */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-red-800 font-medium">Erro</div>
              <div className="text-red-600 text-sm mt-1">{error}</div>
            </div>
          )}

          {/* Footer do Modal */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={
                isLoading || 
                !formData.nome?.trim() || 
                !formData.tipo_manejo || 
                !formData.pais?.trim() || 
                !formData.estado?.trim() || 
                !formData.cidade?.trim() || 
                !formData.bairro?.trim() || 
                !formData.rua?.trim() || 
                !formData.cep?.trim()
              }
              className="px-4 py-2 bg-[#FFCF78] text-gray-800 rounded-lg hover:bg-[#F2B84D] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading && (
                <div className="w-4 h-4 border-2 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
              )}
              {isLoading ? "Criando..." : "Criar Propriedade"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
