// src/services/loteService.js
import { apiFetch } from "@/lib/apiClient";

// --- HELPER: GeoJSON Polygon -> WKT POLYGON ---
function geoToWKT(geo) {
  // Se já vier como string WKT, só retorna
  if (typeof geo === "string") {
    const trimmed = geo.trim();
    if (trimmed.toUpperCase().startsWith("POLYGON(")) return trimmed;
  }

  // GeoJSON { type: "Polygon", coordinates: [ [ [lng, lat], ... ] ] }
  if (geo && geo.type === "Polygon" && Array.isArray(geo.coordinates)) {
    let ring = geo.coordinates[0] || [];
    // Garante fechamento do anel
    if (ring.length >= 3) {
      const first = ring[0];
      const last = ring[ring.length - 1];
      if (first[0] !== last[0] || first[1] !== last[1]) {
        ring = [...ring, first];
      }
    }
    // Monta "lng lat" (WKT usa ordem LON LAT)
    const pairs = ring.map(([lng, lat]) => `${Number(lng)} ${Number(lat)}`);
    return `POLYGON((${pairs.join(", ")}))`;
  }

  throw new Error("Campo 'geo_mapa' inválido: forneça WKT POLYGON ou GeoJSON Polygon.");
}

/**
 * Lista todos os lotes (piquetes) georreferenciados.
 */
const listarLotes = async (token) => {
  try {
    const data = await apiFetch(`/lotes`, {
      method: "GET",
      token,
    });
    if (!Array.isArray(data)) {
      console.warn("Resposta inesperada em /lotes:", data);
      return [];
    }
    console.log("✅ Lotes carregados:", data);
    return data;
  } catch (error) {
    console.error("❌ Erro ao listar lotes:", error);
    throw error;
  }
};

/**
 * Cria um novo lote (piquete) georreferenciado.
 */
const criarLote = async (payload, token) => {
  try {
    const nome = String(payload?.nome_lote ?? "").trim();
    if (!nome) throw new Error("Campo 'nome_lote' é obrigatório e não pode ser vazio.");

    const idProp = Number(payload?.id_propriedade);
    if (!Number.isInteger(idProp)) throw new Error("Campo 'id_propriedade' deve ser um inteiro.");

    if (!payload?.geo_mapa) throw new Error("Campo 'geo_mapa' é obrigatório.");

    // Converte para WKT se vier em GeoJSON
    const wkt = geoToWKT(payload.geo_mapa);

    const body = {
      nome_lote: nome,
      id_propriedade: idProp,
      descricao: payload?.descricao ?? null,
      geo_mapa: wkt, // <-- agora no formato que a API espera
    };

    const data = await apiFetch(`/lotes`, {
      method: "POST",
      token,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    console.log("✅ Lote criado com sucesso:", data);
    return data;
  } catch (error) {
    console.error("❌ Erro ao criar lote:", error);
    throw error;
  }
};

export default {
  listarLotes,
  criarLote,
};
