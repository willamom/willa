'use client'

import { useState } from 'react'

type ProviderImageUrlFieldProps = {
  defaultValue?: string
}

function getSafeBackgroundImage(value: string) {
  const cleanValue = value.trim().replace(/"/g, '\\"')

  return `url("${cleanValue}")`
}

export default function ProviderImageUrlField({
  defaultValue = '',
}: ProviderImageUrlFieldProps) {
  const [imageUrl, setImageUrl] = useState(defaultValue)
  const cleanImageUrl = imageUrl.trim()

  return (
    <div className="lg:col-span-2">
      <label className="block">
        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#8a8277]">
          Image URL
        </span>

        <input
          name="image_url"
          value={imageUrl}
          onChange={(event) => setImageUrl(event.target.value)}
          placeholder="/images/providers/example.jpg or https://..."
          className="h-12 w-full rounded-xl border border-[#e2d7c8] bg-white px-4 text-sm outline-none focus:border-[#a45f51]"
        />
      </label>

      <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-[#e2d7c8] bg-[#f8f3eb]">
        {cleanImageUrl ? (
          <div className="relative h-56 overflow-hidden bg-[#f2ece2]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: getSafeBackgroundImage(cleanImageUrl),
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

            <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#211f1b] shadow-sm backdrop-blur-md">
              Image preview
            </div>
          </div>
        ) : (
          <div className="flex h-40 items-center justify-center p-6 text-center">
            <div>
              <p className="font-serif text-2xl text-[#211f1b]">
                No image yet
              </p>

              <p className="mt-2 max-w-sm text-sm leading-6 text-[#8a8277]">
                Paste an image URL above to preview how this provider may look
                on Willa.
              </p>
            </div>
          </div>
        )}
      </div>

      <p className="mt-2 text-xs leading-5 text-[#8a8277]">
        Use a warm, clear image when possible. Provider portrait, studio,
        office, service photo, or soft brand image works best.
      </p>
    </div>
  )
}