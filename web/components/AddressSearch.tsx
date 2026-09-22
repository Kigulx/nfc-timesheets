'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import { loadGoogleMaps, MAPS_API_KEY, onMapsAuthFailure } from '@/lib/map'

type Place = {
  formattedAddress?: string
  fetchFields(options: { fields: string[] }): Promise<unknown>
}
type Selection = Event & { placePrediction: { toPlace(): Place } }

/** Suggestions help enter an address. The server still verifies it before placing a pin. */
export function AddressSearch({
  value,
  disabled,
  onSelect,
}: {
  value: string
  disabled: boolean
  onSelect: (address: string) => void
}) {
  const t = useTranslations('locations')
  const locale = useLocale()
  const host = useRef<HTMLDivElement>(null)
  const latest = useRef({ value, disabled, onSelect })
  const [state, setState] = useState<'loading' | 'ready' | 'failed'>(
    MAPS_API_KEY ? 'loading' : 'failed',
  )
  useEffect(() => {
    latest.current = { value, disabled, onSelect }
  }, [value, disabled, onSelect])

  useEffect(() => {
    if (!MAPS_API_KEY) return
    let cancelled = false
    let failed = false
    let generation = 0
    let widget: HTMLElement | undefined
    const fail = () => {
      failed = true
      if (!cancelled) setState('failed')
    }
    setState('loading')
    const unsubscribe = onMapsAuthFailure(fail)
    const timeout = window.setTimeout(fail, 12000)
    void loadGoogleMaps()
      .then(async (api) => {
        const { PlaceAutocompleteElement } = await api.importLibrary('places')
        if (cancelled || failed) return
        widget = new PlaceAutocompleteElement({
          includedRegionCodes: ['at'],
          requestedLanguage: locale,
        })
        widget.setAttribute('aria-label', t('addressSearch'))
        widget.setAttribute('tabindex', '0')
        widget.addEventListener('gmp-error', fail)
        widget.addEventListener('gmp-select', async (event) => {
          const request = ++generation
          const original = latest.current.value
          if (latest.current.disabled) return
          try {
            const place = (event as Selection).placePrediction.toPlace()
            await place.fetchFields({ fields: ['formattedAddress'] })
            if (
              cancelled ||
              failed ||
              request !== generation ||
              latest.current.disabled ||
              latest.current.value !== original
            )
              return
            if (!place.formattedAddress) {
              fail()
              return
            }
            latest.current.onSelect(place.formattedAddress)
          } catch {
            fail()
          }
        })
        host.current?.replaceChildren(widget)
        window.clearTimeout(timeout)
        setState('ready')
      })
      .catch(fail)
    return () => {
      cancelled = true
      unsubscribe()
      window.clearTimeout(timeout)
      widget?.remove()
    }
  }, [locale, t])

  return (
    <div className="address-search">
      <p className="field-hint" role="status">
        {t(
          state === 'failed'
            ? 'addressSearchUnavailable'
            : state === 'loading'
              ? 'addressSearchLoading'
              : 'addressSearchHint',
        )}
      </p>
      <div ref={host} hidden={state !== 'ready'} inert={disabled} />
    </div>
  )
}
