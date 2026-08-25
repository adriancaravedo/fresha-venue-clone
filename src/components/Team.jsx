import Avatar from './ui/Avatar.jsx'
import Button from './ui/Button.jsx'
import { StarIcon } from '../lib/icons.jsx'

const PREVIEW = 8 // 4 columns × 2 rows, same as the original grid

/**
 * Team grid. Each card is a 120px avatar with a floating white rating chip
 * hanging 8px past its bottom edge, then name (16/22 medium) and role
 * (14/20 muted) with a 2px gap.
 */
export default function Team({ team, onSelect }) {
  return (
    <section id="team-section" className="scroll-mt-[124px]">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="text-head-xs font-semibold text-fg">Team</h2>
        <a href="#team-section" className="text-body-m font-medium text-fg-accent hover:underline">
          See all
        </a>
      </div>

      <ul className="mb-6 grid grid-cols-2 gap-y-10 tablet:grid-cols-4">
        {team.slice(0, PREVIEW).map((member) => (
          <li key={member.id}>
            <button
              type="button"
              onClick={() => onSelect(member)}
              className="group block w-[120px] rounded-tile text-left"
            >
              <div className="relative">
                <Avatar
                  src={member.avatar}
                  alt={`The avatar of ${member.name}`}
                  initials={member.name.slice(0, 2)}
                  size={120}
                  className="transition-transform duration-300 group-hover:scale-[1.03]"
                />
                {member.rating != null && (
                  <div className="absolute -bottom-2 left-1/2 flex h-[30px] -translate-x-1/2 items-center gap-1 rounded-pill bg-surface-base px-2 shadow-badge">
                    <span className="sr-only-text">{`${member.rating} rating`}</span>
                    <StarIcon size={16} className="text-star" />
                    <span className="text-body-s font-semibold text-fg">
                      {member.rating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-col gap-0.5">
                <span className="block truncate text-body-m font-medium text-fg">
                  {member.name}
                </span>
                {member.jobTitle && (
                  <span className="block truncate text-body-s text-fg-muted">
                    {member.jobTitle}
                  </span>
                )}
              </div>
            </button>
          </li>
        ))}
      </ul>

      <Button size="l">See all</Button>
    </section>
  )
}
