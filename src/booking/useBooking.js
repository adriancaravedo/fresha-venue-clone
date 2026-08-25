import { useCallback, useMemo, useState } from 'react'
import { captionToMinutes, slotsFor } from './availability.js'

export const STEPS = [
  { key: 'services', label: 'Services', title: 'Select services' },
  { key: 'professional', label: 'Professional', title: 'Select professional' },
  { key: 'time', label: 'Time', title: 'Select date and time' },
  { key: 'confirm', label: 'Confirm', title: 'Review and confirm' },
]

/**
 * Booking state for all four steps. Changing services or professional clears
 * the chosen slot, because availability depends on both.
 */
export function useBooking({ data, initialServiceIds = [] }) {
  const catalogue = useMemo(() => {
    const map = new Map()
    data.serviceCategories.forEach((cat) =>
      cat.items.forEach((item) => {
        // "Featured" repeats services that also live in a real category
        if (!map.has(item.variantId)) map.set(item.variantId, { ...item, categoryName: cat.name })
      }),
    )
    return map
  }, [data])

  const [step, setStep] = useState(0)
  const [serviceIds, setServiceIds] = useState(() =>
    initialServiceIds.filter((id) => catalogue.has(id)),
  )
  const [employeeId, setEmployeeId] = useState(null)
  const [date, setDate] = useState(null)
  const [time, setTime] = useState(null)
  const [notes, setNotes] = useState('')

  const services = useMemo(
    () => serviceIds.map((id) => catalogue.get(id)).filter(Boolean),
    [serviceIds, catalogue],
  )

  const total = services.reduce((sum, s) => sum + (s.priceValue ?? 0), 0)
  const duration = services.reduce(
    (sum, s) => sum + (s.durationMinutes ?? captionToMinutes(s.caption)),
    0,
  )

  const employee = employeeId && employeeId !== 'any'
    ? data.team.find((t) => t.id === employeeId)
    : null

  const toggleService = useCallback((service) => {
    setTime(null)
    setServiceIds((ids) =>
      ids.includes(service.variantId)
        ? ids.filter((id) => id !== service.variantId)
        : [...ids, service.variantId],
    )
  }, [])

  const chooseEmployee = useCallback((id) => {
    setEmployeeId(id)
    setTime(null)
  }, [])

  const chooseDate = useCallback((iso) => {
    setDate(iso)
    setTime(null)
  }, [])

  const slots = useMemo(
    () => (date ? slotsFor(date, data.workingTime, duration, employeeId ?? 'any') : []),
    [date, data.workingTime, duration, employeeId],
  )

  const canContinue = [
    services.length > 0,
    employeeId != null,
    date != null && time != null,
    true,
  ][step]

  return {
    step, setStep,
    services, serviceIds, toggleService,
    employeeId, employee, chooseEmployee,
    date, chooseDate, time, setTime, slots,
    notes, setNotes,
    total, duration, canContinue,
  }
}
