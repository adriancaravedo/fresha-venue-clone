/**
 * Fresha's button. Measured on the live site:
 *   size m  -> 36px tall, 15px side padding, 14px/20 medium label
 *   size l  -> 48px tall, 19px side padding, 16px/22 medium label
 * `outline` carries a 1px inset ring so the border never adds to the box.
 */
const SIZES = {
  m: 'h-9 px-[15px] text-body-s font-medium',
  l: 'h-12 px-[19px] text-body-m font-medium',
}

const VARIANTS = {
  primary: 'bg-surface-primary text-fg-onPrimary hover:bg-[#262626] active:bg-[#333]',
  outline:
    'bg-surface-base text-fg shadow-ringSoft hover:bg-surface-hover active:bg-surface-active',
  ghost: 'text-fg hover:bg-surface-hover active:bg-surface-active',
  elevated: 'bg-surface-base text-fg shadow-float hover:bg-[#fafafa]',
}

export default function Button({
  as: Tag = 'button',
  size = 'm',
  variant = 'outline',
  className = '',
  full = false,
  children,
  ...rest
}) {
  return (
    <Tag
      className={[
        'inline-flex select-none items-center justify-center gap-2 rounded-pill',
        'whitespace-nowrap transition-colors duration-150',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg',
        SIZES[size],
        VARIANTS[variant],
        full ? 'w-full' : '',
        className,
      ].join(' ')}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/** Circular icon-only button — the share / favourite pair in the venue header. */
export function IconButton({ label, size = 48, className = '', children, ...rest }) {
  return (
    <button
      aria-label={label}
      style={{ width: size, height: size }}
      className={[
        'inline-flex items-center justify-center rounded-pill shadow-ringSoft',
        'bg-surface-base text-fg transition-colors duration-150',
        'hover:bg-surface-hover active:bg-surface-active',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg',
        className,
      ].join(' ')}
      {...rest}
    >
      {children}
    </button>
  )
}
