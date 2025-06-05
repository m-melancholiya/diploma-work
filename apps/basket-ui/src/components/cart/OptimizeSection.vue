<template>
  <v-card outlined class="mt-6">
    <v-card-title class="d-flex align-center text-h5 py-3">
      <v-icon start color="primary">mdi-calculator-variant-outline</v-icon>
      Оптимізація кошика
    </v-card-title>
    <v-divider />

    <v-card-text>
      <v-form @submit.prevent="triggerOptimization">
        <v-row>
          <!-- Бюджет у гривнях -->
          <v-col cols="12" md="6">
            <v-text-field
                v-model.number="budget"
                label="Бюджет (грн)"
                type="number"
                min="0"
                variant="outlined"
                prepend-inner-icon="mdi-cash"
                clearable
                hint="Вкажіть максимальну суму для покупки"
            />
          </v-col>

          <!-- Адреса -->
          <v-col cols="12" md="6">
            <v-text-field
                v-model="addressInput"
                label="Адреса доставки (опціонально)"
                placeholder="наприклад: Київ, вул. Хрещатик, 1"
                variant="outlined"
                prepend-inner-icon="mdi-map-marker-outline"
                clearable
                hint="Для врахування вартості/часу доставки"
            />
          </v-col>
        </v-row>

        <v-row>
          <!-- Режим -->
          <v-col cols="12" md="6">
            <v-select
                v-model="optimizerStore.mode"
                :items="optimizationModeOptions"
                label="Режим оптимізації"
                item-title="label"
                item-value="value"
                variant="outlined"
                prepend-inner-icon="mdi-tune"
            />
          </v-col>

          <!-- Метод ранжування -->
          <v-col cols="12" md="6">
            <v-select
                v-model="optimizerStore.rankingMethod"
                :items="rankingMethodOptions"
                label="Метод ранжування"
                item-title="label"
                item-value="value"
                variant="outlined"
                prepend-inner-icon="mdi-sort-variant"
            />
          </v-col>
        </v-row>

        <v-btn
            type="submit"
            color="primary"
            block
            size="large"
            :loading="loading"
            :disabled="loading || cartStore.items.length === 0"
            class="mt-2"
        >
          <v-icon start>mdi-cogs</v-icon>
          Оптимізувати кошик
        </v-btn>
      </v-form>

      <v-alert
          v-if="error"
          type="error"
          prominent
          border="start"
          class="mt-4"
      >
        {{ error }}
      </v-alert>
    </v-card-text>

    <div v-if="optimizationDone" class="result-section pa-4">
      <v-divider class="mb-4" />
      <h3 class="text-h6 mb-3 d-flex align-center">
        <v-icon start color="success">mdi-check-circle-outline</v-icon>
        Результат оптимізації
      </h3>
      <v-card variant="outlined">
        <v-list dense>
          <v-list-item
              v-for="item in optimizedItems"
              :key="item.id"
          >
            <!-- Контент: назва + магазин -->
            <v-list-item-content>
              <v-list-item-title>
                {{ findProductTitle(item.productId) || 'Невідомий товар' }}
              </v-list-item-title>
              <v-list-item-subtitle>
                Магазин: {{ getShopName(item.shop) }}
              </v-list-item-subtitle>
            </v-list-item-content>

            <!-- Ціна -->
            <v-list-item-action>
              <span class="font-weight-bold text-primary">
                {{ (item.price / 100).toFixed(2) }} грн
              </span>
            </v-list-item-action>

            <!-- Кнопка на Zakaz.ua -->
            <v-list-item-action>
              <v-btn
                  icon
                  :href="item.zakazUrl"
                  target="_blank"
                  :disabled="!item.zakazUrl"
                  title="Замовити на Zakaz.ua"
              >
                <v-icon>mdi-cart-arrow-right</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <v-divider />
        <v-card-text class="d-flex justify-space-between align-center">
          <div class="text-subtitle-1">
            <strong>Загальна сума:</strong>
            <span class="text-primary font-weight-bold ml-2">
              {{ (totalPrice / 100).toFixed(2) }} грн
            </span>
          </div>
          <div class="text-subtitle-1">
            <strong>Кількість товарів:</strong>
            <span class="font-weight-bold ml-2">
              {{ optimizedItems.length }}
            </span>
          </div>
        </v-card-text>
      </v-card>
    </div>

    <v-snackbar
        v-model="snackbar.show"
        :color="snackbar.color"
        timeout="4000"
        location="top right"
    >
      {{ snackbar.text }}
      <template #actions>
        <v-btn variant="text" @click="snackbar.show = false">Закрити</v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useOptimizerStore } from '@/stores/optimizer'
import { useUserStore } from '@/stores/user'
import type {
  AlternativePayload,
  OptimizationRequestPayload,
  OptimizationResponsePayload,
  ItemToOptimizePayload,
  OptimizationModeName,
  RankingMethod
} from '@libs/shared/types/src/optimizer'

// Тип розширений полем zakazUrl
type AlternativeWithUrl = AlternativePayload & { zakazUrl?: string }

const cartStore = useCartStore()
const userStore = useUserStore()
const optimizerStore = useOptimizerStore()

