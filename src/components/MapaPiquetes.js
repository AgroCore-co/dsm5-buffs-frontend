import React, { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useAuth } from "@/hooks/useAuth";
import { useProperty } from "@/hooks/useProperty";
import loteService from "@/services/loteService";
import { Plus, Save, MapPin } from "lucide-react";

// Corrige o ícone padrão do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ========================= Helpers ========================= */

// Extrai anel [ [lat,lng], ... ] de GeoJSON Polygon
function getLatLngRingFromGeo(geo) {
  if (
    geo &&
    typeof geo === "object" &&
    geo.type === "Polygon" &&
    Array.isArray(geo.coordinates)
  ) {
    const ring = geo.coordinates[0] || [];
    return ring.map(([lng, lat]) => [lat, lng]); // converte para [lat,lng]
  }
  return null;
}

// Conversão metros → graus (aprox)
function metersToDegrees(lat, dx, dy) {
  const latDegree = dy / 111320;
  const lngDegree = dx / (111320 * Math.cos((lat * Math.PI) / 180));
  return [latDegree, lngDegree];
}

// Ajusta a view para caber todos os polígonos
function ringsToBounds(rings) {
  let minLat = Infinity,
    minLng = Infinity,
    maxLat = -Infinity,
    maxLng = -Infinity;
  rings.forEach((ring) => {
    ring.forEach(([lat, lng]) => {
      if (lat < minLat) minLat = lat;
      if (lng < minLng) minLng = lng;
      if (lat > maxLat) maxLat = lat;
      if (lng > maxLng) maxLng = lng;
    });
  });
  if (minLat === Infinity) return null;
  return [
    [minLat, minLng],
    [maxLat, maxLng],
  ];
}

function FitBoundsToPolygons({ rings, enabled }) {
  const map = useMap();
  useEffect(() => {
    if (!enabled) return;
    if (!rings?.length) return;
    const bounds = ringsToBounds(rings);
    if (bounds)
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: 18, animate: true });
  }, [enabled, rings, map]);
  return null;
}

