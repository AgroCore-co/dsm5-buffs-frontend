// src/services/loteService.js
import { apiFetch } from "@/lib/apiClient";

// --- HELPER: GeoJSON Polygon -> WKT POLYGON ---
function geoToWKT(geo) {
  if (typeof geo === "string") {
    const trimmed = geo.trim();
    if (trimmed.toUpperCase().startsWith("POLYGON(")) return trimmed;
  }

  if (geo && geo.type === "Polygon" && Array.isArray(geo.coordinates)) {
    let ring = geo.coordinates[0] || [];
    if (ring.length >= 3) {
      const first = ring[0];
      const last = ring[ring.length - 1];
      if (first[0] !== last[0] || first[1] !== last[1]) {
        ring = [...ring, first];
      }
    }
    const pairs = ring.map(([lng, lat]) => `${Number(lng)} ${Number(lat)}`);
    return `POLYGON((${pairs.join(", ")}))`;
  }

  throw new Error("Campo 'geo_mapa' inválido: forneça WKT POLYGON ou GeoJSON Polygon.");
}



/**
 * Lista todos os lotes de uma propriedade específica.
 */
const listarLotesPorPropriedade = async (idPropriedade, token) => {
  try {
    if (!idPropriedade) throw new Error("É necessário informar um id_propriedade válido.");

    const data = await apiFetch(`/lotes/propriedade/${idPropriedade}`, {
      method: "GET",
      token,
    });

    if (!Array.isArray(data)) {
      console.warn("Resposta inesperada em /lotes/propriedade:", data);
      return [];
    }

    console.log(`✅ Lotes da propriedade ${idPropriedade} carregados:`, data);
    return data;
  } catch (error) {
    console.error("❌ Erro ao listar lotes da propriedade:", error);
    throw error;
  }
};


const criarLote = async (payload, token) => {
  try {
    // Validações
    const nome = String(payload?.nome_lote ?? "").trim()
    if (!nome) throw new Error("Campo 'nome_lote' é obrigatório e não pode ser vazio.")

    const idProp = Number(payload?.id_propriedade)
    if (!Number.isInteger(idProp)) throw new Error("Campo 'id_propriedade' deve ser um inteiro.")

    if (!payload?.geo_mapa || typeof payload.geo_mapa !== "object") {
      throw new Error("Campo 'geo_mapa' é obrigatório e deve ser um objeto GeoJSON.")
    }

    // Monta o corpo da requisição conforme a API espera
    const body = {
      nome_lote: nome,
      id_propriedade: idProp,
      descricao: payload?.descricao ?? null,
      geo_mapa: payload.geo_mapa,
    }

    // Chamada ao apiFetch (usa 'data', não 'body')
    const data = await apiFetch(`/lotes`, {
      method: "POST",
      token,
      data: body,
    })

    console.log("✅ Lote criado com sucesso:", data)
    return data
  } catch (error) {
    console.error("❌ Erro ao criar lote:", error.message)
    throw error
  }
}

const loteService = {
  listarLotesPorPropriedade,
  criarLote,
};

export default loteService;
