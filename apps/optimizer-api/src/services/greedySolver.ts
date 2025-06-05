import {OptimizedCartResult} from '@libs/shared/types/src/optimizer-cart';
import {AlternativePayload} from '@libs/shared/types/src/optimizer';

export function solveGreedy(
    alternativesPerProduct: AlternativePayload[][],
    maxBudget?: number
): OptimizedCartResult {
    const selectedAlternatives: AlternativePayload[] = [];
    let totalPrice = 0;

    console.log('\n[Greedy] 📌 Початок формування оптимального кошика:');
    console.log(`[Greedy] Дозволений бюджет: ${maxBudget !== undefined ? (maxBudget / 100).toFixed(2) + ' грн' : 'не обмежено'}`);

    alternativesPerProduct.forEach((alternatives, index) => {
        console.log(`\n[Greedy] Товар #${index + 1}`);
        for (const alt of alternatives) {
            const nextTotalPrice = totalPrice + alt.price;

            console.log(`[Greedy] → Альтернатива: ID ${alt.id}, Магазин: ${alt.shop}, Ціна: ${(alt.price / 100).toFixed(2)} грн`);

            if (maxBudget === undefined || nextTotalPrice <= maxBudget) {
                selectedAlternatives.push(alt);
                totalPrice = nextTotalPrice;
                console.log(`[Greedy] ✅ Обрано! Накопичена сума: ${(totalPrice / 100).toFixed(2)} грн`);
                break;
            } else {
                console.log(`[Greedy] ❌ Пропущено (перевищує бюджет)`);
            }
        }
    });

    console.log('\n[Greedy] 📌 Формування завершено.');
    console.log(`[Greedy] Обрано товарів: ${selectedAlternatives.length}`);
    console.log(`[Greedy] Загальна сума: ${(totalPrice / 100).toFixed(2)} грн`);

    return {
        selectedAlternatives,
        totalPrice
    };
}
