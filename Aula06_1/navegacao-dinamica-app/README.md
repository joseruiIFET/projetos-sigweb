# Sistema de Navegação Dinâmico em Tempo Real (Next.js PWA + Leaflet)

Projeto prático desenvolvido para a disciplina de **SIG-Web** (Aula 06.1) ministrada pelo **Prof. José Rui**.

Este aplicativo substitui a integração nativa com o ArcGIS Runtime (`LocationDisplay.AutoPanMode`) por uma solução aberta e moderna utilizando **Next.js**, **Leaflet** e a API contínua de satélites `navigator.geolocation.watchPosition()`.

---

## 🚀 Funcionalidades

- **Streaming Contínuo com `watchPosition`**: Abre um canal contínuo com os satélites de GPS, atualizando a posição em tempo real conforme o usuário se move, sem a destruição de bateria provocada por `setInterval`.
- **Gerenciamento de Bateria com `clearWatch`**: Libera a antena do rádio de satélites imediatamente ao pausar a navegação ou desmontar a página.
- **Componente Fantasma `RastreadorCamera`**: Implementa o efeito *AutoPanMode* suave via `map.flyTo()`, integrando o fluxo declarativo do React com o motor imperativo do Leaflet.
- **Prevenção de Erros de SSR (`next/dynamic`)**: Carrega os componentes do Leaflet exclusivamente no lado do cliente (`ssr: false`), evitando o erro de `window is not defined`.
- **HUD de Telemetria ao Vivo**:
  - Velocidade instantânea calculada em km/h
  - Rumo de deslocamento / Azimute em graus com indicação do ponto cardeal (N, NE, L, etc.)
  - Odômetro de distância total percorrida (acumulada via fórmula de Haversine)
  - Círculo dinâmico de raio de incerteza da precisão horizontal (±X metros)
- **Alternador de Camadas Cartográficas**: Permite alternar com 1 clique entre imagens de satélite/ortofotos (ESRI World Imagery) e malha viária urbana (OpenStreetMap).
- **PWA com Suporte Offline**: Configurável para instalação direta na gaveta de aplicativos do smartphone.

---

## 🛠️ Como Executar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- npm ou yarn

### 1. Instalar as dependências
```bash
npm install
```

### 2. Rodar o servidor de desenvolvimento
```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 📱 Testando a Navegação no Celular

Para testar o acompanhamento de passos em tempo real no smartphone:
```bash
npm run dev -- --experimental-https
```
Acesse o IP local via HTTPS (ex.: `https://192.168.1.15:3000`), clique em **Iniciar Navegação** e caminhe pela rua. O mapa deslizará suavemente acompanhando seus passos e o velocímetro/odômetro registrará o deslocamento instantâneo.

---

## 📦 Estrutura do Projeto

```text
navegacao-dinamica-app/
├── app/
│   ├── globals.css           # Estilos globais e Tailwind CSS
│   ├── layout.tsx            # Layout raiz e Service Worker
│   └── page.tsx              # ⭐ Gestão do watchPosition, telemetria e HUD
├── components/
│   └── MapaNavegacao.tsx     # ⭐ Leaflet, AutoPanMode (RastreadorCamera) e camadas
├── lib/
│   └── geodesia.ts           # Haversine, cálculo de azimute e formatações
├── public/
│   ├── manifest.json         # Manifesto PWA
│   ├── sw.js                 # Service Worker
│   ├── offline.html          # Fallback offline
│   └── icons/
│       └── icon.svg          # Ícone do aplicativo
└── package.json
```

---

## 👨‍🏫 Professor
- **Prof. José Rui** — Disciplina de SIG-Web
