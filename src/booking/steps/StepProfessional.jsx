import Avatar from '../../components/ui/Avatar.jsx'
import { ShuffleIcon, StarIcon } from '../../lib/icons.jsx'

/** Elevated "Select" pill — its own soft shadow, distinct from the page's. */
function SelectButton({ selected, onClick, label }) {
  return (
    <span
      className={`flex h-9 shrink-0 items-center rounded-pill px-4 text-body-s font-medium transition-colors ${
        selected
          ? 'bg-surface-primary text-fg-onPrimary'
          : 'bg-surface-base text-fg shadow-[0_1px_6px_0_rgba(13,22,25,0.04),0_6px_8px_0_rgba(13,22,25,0.06)]'
      }`}
      onClick={onClick}
      aria-hidden="true"
    >
      {selected ? 'Selected' : label}
    </span>
  )
}

function Row({ selected, onSelect, children, label = 'Select' }) {
  return (
    <li>
      <button
        type="button"
        aria-pressed={selected}
        onClick={onSelect}
        className={`flex w-full items-center gap-4 rounded-card bg-surface-base px-6 py-5 text-left transition-shadow ${
          selected
            ? 'shadow-[inset_0_0_0_2px_theme(colors.fg.accent)]'
            : 'shadow-ring hover:shadow-[inset_0_0_0_1px_#0d0d0d]'
        }`}
      >
        {children}
        <SelectButton selected={selected} label={label} />
      </button>
    </li>
  )
}

/**
 * Professional picker. "Any professional" leads, then one 80px avatar card per
 * team member with a floating rating chip hanging 8px past the avatar.
 */
export default function StepProfessional({ data, booking }) {
  const { employeeId, chooseEmployee } = booking

  return (
    <ul className="flex flex-col gap-3">
      <Row selected={employeeId === 'any'} onSelect={() => chooseEmployee('any')}>
        <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-pill bg-surface-avatar text-fg-accent">
          <ShuffleIcon size={28} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-body-m font-medium text-fg">Any professional</span>
          <span className="block text-body-s text-fg-muted">Maximum availability</span>
        </span>
      </Row>

      {data.team.map((member) => (
        <Row
          key={member.id}
          selected={employeeId === member.id}
          onSelect={() => chooseEmployee(member.id)}
        >
          <span className="relative shrink-0">
            <Avatar
              src={member.avatar}
              alt={`The avatar of ${member.name}`}
              initials={member.name.slice(0, 2)}
              size={80}
            />
            {member.rating != null && (
              <span className="absolute -bottom-2 left-1/2 flex h-[30px] -translate-x-1/2 items-center gap-1 rounded-pill bg-surface-base px-2 shadow-badge">
                <span className="sr-only-text">{`${member.rating} rating`}</span>
                <StarIcon size={16} className="text-star" />
                <span className="text-body-s font-semibold text-fg">{member.rating.toFixed(1)}</span>
              </span>
            )}
          </span>

          <span className="min-w-0 flex-1">
            <span className="block truncate text-body-m font-medium text-fg">{member.name}</span>
            {member.jobTitle && (
              <span className="block truncate text-body-s text-fg-muted">{member.jobTitle}</span>
            )}
            <span className="mt-1 block text-body-s text-fg-muted underline-offset-2 hover:underline">
              View profile
            </span>
          </span>
        </Row>
      ))}
    </ul>
  )
}
