import { useEffect, useState } from "react";
import { SupabaseAuth } from "@/utils/supabaseApi";
import usuarioService from "@/services/usuarioService";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [erro, setErro] = useState(null);

  // Carrega usuários ao iniciar
  useEffect(() => {
    async function carregarUsuarios() {
      try {
        const token = await SupabaseAuth.getAccessToken();
        if (!token) throw new Error("Usuário não autenticado");

        const lista = await usuarioService.listarUsuarios(token);
        setUsuarios(lista);
        console.log("Usuários carregados:", lista);
      } catch (err) {
        console.error("Erro ao carregar usuários:", err.message);
        setErro(err.message);
      }
    }

    carregarUsuarios();
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Usuários</h1>
      {erro && <p style={{ color: "red" }}>{erro}</p>}

      <section>
        <h2>Lista de Usuários</h2>
        {usuarios.length === 0 ? (
          <p>Nenhum usuário encontrado.</p>
        ) : (
          <ul>
            {usuarios.map((u) => (
              <li key={u.id}>
                <strong>{u.nome}</strong> — {u.email} — {u.cargo}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
