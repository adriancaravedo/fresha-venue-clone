/**
 * Avatar with initials fallback. Fresha ships a 1px white ring inside a
 * tinted (#f0f0ff) plate, so the photo sits 1px in from the circle edge.
 */
export default function Avatar({ src, alt, initials, size = 64, className = '' }) {
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-pill bg-surface-avatar ${className}`}
      style={{ width: size, height: size }}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="h-full w-full rounded-pill object-cover"
          style={{ padding: 1 }}
        />
      ) : (
        <span
          className="flex h-full w-full items-center justify-center font-medium uppercase text-fg"
          style={{ fontSize: Math.round(size * 0.34) }}
        >
          {initials}
        </span>
      )}
    </div>
  )
}
