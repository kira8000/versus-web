import type { PublicOrganization } from './api.ts';

// Ponto vem do servidor (geocodificado ao salvar o endereço). Sem ponto: só na lista.
export type MapPin = Pick<PublicOrganization, 'slug' | 'name' | 'address' | 'scheduleText'> & {
  lngLat: [number, number];
};

export type MapView = { center: [number, number]; zoom: number } | { bounds: [[number, number], [number, number]] };

export const mapPins = (orgs: PublicOrganization[]): MapPin[] =>
  orgs.flatMap((o) =>
    o.latitude != null && o.longitude != null
      ? [{ slug: o.slug, name: o.name, address: o.address, scheduleText: o.scheduleText, lngLat: [o.longitude, o.latitude] }]
      : [],
  );

export function mapView(pins: MapPin[]): MapView | null {
  if (pins.length === 0) return null;
  if (pins.length === 1) return { center: pins[0].lngLat, zoom: 14 };
  const lngs = pins.map((p) => p.lngLat[0]);
  const lats = pins.map((p) => p.lngLat[1]);
  return {
    bounds: [
      [Math.min(...lngs), Math.min(...lats)],
      [Math.max(...lngs), Math.max(...lats)],
    ],
  };
}
