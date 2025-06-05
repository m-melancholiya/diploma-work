<template>
  <v-container class="py-8 px-4">
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <v-card elevation="2" class="pa-4 pa-md-8">
          <h1 class="text-h4 text-md-h3 font-weight-medium mb-6 text-center text-primary">
            Про BASKETIKA
          </h1>
          <v-divider class="mb-6"></v-divider>
          <p class="text-body-1 mb-4" style="line-height: 1.8;">
            Ласкаво просимо до <strong>BASKETIKA</strong>! Наша місія - допомогти вам знаходити найкращі товари та оптимізувати ваші покупки.
            Ми прагнемо зробити процес вибору та придбання товарів максимально зручним, швидким та вигідним.
          </p>
          <p class="text-body-1 mb-4" style="line-height: 1.8;">
            Наша платформа аналізує ціни, характеристики товарів та відгуки покупців, щоб ви могли приймати поінформовані рішення.
            Ми використовуємо сучасні технології для порівняння пропозицій від різних магазинів, допомагаючи вам економити час та гроші.
          </p>
          <p class="text-body-1" style="line-height: 1.8;">
            З BASKETIKA ви завжди будете в курсі найкращих пропозицій, акцій та знижок. Приєднуйтесь до нашої спільноти розумних покупців!
          </p>

          <v-divider class="my-8"></v-divider>

          <h2 class="text-h5 font-weight-medium mb-4 text-center">Наші переваги</h2>
          <v-row>
            <v-col cols="12" sm="4" v-for="advantage in advantages" :key="advantage.title">
              <v-card variant="tonal" color="primary" class="fill-height d-flex flex-column">
                <v-card-item class="text-center">
                  <div>
                    <v-icon size="x-large" class="mb-2">{{ advantage.icon }}</v-icon>
                    <div class="text-h6 mb-1">{{ advantage.title }}</div>
                    <div class="text-caption">{{ advantage.text }}</div>
                  </div>
                </v-card-item>
              </v-card>
            </v-col>
          </v-row>

        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const advantages = ref([
  { icon: 'mdi-timer-sand', title: 'Економія часу', text: 'Швидкий пошук та порівняння товарів.' },
  { icon: 'mdi-cash-multiple', title: 'Вигідні ціни', text: 'Знаходьте найкращі пропозиції та знижки.' },
  { icon: 'mdi-check-decagram', title: 'Надійність', text: 'Інформація з перевірених джерел.' },
]);
</script>

<style scoped>
.fill-height {
  height: 100%;
}
</style>