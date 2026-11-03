# Coletor Geodésico GPS (Next.js PWA)

Projeto prático desenvolvido para a disciplina de **SIG-Web** (Aula 04.1) ministrada pelo **Prof. José Rui**.

Este aplicativo substitui a abordagem legada em Android Studio por uma solução moderna baseada em **Progressive Web App (PWA)**, permitindo capturar coordenadas geodésicas diretamente do hardware GNSS do smartphone e exibir um mapa centrado com *Bounding Box* calculado.

---

## 🚀 Funcionalidades

- **Captura Nativa de GPS**: Consome a `Geolocation API` do navegador com `enableHighAccuracy: true` (forçando o uso de satélites e ignorando estimativas grosseiras de torres celulares).
- **Inspeção Geodésica**: Apresenta Latitude, Longitude, Precisão horizontal em metros (com indicador de qualidade), Altitude e Horário sincronizado pelo relógio atômico dos satélites.
- **Visualização Cartográfica**: Incorpora o OpenStreetMap (Mapnik) com Bounding Box calculado dinamicamente ($\Delta = 0{,}005^\circ \approx 1\text{ km}^2$) com pino no local exato.
- **PWA Instalável e Offline**: Contém `manifest.json` configurado com `display: standalone` e Service Worker (`sw.js`) para funcionamento offline em campo.

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

## 📱 Como Testar no Celular Físico

A API de Geolocalização exige contexto seguro (**HTTPS** ou **localhost**). Para testar no celular conectado na mesma rede Wi-Fi do seu computador:

### Opção 1: Rodar com HTTPS Local (Recomendado)
```bash
npm run dev -- --experimental-https
```
O Next.js exibirá o endereço IP local com HTTPS (ex.: `https://192.168.1.15:3000`). Acesse no navegador do celular e aceite o certificado local de teste.

### Opção 2: Publicação Rápida na Vercel (1 Minuto)
Instale a Vercel CLI ou suba o projeto para um repositório no GitHub e importe na [Vercel](https://vercel.com). O deploy fornecerá uma URL HTTPS oficial válida mundialmente.

---

## 📦 Estrutura do Projeto

```text
gps-nextjs-app/
├── app/
│   ├── globals.css        # Reset e estilos globais básicos (sem Tailwind)
│   ├── layout.tsx         # Layout raiz e registro do Service Worker
│   ├── page.tsx           # ⭐ Toda a lógica de GPS, Bounding Box e estados
│   └── page.module.css    # ⭐ Estilos simples e organizados via CSS Modules
├── public/
│   ├── manifest.json    # Manifesto PWA para instalação no celular
│   ├── sw.js            # Service Worker de cache e fallback offline
│   ├── offline.html     # Página apresentada em caso de falta de rede
│   └── icons/
│       └── icon.svg     # Ícone vetorial da aplicação
└── package.json
```

---

## 👨‍🏫 Professor
- **Prof. José Rui** — Disciplina de SIG-Web
