"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import enderecoService from "@/services/enderecoService";
import propriedadeService from "@/services/propriedadeService";

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

export default function PropriedadeCreateModal({ isOpen, onClose, onSuccess }) {
  const { getAccessToken } = useAuth();
  const [form, setForm] = useState({
    pais: "Brasil",
    estado: "",
    cidade: "",
    bairro: "",
    rua: "",
    cep: "",
    numero: "",
    ponto_referencia: ""
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [enderecoCriado, setEnderecoCriado] = useState(null);
  const [propriedadeForm, setPropriedadeForm] = useState({
    nome: "",
    cnpj: "",
    p_abcb: false,
    tipo_manejo: ""
  });
  const [propriedadeResult, setPropriedadeResult] = useState(null);
  const [propriedadeError, setPropriedadeError] = useState(null);
  const [propriedadeLoading, setPropriedadeLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handlePropriedadeChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPropriedadeForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmitEndereco = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    const obrigatorios = ["pais", "estado", "cidade", "bairro", "rua", "cep"];
    for (const campo of obrigatorios) {
      if (!form[campo] || typeof form[campo] !== "string" || form[campo].trim() === "") {
        setError(`Campo '${campo}' é obrigatório e deve ser uma string não vazia.`);
        setLoading(false);
        return;
      }
    }
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Token de autenticação não encontrado. Faça login novamente.");
      const res = await enderecoService.criarEndereco(form, token);
      setResult(res);
      setEnderecoCriado(res);
      setStep(2);
    } catch (err) {
      setError(err.message || JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPropriedade = async (e) => {
    e.preventDefault();
    setPropriedadeLoading(true);
    setPropriedadeError(null);
    setPropriedadeResult(null);
    // Validação dos campos obrigatórios
    const nome = String(propriedadeForm.nome).trim();
    const cnpj = String(propriedadeForm.cnpj).trim();
    const id_endereco = parseInt(enderecoCriado.id_endereco, 10);
    if (!nome) {
      setPropriedadeError("Campo 'nome' é obrigatório e deve ser uma string não vazia.");
      setPropriedadeLoading(false);
      return;
    }
    if (!cnpj) {
      setPropriedadeError("Campo 'cnpj' é obrigatório e deve ser uma string não vazia.");
      setPropriedadeLoading(false);
      return;
    }
    if (!id_endereco || isNaN(id_endereco)) {
      setPropriedadeError("Campo 'id_endereco' é obrigatório e deve ser um número inteiro.");
      setPropriedadeLoading(false);
      return;
    }
    if (!propriedadeForm.tipo_manejo) {
      setPropriedadeError("Campo 'tipo_manejo' é obrigatório.");
      setPropriedadeLoading(false);
      return;
    }
    const payload = {
      nome,
      cnpj,
      id_endereco,
      p_abcb: Boolean(propriedadeForm.p_abcb),
      tipo_manejo: propriedadeForm.tipo_manejo
    };
    console.log("Payload propriedade enviado:", payload, {
      nomeType: typeof nome,
      cnpjType: typeof cnpj,
      id_enderecoType: typeof id_endereco,
      p_abcbType: typeof payload.p_abcb,
      tipo_manejoType: typeof payload.tipo_manejo
    });
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Token de autenticação não encontrado. Faça login novamente.");
      const res = await propriedadeService.criarPropriedade(payload, token);
      setPropriedadeResult(res);
      if (onSuccess) onSuccess(res);
      if (onClose) onClose(); // Fecha o modal após cadastro
    } catch (err) {
      setPropriedadeError(err.message || JSON.stringify(err));
    } finally {
      setPropriedadeLoading(false);
    }
  };

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
              <div className="flex items-center gap-2 text-amber-600">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-amber-600 text-white">
                  1
                </div>
                <span className="text-sm font-medium">Endereço</span>
              </div>
              <div className="w-8 h-px bg-gray-300"></div>
              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-gray-300 text-white">
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
          <form className="p-6" onSubmit={handleSubmitEndereco}>
            <div className="space-y-6">
              <div>
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
                      value={form.pais} 
                      onChange={handleChange} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-100" 
                      required
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado *
                    </label>
                    <select 
                      name="estado" 
                      value={form.estado} 
                      onChange={handleChange} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" 
                      required
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
                      value={form.cidade} 
                      onChange={handleChange} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bairro *
                    </label>
                    <input 
                      name="bairro"
                      type="text" 
                      value={form.bairro} 
                      onChange={handleChange} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rua *
                    </label>
                    <input 
                      name="rua"
                      type="text" 
                      value={form.rua} 
                      onChange={handleChange} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CEP *
                    </label>
                    <input 
                      name="cep"
                      type="text" 
                      value={form.cep} 
                      onChange={handleChange} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número
                    </label>
                    <input 
                      name="numero"
                      type="text" 
                      value={form.numero} 
                      onChange={handleChange} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ponto de Referência
                    </label>
                    <input 
                      name="ponto_referencia"
                      type="text" 
                      value={form.ponto_referencia} 
                      onChange={handleChange} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Botões da Etapa 1 */}
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
              <button 
                type="button" 
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                disabled={loading} 
                className="px-4 py-2 bg-[#FFCF78] text-gray-800 rounded-lg hover:bg-[#F2B84D] transition-colors font-medium flex items-center gap-2"
              >
                {loading ? "Enviando..." : "Cadastrar Endereço"}
              </button>
            </div>

            {result && (
              <div className="mt-4 text-green-600">
                <strong>Endereço criado:</strong>
                <pre>{JSON.stringify(result, null, 2)}</pre>
              </div>
            )}
            {error && (
              <div className="mt-4 text-red-600">
                <strong>Erro:</strong> {error}
              </div>
            )}
          </form>
        )}

        {/* Conteúdo do Modal - Etapa 2: Propriedade (Oculta por padrão) */}
        {step === 2 && (
          <form className="p-6" onSubmit={handleSubmitPropriedade}>
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
                    value={propriedadeForm.nome} 
                    onChange={handlePropriedadeChange} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CNPJ *
                  </label>
                  <input 
                    name="cnpj"
                    type="text" 
                    value={propriedadeForm.cnpj} 
                    onChange={handlePropriedadeChange} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Manejo *
                  </label>
                  <select 
                    name="tipo_manejo" 
                    value={propriedadeForm.tipo_manejo} 
                    onChange={handlePropriedadeChange} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" 
                    required
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
                      checked={propriedadeForm.p_abcb} 
                      onChange={handlePropriedadeChange} 
                      className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500" 
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
                    value={enderecoCriado?.id_endereco || ""} 
                    readOnly 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-100" 
                  />
                </div>
              </div>
            </div>

            {/* Botões da Etapa 2 */}
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
              <button 
                type="button" 
                onClick={() => setStep(1)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                ← Voltar ao Endereço
              </button>
              <button 
                type="submit" 
                disabled={propriedadeLoading} 
                className="px-4 py-2 bg-[#FFCF78] text-gray-800 rounded-lg hover:bg-[#F2B84D] transition-colors font-medium flex items-center gap-2"
              >
                {propriedadeLoading ? "Enviando..." : "Finalizar Cadastro"}
              </button>
            </div>

            {propriedadeResult && (
              <div className="mt-4 text-green-600">
                <strong>Propriedade criada:</strong>
                <pre>{JSON.stringify(propriedadeResult, null, 2)}</pre>
              </div>
            )}
            {propriedadeError && (
              <div className="mt-4 text-red-600">
                <strong>Erro:</strong> {propriedadeError}
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}