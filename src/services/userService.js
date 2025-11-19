import { get, post, patch } from "../lib/apiClient";

// Busca o perfil do usuário logado
export async function getMyProfile() {
  const response = await get("/usuarios/me");
  return response.data;
}

// Cria o perfil de proprietário
export async function createOwnerProfile({ nome, telefone }) {
  const response = await post("/usuarios", { nome, telefone });
  return response.data;
}

// Busca usuário por ID
export async function getUserById(id) {
  if (!id) throw new Error("ID do usuário é obrigatório");
  const response = await get(`/usuarios/${id}`);
  return response.data;
}

// Atualiza os dados de um usuário (Admin)
export async function updateUser(id, { nome, telefone, id_endereco }) {
  if (!id) throw new Error("ID do usuário é obrigatório");
  const response = await patch(`/usuarios/${id}`, { nome, telefone, id_endereco });
  return response.data;
}
