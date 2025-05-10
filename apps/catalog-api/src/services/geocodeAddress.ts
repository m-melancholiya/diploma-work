import axios from 'axios';

/**
 * Геокодування адреси через API zakaz.ua
 * 
 * @param address Адреса користувача
 * @returns Координати у форматі "lat,lon" або null
 */
export async function geocodeAddress(address: string): Promise<string | null> {
  try {
    const res = await axios.get('https://stores-api.zakaz.ua/address_management/geocode/', {
      params: {
        address: address, // прямо передаємо адресу
        delivery_service_id: 'zakaz'
      },
      headers: {
        'accept': '*/*',
        'content-type': 'application/json',
        'origin': 'https://zakaz.ua',
        'referer': 'https://zakaz.ua/',
        'x-chain': '*',
        'x-version': '63',
        'user-agent': 'Mozilla/5.0'
      },
    });

    const coords = res.data?.coords;

    if (coords && typeof coords.lat === 'number' && typeof coords.lng === 'number') {
      // Правильне формування координат
      return `${coords.lat},${coords.lng}`;
    } else {
      console.error('❌ Не знайдено координати в відповіді:', res.data);
      return null;
    }
  } catch (err) {
    console.error(`❌ Помилка при геокодуванні адреси "${address}":`, err);
    return null;
  }
}