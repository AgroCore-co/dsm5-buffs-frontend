import React, { useState, useCallback, useEffect } from "react";

/**
 * Modal para criação de novo búfalo
 * 
 * @param {Object} props
 * @param {boolean} props.open - Se o modal está aberto
 * @param {Function} props.onClose - Função para fechar o modal
 * @param {Function} props.onSubmit - Função para enviar o formulário
 */
export default function CreateBuffaloModal({ open, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    nome: "",
    brinco: "",
    dt_nascimento: "",
    nivel_maturidade: "",
    sexo: "",
    id_raca: "",
    id_propriedade: "",
    id_grupo: "",
    id_pai: "",
    id_mae: "",
    status: true,
  });
  
  const [activeTab, setActiveTab] = useState("basicInfo");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);
  
  const stop = useCallback((e) => e.stopPropagation(), []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/45 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-[min(96vw,800px)] max-h-[92vh] bg-white rounded-2xl shadow-2xl ring-1 ring-gray-200 flex flex-col"
        onClick={stop}
      >
        {/* Header (sticky) */}
        <div className="sticky top-0 z-10 border-b bg-white">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-start gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
                    Cadastrar Novo Búfalo
                  </h2>
                </div>
                <p className="text-sm text-gray-500">
                  Preencha os dados para cadastrar um novo animal
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="h-10 w-10 grid place-items-center rounded-xl border border-gray-200 hover:bg-gray-50 text-xl font-bold text-gray-600"
              aria-label="Fechar modal"
            >
              ×
            </button>
          </div>

          {/* Abas */}
          <div className="flex gap-1 px-3 pb-3">
            {/*
              { id: "basicInfo", label: "Dados Básicos" },
              { id: "additionalInfo", label: "Dados Adicionais" },
              { id: "parentage", label: "Filiação" }
            */}
            {/*
              activeTab === "basicInfo" && (
                <BasicInfoTab formData={formData} handleChange={handleChange} />
              )
            */}
            {/*
              activeTab === "additionalInfo" && (
                <AdditionalInfoTab formData={formData} handleChange={handleChange} />
              )
            */}
            {/*
              activeTab === "parentage" && (
                <ParentageTab formData={formData} handleChange={handleChange} />
              )
            */}
          </div>
        </div>

        {/* Conteúdo (rolável apenas aqui) */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* DADOS BÁSICOS */}
            {activeTab === "basicInfo" && (
              <div className="relative rounded-xl border border-gray-200 bg-white">
                <div className="absolute left-0 top-0 h-full w-1.5 bg-amber-400 rounded-l-xl" />
                <div className="p-5 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Informações Principais
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                      <input
                        type="text"
                        name="nome"
                        placeholder="Nome do animal"
                        value={formData.nome}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Brinco/Tag</label>
                      <input
                        type="text"
                        name="brinco"
                        placeholder="Identificação única"
                        value={formData.brinco}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
                      <input
                        type="date"
                        name="dt_nascimento"
                        value={formData.dt_nascimento}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sexo</label>
                      <select
                        name="sexo"
                        value={formData.sexo}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                        required
                      >
                        <option value="">Selecione o sexo</option>
                        <option value="M">Macho</option>
                        <option value="F">Fêmea</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* DADOS ADICIONAIS */}
            {activeTab === "additionalInfo" && (
              <div className="relative rounded-xl border border-gray-200 bg-white">
                <div className="absolute left-0 top-0 h-full w-1.5 bg-emerald-400 rounded-l-xl" />
                <div className="p-5 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Categorização e Status
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nível de Maturidade</label>
                      <select
                        name="nivel_maturidade"
                        value={formData.nivel_maturidade}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        required
                      >
                        <option value="">Selecione o nível</option>
                        <option value="Bezerro">Bezerro</option>
                        <option value="Novilho">Novilho</option>
                        <option value="Novilha">Novilha</option>
                        <option value="Vaca">Vaca</option>
                        <option value="Touro">Touro</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Raça</label>
                      <select
                        name="id_raca"
                        value={formData.id_raca}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      >
                        <option value="">Selecione a raça</option>
                        <option value="Murrah">Murrah</option>
                        <option value="Jafarabadi">Jafarabadi</option>
                        <option value="Mediterrâneo">Mediterrâneo</option>
                        <option value="Surti">Surti</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Grupo/Lote</label>
                      <input
                        type="text"
                        name="id_grupo"
                        placeholder="ID do Grupo"
                        value={formData.id_grupo}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      >
                        <option value={true}>Ativo</option>
                        <option value={false}>Inativo</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Propriedade</label>
                      <input
                        type="text"
                        name="id_propriedade"
                        placeholder="ID da Propriedade"
                        value={formData.id_propriedade}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* FILIAÇÃO */}
            {activeTab === "parentage" && (
              <div className="relative rounded-xl border border-gray-200 bg-white">
                <div className="absolute left-0 top-0 h-full w-1.5 bg-blue-400 rounded-l-xl" />
                <div className="p-5 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Dados de Filiação
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ID do Pai</label>
                      <input
                        type="text"
                        name="id_pai"
                        placeholder="Identificação do pai"
                        value={formData.id_pai}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ID da Mãe</label>
                      <input
                        type="text"
                        name="id_mae"
                        placeholder="Identificação da mãe"
                        value={formData.id_mae}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Botões (fixos na parte inferior) */}
            <div className="sticky bottom-0 flex justify-end gap-2 pt-4 border-t bg-white">
              <button
                type="button"
                className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                onClick={onClose}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors shadow-sm"
              >
                Salvar Búfalo
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
