export const shopScoreByChainId: Record<string, number> = {
    novus: 5.0,
    auchan: 4.5,
    metro: 4.2,
    tavriav: 4.0,
    ultramarket: 4.0,
    megamarket: 4.3,
    cosmos: 3.8,
    zelenka: 4.1,
    zaraz: 3.9,
    silpo: 4.6,
    eco: 4.0,
    ekomarket: 4.0,
};

export function getShopScore(shopId?: string): number {
    const defaultScore = 4.0;
    if (!shopId) {
        console.warn('[getShopScore] shopId не надано, повертається рейтинг за замовчуванням:', defaultScore);
        return defaultScore;
    }
    const normalizedChainId = shopId.toLowerCase();
    const score = shopScoreByChainId[normalizedChainId];

    if (score === undefined) {
        console.warn(`[getShopScore] Рейтинг для магазину '${shopId}' (нормалізовано: '${normalizedChainId}') не знайдено, повертається рейтинг за замовчуванням: ${defaultScore}`);
        return defaultScore;
    }
    return score;
}
