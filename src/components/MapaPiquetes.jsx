import React, { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Polygon, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import loteService from "@/services/loteService";
import area from '@turf/area';

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

export default function MapaPiquetes({ propriedadeId, lotes: externalLotes, onLotesChange }) {
  const [lotes, setLotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState([-24.738, -47.86]);
  const [drawing, setDrawing] = useState(false);
  const [drawPoints, setDrawPoints] = useState([]); // array of [lat, lng]

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
      const lotesData = await loteService.listarLotesPorPropriedade(
        propriedadeId
      );
      const lotesProcessados = lotesData
        .map((lote) => {
          const coordenadas = parseGeoJSONPolygon(lote.geo_mapa);
          return {
            ...lote,
            coordenadas,
            cor: lote.grupo?.color || '#444444',
          };
        })
        .filter((lote) => lote.coordenadas);
      setLotes(lotesProcessados);
      if (onLotesChange) {
        try { onLotesChange(lotesData); } catch (e) { /* ignore */ }
      }
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
    if (externalLotes && Array.isArray(externalLotes)) {
      const processed = externalLotes
        .map((lote) => ({
          ...lote,
          coordenadas: parseGeoJSONPolygon(lote.geo_mapa),
          cor: lote.grupo?.color || '#444444',
        }))
        .filter(l => l.coordenadas);
      setLotes(processed);
      setMapCenter(calcularCentro(processed));
      return;
    }
    if (propriedadeId) {
      carregarLotes();
    }
  }, [propriedadeId, carregarLotes, externalLotes]);

  const finishDrawing = () => {
    if (!drawPoints || drawPoints.length < 3) return;
    const coords = drawPoints.map(([lat, lng]) => [lng, lat]);
    const geo_mapa = { type: 'Polygon', coordinates: [[...coords, coords[0]]] };
    let area_m2 = null;
    try {
      area_m2 = Math.round(area(geo_mapa));
    } catch (err) {
      console.warn('Erro ao calcular área com Turf:', err);
      area_m2 = null;
    }
    if (typeof onLotesChange === 'function') {
      try { onLotesChange(prev => prev); } catch (e) { /* no-op */ }
    }
    window.dispatchEvent(new CustomEvent('mapa:nova-geometria', { detail: { geo_mapa, area_m2 } }));
    setDrawing(false);
    setDrawPoints([]);
  };

  const cancelDrawing = () => {
    setDrawing(false);
    setDrawPoints([]);
  };

  useEffect(() => {
    if (lotes.length > 0) {
      setMapCenter(calcularCentro(lotes));
    }
  }, [lotes]);

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
          <MapInteractionController drawing={drawing} />
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* drawing handlers: capture clicks when drawing */}
          {drawing && (
            <MapClickHandler onClick={(latlng) => {
              setDrawPoints(prev => [...prev, [latlng.lat, latlng.lng]]);
            }} />
          )}

          {/* show temporary polygon while drawing */}
          {drawPoints.length >= 2 && (
            <Polygon positions={drawPoints} pathOptions={{ color: '#337ab7', fillOpacity: 0.15 }} />
          )}

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
          ))}
        </MapContainer>
      </div>

      {/* drawing controls */}
      <div className="flex gap-2 mt-2">
        {!drawing ? (
          <button className="bg-[#FFCF78] text-gray-800 px-3 py-1 rounded text-xs font-bold" onClick={() => setDrawing(true)}>Desenhar Lote</button>
        ) : (
          <>
            <button className="bg-green-500 text-white px-3 py-1 rounded text-xs font-bold" onClick={finishDrawing} disabled={drawPoints.length < 3}>Finalizar</button>
            <button className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-xs font-bold" onClick={cancelDrawing}>Cancelar</button>
            <div className="text-xs text-gray-600 self-center">Pontos: {drawPoints.length}</div>
          </>
        )}
      </div>
    </div>
  );
}

// MapClickHandler component uses leaflet map events to capture clicks
function MapClickHandler({ onClick }) {
  const map = useMap();
  useEffect(() => {
    function handleMapClick(e) {
      onClick(e.latlng);
    }
    map.on('click', handleMapClick);
    return () => map.off('click', handleMapClick);
  }, [map, onClick]);
  return null;
}

// Controls map interactions (drag/zoom) and cursor while drawing
function MapInteractionController({ drawing }) {
  const map = useMap();
  useEffect(() => {
    const container = map.getContainer();
    const prevCursor = container.style.cursor || '';
    if (drawing) {
      // change cursor to crosshair and disable interactions
      try { container.style.cursor = 'crosshair'; } catch (e) {}
      try { map.dragging && map.dragging.disable(); } catch (e) {}
      try { map.doubleClickZoom && map.doubleClickZoom.disable(); } catch (e) {}
      try { map.scrollWheelZoom && map.scrollWheelZoom.disable(); } catch (e) {}
      try { map.boxZoom && map.boxZoom.disable(); } catch (e) {}
      try { map.keyboard && map.keyboard.disable(); } catch (e) {}
      try { map.tap && map.tap.disable && map.tap.disable(); } catch (e) {}
      try { map.touchZoom && map.touchZoom.disable && map.touchZoom.disable(); } catch (e) {}
    } else {
      try { container.style.cursor = prevCursor || ''; } catch (e) {}
      try { map.dragging && map.dragging.enable(); } catch (e) {}
      try { map.doubleClickZoom && map.doubleClickZoom.enable(); } catch (e) {}
      try { map.scrollWheelZoom && map.scrollWheelZoom.enable(); } catch (e) {}
      try { map.boxZoom && map.boxZoom.enable(); } catch (e) {}
      try { map.keyboard && map.keyboard.enable(); } catch (e) {}
      try { map.tap && map.tap.enable && map.tap.enable(); } catch (e) {}
      try { map.touchZoom && map.touchZoom.enable && map.touchZoom.enable(); } catch (e) {}
    }

    return () => {
      try { container.style.cursor = prevCursor || ''; } catch (e) {}
      try { map.dragging && map.dragging.enable(); } catch (e) {}
      try { map.doubleClickZoom && map.doubleClickZoom.enable(); } catch (e) {}
      try { map.scrollWheelZoom && map.scrollWheelZoom.enable(); } catch (e) {}
      try { map.boxZoom && map.boxZoom.enable(); } catch (e) {}
      try { map.keyboard && map.keyboard.enable(); } catch (e) {}
      try { map.tap && map.tap.enable && map.tap.enable(); } catch (e) {}
      try { map.touchZoom && map.touchZoom.enable && map.touchZoom.enable(); } catch (e) {}
    };
  }, [map, drawing]);
  return null;
}
