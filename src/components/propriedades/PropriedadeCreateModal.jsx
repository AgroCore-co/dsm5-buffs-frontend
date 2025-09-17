"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import propriedadeService from "@/services/propriedadeService";
import enderecoService from "@/services/enderecoService";

// 1. Lista de estados brasileiros adicionada aqui
// É uma boa prática definir constantes que não mudam fora do componente.
const estadosBrasileiros = [
  { sigla: "AC", nome: "Acre" },
  { sigla: "AL", nome: "Alagoas" },
  { sigla: "AP", nome: "Amapá" },
  { sigla: "AM", nome: "Amazonas" },
  { sigla: "BA", nome: "Bahia" },
  { sigla: "CE", nome: "Ceará" },
  { sigla: "DF", nome: "Distrito Federal" },
  { sigla: "ES", nome: "Espírito Santo" },
  { sigla: "GO", nome: "Goiás" },
  { sigla: "MA", nome: "Maranhão" },
  { sigla: "MT", nome: "Mato Grosso" },
  { sigla: "MS", nome: "Mato Grosso do Sul" },
  { sigla: "MG", nome: "Minas Gerais" },
  { sigla: "PA", nome: "Pará" },
  { sigla: "PB", nome: "Paraíba" },
  { sigla: "PR", nome: "Paraná" },
  { sigla: "PE", nome: "Pernambuco" },
  { sigla: "PI", nome: "Piauí" },
  { sigla: "RJ", nome: "Rio de Janeiro" },
  { sigla: "RN", nome: "Rio Grande do Norte" },
  { sigla: "RS", nome: "Rio Grande do Sul" },
  { sigla: "RO", nome: "Rondônia" },
  { sigla: "RR", nome: "Roraima" },
  { sigla: "SC", nome: "Santa Catarina" },
  { sigla: "SP", nome: "São Paulo" },
  { sigla: "SE", nome: "Sergipe" },
  { sigla: "TO", nome: "Tocantins" },
];

