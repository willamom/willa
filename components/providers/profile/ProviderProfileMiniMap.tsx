'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'

import { getProviderCategoryConfig } from '@/data/providers/categories'
import type { WillaProvider } from '@/types/providers'

const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

if (mapboxToken) {
  mapboxgl.accessToken = mapboxToken
}

type ProviderProfileMiniMapProps = {
  provider: WillaProvider
}

export default function ProviderProfileMiniMap({
  provider,
}: ProviderProfileMiniMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)

  const { lat, lng } = provider.location
  const category = getProviderCategoryConfig(provider.category)

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return
    if (!mapboxToken) return

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [lng, lat],
      zoom: 13,
      interactive: true,
    })

    mapRef.current = map

    map.addControl(
      new mapboxgl.NavigationControl({
        showCompass: false,
      }),
      'top-right'
    )

    map.on('load', () => {
      try {
        map.setPaintProperty('water', 'fill-color', '#d6eef7')
        map.setPaintProperty('land', 'background-color', '#fbf7ef')
      } catch {
        // Some Mapbox styles may not expose the same layer ids.
      }
    })

    new mapboxgl.Marker({
      color: category.color,
    })
      .setLngLat([lng, lat])
      .addTo(map)

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [lat, lng, category.color])

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`

  if (!mapboxToken) {
    return (
      <section className="overflow-hidden rounded-[1.75rem] border border-[#e2d7c8] bg-[#f8f3eb] p-5">
        <p className="font-serif text-2xl text-[#211f1b]">
          Mapbox token missing.
        </p>

        <p className="mt-2 text-sm leading-6 text-[#655d52]">
          Add NEXT_PUBLIC_MAPBOX_TOKEN to show this provider on the map.
        </p>
      </section>
    )
  }

  return (
    <section className="overflow-hidden rounded-[1.75rem] border border-[#e2d7c8] bg-white shadow-[0_18px_55px_rgba(61,50,38,0.06)]">
      <div ref={mapContainerRef} className="h-[280px] w-full" />

      <div className="flex items-center justify-between gap-4 border-t border-[#eee3d6] px-5 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a8277]">
            Location
          </p>

          <p className="mt-1 text-sm leading-6 text-[#655d52]">
            {provider.location.city}
            {provider.location.state ? `, ${provider.location.state}` : ''}
          </p>
        </div>

        <a
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 rounded-full bg-[#4f5d3d] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#414d31]"
        >
          Open map
        </a>
      </div>
    </section>
  )
}