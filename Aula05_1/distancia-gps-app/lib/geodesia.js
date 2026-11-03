// 1. Constantes físicas universais
const RAIO_MEDIO_TERRA_METROS = 6371000;
const GRAUS_PARA_RADIANOS = Math.PI / 180;

/**
 * Calcula a distância ortodrômica entre dois pontos geográficos em metros.
 * Equivalente na Web ao método Location.distanceBetween() do Android.
 */
export function haversine(lat1, lng1, lat2, lng2) {
    // Passo 1: converter as coordenadas de graus decimais para radianos
    const phi1 = lat1 * GRAUS_PARA_RADIANOS;
    const phi2 = lat2 * GRAUS_PARA_RADIANOS;
    const deltaPhi = (lat2 - lat1) * GRAUS_PARA_RADIANOS;
    const deltaLambda = (lng2 - lng1) * GRAUS_PARA_RADIANOS;

    // Passo 2: calcular o termo "a" (quadrado da metade da corda entre os pontos)
    const a =
        Math.sin(deltaPhi / 2) ** 2 +
        Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2;

    // Passo 3: calcular o ângulo central "c" em radianos usando arco tangente duplo
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Passo 4: multiplicar pelo raio médio da Terra para obter a distância em metros
    return RAIO_MEDIO_TERRA_METROS * c;
}

/**
 * Formata um valor numérico em metros para exibição na tela (m ou km).
 */
export function formatarDistancia(metros) {
    if (!Number.isFinite(metros)) return "-";
    if (metros < 1000) {
        return `${metros.toFixed(2)} m`;
    }
    return `${(metros / 1000).toFixed(3)} km`;
}