export default function PropriedadeCreateModal({ isOpen, onClose, onSuccess }) {
  const { getAccessToken } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [createdAddress, setCreatedAddress] = useState(null);

  // Estados do formulário - separados por etapa
  const [enderecoData, setEnderecoData] = useState({
    pais: "Brasil",
    estado: "",
    cidade: "",
    bairro: "",
    rua: "",
    cep: "",
    numero: "",
    ponto_referencia: "",
  });

  const [propriedadeData, setPropriedadeData] = useState({
    nome: "",
    cnpj: "",
    p_abcb: false,
    tipo_manejo: "",
  });

  // Estados de UI
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const resetForm = () => {
    setCurrentStep(1);
    setCreatedAddress(null);
    setEnderecoData({
      pais: "Brasil",
      estado: "",
      cidade: "",
      bairro: "",
      rua: "",
      cep: "",
      numero: "",
      ponto_referencia: "",
    });
    setPropriedadeData({
      nome: "",
      cnpj: "",
      p_abcb: false,
      tipo_manejo: "",
    });
    setError(null);
  };

  // Função para fechar o modal
  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleEnderecoChange = (field, value) => {
    const stringValue =
      value !== null && value !== undefined ? String(value) : "";
    setEnderecoData((prev) => ({
      ...prev,
      [field]: stringValue,
    }));
    if (error) setError(null);
  };

  const handlePropriedadeChange = (field, value) => {
    setPropriedadeData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (error) setError(null);
  };

  const handleEnderecoSubmit = async (e) => {
    e.preventDefault();

    console.log("[v0] Current endereco data:", enderecoData);

    // Validação básica - Endereço
    const enderecoCamposObrigatorios = [
      "pais",
      "estado",
      "cidade",
      "bairro",
      "rua",
      "cep",
    ];
    for (const campo of enderecoCamposObrigatorios) {
      const valor = enderecoData[campo];
      console.log(`[v0] Validating field ${campo}:`, valor);

      if (!valor || !String(valor).trim()) {
        setError(
          `Campo '${campo}' do endereço é obrigatório e não pode estar vazio.`
        );
        return;
      }
    }

    try {
      setIsLoading(true);
      setError(null);

      const token = await getAccessToken();
      if (!token) {
        throw new Error("Usuário não autenticado. Faça login novamente.");
      }

      const payloadEndereco = {
        pais: String(enderecoData.pais || "").trim(),
        estado: String(enderecoData.estado || "").trim(),
        cidade: String(enderecoData.cidade || "").trim(),
        bairro: String(enderecoData.bairro || "").trim(),
        rua: String(enderecoData.rua || "").trim(),
        cep: String(enderecoData.cep || "").trim(),
        numero: enderecoData.numero ? String(enderecoData.numero).trim() : "",
        ponto_referencia: enderecoData.ponto_referencia
          ? String(enderecoData.ponto_referencia).trim()
          : "",
      };

      const requiredFields = [
        "pais",
        "estado",
        "cidade",
        "bairro",
        "rua",
        "cep",
      ];
      for (const field of requiredFields) {
        if (!payloadEndereco[field]) {
          setError(
            `Erro na validação: Campo '${field}' está vazio após processamento.`
          );
          return;
        }
      }

      console.log("[v0] Sending endereco payload:", payloadEndereco);
      const enderecoResponse = await enderecoService.criarEndereco(
        payloadEndereco,
        token
      );

      if (!enderecoResponse.id_endereco) {
        throw new Error("Erro ao obter ID do endereço criado.");
      }

      console.log("[v0] Endereco created successfully:", enderecoResponse);
      // Salvar endereço criado e avançar para próxima etapa
      setCreatedAddress(enderecoResponse);
      setCurrentStep(2);
    } catch (err) {
      console.error("[v0] Erro ao criar endereço:", err);

      if (
        err.message?.includes("401") ||
        err.message?.includes("Unauthorized")
      ) {
        setError("Sessão expirada. Faça login novamente.");
      } else if (err.message?.includes("400")) {
        setError("Dados inválidos. Verifique os campos e tente novamente.");
      } else {
        setError(err.message || "Erro ao criar endereço. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePropriedadeSubmit = async (e) => {
    e.preventDefault();

    // Validação básica - Propriedade
    if (!propriedadeData.nome || !propriedadeData.nome.trim()) {
      setError("Nome da propriedade é obrigatório.");
      return;
    }

    if (!propriedadeData.tipo_manejo) {
      setError("Tipo de manejo é obrigatório.");
      return;
    }

    if (!createdAddress?.id_endereco) {
      setError("Erro: ID do endereço não encontrado. Reinicie o processo.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const token = await getAccessToken();
      if (!token) {
        throw new Error("Usuário não autenticado. Faça login novamente.");
      }

      // Criar propriedade com o id_endereco obtido na etapa anterior
      const payloadPropriedade = {
        nome: String(propriedadeData.nome).trim(),
        cnpj: propriedadeData.cnpj ? String(propriedadeData.cnpj).trim() : null,
        p_abcb: Boolean(propriedadeData.p_abcb),
        tipo_manejo: String(propriedadeData.tipo_manejo),
        id_endereco: Number(createdAddress.id_endereco),
      };

      console.log(
        "Criando propriedade com endereço ID:",
        createdAddress.id_endereco
      );
      await propriedadeService.criarPropriedade(payloadPropriedade, token);

      // Sucesso - fechar modal e atualizar lista
      onSuccess();
      handleClose();
    } catch (err) {
      console.error("Erro ao criar propriedade:", err);

      if (
        err.message?.includes("401") ||
        err.message?.includes("Unauthorized")
      ) {
        setError("Sessão expirada. Faça login novamente.");
      } else if (err.message?.includes("400")) {
        setError("Dados inválidos. Verifique os campos e tente novamente.");
      } else {
        setError(err.message || "Erro ao criar propriedade. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToStep1 = () => {
    setCurrentStep(1);
    setError(null);
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
            <div className="flex items-center gap-2 mt-2">
              <div
                className={`flex items-center gap-2 ${
                  currentStep >= 1 ? "text-amber-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentStep >= 1
                      ? "bg-amber-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  1
                </div>
                <span className="text-sm font-medium">Endereço</span>
              </div>
              <div className="w-8 h-px bg-gray-300"></div>
              <div
                className={`flex items-center gap-2 ${
                  currentStep >= 2 ? "text-amber-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentStep >= 2
                      ? "bg-amber-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  2
                </div>
                <span className="text-sm font-medium">Propriedade</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {currentStep === 1 && (
          <form onSubmit={handleEnderecoSubmit} className="p-6">
            <div className="space-y-6">
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
                      value={enderecoData.pais}
                      onChange={(e) =>
                        handleEnderecoChange("pais", e.target.value)
                      }
                      disabled={isLoading}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:bg-gray-100 disabled:opacity-50"
                      placeholder="Brasil"
                    />
                    {!enderecoData.pais?.trim() && (
                      <p className="text-red-500 text-xs mt-1">
                        Campo obrigatório
                      </p>
                    )}
                  </div>

                  {/* 2. O <input> de Estado foi substituído por este <select> */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado *
                    </label>
                    <select
                      value={enderecoData.estado}
                      onChange={(e) =>
                        handleEnderecoChange("estado", e.target.value)
                      }
                      disabled={isLoading}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:bg-gray-100 disabled:opacity-50"
                    >
                      <option value="" disabled>
                        Selecione um estado
                      </option>
                      {estadosBrasileiros.map((estado) => (
                        <option key={estado.sigla} value={estado.sigla}>
                          {estado.nome}
                        </option>
                      ))}
                    </select>
                    {!enderecoData.estado?.trim() && (
                      <p className="text-red-500 text-xs mt-1">
                        Campo obrigatório
                      </p>
                    )}
                  </div>

                  {/* Cidade */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      value={enderecoData.cidade}
                      onChange={(e) =>
                        handleEnderecoChange("cidade", e.target.value)
                      }
                      disabled={isLoading}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:bg-gray-100 disabled:opacity-50"
                      placeholder="Presidente Prudente"
                    />
                    {!enderecoData.cidade?.trim() && (
                      <p className="text-red-500 text-xs mt-1">
                        Campo obrigatório
                      </p>
                    )}
                  </div>

                  {/* Bairro */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bairro *
                    </label>
                    <input
                      type="text"
                      value={enderecoData.bairro}
                      onChange={(e) =>
                        handleEnderecoChange("bairro", e.target.value)
                      }
                      disabled={isLoading}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:bg-gray-100 disabled:opacity-50"
                      placeholder="Centro"
                    />
                    {!enderecoData.bairro?.trim() && (
                      <p className="text-red-500 text-xs mt-1">
                        Campo obrigatório
                      </p>
                    )}
                  </div>

                  {/* Rua */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rua *
                    </label>
                    <input
                      type="text"
                      value={enderecoData.rua}
                      onChange={(e) =>
                        handleEnderecoChange("rua", e.target.value)
                      }
                      disabled={isLoading}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:bg-gray-100 disabled:opacity-50"
                      placeholder="Rua Principal"
                    />
                    {!enderecoData.rua?.trim() && (
                      <p className="text-red-500 text-xs mt-1">
                        Campo obrigatório
                      </p>
                    )}
                  </div>

                  {/* CEP */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CEP *
                    </label>
                    <input
                      type="text"
                      value={enderecoData.cep}
                      onChange={(e) =>
                        handleEnderecoChange("cep", e.target.value)
                      }
                      disabled={isLoading}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:bg-gray-100 disabled:opacity-50"
                      placeholder="19000-000"
                    />
                    {!enderecoData.cep?.trim() && (
                      <p className="text-red-500 text-xs mt-1">
                        Campo obrigatório
                      </p>
                    )}
                  </div>

                  {/* Número */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número
                    </label>
                    <input
                      type="text"
                      value={enderecoData.numero}
                      onChange={(e) =>
                        handleEnderecoChange("numero", e.target.value)
                      }
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
                      value={enderecoData.ponto_referencia}
                      onChange={(e) =>
                        handleEnderecoChange("ponto_referencia", e.target.value)
                      }
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

            {/* Footer do Modal - Step 1 */}
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
                  !enderecoData.pais?.trim() ||
                  !enderecoData.estado?.trim() ||
                  !enderecoData.cidade?.trim() ||
                  !enderecoData.bairro?.trim() ||
                  !enderecoData.rua?.trim() ||
                  !enderecoData.cep?.trim()
                }
                className="px-4 py-2 bg-[#FFCF78] text-gray-800 rounded-lg hover:bg-[#F2B84D] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading && (
                  <div className="w-4 h-4 border-2 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
                )}
                {isLoading
                  ? "Criando Endereço..."
                  : "Próximo: Dados da Propriedade"}
              </button>
            </div>
          </form>
        )}

        {currentStep === 2 && (
          <form onSubmit={handlePropriedadeSubmit} className="p-6">
            <div className="space-y-6">
              {/* Resumo do endereço criado */}
              {createdAddress && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-green-800 font-medium mb-2">
                    ✅ Endereço criado com sucesso!
                  </div>
                  <div className="text-green-700 text-sm">
                    {createdAddress.rua},{" "}
                    {createdAddress.numero && `${createdAddress.numero}, `}
                    {createdAddress.bairro}, {createdAddress.cidade} -{" "}
                    {createdAddress.estado}, {createdAddress.cep}
                  </div>
                </div>
              )}

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
                      value={propriedadeData.nome}
                      onChange={(e) =>
                        handlePropriedadeChange("nome", e.target.value)
                      }
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
                      value={propriedadeData.cnpj}
                      onChange={(e) =>
                        handlePropriedadeChange("cnpj", e.target.value)
                      }
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
                      value={propriedadeData.tipo_manejo}
                      onChange={(e) =>
                        handlePropriedadeChange("tipo_manejo", e.target.value)
                      }
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
                        checked={propriedadeData.p_abcb}
                        onChange={(e) =>
                          handlePropriedadeChange("p_abcb", e.target.checked)
                        }
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
            </div>

            {/* Exibição de erro */}
            {error && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="text-red-800 font-medium">Erro</div>
                <div className="text-red-600 text-sm mt-1">{error}</div>
              </div>
            )}

            {/* Footer do Modal - Step 2 */}
            <div className="flex justify-between mt-6 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleBackToStep1}
                disabled={isLoading}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Voltar ao Endereço
              </button>

              <div className="flex gap-3">
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
                    !propriedadeData.nome?.trim() ||
                    !propriedadeData.tipo_manejo
                  }
                  className="px-4 py-2 bg-[#FFCF78] text-gray-800 rounded-lg hover:bg-[#F2B84D] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading && (
                    <div className="w-4 h-4 border-2 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {isLoading ? "Criando Propriedade..." : "Finalizar Cadastro"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
