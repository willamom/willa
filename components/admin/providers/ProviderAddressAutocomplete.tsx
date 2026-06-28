'use client'

import { useCallback, useEffect, useRef } from 'react'

export type ProviderAddressSelection = {
  address: string
  city?: string
  state?: string
  country?: string
  lat: number
  lng: number
}

type ProviderAddressAutocompleteProps = {
  onSelect: (data: ProviderAddressSelection) => void
}

type MapboxContextItem = {
  id?: string
  text?: string
  name?: string
  short_code?: string
  country_code?: string
}

type MapboxContextObject = Record<
  string,
  {
    id?: string
    name?: string
    text?: string
    short_code?: string
    country_code?: string
  }
>

type MapboxFeature = {
  context?: MapboxContextItem[]
  place_name?: string
  text?: string

  properties?: {
    context?: MapboxContextItem[] | MapboxContextObject
    full_address?: string
    place_formatted?: string
    place_name?: string
    name?: string
    address?: string
    postcode?: string
  }

  geometry?: {
    coordinates?: [number, number]
  }
}

type RetrieveEvent = Event & {
  detail?: {
    features?: MapboxFeature[]
  }
}

function getContextArray(feature: MapboxFeature): MapboxContextItem[] {
  const propsContext = feature.properties?.context

  if (Array.isArray(propsContext)) {
    return propsContext
  }

  if (propsContext && typeof propsContext === 'object') {
    return Object.entries(propsContext).map(([key, value]) => ({
      id: key,
      text: value.text ?? value.name,
      name: value.name ?? value.text,
      short_code: value.short_code,
      country_code: value.country_code,
    }))
  }

  if (Array.isArray(feature.context)) {
    return feature.context
  }

  return []
}

function findContextValue(
  context: MapboxContextItem[],
  keys: string[]
) {
  const item = context.find((entry) =>
    keys.some((key) => entry.id?.startsWith(key))
  )

  return item?.text ?? item?.name ?? ''
}

function findContextShortCode(
  context: MapboxContextItem[],
  keys: string[]
) {
  const item = context.find((entry) =>
    keys.some((key) => entry.id?.startsWith(key))
  )

  return item?.short_code ?? item?.country_code ?? ''
}

function cleanRegionCode(value: string) {
  if (!value) return ''

  const parts = value.split('-')
  return parts[parts.length - 1]?.toUpperCase() ?? value
}

export default function ProviderAddressAutocomplete({
  onSelect,
}: ProviderAddressAutocompleteProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const extractAddressData = useCallback((feature: MapboxFeature) => {
    const props = feature.properties ?? {}
    const context = getContextArray(feature)

    const fullAddress =
      props.full_address ||
      props.place_name ||
      feature.place_name ||
      props.place_formatted ||
      props.name ||
      feature.text ||
      ''

    const addressParts = fullAddress
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean)

    const address =
      addressParts[0] ||
      props.address ||
      props.name ||
      feature.text ||
      fullAddress

    const city =
      findContextValue(context, ['place', 'locality', 'district']) ||
      addressParts[1] ||
      ''

    const regionName =
      findContextValue(context, ['region']) ||
      addressParts[2] ||
      ''

    const regionCode =
      cleanRegionCode(findContextShortCode(context, ['region']))

    const country =
      findContextValue(context, ['country']) ||
      addressParts[addressParts.length - 1] ||
      ''

    return {
      address,
      city,
      state: regionCode || regionName,
      country,
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    let searchBox: HTMLElement | null = null

    async function init() {
      if (!containerRef.current) return

      if (!window.customElements?.get('mapbox-search-box')) {
        await import('@mapbox/search-js-web')
      }

      if (cancelled || !containerRef.current) return

      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

      if (!token) {
        containerRef.current.innerHTML =
          '<div style="font-size: 13px; color: #8a8277;">Mapbox token missing.</div>'
        return
      }

      const el = document.createElement('mapbox-search-box')

      el.setAttribute('access-token', token)
      el.setAttribute('placeholder', 'Search address')
      el.setAttribute('language', 'en')
      el.style.width = '100%'

      el.addEventListener('retrieve', (event) => {
        const retrieveEvent = event as RetrieveEvent
        const feature = retrieveEvent.detail?.features?.[0]

        if (!feature) return

        const coordinates = feature.geometry?.coordinates

        if (!coordinates) return

        const [lng, lat] = coordinates

        if (typeof lng !== 'number' || typeof lat !== 'number') {
          return
        }

        const addressData = extractAddressData(feature)

        onSelect({
          ...addressData,
          lat,
          lng,
        })
      })

      containerRef.current.innerHTML = ''
      containerRef.current.appendChild(el)
      searchBox = el
    }

    init()

    return () => {
      cancelled = true

      if (searchBox) {
        searchBox.remove()
      }
    }
  }, [extractAddressData, onSelect])

  return <div ref={containerRef} />
}