export async function loadFonts(): Promise<void> { // Явно вказуємо тип повернення
    try {
        // Динамічний імпорт пакету webfontloader
        const webFontLoader = await import(/* webpackChunkName: "webfontloader" */'webfontloader');
        // Тепер webFontLoader має бути типізований, якщо @types/webfontloader встановлено

        webFontLoader.load({
            google: {
                families: ['Roboto:100,300,400,500,700,900&display=swap'], // Стандартний шрифт для Vuetify
            },
        });
    } catch (error) {
        console.error("Помилка під час завантаження шрифтів: ", error);
        // Тут можна додати логіку для обробки помилки,
        // наприклад, використання стандартних шрифтів системи.
    }
}