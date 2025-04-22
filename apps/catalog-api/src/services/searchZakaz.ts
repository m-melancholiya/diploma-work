import axios from 'axios';
import { ZakazProduct } from '../types/zakaz';

export async function searchZakaz(query: string): Promise<ZakazProduct[]> {
  const encodedQuery = encodeURIComponent(query);

  const res = await axios.get('https://stores-api.zakaz.ua/uber_catalog/products/search/', {
    params: {
      q: encodedQuery,
      per_page: 50,
      sort: 'relevance_desc'
    },
    headers: {
      'accept': '*/*',
      'accept-language': 'uk',
      'cache-control': 'no-cache',
      'content-type': 'application/json',
      'origin': 'https://zakaz.ua',
      'referer': 'https://zakaz.ua/',
      'x-chain': '*',
      'x-version': '63',
      'user-agent': 'Mozilla/5.0',
    }
  });

  return (res.data?.results || []).map((item: any): ZakazProduct => ({
    ean: item.ean,
    eans: item.eans,
    title: item.title,
    slug: item.slug,
    img: item.img,
    weight: item.weight,
    volume: item.volume,
    unit: item.unit,
    in_stock: item.in_stock,
    price_details: {
      price_from: item.price_details?.price_from ?? 0,
      price_to: item.price_details?.price_to ?? 0
    },
    bundle: item.bundle,
    tags: item.tags || []
  }));
}