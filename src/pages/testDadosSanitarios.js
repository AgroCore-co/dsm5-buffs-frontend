// src/pages/testDadosSanitarios.jsx
import { useEffect } from "react";
import dadosSanitariosService from "../services/dadosSanitariosService.js";

const TOKEN = "eyJhbGciOiJIUzI1NiIsImtpZCI6IjE3azBFTFRGeFdLSm8vRlciLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3Nudm5yaGViZHNyZ29rbnNtcm5wLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI0NjA1YTVjMC05YTgyLTQ0ZjAtODEyNC03MjViNmQyMTk2Y2UiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzU4MjM5NDM5LCJpYXQiOjE3NTgyMzU4MzksImVtYWlsIjoicGF1bG9jYW5kaWFuaTA0QGdtYWlsLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiLCJnb29nbGUiXX0sInVzZXJfbWV0YWRhdGEiOnsiYXZhdGFyX3VybCI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0lVc1FXNEIxeVRHWjBDN1U5N0lOUE9KRUxpai1xMnFzdkN6S2E5bFBZVUtxS28zUT1zOTYtYyIsImVtYWlsIjoicGF1bG9jYW5kaWFuaTA0QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmdWxsX25hbWUiOiJQYXVsbyBDZXNhciIsImlzcyI6Imh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbSIsIm5hbWUiOiJQYXVsbyBDZXNhciIsInBob25lX3ZlcmlmaWVkIjpmYWxzZSwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0lVc1FXNEIxeVRHWjBDN1U5N0lOUE9KRUxpai1xMnFzdkN6S2E5bFBZVUtxS28zUT1zOTYtYyIsInByb3ZpZGVyX2lkIjoiMTAwNjU0NzQyMTg0NTEyMzY4MTg4Iiwic3ViIjoiMTAwNjU0NzQyMTg0NTEyMzY4MTg4In0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoib2F1dGgiLCJ0aW1lc3RhbXAiOjE3NTgyMzIzODR9XSwic2Vzc2lvbl9pZCI6IjMxMzhmMDFlLWQ2OWMtNGMxMS05ZWUyLTM5NmMyYmU1YTRjNyIsImlzX2Fub255bW91cyI6ZmFsc2V9.R_bo-bgLxx7cahfpc_bjEiKvGMuq9pVRaN0l7tRXfDc";
const ID_BUFALO = 15;

export default function TestDadosSanitarios() {
  useEffect(() => {
    const testarDadosSanitarios = async () => {
      try {
        console.log("🚀 Iniciando teste de dados sanitários...");
        const dados = await dadosSanitariosService.listarDadosSanitariosPorBufalo(
          ID_BUFALO,
          TOKEN
        );
        console.log("🎯 Resultado final:", dados);
      } catch (error) {
        console.error("💥 Falha ao buscar dados sanitários:", error);
      }
    };

    testarDadosSanitarios();
  }, []);

  return <div>Verifique o console para os dados sanitários.</div>;
}
