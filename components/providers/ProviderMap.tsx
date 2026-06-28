'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'

import { getProviderCategoryConfig } from '@/data/providers/categories'
import type { ProviderCategory, WillaProvider } from '@/types/providers'

const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

const DEFAULT_PROVIDER_CENTER: [number, number] = [-117.1611, 32.7157]
const DEFAULT_PROVIDER_ZOOM = 10.5
const DEFAULT_SELECTED_SPECIALTIES: string[] = []

if (mapboxToken) {
  mapboxgl.accessToken = mapboxToken
}

type FlyToRequest = {
  id: number
  center: [number, number]
  zoom?: number
}

type ProviderMapProps = {
  providers: WillaProvider[]
  center?: [number, number]
  zoom?: number
  category?: ProviderCategory | 'all'
  query?: string
  selectedSpecialties?: string[]
  focusProviderId?: string | null
  selectedProviderId?: string | null
  flyToRequest?: FlyToRequest | null
  onProviderSelect?: (provider: WillaProvider) => void
  onResultsChange?: (providers: WillaProvider[]) => void
  onViewportProvidersChange?: (providers: WillaProvider[]) => void
}

type MapFeatureWithProperties = {
  properties?: Record<string, unknown>
}

type MapPointFeature = {
  geometry?: {
    type?: string
    coordinates?: unknown
  }
}

function getFeatureProperty(feature: unknown, key: string) {
  return (feature as MapFeatureWithProperties | undefined)?.properties?.[key]
}

function getFeaturePointCoordinates(feature: unknown): [number, number] | null {
  const geometry = (feature as MapPointFeature | undefined)?.geometry

  if (geometry?.type !== 'Point') {
    return null
  }

  if (!Array.isArray(geometry.coordinates)) {
    return null
  }

  const [lng, lat] = geometry.coordinates

  if (typeof lng !== 'number' || typeof lat !== 'number') {
    return null
  }

  return [lng, lat]
}

function getProviderIdsKey(providers: WillaProvider[]) {
  return providers
    .map((provider) => provider.id)
    .sort()
    .join('|')
}

