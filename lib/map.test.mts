import assert from 'node:assert/strict';
import { test } from 'node:test';

import type { PublicOrganization } from './api.ts';
import { mapPins, mapView } from './map.ts';

const org = (slug: string, latitude: number | null, longitude: number | null): PublicOrganization => ({
  id: slug,
  slug,
  name: slug.toUpperCase(),
  city: 'SP',
  address: latitude == null ? null : 'Praça X',
  scheduleText: null,
  latitude,
  longitude,
  editionCount: 0,
});

test('só batalha com ponto vira pino (sem endereço achado fica só na lista)', () => {
  const pins = mapPins([org('san', -23.5, -46.6), org('sem', null, null), org('meio', -23.5, null)]);
  assert.deepEqual(pins.map((p) => p.slug), ['san']);
  assert.deepEqual(pins[0].lngLat, [-46.6, -23.5]);
});

test('um pino: centraliza nele', () => {
  assert.deepEqual(mapView(mapPins([org('san', -23.5, -46.6)])), { center: [-46.6, -23.5], zoom: 14 });
});

test('vários pinos: enquadra todos', () => {
  const view = mapView(mapPins([org('a', -23.5, -46.6), org('b', -22.9, -43.2), org('c', -25.4, -49.3)]));
  assert.deepEqual(view, { bounds: [[-49.3, -25.4], [-43.2, -22.9]] });
});

test('nenhum pino: sem mapa', () => {
  assert.equal(mapView([]), null);
});
