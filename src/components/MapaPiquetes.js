import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Polygon, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import loteService from "@/services/loteService";

/* ========================= Leaflet icon fix ========================= */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ========================= Helper: Converter GeoJSON para coordenadas Leaflet ========================= */
const parseGeoJSONPolygon = (geoJson) => {
  if (!geoJson) return null;
  try {
    if (geoJson.type === "Polygon" && geoJson.coordinates) {
      const coordinates = geoJson.coordinates[0];
      return coordinates.map(([lng, lat]) => [lat, lng]);
    }
    return null;
  } catch (error) {
    console.error("Erro ao converter GeoJSON:", error);
    return null;
  }
};

/* ========================= Componente Principal ========================= */
export default function MapaPiquetes({ propriedadeId }) {
  const [lotes, setLotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const carregarLotes = async () => {
    if (!propriedadeId) {
      setLotes([]);
      return;
    }
    setLoading(true);
    setError(null);

    try {
      // Aqui você pode pegar o token de onde quiser, se necessário
      // const token = await getAccessToken();

      const lotesData = await loteService.listarLotesPorPropriedade(
        propriedadeId,
        null // ou token se necessário
      );

      const lotesProcessados = lotesData
        .map((lote) => {
          const coordenadas = parseGeoJSONPolygon(lote.geo_mapa);
          return {
            ...lote,
            coordenadas,
            cor: `hsl(${Math.random() * 360}, 70%, 50%)`,
          };
        })
        .filter((lote) => lote.coordenadas);

      setLotes(lotesProcessados);
    } catch (err) {
      console.error("Erro ao carregar lotes:", err);
      setError(err.message || "Erro ao carregar lotes");
      setLotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarLotes();
  }, [propriedadeId]);

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800">Mapa de Piquetes</h3>
        {propriedadeId && (
          <span className="text-sm text-gray-600">
            Propriedade ID: {propriedadeId} • {lotes.length} lote{lotes.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {loading && (
        <div className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm">
          Carregando lotes...
        </div>
      )}
      {error && (
        <div className="bg-red-500 text-white px-3 py-1 rounded-md text-sm">{error}</div>
      )}

      <div className="rounded-lg overflow-hidden border border-gray-200" style={{ height: "500px" }}>
        <MapContainer
          center={[-24.738, -47.86]}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {lotes.map((lote) => (
            <Polygon
              key={lote.id_lote}
              positions={lote.coordenadas}
              pathOptions={{
                color: lote.cor,
                fillColor: lote.cor,
                fillOpacity: 0.3,
                weight: 2,
              }}
            >
              <Tooltip permanent={false} direction="center">
                <div>
                  <strong>{lote.nome_lote}</strong>
                  {lote.descricao && <div className="text-sm text-gray-600">{lote.descricao}</div>}
                </div>
              </Tooltip>
            </Polygon>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
