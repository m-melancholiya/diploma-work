import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify, ThemeDefinition } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const myCustomLightTheme: ThemeDefinition = {
    dark: false,
    colors: {
        background: '#FFFFFF',      // Загальний фон сторінок
        surface: '#FFFFFF',         // Фон для елементів типу v-card, v-sheet
        primary: '#356859',         // Ваш основний зелений
        'primary-darken-1': '#2A524F', // Трохи темніший зелений
        error: '#B00020',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FB8C00',
        'app-bar-background': '#FFFBE6', // Ваш кремовий/бежевий для AppBar
    }
}

export default createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'myCustomLightTheme',
        themes: {
            myCustomLightTheme,
        }
    }
})
