"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import styles from "./page.module.css";

// Importação dinâmica para evitar erro de SSR no Leaflet (window is not defined)
const MapaVetorial = dynamic(() => import("../components/MapaVetorial"), {
  ssr: false,
  loading: () => (
    <div style={{ height: "100%", minHeight: "480px", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f172a", color: "#64748b", borderRadius: 12, border: "1px solid #334155" }}>
      🗺️ Carregando motor cartográfico Leaflet...
    </div>
  ),
});

export default function Home() {
  const [trechoSelecionado, setTrechoSelecionado] = useState(null);
  const [centroAlvo, setCentroAlvo] = useState(null);

  // Centraliza o mapa sobre a bacia hidrográfica de exemplo
  function centralizarHidrografia() {
    setCentroAlvo([-21.2650, -43.1650]);
  }

  return (
    <main className={styles.container}>
      {/* Cabeçalho */}
      <header className={styles.cabecalho}>
        <h1>🗺️ Mapas Vetoriais & Tabela de Atributos</h1>
        <p>Camada GeoJSON (Hidrografia) sobreposta à ortofoto com Popup interativo</p>
      </header>

      {/* Barra de Ações Rápidas */}
      <section className={styles.barraAcoes}>
        <div className={styles.botoesGrupo}>
          <button
            type="button"
            className={styles.btn}
            onClick={centralizarHidrografia}
          >
            🎯 Focar na Hidrografia
          </button>
        </div>
      </section>

      {/* Mapa Interativo */}
      <section className={styles.mapaWrapper}>
        <MapaVetorial
          onSelecionarTrecho={(dados) => setTrechoSelecionado(dados)}
          centroAlvo={centroAlvo}
        />
      </section>

      {/* Painel da Tabela de Atributos (Callout expandido na tela) */}
      <section className={styles.cardPainel}>
        <h2 className={styles.cardTitulo}>
          📊 Tabela de Atributos (Feature Properties)
        </h2>

        {trechoSelecionado ? (
          <div className={styles.gridAtributos}>
            <div className={styles.itemAtributo}>
              <div className={styles.itemRotulo}>Nome da Feição</div>
              <div className={styles.itemValor}>{trechoSelecionado.NOME}</div>
            </div>

            <div className={styles.itemAtributo}>
              <div className={styles.itemRotulo}>Bacia Hidrográfica</div>
              <div className={styles.itemValor}>{trechoSelecionado.BACIA}</div>
            </div>

            <div className={styles.itemAtributo}>
              <div className={styles.itemRotulo}>Domínio Administrativo</div>
              <div className={styles.itemValor}>{trechoSelecionado.DOMINIO}</div>
            </div>

            <div className={styles.itemAtributo}>
              <div className={styles.itemRotulo}>Extensão do Trecho</div>
              <div className={styles.itemValor}>{trechoSelecionado.EXTENSAO_KM} km</div>
            </div>

            <div className={styles.itemAtributo}>
              <div className={styles.itemRotulo}>Vazão Média</div>
              <div className={styles.itemValor}>{trechoSelecionado.VAZAO_MED} m³/s</div>
            </div>

            <div className={styles.itemAtributo}>
              <div className={styles.itemRotulo}>Vazão Crítica Q7,10</div>
              <div className={styles.itemValorAlerta}>{trechoSelecionado.Q7_10} m³/s</div>
            </div>
          </div>
        ) : (
          <p className={styles.instrucaoVazio}>
            💡 Toque ou clique em qualquer linha azul no mapa para consultar os dados hidrológicos cadastrados no GeoJSON.
          </p>
        )}
      </section>

      {/* Rodapé Didático */}
      <footer className={styles.rodape}>
        SIG-Web · Prof. José Rui · Código aberto e soberania sobre o dado espacial
      </footer>
    </main>
  );
}
