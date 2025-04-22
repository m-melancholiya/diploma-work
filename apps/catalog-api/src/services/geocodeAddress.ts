import axios from "axios";
import { GeocodeResult } from '../types/zakaz';


export async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
    const encodedQuery = encodeURIComponent(address);

    try {
      const res = await axios.get('https://stores-api.zakaz.ua/address_management/geocode/', {
        params: {
          encodedQuery,
          delivery_service_id: 'zakaz',
        },
        headers: {
          'accept': '*/*',
          'content-type': 'application/json',
          'origin': 'https://zakaz.ua',
          'referer': 'https://zakaz.ua/',
          'x-chain': '*',
          'x-version': '63',
          'user-agent': 'Mozilla/5.0',
        },
      });
  
      return res.data;
    } catch (err) {
      console.error(`❌ Error geocoding address "${address}":`, err);
      return null;
    }
  }