const loading = ref(false)
const error = ref('')
const budget = ref<number | undefined>(
    optimizerStore.maxBudget !== undefined
        ? optimizerStore.maxBudget / 100
        : undefined
)
const addressInput = ref(userStore.address || '')

// Оновлений масив з URL
const optimizedItems = ref<AlternativeWithUrl[]>([])
const totalPrice = ref(0)
const optimizationDone = ref(false)

const snackbar = reactive({
  show: false,
  text: '',
  color: 'success' as 'success' | 'error' | 'info'
})

// Опції для селектів
const optimizationModeOptions = ref([
  { label: 'Найкраща ціна',     value: 'best_price'       as OptimizationModeName },
  { label: 'Найшвидша доставка',value: 'fastest_delivery' as OptimizationModeName },
  { label: 'Збалансований',     value: 'balanced'         as OptimizationModeName },
  { label: 'Найкращий рейтинг', value: 'best_shop_rating' as OptimizationModeName },
])
const rankingMethodOptions = ref([
  { label: 'TOPSIS',             value: 'topsis' as RankingMethod },
  { label: 'WSM (Зважена сума)', value: 'wsm'    as RankingMethod },
])

function showSnackbar(text: string, color: 'success'|'error'|'info' = 'success') {
  snackbar.text = text
  snackbar.color = color
  snackbar.show = true
}

async function triggerOptimization() {
  error.value = ''
  loading.value = true
  optimizationDone.value = false
  optimizedItems.value = []
  totalPrice.value = 0

  if (!cartStore.items.length) {
    showSnackbar('Кошик порожній. Додайте товари.', 'error')
    loading.value = false
    return
  }

  // Зберігаємо бюджет у копійках
  optimizerStore.setMaxBudget(
      budget.value != null
          ? Math.round(budget.value * 100)
          : undefined
  )

  // Адреса → coords
  let clientCoords: string | undefined = userStore.clientCoords
  if (addressInput.value && addressInput.value !== userStore.address) {
    userStore.address = addressInput.value
    try {
      await userStore.fetchCoords()
      clientCoords = userStore.clientCoords
    } catch {
      showSnackbar('Не вдалося отримати координати, результати можуть бути неточні.', 'info')
    }
  }

  // Підготовка payload
  const itemsToOptimize = cartStore.items.map<ItemToOptimizePayload>(item => ({
    productId: item.productId,
    title:     item.title,
    alternatives: item.alternatives.map(alt => ({
      id:                alt.id,
      productId:         item.productId,
      ean:               alt.ean,
      price:             alt.price,
      available:         alt.available,
      shop:              alt.shop,
      deliveryTime:      alt.deliveryTime,
      weight:            alt.weight,
      deliveryTimeRange: alt.deliveryTimeRange,
      shopScore:         alt.shopScore,
      score:             alt.score,
      slug:              alt.slug,
      zakazUrl:          `https://zakaz.ua/uk/products/${alt.slug}--${alt.ean}`
    }))
  }));

  const payload: OptimizationRequestPayload = {
    items:         itemsToOptimize,
    mode:          { name: optimizerStore.mode, rankingMethod: optimizerStore.rankingMethod },
    maxBudget:     optimizerStore.maxBudget,
    clientCoords,
  }

  try {
    const res = await fetch('/optimizer-api/optimize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }))
      throw new Error(err.message)
    }
    // очікуємо, що бекенд віддає selectedItems із полями slug, ean
    const data = await res.json() as OptimizationResponsePayload & {
      selectedItems: (AlternativePayload & { slug: string })[]
    }

    // додаємо zakazUrl на основі slug + ean
    optimizedItems.value = data.selectedItems.map(alt => ({
      ...alt,
      zakazUrl: `https://zakaz.ua/uk/products/${alt.slug}--${alt.ean}`
    }))
    totalPrice.value       = data.totalPrice
    optimizationDone.value = optimizedItems.value.length > 0

    showSnackbar(
        optimizationDone.value
            ? 'Оптимізацію завершено!'
            : 'Не вдалося знайти оптимальне рішення.',
        optimizationDone.value ? 'success' : 'info'
    )
  } catch (e: any) {
    console.error(e)
    showSnackbar(e.message || 'Помилка оптимізації.', 'error')
  } finally {
    loading.value = false
  }
}

const findProductTitle = (id: string) =>
    cartStore.items.find(i => i.productId === id)?.title

function getShopName(shopId: string | undefined): string {
  if (!shopId) return 'Невідомий'
  const map: Record<string,string> = {
    novus:'Novus', metro:'Metro', auchan:'Auchan', tavriav:'Tavria V',
    ultramarket:'Ultramarket', megamarket:'MegaMarket', silpo:'Silpo',
    cosmo:'Cosmo', zaraz:'Zaraz', ekomarket:'ECO Market',
  }
  return map[shopId.toLowerCase()] || shopId
}
</script>

<style scoped>
.result-section { background: #f9f9f9; border-top: 1px solid #e0e0e0; }
.text-primary   { color: var(--v-theme-primary) !important; }
</style>
