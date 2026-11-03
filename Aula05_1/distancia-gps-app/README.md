# Medidor de Distância Geodésica GPS (Next.js PWA)

Projeto prático desenvolvido para a disciplina de **SIG-Web** (Aula 05.1) ministrada pelo **Prof. José Rui**.

Este aplicativo calcula a distância geodésica entre dois pontos (Ponto A e Ponto B) utilizando a **Fórmula de Haversine** diretamente no navegador, sem depender de bibliotecas pesadas de terceiros ou chamadas de API com custo financeiro.

---

## 🚀 Funcionalidades

- **Cálculo com Haversine Puro**: Resolve a menor distância sobre a superfície esférica terrestre (distância ortodrômica) com erro inferior a 0,5% em relação ao elipsoide WGS 84.
- **Cálculo de Azimute Inicial**: Informa o rumo em graus ($0^\circ$ a $360^\circ$) e ponto cardeal correspondente (N, NE, L, etc.).
- **Máquina de Estados de Marcação**: Permite selecionar e capturar Ponto A e Ponto B com alternância automática e botão de reset.
- **Reatividade com `useMemo`**: Cálculos trigonométricos são memorizados e só re-executam quando as coordenadas de A ou B são alteradas, preservando CPU e bateria.
- **Visualização com Bounding Box Adaptativo**: Incorpora o OpenStreetMap com enquadramento dinâmico abrangendo simultaneamente os dois pontos coletados.
- **PWA com Suporte Offline**: Pronto para instalação como aplicativo no celular via `manifest.json` e Service Worker (`sw.js`).

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

## 📱 Testando em Campo no Celular

Para testar a medição de distância real no celular:
```bash
npm run dev -- --experimental-https
```
Acesse o IP local via HTTPS (ex.: `https://192.168.1.15:3000`), saia para a calçada ou praça, capture o Ponto A, caminhe 15 a 20 passos e capture o Ponto B. O resultado será exibido em metros e quilômetros na hora.

---

## 📦 Estrutura do Projeto

```text
distancia-gps-app/
├── app/
│   ├── globals.css      # Estilos Tailwind CSS
│   ├── layout.tsx       # Layout raiz e Service Worker
│   └── page.tsx         # ⭐ Gerenciamento dos pontos, UI e mapa dinâmico
├── lib/
│   └── geodesia.ts      # ⭐ Matemática geodésica (Haversine e Azimute)
├── public/
│   ├── manifest.json    # Manifesto PWA
│   ├── sw.js            # Service Worker offline
│   ├── offline.html     # Fallback offline
│   └── icons/
│       └── icon.svg     # Ícone do app
└── package.json
```

---

## 👨‍🏫 Professor
- **Prof. José Rui** — Disciplina de SIG-Web
