import React, { useState } from "react";
import usuarioService from "@/services/usuarioService";
import { useAuth } from "@/hooks/useAuth";


export default function EditarUsuarioModal({ open, onClose, usuario, onUsuarioAtualizado }) {
  const { getAccessToken } = useAuth();
  const [form, setForm] = useState({
    nome: usuario?.nome || "",
    telefone: usuario?.telefone || ""
  });
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(false);

  React.useEffect(() => {
    setForm({
      nome: usuario?.nome || "",
      telefone: usuario?.telefone || ""
    });
    setErro(null);
    setSucesso(false);
  }, [usuario, open]);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setErro(null);
    setSucesso(false);
    try {
      console.log("[DEBUG] PATCH usuario id:", usuario?.id_usuario, "payload:", form);
      const token = await getAccessToken();
      await usuarioService.editarUsuario(usuario.id_usuario, {
        nome: form.nome,
        telefone: form.telefone
      }, token);
      setSucesso(true);
      if (onUsuarioAtualizado) onUsuarioAtualizado();
    } catch (err) {
      setErro("Erro ao atualizar usuário.");
    } finally {
      setCarregando(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1004] flex items-center justify-center bg-black/45">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold"
          onClick={onClose}
          aria-label="Fechar"
        >
          ×
        </button>
  <h2 className="text-2xl font-bold mb-4 text-gray-800">Editar Funcionário</h2>
  <div className="mb-2 text-xs text-gray-500">ID do usuário: <span className="font-mono">{usuario?.id_usuario ?? "(sem id)"}</span></div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Nome</label>
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Telefone</label>
            <input
              type="text"
              name="telefone"
              value={form.telefone}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>

          {erro && <div className="text-red-500">{erro}</div>}
          {sucesso && <div className="text-green-600">Usuário atualizado com sucesso!</div>}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300"
              disabled={carregando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#FFCF78] text-gray-800 font-bold hover:bg-[#F2B84D]"
              disabled={carregando}
            >
              {carregando ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
