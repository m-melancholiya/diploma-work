<!-- src/components/shared/HeaderComponent.vue -->
<template>
  <v-app-bar
      flat
      height="64"
      :style="{ backgroundColor: '#FFFBE6' }"
  >
    <v-container class="d-flex align-center justify-space-between">
      <!-- Логотип / Назва -->
      <v-toolbar-title class="text-h6" :style="{ color: '#356859' }">
        BASKETIKA
      </v-toolbar-title>

      <!-- Вкладки -->
      <div class="d-flex">
        <v-btn
            v-for="tab in tabs"
            :key="tab.route"
            text
            :style="buttonStyle(tab.route === route.path)"
            @click="navigate(tab.route)"
        >
          {{ tab.label }}
        </v-btn>
      </div>

      <!-- Іконка корзини -->
      <v-btn icon @click="navigate('/cart')">
        <v-icon size="24" :style="{ color: '#356859' }">mdi-cart</v-icon>
      </v-btn>
    </v-container>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const tabs = [
  { label: 'Головна', route: '/' },
  { label: 'Як це працює', route: '/how-it-works' },
  { label: 'Пошук', route: '/search' }
]

function navigate(to: string) {
  if (route.path !== to) router.push(to)
}

// Повертає інлайн-стиль для кнопки: підсвічує активну
function buttonStyle(isActive: boolean) {
  return {
    color: isActive ? '#FFFBE6' : '#356859',
    backgroundColor: isActive ? '#356859' : 'transparent'
  }
}
</script>

<style scoped>
/* Vuetify utility-класи: flex та alignment */
.d-flex { display: flex; }
.align-center { align-items: center; }
.justify-space-between { justify-content: space-between; }
</style>