function InvalidateSizeOnChange({ heightKey }) {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      if (map) map.invalidateSize();
    }, 100);
    return () => clearTimeout(timer);
  }, [heightKey, map]);

  useEffect(() => {
    const onResize = () => {
      if (map) map.invalidateSize();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [map]);

  return null;
}

function MapClickHandler({ onMapClick, isDrawing }) {
  useMapEvents({
    click: (e) => {
      if (isDrawing && onMapClick) onMapClick(e.latlng);
    },
  });
  return null;
}

// Converte os pontos clicados para GeoJSON
function drawingToGeoJSON(points) {
  const ring = points.map(([lat, lng]) => [lng, lat]); // Leaflet usa [lat,lng]
  if (
    ring.length > 0 &&
    (ring[0][0] !== ring[ring.length - 1][0] ||
      ring[0][1] !== ring[ring.length - 1][1])
  ) {
    ring.push(ring[0]); // fecha polígono
  }
  return {
    type: "Polygon",
    coordinates: [ring],
  };
}

/* ========================= Componente Principal ========================= */

export default function MapaPiquetes() {
  const { getAccessToken } = useAuth();
  const { propriedadeSelecionada } = useProperty();

  const [lotes, setLotes] = useState([]);
  const [center, setCenter] = useState([-24.738, -47.86]);
  const [zoom, setZoom] = useState(15);

  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingPoints, setDrawingPoints] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome_lote: "",
    descricao: "",
    largura: "",
    altura: "",
    id_propriedade: propriedadeSelecionada?.id || 1,
  });

  // --- altura dinâmica
  const mapHeight = useMemo(() => {
    const n = lotes.length;
    if (isDrawing) return 520;
    if (showForm) return 480;
    if (n === 0) return 360;
    if (n <= 3) return 420;
    if (n <= 8) return 500;
    return 580;
  }, [lotes.length, isDrawing, showForm]);
  const heightKey = `${mapHeight}-${isDrawing ? "D" : "N"}-${
    showForm ? "F" : "NF"
  }`;

  // atualiza id_propriedade
  useEffect(() => {
    if (propriedadeSelecionada?.id) {
      setFormData((prev) => ({
        ...prev,
        id_propriedade: propriedadeSelecionada.id,
      }));
    }
  }, [propriedadeSelecionada?.id]);

  // carrega lotes
  useEffect(() => {
    const carregarLotes = async () => {
      try {
        const token = await getAccessToken();
        if (!token) return;
        const lotesCarregados = await loteService.listarLotes(token);
        setLotes(Array.isArray(lotesCarregados) ? lotesCarregados : []);
      } catch (error) {
        console.error("❌ Erro ao carregar lotes:", error);
      }
    };
    if (propriedadeSelecionada) carregarLotes();
  }, [propriedadeSelecionada, getAccessToken]);

  const lotesRender = useMemo(() => {
    return (lotes || []).map((lote) => {
      const ring = getLatLngRingFromGeo(lote.geo_mapa);
      return { ...lote, __ringLatLng: ring || [] };
    });
  }, [lotes]);
  const allRings = useMemo(
    () =>
      lotesRender
        .filter((l) => l.__ringLatLng.length)
        .map((l) => l.__ringLatLng),
    [lotesRender]
  );

  const iniciarDesenho = () => {
    setIsDrawing(true);
    setDrawingPoints([]);
    setShowForm(true);
    setFormData({
      nome_lote: "",
      descricao: "",
      largura: "",
      altura: "",
      id_propriedade: propriedadeSelecionada?.id || 1,
    });
  };

  const cancelarDesenho = () => {
    setIsDrawing(false);
    setDrawingPoints([]);
    setShowForm(false);
    setFormData((prev) => ({
      ...prev,
      nome_lote: "",
      descricao: "",
      largura: "",
      altura: "",
      id_propriedade: propriedadeSelecionada?.id || prev.id_propriedade || 1,
    }));
  };

  const handleMapClick = (latlng) => {
    if (isDrawing && drawingPoints.length === 0) {
      const largura = Number(formData.largura || 0);
      const altura = Number(formData.altura || 0);
      if (!largura || !altura) {
        alert("Informe largura e altura antes de clicar no mapa!");
        return;
      }
      const [dLat, dLng] = metersToDegrees(latlng.lat, largura, altura);
      const p1 = [latlng.lat, latlng.lng];
      const p2 = [latlng.lat, latlng.lng + dLng];
      const p3 = [latlng.lat + dLat, latlng.lng + dLng];
      const p4 = [latlng.lat + dLat, latlng.lng];
      setDrawingPoints([p1, p2, p3, p4]);
    }
  };

  // salvar (GeoJSON) - FUNÇÃO CORRIGIDA
  const salvarPiquete = async () => {
    // Validação do nome - garantir que não está vazio e é string
    const nome = String(formData.nome_lote || "").trim();
    if (!nome) {
      alert("Nome do piquete é obrigatório!");
      return;
    }

    // Validação da propriedade - garantir que é um número inteiro
    const idPropRaw = propriedadeSelecionada?.id ?? formData.id_propriedade;
    const idProp = parseInt(idPropRaw, 10);
    if (!idProp || isNaN(idProp) || !Number.isInteger(idProp)) {
      alert("Propriedade inválida. ID deve ser um número inteiro válido.");
      return;
    }

    // Validação dos pontos do desenho
    if (!drawingPoints || drawingPoints.length < 3) {
      alert("Clique no mapa para gerar o quadrado.");
      return;
    }

    setLoading(true);
    try {
      // Gerar GeoJSON a partir dos pontos
      const geo = drawingToGeoJSON(drawingPoints);

      // Preparar dados com validação rigorosa
      const dadosPiquete = {
        nome_lote: nome, // já validado como string não vazia
        descricao: formData.descricao?.trim() || "", // string vazia se não informado
        id_propriedade: idProp, // já validado como inteiro
        geo_mapa: geo,
      };

      console.log("📤 Enviando dados:", dadosPiquete);

      const token = await getAccessToken();
      if (!token) {
        throw new Error("Token de acesso não disponível");
      }

      const novoPiquete = await loteService.criarLote(dadosPiquete, token);

      setLotes((prev) => [...prev, novoPiquete]);
      cancelarDesenho();
      alert("Piquete criado com sucesso!");
    } catch (error) {
      console.error("❌ Erro ao salvar piquete:", error);
      const errorMessage = error?.message || "Erro desconhecido ao salvar piquete.";
      alert(`Erro ao salvar piquete: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#FFCF78] rounded-lg">
            <MapPin className="w-5 h-5 text-[#CE7D0A]" />
          </div>
          <p className="text-sm text-gray-600">
            {lotes.length === 0
              ? "Nenhum piquete cadastrado"
              : `${lotes.length} piquete${lotes.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <div>
          {!isDrawing && !showForm && (
            <button
              onClick={iniciarDesenho}
              className="flex items-center gap-2 bg-[#FFCF78] hover:bg-[#F2B84D] px-4 py-2 rounded-lg"
            >
              <Plus size={16} /> Novo Piquete
            </button>
          )}
        </div>
      </div>

      {/* MAPA */}
      <div
        className="w-full mb-4 rounded-lg overflow-hidden border border-gray-200"
        style={{ height: `${mapHeight}px` }}
      >
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: "100%", width: "100%" }}
        >
          <InvalidateSizeOnChange heightKey={heightKey} />
          <FitBoundsToPolygons
            rings={allRings}
            enabled={!isDrawing && !showForm && allRings.length > 0}
          />
          <MapClickHandler onMapClick={handleMapClick} isDrawing={isDrawing} />
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {lotesRender.map((lote) =>
            lote.__ringLatLng?.length ? (
              <Polygon
                key={lote.id_lote}
                positions={lote.__ringLatLng}
                pathOptions={{ color: "#CE7D0A" }}
              >
                <Popup>{lote.nome_lote}</Popup>
              </Polygon>
            ) : null
          )}
          {drawingPoints.length >= 3 && (
            <Polygon
              positions={drawingPoints}
              pathOptions={{ color: "#3B82F6", dashArray: "5,10" }}
            />
          )}
        </MapContainer>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Plus size={20} className="text-[#CE7D0A]" /> Novo Piquete
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Nome *</label>
              <input
                type="text"
                value={formData.nome_lote}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, nome_lote: e.target.value }))
                }
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Digite o nome do piquete"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Descrição
              </label>
              <input
                type="text"
                value={formData.descricao}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, descricao: e.target.value }))
                }
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Descrição opcional"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Largura (m) *
              </label>
              <input
                type="number"
                min="1"
                step="0.01"
                value={formData.largura}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, largura: e.target.value }))
                }
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Ex: 100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Altura (m) *
              </label>
              <input
                type="number"
                min="1"
                step="0.01"
                value={formData.altura}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, altura: e.target.value }))
                }
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Ex: 150"
              />
            </div>
          </div>

          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Instruções:</strong> Preencha o nome, largura e altura, depois clique no mapa para posicionar o piquete.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={cancelarDesenho}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              onClick={salvarPiquete}
              disabled={loading || drawingPoints.length < 3 || !formData.nome_lote.trim()}
              className="flex items-center gap-2 bg-[#FFCF78] px-6 py-2 rounded-lg hover:bg-[#F2B84D] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                "Salvando..."
              ) : (
                <>
                  <Save size={16} /> Salvar
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}