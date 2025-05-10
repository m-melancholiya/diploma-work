import '@mdi/font/css/materialdesignicons.css' // Іконки Material Design
import 'vuetify/styles' // Стилі Vuetify
import { createVuetify, ThemeDefinition } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Приклад визначення власної світлої теми
const myCustomLightTheme: ThemeDefinition = {
    dark: false,
    colors: {
        background: '#FFFFFF', // Білий фон
        surface: '#FFFFFF',    // Білий для поверхонь компонентів (картки, меню)
        primary: '#1976D2',    // Основний синій (Vuetify default)
        'primary-darken-1': '#1565C0',
        secondary: '#424242',  // Темно-сірий
        'secondary-darken-1': '#212121',
        error: '#B00020',      // Червоний для помилок
        info: '#2196F3',       // Блакитний для інформації
        success: '#4CAF50',    // Зелений для успіху
        warning: '#FB8C00',    // Помаранчевий для попереджень
        // Додайте інші кольори за потреби
        'blue-lighten-1': '#64B5F6', // Світло-блакитний для прикладу на HomePage
    }
}

export default createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'myCustomLightTheme', // Встановлення власної теми за замовчуванням
        themes: {
            myCustomLightTheme,
            // Тут можна додати інші теми, наприклад, темну
            // myCustomDarkTheme: { ... }
        }
    }
})