"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { haversine, formatarDistancia, pontoCardeal } from "../lib/geodesia";
import styles from "./page.module.css";

// Previne erro de SSR no Leaflet (window is not defined)
const MapaInterativo = dynamic(() => import("../components/MapaNavegacao"), {
  ssr: false,
  loading: () => (
    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#020617", color: "#64748b", borderRadius: 14 }}>
      Carregando mapa...
    </div>
  ),
});

export default function Home() {
  const [posicao, setPosicao] = useState(null);
  const [modoNavegacao, setModoNavegacao] = useState(false);
  const [seguindoCamera, setSeguindoCamera] = useState(true);
  const [erro, setErro] = useState(null);
  const [distanciaTotal, setDistanciaTotal] = useState(0);
  const [leiturasCount, setLeiturasCount] = useState(0);

  const watchIdRef = useRef(null);
  const ultimaPosicaoRef = useRef(null);

  // Limpa o watchPosition ao fechar a página para não descarregar a bateria
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  function alternarNavegacao() {
    if (modoNavegacao) {
      // 🛑 Parar streaming e desligar o rádio de satélites
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setModoNavegacao(false);
      return;
    }

    if (!navigator.geolocation) {
      setErro("Navegador sem suporte a Geolocation.");
      return;
    }

    setErro(null);

    // 🚀 Iniciar streaming contínuo
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = pos.coords;
        const nova = {
          latitude: coords.latitude,
          longitude: coords.longitude,
          precisao: Math.round(coords.accuracy * 10) / 10,
          altitude: coords.altitude ? Math.round(coords.altitude * 10) / 10 : null,
          velocidade: coords.speed !== null ? Math.round(coords.speed * 3.6 * 10) / 10 : 0,
          rumo: coords.heading !== null ? Math.round(coords.heading) : null,
          horario: new Date(pos.timestamp).toLocaleTimeString("pt-BR"),
        };

        // Acumula distância percorrida se moveu mais de 2 metros (filtra ruído)
        if (ultimaPosicaoRef.current) {
          const d = haversine(
            ultimaPosicaoRef.current.latitude,
            ultimaPosicaoRef.current.longitude,
            nova.latitude,
            nova.longitude
          );
          if (d > 2) {
            setDistanciaTotal((prev) => prev + d);
          }
        }

        ultimaPosicaoRef.current = nova;
        setPosicao(nova);
        setLeiturasCount((prev) => prev + 1);
      },
      (err) => {
        setErro(`Erro do GPS: ${err.message}. Em desktop, use o botão de simulação.`);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    watchIdRef.current = id;
    setModoNavegacao(true);
  }

  return (
    <main className={styles.container}>
      {/* 1. Cabeçalho e Controles */}
      <header className={styles.cabecalho}>
        <div>
          <span className={styles.tagDisciplina}>SIG-Web • Aula 06.1</span>
          <h1 className={styles.titulo}>Navegação Dinâmica (AutoPan)</h1>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            type="button"
            onClick={alternarNavegacao}
            className={`${styles.btnNavegacao} ${
              modoNavegacao ? styles.btnParar : styles.btnIniciar
            }`}
          >
            {modoNavegacao ? "🛑 Parar Rastreamento" : "▶️ Iniciar Navegação"}
          </button>
        </div>
      </header>

      {erro && <div className={styles.erro}>⚠️ {erro}</div>}

      {/* 2. HUD de Telemetria ao Vivo */}
      <section className={styles.gridHUD}>
        <div className={styles.itemHUD}>
          <span className={styles.labelHUD}>Velocidade</span>
          <span className={styles.valorHUD}>
            {posicao?.velocidade ? `${posicao.velocidade} km/h` : "0.0 km/h"}
          </span>
        </div>

        <div className={styles.itemHUD}>
          <span className={styles.labelHUD}>Distância Percorrida</span>
          <span className={styles.valorHUD}>
            {formatarDistancia(distanciaTotal)}
          </span>
        </div>

        <div className={styles.itemHUD}>
          <span className={styles.labelHUD}>Rumo / Bússola</span>
          <span className={styles.valorHUD} style={{ color: "#38bdf8" }}>
            {posicao?.rumo ? `${posicao.rumo}° (${pontoCardeal(posicao.rumo)})` : "—"}
          </span>
        </div>

        <div className={styles.itemHUD}>
          <span className={styles.labelHUD}>Precisão do Sinal</span>
          <span className={styles.valorHUD} style={{ color: "#c084fc" }}>
            {posicao ? `±${posicao.precisao}m` : "Aguardando"}
          </span>
        </div>
      </section>

      {/* 3. Mapa com Leaflet */}
      <section className={styles.mapaArea}>
        <MapaInterativo
          posicao={posicao}
          seguindoCamera={seguindoCamera}
          onAlternarSeguir={() => setSeguindoCamera((prev) => !prev)}
        />
      </section>

      {/* 4. Rodapé */}
      <footer className={styles.rodape}>
        <span>
          {modoNavegacao ? "🟢 GPS ativo via watchPosition" : "⚪ GPS em repouso"}
          {leiturasCount > 0 && ` • ${leiturasCount} leituras recebidas`}
        </span>
        <button
          type="button"
          onClick={() => { setDistanciaTotal(0); setLeiturasCount(0); }}
          style={{ background: "none", border: "none", color: "#64748b", textDecoration: "underline", cursor: "pointer", fontSize: 11 }}
        >
          Zerar odômetro
        </button>
      </footer>
    </main>
  );
}
