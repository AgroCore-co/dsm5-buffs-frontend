"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import loteService from "@/services/loteService";

export default function TestePostLote() {
  const { getAccessToken } = useAuth();
  const [log, setLog] = useState("");
  const [err, setErr] = useState("");

  // === Payload EXATO que você pediu ===
  const payloadExato = {
    nome_lote: "Piquete Teste GeoJSON 2",
    id_propriedade: 2,
    descricao: "Teste de criação via Postman com GeoJSON.",
    geo_mapa: {
      type: "Polygon",
      coordinates: [
        [
          [-48.84, -24.50],
          [-48.83, -24.50],
          [-48.83, -24.49],
          [-48.84, -24.49]
        ]
      ]
    }
  };

  const enviarViaService = async () => {
    setErr("");
    setLog("");
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Token de acesso não encontrado.");

      console.log("POST VIA SERVICE -> /lotes", payloadExato);
      setLog(`POST VIA SERVICE -> /lotes\n${JSON.stringify(payloadExato, null, 2)}`);

      const resp = await loteService.criarLote(payloadExato, token);
      setLog((prev) => prev + `\n\n✅ Resposta:\n${JSON.stringify(resp, null, 2)}`);
    } catch (e) {
      console.error(e);
      setErr(e.message || "Erro ao enviar via service.");
    }
  };

  // Útil para isolar se o erro vem do service/validações internas:
  const enviarDiretoFetch = async () => {
    setErr("");
    setLog("");
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Token de acesso não encontrado.");

      console.log("POST DIRETO FETCH -> /lotes", payloadExato);
      setLog(`POST DIRETO FETCH -> /lotes\n${JSON.stringify(payloadExato, null, 2)}`);

      const resp = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/lotes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payloadExato)
      });

      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        throw new Error(
          `HTTP ${resp.status} - ${resp.statusText}\n${JSON.stringify(data)}`
        );
      }

      setLog((prev) => prev + `\n\n✅ Resposta:\n${JSON.stringify(data, null, 2)}`);
    } catch (e) {
      console.error(e);
      setErr(e.message || "Erro ao enviar via fetch direto.");
    }
  };

  return (
    <div style={{ maxWidth: 880, margin: "24px auto", padding: 16 }}>
      <h1 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>
        Teste — POST /lotes com body EXATO
      </h1>

      <div style={{ marginBottom: 12, fontFamily: "monospace", fontSize: 12, whiteSpace: "pre-wrap" }}>
        <strong>Body que será enviado:</strong>
        <pre>{JSON.stringify(payloadExato, null, 2)}</pre>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button
          onClick={enviarViaService}
          style={{ padding: "10px 14px", background: "#059669", color: "#fff", borderRadius: 6 }}
        >
          Enviar via loteService.criarLote
        </button>
        <button
          onClick={enviarDiretoFetch}
          style={{ padding: "10px 14px", background: "#2563eb", color: "#fff", borderRadius: 6 }}
        >
          Enviar via fetch direto
        </button>
      </div>

      {err && (
        <div style={{ background: "#fee2e2", border: "1px solid #fecaca", padding: 10, marginBottom: 12 }}>
          <strong>Erro:</strong> {err}
        </div>
      )}

      {log && (
        <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", padding: 10 }}>
          <strong>Log:</strong>
          <pre style={{ whiteSpace: "pre-wrap" }}>{log}</pre>
        </div>
      )}
    </div>
  );
}
