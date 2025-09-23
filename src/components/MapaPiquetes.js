import React, { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Polygon, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import loteService from "@/services/loteService";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

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

function MapCenterUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center);
    }
  }, [center, map]);
  return null;
}

function ResetViewControl({ center, zoom = 15 }) {
  const map = useMap();
  useEffect(() => {
    const control = L.control({ position: "topleft" });
    control.onAdd = function () {
      const div = L.DomUtil.create("div", "leaflet-bar leaflet-control leaflet-control-custom");
      div.style.backgroundColor = "white";
      div.style.width = "32px";
      div.style.height = "32px";
      div.style.display = "flex";
      div.style.alignItems = "center";
      div.style.justifyContent = "center";
      div.style.cursor = "pointer";
      div.title = "Centralizar nos piquetes";
      div.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></svg>';
      div.onclick = () => {
        map.setView(center, zoom);
      };
      return div;
    };
    control.addTo(map);
    return () => {
      control.remove();
    };
  }, [center, zoom, map]);
  return null;
}

export default function MapaPiquetes({ propriedadeId }) {
  const [lotes, setLotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState([-24.738, -47.86]);

  const calcularCentro = (lotes) => {
    const todasCoords = lotes.flatMap((lote) => lote.coordenadas || []);
    if (todasCoords.length === 0) return [-24.738, -47.86];
    const latSum = todasCoords.reduce((sum, [lat]) => sum + lat, 0);
    const lngSum = todasCoords.reduce((sum, [, lng]) => sum + lng, 0);
    return [latSum / todasCoords.length, lngSum / todasCoords.length];
  };

  const carregarLotes = useCallback(async () => {
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
      setMapCenter(calcularCentro(lotesProcessados));
    } catch (err) {
      console.error("Erro ao carregar lotes:", err);
      setError(err.message || "Erro ao carregar lotes");
      setLotes([]);
    } finally {
      setLoading(false);
    }
  }, [propriedadeId]);

  useEffect(() => {
    if (propriedadeId) {
      carregarLotes();
    }
  }, [propriedadeId]); // Executa quando propriedadeId muda

  useEffect(() => {
    if (lotes.length > 0) {
      setMapCenter(calcularCentro(lotes));
    }
  }, [lotes]); // Centraliza o mapa nos piquetes após carregamento

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
          center={mapCenter}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
        >
          <MapCenterUpdater center={mapCenter} />
          <ResetViewControl center={mapCenter} zoom={15} />
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
