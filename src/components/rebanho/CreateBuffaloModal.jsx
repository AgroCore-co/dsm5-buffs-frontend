import React, { useState } from "react";

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Cadastrar Búfalo</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Nome */}
          <input
            type="text"
            name="nome"
            placeholder="Nome"
            value={formData.nome}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          {/* Brinco */}
          <input
            type="text"
            name="brinco"
            placeholder="Brinco"
            value={formData.brinco}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          {/* Data de Nascimento */}
          <input
            type="date"
            name="dt_nascimento"
            value={formData.dt_nascimento}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          {/* Nível de Maturidade */}
          <select
            name="nivel_maturidade"
            value={formData.nivel_maturidade}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Selecione o nível</option>
            <option value="Bezerro">Bezerro</option>
            <option value="Novilho">Novilho</option>
            <option value="Novilha">Novilha</option>
            <option value="Vaca">Vaca</option>
            <option value="Touro">Touro</option>
          </select>

          {/* Sexo */}
          <select
            name="sexo"
            value={formData.sexo}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Selecione o sexo</option>
            <option value="M">Macho</option>
            <option value="F">Fêmea</option>
          </select>

          {/* Raça */}
          <select
            name="id_raca"
            value={formData.id_raca}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Selecione a raça</option>
            <option value="Murrah">Murrah</option>
            <option value="Jafarabadi">Jafarabadi</option>
            <option value="Mediterrâneo">Mediterrâneo</option>
            <option value="Surti">Surti</option>
          </select>

          {/* Propriedade */}
          <input
            type="text"
            name="id_propriedade"
            placeholder="ID da Propriedade"
            value={formData.id_propriedade}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          {/* Grupo */}
          <input
            type="text"
            name="id_grupo"
            placeholder="ID do Grupo"
            value={formData.id_grupo}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          {/* Pai */}
          <input
            type="text"
            name="id_pai"
            placeholder="ID do Pai"
            value={formData.id_pai}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          {/* Mãe */}
          <input
            type="text"
            name="id_mae"
            placeholder="ID da Mãe"
            value={formData.id_mae}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          {/* Status */}
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value={true}>Ativo</option>
            <option value={false}>Inativo</option>
          </select>

          {/* Botões */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
