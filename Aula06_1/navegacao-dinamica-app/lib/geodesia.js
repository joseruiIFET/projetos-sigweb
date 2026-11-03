// Constantes Geodésicas Universais
const RAIO_MEDIO_TERRA_METROS = 6371000;
const GRAUS_PARA_RADIANOS = Math.PI / 180;
const RADIANOS_PARA_GRAUS = 180 / Math.PI;

/**
 * Calcula a distância ortodrômica entre dois pontos geográficos em metros (WGS 84).
 * Fórmula de Haversine pura e estável com Math.atan2.
 */
export function haversine(lat1, lng1, lat2, lng2) {
  const phi1 = lat1 * GRAUS_PARA_RADIANOS;
  const phi2 = lat2 * GRAUS_PARA_RADIANOS;
  const deltaPhi = (lat2 - lat1) * GRAUS_PARA_RADIANOS;
  const deltaLambda = (lng2 - lng1) * GRAUS_PARA_RADIANOS;

  const a =
    Math.sin(deltaPhi / 2) ** 2 +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return RAIO_MEDIO_TERRA_METROS * c;
}

/**
 * Calcula o azimute inicial (rumo de navegação) em graus decimais (0° a 360°).
 */
export function calcularAzimute(lat1, lng1, lat2, lng2) {
  const phi1 = lat1 * GRAUS_PARA_RADIANOS;
  const phi2 = lat2 * GRAUS_PARA_RADIANOS;
  const deltaLambda = (lng2 - lng1) * GRAUS_PARA_RADIANOS;

  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);

  const theta = Math.atan2(y, x);
  const graus = (theta * RADIANOS_PARA_GRAUS + 360) % 360;

  return Math.round(graus * 10) / 10;
}

/**
 * Formata um valor numérico em metros para exibição limpa em UI (m ou km).
 */
export function formatarDistancia(metros) {
  if (!Number.isFinite(metros)) return "—";
  if (metros < 1000) {
    return `${metros.toFixed(2)} m`;
  }
  return `${(metros / 1000).toFixed(3)} km`;
}

/**
 * Retorna o ponto cardeal aproximado dado um azimute em graus (ex: Norte, Nordeste).
 */
export function pontoCardeal(azimuteGraus) {
  const direcoes = ["N", "NE", "L", "SE", "S", "SO", "O", "NO", "N"];
  const indice = Math.round((azimuteGraus % 360) / 45);
  return direcoes[indice];
}
