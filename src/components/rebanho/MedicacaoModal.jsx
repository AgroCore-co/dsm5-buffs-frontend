import { useState, useEffect } from "react";
import Button from "../Button";

export default function MedicacaoModal({ open, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    tipo_tratamento: "",
    medicacao: "",
    descricao: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Limpar mensagens de erro ao editar o formulário
    if (error) setError(null);
    if (success) setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await onSubmit(formData);
      
      // Exibir mensagem de sucesso
      setSuccess(true);
      
      // Limpar formulário após envio bem-sucedido
      setFormData({
        tipo_tratamento: "",
        medicacao: "",
        descricao: "",
      });
      
      // Fechar o modal após 1 segundo
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Erro ao cadastrar medicação:", error);
      setError(error.message || "Ocorreu um erro ao cadastrar a medicação. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Carregar dados iniciais quando é modo de edição
  useEffect(() => {
    if (initialData) {
      setFormData({
        tipo_tratamento: initialData.tipo_tratamento || "",
        medicacao: initialData.medicacao || "",
        descricao: initialData.descricao || "",
      });
      setError(null);
      setSuccess(false);
    }
  }, [initialData]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {initialData ? "Editar Medicação" : "Cadastrar Nova Medicação"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        
        {/* Mensagem de erro */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
            <p className="font-medium">Erro</p>
            <p>{error}</p>
          </div>
        )}
        
        {/* Mensagem de sucesso */}
        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">
            <p className="font-medium">Sucesso</p>
            <p>{initialData ? "Medicação atualizada com sucesso!" : "Medicação cadastrada com sucesso!"}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Tipo de Tratamento*
              </label>                <select
                name="tipo_tratamento"
                value={formData.tipo_tratamento}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFCF78]"
              >
                <option key="empty" value="">Selecione o tipo</option>
                <optgroup key="parasitario" label="Controle Parasitário">
                  <option key="vermifugacao" value="Vermifugação">Vermifugação</option>
                  <option key="carrapaticida" value="Carrapaticida">Carrapaticida</option>
                  <option key="bernicida" value="Bernicida">Bernicida</option>
                </optgroup>
                <optgroup key="medicamentosos" label="Tratamentos Medicamentosos">
                  <option key="antibiotico" value="Antibiótico">Antibiótico</option>
                  <option key="anti-inflamatorio" value="Anti-inflamatório">Anti-inflamatório</option>
                  <option key="antitermico" value="Antitérmico">Antitérmico</option>
                  <option key="antidiarreico" value="Antidiarreico">Antidiarreico</option>
                  <option key="antitoxico" value="Antitóxico">Antitóxico</option>
                </optgroup>
                <optgroup key="prevencao" label="Prevenção">
                  <option key="vacina" value="Vacina">Vacina</option>
                  <option key="profilaxia" value="Profilaxia">Profilaxia</option>
                </optgroup>
                <optgroup key="suplementacao" label="Suplementação">
                  <option key="suplemento-mineral" value="Suplemento Mineral">Suplemento Mineral</option>
                  <option key="suplemento-vitaminico" value="Suplemento Vitamínico">Suplemento Vitamínico</option>
                  <option key="suplemento-energetico" value="Suplemento Energético">Suplemento Energético</option>
                  <option key="probiotico" value="Probiótico">Probiótico</option>
                </optgroup>
                <optgroup key="outros" label="Outros">
                  <option key="hormonal" value="Hormonal">Hormonal</option>
                  <option key="topico" value="Tópico">Tópico</option>
                  <option key="outro" value="Outro">Outro</option>
                </optgroup>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Nome da Medicação*
              </label>
              <input
                type="text"
                name="medicacao"
                value={formData.medicacao}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFCF78]"
                placeholder="Ex: Ivermectina"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                rows={3}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFCF78]"
                placeholder="Descreva a medicação e sua aplicação..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              variant="secondary"
              size="medium"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Salvando..." : initialData ? "Atualizar Medicação" : "Salvar Medicação"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
