import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProperty } from "@/hooks/useProperty";
import loteService from "@/services/loteService";

// Corrige o ícone padrão do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Componente auxiliar para atualizar a visualização do mapa
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export default function MapaPiquetes() {
  const { getAccessToken } = useAuth(); 
  const { propriedadeSelecionada } = useProperty();
  const [lotes, setLotes] = useState([]);
  const [center, setCenter] = useState([-24.738, -47.86]);
  const [zoom, setZoom] = useState(15);

  useEffect(() => {
    const carregarLotes = async () => {
      try {
        const token = await getAccessToken();
        if (!token) {
          console.error("❌ Token não disponível");
          return;
        }

        const lotesCarregados = await loteService.listarLotes(token);
        setLotes(lotesCarregados);

        // Calcula o centro médio de todos os piquetes
        if (lotesCarregados.length > 0) {
          let totalLat = 0;
          let totalLng = 0;
          let pointCount = 0;

          lotesCarregados.forEach(lote => {
            if (lote.geo_mapa?.coordinates) {
              const coordinates = lote.geo_mapa.coordinates[0];
              coordinates.forEach(([lng, lat]) => {
                totalLat += lat;
                totalLng += lng;
                pointCount++;
              });
            }
          });

          if (pointCount > 0) {
            const centerLat = totalLat / pointCount;
            const centerLng = totalLng / pointCount;
            setCenter([centerLat, centerLng]);
            setZoom(14); // Zoom fixo mais aberto para ver múltiplos piquetes
          }
        }
      } catch (error) {
        console.error("❌ Erro ao carregar lotes:", error);
      }
    };

    if (propriedadeSelecionada) {
      carregarLotes();
    }
  }, [propriedadeSelecionada, getAccessToken]);

  return (
    <div className="text-center">
      <div className="w-full h-[400px] mb-4">
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: "100%", width: "100%" }}
        >
          {/* Adiciona o componente ChangeView para atualizar a visualização */}
          <ChangeView center={center} zoom={zoom} />
          
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {lotes.map((lote) => {
            if (!lote.geo_mapa?.coordinates) return null;
            
            // Converte as coordenadas do GeoJSON (longitude,latitude) para Leaflet (latitude,longitude)
            const coordinates = lote.geo_mapa.coordinates[0].map(([lng, lat]) => [lat, lng]);
            
            return (
              <div key={lote.id_lote}>
                <Polygon
                  positions={coordinates}
                  pathOptions={{
                    color: '#CE7D0A',
                    weight: 2,
                    fillColor: '#FFCF78',
                    fillOpacity: 0.4
                  }}
                >
                  <Popup>
                    <div>
                      <h3 className="font-bold">{lote.nome_lote}</h3>
                      {lote.descricao && (
                        <p className="text-sm text-gray-600">{lote.descricao}</p>
                      )}
                    </div>
                  </Popup>
                </Polygon>
                
                {/* Marcador opcional no centro do polígono */}
                <Marker position={coordinates[0]}>
                  <Popup>{lote.nome_lote}</Popup>
                </Marker>
              </div>
            );
          })}
        </MapContainer>
      </div>
      
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        Mapa dos Piquetes
      </h3>
      <p className="text-gray-500 text-sm">
        {lotes.length 
          ? `${lotes.length} piquetes encontrados` 
          : "Nenhum piquete cadastrado"}
      </p>
    </div>
  );
}