export default function ProviderMap({
  providers,
  center = DEFAULT_PROVIDER_CENTER,
  zoom = DEFAULT_PROVIDER_ZOOM,
  category = 'all',
  query = '',
  selectedSpecialties = DEFAULT_SELECTED_SPECIALTIES,
  focusProviderId,
  selectedProviderId,
  flyToRequest,
  onProviderSelect,
  onResultsChange,
  onViewportProvidersChange,
}: ProviderMapProps) {
  const initialCenterRef = useRef(center)
  const initialZoomRef = useRef(zoom)

  const mapRef = useRef<mapboxgl.Map | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const providersRef = useRef<WillaProvider[]>([])

  const lastFocusProviderIdRef = useRef<string | null>(null)
  const lastViewportProviderIdsRef = useRef('')
  const lastResultsProviderIdsRef = useRef('')

  const onProviderSelectRef = useRef(onProviderSelect)
  const onResultsChangeRef = useRef(onResultsChange)
  const onViewportProvidersChangeRef = useRef(onViewportProvidersChange)

  const [mapReady, setMapReady] = useState(false)
  const [popupProvider, setPopupProvider] = useState<WillaProvider | null>(null)
  const [popupPos, setPopupPos] = useState<{ x: number; y: number } | null>(
    null
  )
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    onProviderSelectRef.current = onProviderSelect
  }, [onProviderSelect])

  useEffect(() => {
    onResultsChangeRef.current = onResultsChange
  }, [onResultsChange])

  useEffect(() => {
    onViewportProvidersChangeRef.current = onViewportProvidersChange
  }, [onViewportProvidersChange])

  const visibleProviders = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase()

    return providers.filter((provider) => {
      if (category !== 'all' && provider.category !== category) {
        return false
      }

      if (selectedSpecialties.length > 0) {
        const providerSpecialties = provider.specialties.map((item) =>
          item.toLowerCase()
        )

        const hasSpecialty = selectedSpecialties.some((specialty) =>
          providerSpecialties.includes(specialty.toLowerCase())
        )

        if (!hasSpecialty) {
          return false
        }
      }

      if (cleanQuery) {
        const searchable = [
          provider.name,
          provider.description,
          provider.location.city,
          provider.location.state,
          provider.location.country,
          getProviderCategoryConfig(provider.category).label,
          ...provider.specialties,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        if (!searchable.includes(cleanQuery)) {
          return false
        }
      }

      return true
    })
  }, [providers, category, selectedSpecialties, query])

  const emitViewportProviders = useCallback(() => {
    const map = mapRef.current

    if (!map) {
      return
    }

    const bounds = map.getBounds()

    if (!bounds) {
      return
    }

    const providersInsideBounds = providersRef.current.filter((provider) =>
      bounds.contains([provider.location.lng, provider.location.lat])
    )

    const nextIds = getProviderIdsKey(providersInsideBounds)

    if (lastViewportProviderIdsRef.current === nextIds) {
      return
    }

    lastViewportProviderIdsRef.current = nextIds
    onViewportProvidersChangeRef.current?.(providersInsideBounds)
  }, [])

  useEffect(() => {
    providersRef.current = visibleProviders

    const nextResultsIds = getProviderIdsKey(visibleProviders)

    if (lastResultsProviderIdsRef.current !== nextResultsIds) {
      lastResultsProviderIdsRef.current = nextResultsIds
      onResultsChangeRef.current?.(visibleProviders)
    }

    if (mapReady) {
      lastViewportProviderIdsRef.current = ''
      emitViewportProviders()
    }
  }, [visibleProviders, mapReady, emitViewportProviders])

  useEffect(() => {
    setActiveId(selectedProviderId ?? null)
  }, [selectedProviderId])

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    if (!mapboxToken) return

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: initialCenterRef.current,
      zoom: initialZoomRef.current,
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

      map.addSource('providers', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
        cluster: true,
        clusterRadius: 42,
      })

      map.addLayer({
        id: 'provider-clusters',
        type: 'circle',
        source: 'providers',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': '#b9afa3',
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            15,
            10,
            18,
            30,
            23,
            60,
            28,
          ],
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 2,
        },
      })

      map.addLayer({
        id: 'provider-cluster-count',
        type: 'symbol',
        source: 'providers',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': ['to-string', ['get', 'point_count']],
          'text-size': 12,
          'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
        },
        paint: {
          'text-color': '#ffffff',
        },
      })

      map.addLayer({
        id: 'provider-points',
        type: 'circle',
        source: 'providers',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': ['get', 'color'],
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            9,
            ['case', ['==', ['get', 'isActive'], 1], 8, 5],
            12,
            ['case', ['==', ['get', 'isActive'], 1], 11, 7],
            15,
            ['case', ['==', ['get', 'isActive'], 1], 15, 10],
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        },
      })

      map.on('click', 'provider-points', (event) => {
        const feature = event.features?.[0]
        if (!feature) return

        const idProperty = getFeatureProperty(feature, 'id')
        if (idProperty == null) return

        const id = String(idProperty)

        const provider = providersRef.current.find(
          (item) => String(item.id) === id
        )

        if (!provider) return

        setActiveId(provider.id)
        setPopupProvider(null)
        setPopupPos(null)
        onProviderSelectRef.current?.(provider)
      })

      map.on('mouseenter', 'provider-points', (event) => {
        map.getCanvas().style.cursor = 'pointer'

        const feature = event.features?.[0]
        if (!feature) return

        const idProperty = getFeatureProperty(feature, 'id')
        if (idProperty == null) return

        const id = String(idProperty)

        const provider = providersRef.current.find(
          (item) => String(item.id) === id
        )

        if (!provider) return

        setPopupProvider(provider)
        setPopupPos({
          x: event.point.x,
          y: event.point.y,
        })
      })

      map.on('mouseleave', 'provider-points', () => {
        map.getCanvas().style.cursor = ''
        setPopupProvider(null)
        setPopupPos(null)
      })

      map.on('click', 'provider-clusters', (event) => {
        const features = map.queryRenderedFeatures(event.point, {
          layers: ['provider-clusters'],
        })

        const feature = features[0]
        if (!feature) return

        const rawClusterId = getFeatureProperty(feature, 'cluster_id')
        const clusterId =
          typeof rawClusterId === 'number'
            ? rawClusterId
            : Number(rawClusterId)

        if (!Number.isFinite(clusterId)) return

        const coordinates = getFeaturePointCoordinates(feature)
        if (!coordinates) return

        const source = map.getSource('providers') as mapboxgl.GeoJSONSource
        if (!source) return

        source.getClusterExpansionZoom(clusterId, (error, nextZoom) => {
          if (error || nextZoom == null) return

          map.easeTo({
            center: coordinates,
            zoom: nextZoom,
            duration: 500,
          })
        })
      })

      map.on('click', (event) => {
        const features = map.queryRenderedFeatures(event.point, {
          layers: ['provider-points', 'provider-clusters'],
        })

        if (features.length > 0) return

        setPopupProvider(null)
        setPopupPos(null)
      })

      map.on('moveend', () => {
        emitViewportProviders()
      })

      setMapReady(true)
    })

    return () => {
      setMapReady(false)
      map.remove()
      mapRef.current = null
      lastViewportProviderIdsRef.current = ''
      lastResultsProviderIdsRef.current = ''
    }
  }, [emitViewportProviders])

  useEffect(() => {
    if (!mapRef.current || !mapReady) return

    mapRef.current.resize()
  }, [mapReady])

  useEffect(() => {
    if (!mapRef.current || !mapReady) return

    const source = mapRef.current.getSource(
      'providers'
    ) as mapboxgl.GeoJSONSource

    if (!source) return

    source.setData({
      type: 'FeatureCollection',
      features: visibleProviders.map((provider) => {
        const categoryConfig = getProviderCategoryConfig(provider.category)

        return {
          type: 'Feature' as const,
          properties: {
            id: provider.id,
            color: categoryConfig.color,
            isActive: provider.id === activeId ? 1 : 0,
            isFeatured: provider.isFeatured ? 1 : 0,
            isVerified: provider.isVerified ? 1 : 0,
          },
          geometry: {
            type: 'Point' as const,
            coordinates: [
              provider.location.lng,
              provider.location.lat,
            ] as [number, number],
          },
        }
      }),
    })
  }, [visibleProviders, activeId, mapReady])

  useEffect(() => {
    if (!focusProviderId) {
      lastFocusProviderIdRef.current = null
      return
    }

    if (!mapRef.current || !mapReady) return

    if (lastFocusProviderIdRef.current === focusProviderId) {
      return
    }

    const provider = providersRef.current.find(
      (item) => String(item.id) === String(focusProviderId)
    )

    if (!provider) return

    lastFocusProviderIdRef.current = focusProviderId

    mapRef.current.easeTo({
      center: [provider.location.lng - 0.004, provider.location.lat],
      zoom: Math.max(mapRef.current.getZoom(), 13.5),
      duration: 650,
      easing: (time) => time * (2 - time),
    })

    setPopupProvider(null)
    setPopupPos(null)
    setActiveId(provider.id)
  }, [focusProviderId, mapReady])

  useEffect(() => {
    if (!flyToRequest || !mapRef.current || !mapReady) return

    mapRef.current.easeTo({
      center: flyToRequest.center,
      zoom: flyToRequest.zoom ?? 12.5,
      duration: 800,
      easing: (time) => time * (2 - time),
    })
  }, [flyToRequest, mapReady])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return

      setPopupProvider(null)
      setPopupPos(null)
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  if (!mapboxToken) {
    return (
      <div className="flex h-full min-h-[28rem] items-center justify-center rounded-[2rem] bg-[#f2ece2] p-8 text-center">
        <div>
          <p className="font-serif text-3xl text-[#211f1b]">
            Mapbox token missing.
          </p>

          <p className="mt-3 max-w-md text-sm leading-6 text-[#655d52]">
            Add NEXT_PUBLIC_MAPBOX_TOKEN to your environment variables to show
            the provider map.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-[#f2ece2]">
      <div ref={containerRef} className="h-full w-full" />

      {popupProvider && popupPos ? (
        <>
          <div className="absolute inset-x-3 bottom-4 z-[1000] sm:hidden">
            <ProviderPopup
              provider={popupProvider}
              onViewDetails={(provider) => {
                setPopupProvider(null)
                setPopupPos(null)
                setActiveId(provider.id)
                onProviderSelectRef.current?.(provider)
              }}
            />
          </div>

          <div
            className="absolute z-[1000] hidden sm:block"
            style={{
              left: popupPos.x,
              top: popupPos.y,
              transform: 'translate(12px, -50%)',
            }}
          >
            <ProviderPopup
              provider={popupProvider}
              onViewDetails={(provider) => {
                setPopupProvider(null)
                setPopupPos(null)
                setActiveId(provider.id)
                onProviderSelectRef.current?.(provider)
              }}
            />
          </div>
        </>
      ) : null}
    </div>
  )
}

function ProviderPopup({
  provider,
  onViewDetails,
}: {
  provider: WillaProvider
  onViewDetails: (provider: WillaProvider) => void
}) {
  const category = getProviderCategoryConfig(provider.category)

  return (
    <div className="w-full rounded-2xl bg-white p-4 shadow-[0_20px_60px_rgba(61,50,38,0.16)] sm:w-72">
      <div className="flex items-center gap-2">
        <span
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: category.color }}
        />

        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a8277]">
          {category.label}
        </p>
      </div>

      <p className="mt-3 font-serif text-2xl leading-tight text-[#211f1b]">
        {provider.name}
      </p>

      <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#655d52]">
        {provider.description}
      </p>

      <button
        type="button"
        onClick={() => onViewDetails(provider)}
        className="mt-4 text-sm font-semibold text-[#4f5d3d] transition hover:text-[#211f1b]"
      >
        View details →
      </button>
    </div>
  )
}