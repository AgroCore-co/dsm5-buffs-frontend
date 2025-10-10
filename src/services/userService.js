import { get, post } from "../lib/apiClient";

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
