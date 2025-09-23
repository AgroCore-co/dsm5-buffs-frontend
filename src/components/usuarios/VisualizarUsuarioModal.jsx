import React, { useEffect, useState } from "react";
import usuarioService from "@/services/usuarioService";
import EditarUsuarioModal from "./EditarUsuarioModal";

export default function VisualizarUsuarioModal({ open, onClose, usuario }) {
  const [usuarioDetalhado, setUsuarioDetalhado] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [editarOpen, setEditarOpen] = useState(false);

  useEffect(() => {
    const fetchUsuario = async () => {
      if (!open || !usuario?.id_usuario) {
        setUsuarioDetalhado(null);
        setErro(null);
        setCarregando(false);
        return;
      }
      setCarregando(true);
      setErro(null);
      try {
        // Busca sem autenticação, pois é admin ou público (ajuste se precisar de token)
        const user = await usuarioService.buscarUsuarioPorId(usuario.id_usuario);
        setUsuarioDetalhado(user);
      } catch (e) {
        setErro("Erro ao buscar detalhes do usuário.");
        setUsuarioDetalhado(null);
      } finally {
        setCarregando(false);
      }
    };
    fetchUsuario();
  }, [open, usuario, editarOpen]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1003] flex items-center justify-center bg-black/45">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold"
          onClick={onClose}
          aria-label="Fechar"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Detalhes do Funcionário</h2>
        {carregando ? (
          <div className="text-gray-500">Carregando...</div>
        ) : erro ? (
          <div className="text-red-500">{erro}</div>
        ) : usuarioDetalhado ? (
          <>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-gray-700">Nome:</span> {usuarioDetalhado.nome}
              </div>
              <div>
                <span className="font-semibold text-gray-700">E-mail:</span> {usuarioDetalhado.email}
              </div>
              <div>
                <span className="font-semibold text-gray-700">Cargo:</span> {usuarioDetalhado.cargo}
              </div>
              <div>
                <span className="font-semibold text-gray-700">Telefone:</span> {usuarioDetalhado.telefone}
              </div>
              <div>
                <span className="font-semibold text-gray-700">Data de Admissão:</span> {usuarioDetalhado.created_at ? new Date(usuarioDetalhado.created_at).toLocaleDateString() : "-"}
              </div>
              <div>
                <span className="font-semibold text-gray-700">Status:</span> <span className="px-2 py-1 rounded-full bg-[#9DFFBE] text-gray-800 font-bold">Ativo</span>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                className="px-4 py-2 rounded-lg bg-[#FFCF78] text-gray-800 font-bold hover:bg-[#F2B84D]"
                onClick={() => setEditarOpen(true)}
              >
                Editar
              </button>
            </div>
            <EditarUsuarioModal
              open={editarOpen}
              onClose={() => setEditarOpen(false)}
              usuario={usuarioDetalhado}
              onUsuarioAtualizado={() => setEditarOpen(false)}
            />
          </>
        ) : (
          <div className="text-gray-500">Nenhum usuário selecionado.</div>
        )}
      </div>
    </div>
  );
}
