import { post } from "../lib/apiClient";

// Faz login do usuário
export async function signin({ email, password }) {
  const response = await post("/auth/signin", { email, password });
  return response.data;
}

// Renova o token de acesso
export async function refreshToken(refresh_token) {
  const response = await post("/auth/refresh", { refresh_token });
  return response.data;
}

// Faz logout do usuário
export async function signout() {
  const response = await post("/auth/signout");
  return response.data;
}

// Registra novo usuário
export async function signup({ email, password, nome, telefone }) {
  const response = await post("/auth/signup", { email, password, nome, telefone });
  return response.data;
}
