"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Correção padrão dos ícones do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/**
 * COMPONENTE FANTASMA: RastreadorCamera
 * Executa o AutoPanMode suave com map.flyTo()
 */
function RastreadorCamera({ posicao, seguindo }) {
  const map = useMap();

  useEffect(() => {
    if (posicao && seguindo) {
      map.flyTo([posicao.latitude, posicao.longitude], 17, {
        animate: true,
        duration: 1.2,
      });
    }
  }, [posicao, seguindo, map]);

  return null;
}

export default function MapaNavegacao({
  posicao,
  seguindoCamera,
  onAlternarSeguir,
}) {
  const [tipoCamada, setTipoCamada] = useState("satelite");

  const centro = posicao
    ? [posicao.latitude, posicao.longitude]
    : [-21.2526, -43.1511];

  const zoomInicial = posicao ? 17 : 6;

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: "14px", overflow: "hidden", border: "1px solid #334155" }}>
      {/* Controles Flutuantes do Mapa */}
      <div style={{ position: "absolute", top: 12, right: 12, zIndex: 1000, display: "flex", flexDirection: "column", gap: 8 }}>
        {/* Alternador de Camadas: Satélite x Ruas */}
        <div style={{ background: "rgba(15, 23, 42, 0.9)", border: "1px solid #334155", borderRadius: 10, padding: 4, display: "flex", gap: 4 }}>
          <button
            type="button"
            onClick={() => setTipoCamada("satelite")}
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              border: "none",
              fontSize: 12,
              fontWeight: "bold",
              cursor: "pointer",
              background: tipoCamada === "satelite" ? "#10b981" : "transparent",
              color: tipoCamada === "satelite" ? "#0f172a" : "#cbd5e1",
            }}
          >
            🛰️ Satélite
          </button>
          <button
            type="button"
            onClick={() => setTipoCamada("ruas")}
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              border: "none",
              fontSize: 12,
              fontWeight: "bold",
              cursor: "pointer",
              background: tipoCamada === "ruas" ? "#10b981" : "transparent",
              color: tipoCamada === "ruas" ? "#0f172a" : "#cbd5e1",
            }}
          >
            🗺️ Ruas
          </button>
        </div>

        {/* Botão Seguir Câmera */}
        {onAlternarSeguir && (
          <button
            type="button"
            onClick={onAlternarSeguir}
            style={{
              padding: "8px 12px",
              borderRadius: 10,
              border: "1px solid #334155",
              fontSize: 12,
              fontWeight: "bold",
              cursor: "pointer",
              background: seguindoCamera ? "#059669" : "rgba(15, 23, 42, 0.9)",
              color: "#ffffff",
            }}
          >
            {seguindoCamera ? "🎯 Câmera Fixada" : "🔓 Câmera Livre"}
          </button>
        )}
      </div>

      <MapContainer
        center={centro}
        zoom={zoomInicial}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        {tipoCamada === "satelite" ? (
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="&copy; ESRI World Imagery"
            maxZoom={19}
          />
        ) : (
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
            maxZoom={19}
          />
        )}

        {posicao && (
          <>
            <Circle
              center={[posicao.latitude, posicao.longitude]}
              radius={posicao.precisao}
              pathOptions={{
                color: "#10b981",
                fillColor: "#10b981",
                fillOpacity: 0.15,
                weight: 1.5,
              }}
            />
            <Marker position={[posicao.latitude, posicao.longitude]}>
              <Popup>
                <div style={{ fontSize: 12, color: "#0f172a" }}>
                  <strong>📍 Posição Atual</strong>
                  <br />Lat: {posicao.latitude.toFixed(6)}°
                  <br />Lon: {posicao.longitude.toFixed(6)}°
                  <br />Precisão: ±{posicao.precisao}m
                  {posicao.velocidade !== null && <><br />Velocidade: {posicao.velocidade} km/h</>}
                </div>
              </Popup>
            </Marker>
          </>
        )}

        <RastreadorCamera posicao={posicao} seguindo={seguindoCamera} />
      </MapContainer>
    </div>
  );
}
