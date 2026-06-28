'use client'

import { useState } from 'react'

import ProviderAddressAutocomplete, {
  type ProviderAddressSelection,
} from '@/components/admin/providers/ProviderAddressAutocomplete'

type ProviderLocationFieldsProps = {
  initialLocation?: {
    address?: string
    city?: string
    state?: string
    country?: string
    lat?: number
    lng?: number
  }
}

export default function ProviderLocationFields({
  initialLocation,
}: ProviderLocationFieldsProps) {
  const [address, setAddress] = useState(initialLocation?.address ?? '')
  const [city, setCity] = useState(initialLocation?.city ?? '')
  const [state, setState] = useState(initialLocation?.state ?? '')
  const [country, setCountry] = useState(initialLocation?.country ?? 'USA')
  const [lat, setLat] = useState(
    initialLocation?.lat != null ? String(initialLocation.lat) : ''
  )
  const [lng, setLng] = useState(
    initialLocation?.lng != null ? String(initialLocation.lng) : ''
  )

  function handleAddressSelect(data: ProviderAddressSelection) {
    setAddress(data.address)
    setCity(data.city ?? '')
    setState(data.state ?? '')
    setCountry(data.country || 'USA')
    setLat(String(data.lat))
    setLng(String(data.lng))
  }

  return (
    <div className="lg:col-span-2">
      <FieldGroup label="Address search">
        <ProviderAddressAutocomplete onSelect={handleAddressSelect} />

        <p className="mt-2 text-xs leading-5 text-[#8a8277]">
          Search and select an address. Willa will fill the address, city,
          region, country, latitude, and longitude.
        </p>
      </FieldGroup>

      {address ? (
        <div className="mt-4 rounded-2xl bg-[#f8f3eb] p-4 text-sm leading-6 text-[#655d52]">
          <p className="font-semibold text-[#211f1b]">Selected location</p>

          <p className="mt-1">📍 {address}</p>

          <p className="text-xs text-[#8a8277]">
            {[city, state, country].filter(Boolean).join(', ')}
          </p>
        </div>
      ) : null}

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <FieldGroup label="Address">
          <input
            name="address"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            className="h-12 w-full rounded-xl border border-[#e2d7c8] bg-white px-4 text-sm outline-none focus:border-[#a45f51]"
          />
        </FieldGroup>

        <FieldGroup label="City">
          <input
            name="city"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            required
            className="h-12 w-full rounded-xl border border-[#e2d7c8] bg-white px-4 text-sm outline-none focus:border-[#a45f51]"
          />
        </FieldGroup>

        <FieldGroup label="State / Region">
          <input
            name="state"
            value={state}
            onChange={(event) => setState(event.target.value)}
            placeholder="CA"
            className="h-12 w-full rounded-xl border border-[#e2d7c8] bg-white px-4 text-sm outline-none focus:border-[#a45f51]"
          />
        </FieldGroup>

        <FieldGroup label="Country">
          <input
            name="country"
            value={country}
            onChange={(event) => setCountry(event.target.value)}
            required
            className="h-12 w-full rounded-xl border border-[#e2d7c8] bg-white px-4 text-sm outline-none focus:border-[#a45f51]"
          />
        </FieldGroup>

        <FieldGroup label="Latitude">
          <input
            name="lat"
            type="number"
            step="any"
            value={lat}
            onChange={(event) => setLat(event.target.value)}
            required
            className="h-12 w-full rounded-xl border border-[#e2d7c8] bg-white px-4 text-sm outline-none focus:border-[#a45f51]"
          />
        </FieldGroup>

        <FieldGroup label="Longitude">
          <input
            name="lng"
            type="number"
            step="any"
            value={lng}
            onChange={(event) => setLng(event.target.value)}
            required
            className="h-12 w-full rounded-xl border border-[#e2d7c8] bg-white px-4 text-sm outline-none focus:border-[#a45f51]"
          />
        </FieldGroup>
      </div>
    </div>
  )
}

function FieldGroup({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#8a8277]">
        {label}
      </span>

      {children}
    </label>
  )
}