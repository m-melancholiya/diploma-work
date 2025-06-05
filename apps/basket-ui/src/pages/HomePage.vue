<template>
  <v-responsive class="fill-height-hero">
    <v-img
        :src="backgroundImageUrl"
        cover
        gradient="to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.85)"
        class="d-flex align-center justify-center text-center fill-height-hero"
        alt="Фон кошика з покупками"
    >
      <v-container fluid>
        <v-row justify="center">
          <v-col cols="12" md="10" lg="8">
            <h1 class="text-h2 text-sm-h1 font-weight-bold mb-4 text-white hero-title-custom" style="letter-spacing: 0.05em;">
              BASKETIKA
            </h1>
            <p class="text-h5 text-sm-h4 font-weight-light mb-3 text-grey-lighten-3"> Знайди свій товар
            </p>
            <p class="text-h6 text-sm-h5 mb-8 text-grey-lighten-4"> Оптимізуй покупки з <span class="font-weight-medium" :style="{ color: vuetifyTheme.current.value.colors['hero-text-accent'] }">basketika</span>
            </p>
            <v-btn
                color="secondary" size="x-large"
                rounded="lg"
                elevation="8"
                @click="goToSearchPage"
                class="px-12 py-3 mt-2 custom-hero-btn"
                aria-label="Переглянути товари"
            >
              Переглянути товари <v-icon end>mdi-arrow-right-circle-outline</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-img>
  </v-responsive>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import backgroundImageUrl from '@/assets/basket-bg.png'; // Правильний імпорт для Vite
import { useTheme } from 'vuetify';

const router = useRouter();
const vuetifyTheme = useTheme();

const goToSearchPage = () => {
  router.push('/search');
}
</script>

<style scoped>
.fill-height-hero {
  min-height: calc(100vh - 64px - 48px); /* Висота футера може бути іншою, зараз 48px */
  height: 100%;
  width: 100%;
}

/* Стиль для головного заголовку, якщо потрібно окремо від теми */
.hero-title-custom {
  /* Замість жорсткого зеленого, використовуємо білий, який краще читається на темному фоні */
  color: white !important;
  text-shadow: 1px 1px 4px rgba(0,0,0,0.6); /* Посилена тінь для тексту */
}

/* Текст підзаголовків - використовуємо світлі кольори Vuetify */
/* p.text-grey-lighten-3,
p.text-grey-lighten-4 {
  color: white !important; /* Або світло-сірі з теми, але білий краще на темному */
/* } */

/* Стиль для кнопки, якщо потрібно щось специфічне, що не покривається Vuetify props */
.custom-hero-btn {
  color: white !important; /* Текст кнопки білий для контрасту з secondary кольором */
}
/* CSS правило для .v-btn.primary видалено, оскільки кнопка тепер secondary */
</style>
