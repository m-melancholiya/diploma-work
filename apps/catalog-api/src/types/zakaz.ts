export interface ZakazProduct {
    ean: string;
    eans: string[];
    title: string;
    slug: string;
    img: {
      s150x150: string;
      s200x200: string;
      s350x350: string;
      s1350x1350: string;
    };
    weight: number | null;
    volume: number | null;
    unit: 'kg' | 'pcs' | 'l' | string;
    in_stock: boolean;
    price_details: {
      price_from: number;
      price_to: number;
    };
    bundle: number | null;
    tags: string[];
  }

export interface StorePrice {
    chainId: string;
    storeId: string;
    available: boolean;
    price: number; // в копійках
    ean: string;
    deliveryTimeRange: string | null; // Оригінальний рядок від API, наприклад, "10:00-12:00"
    deliveryTimeMinutes?: number;     // Розрахований час доставки в хвилинах від поточного моменту
}

  export interface GeocodeResult {
    coords: {
      lat: number;
      lng: number;
    };
    city: string;
    street: string;
    building: string;
  }