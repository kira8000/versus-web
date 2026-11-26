'use client';

import 'maplibre-gl/dist/maplibre-gl.css';

import { useEffect, useRef } from 'react';

import { mapView, type MapPin } from '@/lib/map';

// OpenFreeMap: tiles OSM gratuitos, sem chave. Estilo escuro combina com o cromo preto.
const STYLE_URL = 'https://tiles.openfreemap.org/styles/dark';

function popupContent(pin: MapPin) {
  // textContent, nunca innerHTML: nome e endereço vêm de quem organiza.
  const el = document.createElement('div');
  el.className = 'pin';
  const title = document.createElement('a');
  title.href = `/b/${pin.slug}`;
  title.textContent = pin.name;
  el.append(title);
  for (const line of [pin.scheduleText, pin.address]) {
    if (!line) continue;
    const p = document.createElement('p');
    p.textContent = line;
    el.append(p);
  }
  return el;
}

export function BattlesMap({ pins }: { pins: MapPin[] }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const view = mapView(pins);
    if (!container.current || !view) return;
    let map: import('maplibre-gl').Map | undefined;
    let cancelled = false;
    // maplibre-gl só roda no navegador: carrega aqui, fora do render do servidor.
    import('maplibre-gl').then(({ default: maplibregl }) => {
      if (cancelled || !container.current) return;
      map = new maplibregl.Map({
        container: container.current,
        style: STYLE_URL,
        ...('bounds' in view ? { bounds: view.bounds, fitBoundsOptions: { padding: 48, maxZoom: 14 } } : view),
        attributionControl: { compact: true },
        cooperativeGestures: true,
      });
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }));
      for (const pin of pins) {
        new maplibregl.Marker({ color: '#ffd400' })
          .setLngLat(pin.lngLat)
          .setPopup(new maplibregl.Popup({ offset: 24, closeButton: false }).setDOMContent(popupContent(pin)))
          .addTo(map);
      }
    });
    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [pins]);

  if (pins.length === 0) return null;
  return <div ref={container} className="map" role="region" aria-label="Mapa das batalhas" />;
}
