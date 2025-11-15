import React from "react";
import { MapContainer, TileLayer, Polygon, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

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
  React.useEffect(() => {
    if (center) {
      map.setView(center);
    }
  }, [center, map]);
  return null;
}

export default function MapaGrupoPiquetes({ lotes, grupoAtualId, loteDestacadoId, height = "250px" }) {
  // Processa lotes para garantir coordenadas
  const lotesProcessados = (lotes || [])
    .map((lote) => ({
      ...lote,
      coordenadas: parseGeoJSONPolygon(lote.geo_mapa),
      cor: lote.grupo?.color || "#444444",
    }))
    .filter((lote) => lote.coordenadas && lote.coordenadas.length > 2);

  // Calcula centro do mapa
  const calcularCentro = (lotes) => {
    const todasCoords = lotes.flatMap((lote) => lote.coordenadas || []);
    if (todasCoords.length === 0) return [-24.738, -47.86];
    const latSum = todasCoords.reduce((sum, [lat]) => sum + lat, 0);
    const lngSum = todasCoords.reduce((sum, [, lng]) => sum + lng, 0);
    return [latSum / todasCoords.length, lngSum / todasCoords.length];
  };
  const mapCenter = calcularCentro(lotesProcessados);

  return (
    <div className="w-full">
      {lotesProcessados.length === 0 ? (
        <div className="text-center text-gray-500 py-8">Nenhum piquete encontrado para exibir no mapa.</div>
      ) : (
        <MapContainer
          center={mapCenter}
          zoom={15}
          style={{ height, width: "100%", minWidth: 0 }}
          className="w-full"
        >
          <MapCenterUpdater center={mapCenter} />
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {lotesProcessados.map((lote) => {
            const isDestacado = loteDestacadoId
              ? lote.id_lote === loteDestacadoId
              : grupoAtualId && lote.grupo && lote.grupo.id_grupo === grupoAtualId;
            return (
              <Polygon
                key={lote.id_lote}
                positions={lote.coordenadas}
                pathOptions={{
                  color: isDestacado ? lote.cor : "#444444",
                  fillColor: isDestacado ? lote.cor : "#888888",
                  fillOpacity: isDestacado ? 0.3 : 0.45,
                  weight: isDestacado ? 2 : 1,
                  dashArray: isDestacado ? "" : "4",
                }}
              >
                <Tooltip permanent={false} direction="center">
                  <div>
                    <strong>{lote.nome_lote}</strong>
                    {lote.descricao && <div className="text-sm text-gray-600">{lote.descricao}</div>}
                    {lote.grupo && (
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className="inline-block w-3 h-3 rounded-full border border-gray-300"
                          style={{ backgroundColor: lote.grupo.color }}
                          title={lote.grupo.nome_grupo}
                        ></span>
                        <span className="text-xs text-gray-700 font-medium">{lote.grupo.nome_grupo}</span>
                      </div>
                    )}
                  </div>
                </Tooltip>
              </Polygon>
            );
          })}
        </MapContainer>
      )}
    </div>
  );
}
