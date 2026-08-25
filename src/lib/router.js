import { useCallback, useEffect, useState } from 'react'

/**
 * Two-route History API shim — the venue profile and the booking flow.
 * The real site serves `/a/<slug>` and `/a/<slug>/booking?offerItems=…`;
 * this keeps those URLs shareable without pulling in a router.
 */
export function useRoute() {
  const read = () => ({ path: window.location.pathname, search: window.location.search })
  const [route, setRoute] = useState(read)

  useEffect(() => {
    const onPop = () => setRoute(read())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = useCallback((to, { replace = false } = {}) => {
    window.history[replace ? 'replaceState' : 'pushState']({}, '', to)
    setRoute(read())
    if (!replace) window.scrollTo(0, 0)
  }, [])

  return { ...route, isBooking: /\/booking\/?$/.test(route.path), navigate }
}

/** `?offerItems=sv:123,sv:456` ⇄ service ids, the same shape the original uses. */
export const parseOfferItems = (search) => {
  const raw = new URLSearchParams(search).get('offerItems')
  if (!raw) return []
  return raw
    .split(',')
    .map((s) => s.trim().replace(/^sv:/, ''))
    .filter(Boolean)
}

export const buildBookingUrl = (basePath, serviceIds) => {
  const base = basePath.replace(/\/$/, '')
  if (!serviceIds.length) return `${base}/booking`
  const items = serviceIds.map((id) => `sv:${id}`).join(',')
  return `${base}/booking?offerItems=${encodeURIComponent(items)}`
}
