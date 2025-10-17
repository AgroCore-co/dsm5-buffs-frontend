"use client";

// Lista de estados brasileiros
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

import { useState } from "react";
import enderecoService from "@/services/enderecoService";
import propriedadeService from "@/services/propriedadeService";

export default function PropriedadeCreateModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [enderecoForm, setEnderecoForm] = useState({
    pais: "",
    estado: "",
    cidade: "",
    bairro: "",
    rua: "",
    cep: "",
    numero: "",
    ponto_referencia: "",
  });
  const [propriedadeForm, setPropriedadeForm] = useState({
    nome: "",
    cnpj: "",
    tipo_manejo: "",
    p_abcb: false,
  });
  const [idEndereco, setIdEndereco] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  // Handlers dos formulários
  const handleEnderecoChange = (e) => {
    const { name, value } = e.target;
    setEnderecoForm((prev) => ({ ...prev, [name]: value }));
  };
  const handlePropriedadeChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPropriedadeForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Submissão do endereço
  const handleEnderecoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const enderecoCriado = await enderecoService.cadastrarEndereco(enderecoForm);
      setIdEndereco(enderecoCriado.id_endereco || enderecoCriado.id || enderecoCriado.idEndereco);
      setStep(2);
    } catch (err) {
      setError("Erro ao cadastrar endereço. Verifique os dados e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Submissão da propriedade
  const handlePropriedadeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const propriedadePayload = {
        ...propriedadeForm,
        id_endereco: idEndereco,
      };
      await propriedadeService.criarPropriedade(propriedadePayload);
      onClose();
      // Resetar modal
      setStep(1);
      setEnderecoForm({
        pais: "",
        estado: "",
        cidade: "",
        bairro: "",
        rua: "",
        cep: "",
        numero: "",
        ponto_referencia: "",
      });
      setPropriedadeForm({
        nome: "",
        cnpj: "",
        tipo_manejo: "",
        p_abcb: false,
      });
      setIdEndereco("");
    } catch (err) {
      setError("Erro ao cadastrar propriedade. Verifique os dados e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Voltar para etapa de endereço
  const handleVoltarEndereco = () => {
    setStep(1);
  };

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
              <div className={`flex items-center gap-2 ${step === 1 ? "text-amber-600" : "text-gray-400"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 1 ? "bg-amber-600" : "bg-gray-300"} text-white`}>
                  1
                </div>
                <span className="text-sm font-medium">Endereço</span>
              </div>
              <div className="w-8 h-px bg-gray-300"></div>
              <div className={`flex items-center gap-2 ${step === 2 ? "text-amber-600" : "text-gray-400"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 2 ? "bg-amber-600" : "bg-gray-300"} text-white`}>
                  2
                </div>
                <span className="text-sm font-medium">Propriedade</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Conteúdo do Modal - Etapa 1: Endereço */}
        {step === 1 && (
          <form className="p-6" onSubmit={handleEnderecoSubmit}>
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Endereço da Propriedade
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    País *
                  </label>
                  <input 
                    name="pais"
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" 
                    required
                    value={enderecoForm.pais}
                    onChange={handleEnderecoChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado *
                  </label>
                  <select 
                    name="estado" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" 
                    required
                    value={enderecoForm.estado}
                    onChange={handleEnderecoChange}
                  >
                    <option value="" disabled>
                      Selecione um estado
                    </option>
                    {estadosBrasileiros.map((estado) => (
                      <option key={estado.sigla} value={estado.nome}>
                        {estado.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cidade *
                  </label>
                  <input 
                    name="cidade"
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" 
                    required
                    value={enderecoForm.cidade}
                    onChange={handleEnderecoChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bairro *
                  </label>
                  <input 
                    name="bairro"
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" 
                    required
                    value={enderecoForm.bairro}
                    onChange={handleEnderecoChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rua *
                  </label>
                  <input 
                    name="rua"
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" 
                    required
                    value={enderecoForm.rua}
                    onChange={handleEnderecoChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CEP *
                  </label>
                  <input 
                    name="cep"
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" 
                    required
                    value={enderecoForm.cep}
                    onChange={handleEnderecoChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número
                  </label>
                  <input 
                    name="numero"
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" 
                    value={enderecoForm.numero}
                    onChange={handleEnderecoChange}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ponto de Referência
                  </label>
                  <input 
                    name="ponto_referencia"
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" 
                    value={enderecoForm.ponto_referencia}
                    onChange={handleEnderecoChange}
                  />
                </div>
              </div>
            </div>
            {error && <div className="text-red-500 mt-4">{error}</div>}
            {/* Botões da Etapa 1 */}
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
              <button 
                type="button" 
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                disabled={loading}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-[#FFCF78] text-gray-800 rounded-lg hover:bg-[#F2B84D] transition-colors font-medium flex items-center gap-2"
                disabled={loading}
              >
                {loading ? "Cadastrando..." : "Cadastrar Endereço"}
              </button>
            </div>
          </form>
        )}

        {/* Conteúdo do Modal - Etapa 2: Propriedade */}
        {step === 2 && (
          <form className="p-6" onSubmit={handlePropriedadeSubmit}>
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Dados da Propriedade
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome da Propriedade *
                  </label>
                  <input 
                    name="nome"
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" 
                    required
                    value={propriedadeForm.nome}
                    onChange={handlePropriedadeChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CNPJ *
                  </label>
                  <input 
                    name="cnpj"
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" 
                    required
                    value={propriedadeForm.cnpj}
                    onChange={handlePropriedadeChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Manejo *
                  </label>
                  <select 
                    name="tipo_manejo" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" 
                    required
                    value={propriedadeForm.tipo_manejo}
                    onChange={handlePropriedadeChange}
                  >
                    <option value="">Selecione o tipo de manejo</option>
                    <option value="P">P - Pecuária</option>
                    <option value="E">E - Extensivo</option>
                    <option value="I">I - Intensivo</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center space-x-3">
                    <input 
                      name="p_abcb"
                      type="checkbox" 
                      className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500" 
                      checked={propriedadeForm.p_abcb}
                      onChange={handlePropriedadeChange}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID do Endereço
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-100" 
                    readOnly 
                    value={idEndereco}
                  />
                </div>
              </div>
            </div>
            {error && <div className="text-red-500 mt-4">{error}</div>}
            {/* Botões da Etapa 2 */}
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
              <button 
                type="button" 
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                onClick={handleVoltarEndereco}
                disabled={loading}
              >
                ← Voltar ao Endereço
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-[#FFCF78] text-gray-800 rounded-lg hover:bg-[#F2B84D] transition-colors font-medium flex items-center gap-2"
                disabled={loading}
              >
                {loading ? "Cadastrando..." : "Finalizar Cadastro"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}