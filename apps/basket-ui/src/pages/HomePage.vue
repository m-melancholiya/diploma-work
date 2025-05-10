<template>
  <v-responsive class="fill-height-hero">
    <v-img
        :src="backgroundImageUrl"
        cover
        gradient="to bottom, rgba(0,0,0,.3), rgba(0,0,0,.7)"
        class="d-flex align-center justify-center text-center fill-height-hero"
        alt="Фон кошика з покупками"
    >
      <v-container fluid>
        <v-row justify="center">
          <v-col cols="12" md="10" lg="8">
            <h1 class="text-h2 text-sm-h1 font-weight-bold mb-4 text-white" style="letter-spacing: 0.05em;">
              BASKETIKA
            </h1>
            <p class="text-h5 text-sm-h4 font-weight-light mb-3 text-grey-lighten-2">
              Знайди свій товар
            </p>
            <p class="text-h6 text-sm-h5 mb-8 text-grey-lighten-3">
              Оптимізуй покупки з <span class="font-weight-medium text-blue-lighten-1">basketika</span>
            </p>
            <v-btn
                color="primary"
                size="x-large"
                rounded="lg"
                elevation="8"
                @click="goToSearchPage"
                class="px-12 py-3 mt-2"
                aria-label="Переглянути товари"
            >
              View products
              <v-icon end>mdi-arrow-right-circle-outline</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-img>
  </v-responsive>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

// Шлях до фонового зображення.
// ВАЖЛИВО: Оновіть цей шлях на правильний!
// Рекомендується розмістити зображення в папці `public/images/` (наприклад, `public/images/basket-bg.png`)
// і тоді шлях буде '/images/basket-bg.png'.
// Якщо зображення в `src/assets/`, його потрібно імпортувати:
// import basketBgFromAssets from '@/assets/images/basket-bg.png'; // Припускаємо, що є alias @ для src
// const backgroundImageUrl = basketBgFromAssets;
const backgroundImageUrl = '/src/assets/basket-bg.png' // ЗАМІНІТЬ ЦЕЙ ШЛЯХ! (Приклад)
// Якщо у вас є файл `basket-bg.png`, використовуйте:
// const backgroundImageUrl = '/images/basket-bg.png'


const router = useRouter()

// Функція для переходу на сторінку пошуку
const goToSearchPage = () => {
  router.push('/search')
}
</script>

<style scoped>
/* Стилі, специфічні для HomePage.vue */
.fill-height-hero {
  /* Розраховуємо висоту так, щоб сторінка займала весь екран мінус хедер та футер.
     Стандартна висота v-app-bar - 64px.
     Стандартна висота v-footer (якщо app=true) - 36px, але може бути більшою з контентом.
     Припустимо, футер ~52px. Налаштуйте ці значення, якщо висота хедера/футера інша.
  */
  min-height: calc(100vh - 64px - 52px);
  height: 100%; /* Дозволяє v-img розтягнутися на всю висоту v-responsive */
  width: 100%;
}

/* Для кращої видимості тексту "basketika" на темному фоні,
   якщо стандартний колір теми `primary` занадто темний.
   Колір 'text-blue-lighten-1' визначений у темі Vuetify (plugins/vuetify.ts)
*/
.text-blue-lighten-1 {
  color: var(--v-theme-blue-lighten-1) !important; /* Використання змінної теми Vuetify */
}

/* Додаткові стилі для тексту, якщо потрібно */
h1.text-white {
  text-shadow: 1px 1px 3px rgba(0,0,0,0.5); /* Легка тінь для кращої читабельності */
}
</style>