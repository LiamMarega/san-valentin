export function FloralTopLeft({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 300 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Large flower */}
      <g transform="translate(80, 100)">
        <ellipse cx="0" cy="-30" rx="28" ry="40" fill="#F19C98" stroke="#4A3B36" strokeWidth="0.5" transform="rotate(-20)" />
        <ellipse cx="25" cy="-15" rx="28" ry="40" fill="#E8A39A" stroke="#4A3B36" strokeWidth="0.5" transform="rotate(20)" />
        <ellipse cx="25" cy="15" rx="28" ry="40" fill="#F3C1B6" stroke="#4A3B36" strokeWidth="0.5" transform="rotate(60)" />
        <ellipse cx="0" cy="30" rx="28" ry="40" fill="#F19C98" stroke="#4A3B36" strokeWidth="0.5" transform="rotate(100)" />
        <ellipse cx="-25" cy="15" rx="28" ry="40" fill="#E8A39A" stroke="#4A3B36" strokeWidth="0.5" transform="rotate(140)" />
        <ellipse cx="-25" cy="-15" rx="28" ry="40" fill="#F3C1B6" stroke="#4A3B36" strokeWidth="0.5" transform="rotate(-60)" />
        <circle cx="0" cy="0" r="14" fill="#FDEAE3" stroke="#4A3B36" strokeWidth="0.5" />
      </g>
      {/* Stem */}
      <path d="M80 200 Q60 250 40 290" stroke="#5E8C7A" strokeWidth="2.5" fill="none" />
      {/* Leaves */}
      <path d="M65 240 Q40 230 30 250 Q55 245 65 240Z" fill="#5E8C7A" stroke="#4A3B36" strokeWidth="0.3" />
      <path d="M55 260 Q75 250 85 270 Q60 265 55 260Z" fill="#5E8C7A" stroke="#4A3B36" strokeWidth="0.3" />
      {/* Small bud */}
      <g transform="translate(200, 220)">
        <ellipse cx="0" cy="-8" rx="10" ry="16" fill="#F19C98" stroke="#4A3B36" strokeWidth="0.5" />
        <ellipse cx="8" cy="-4" rx="10" ry="16" fill="#E8A39A" stroke="#4A3B36" strokeWidth="0.5" transform="rotate(30)" />
        <circle cx="2" cy="0" r="5" fill="#FDEAE3" />
      </g>
      <path d="M200 232 Q195 260 190 290" stroke="#5E8C7A" strokeWidth="2" fill="none" />
    </svg>
  )
}

export function FloralBottomRight({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 300 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Large flower */}
      <g transform="translate(200, 120)">
        <ellipse cx="0" cy="-32" rx="30" ry="44" fill="#E8A39A" stroke="#4A3B36" strokeWidth="0.5" transform="rotate(-15)" />
        <ellipse cx="28" cy="-16" rx="30" ry="44" fill="#F19C98" stroke="#4A3B36" strokeWidth="0.5" transform="rotate(25)" />
        <ellipse cx="28" cy="16" rx="30" ry="44" fill="#F3C1B6" stroke="#4A3B36" strokeWidth="0.5" transform="rotate(65)" />
        <ellipse cx="0" cy="32" rx="30" ry="44" fill="#E8A39A" stroke="#4A3B36" strokeWidth="0.5" transform="rotate(105)" />
        <ellipse cx="-28" cy="16" rx="30" ry="44" fill="#F19C98" stroke="#4A3B36" strokeWidth="0.5" transform="rotate(145)" />
        <ellipse cx="-28" cy="-16" rx="30" ry="44" fill="#F3C1B6" stroke="#4A3B36" strokeWidth="0.5" transform="rotate(-55)" />
        <circle cx="0" cy="0" r="16" fill="#FDEAE3" stroke="#4A3B36" strokeWidth="0.5" />
      </g>
      {/* Stems and leaves */}
      <path d="M200 164 Q220 220 240 280" stroke="#5E8C7A" strokeWidth="2.5" fill="none" />
      <path d="M220 200 Q245 190 250 210 Q230 208 220 200Z" fill="#5E8C7A" stroke="#4A3B36" strokeWidth="0.3" />
      <path d="M230 240 Q210 230 205 250 Q225 245 230 240Z" fill="#5E8C7A" stroke="#4A3B36" strokeWidth="0.3" />
      {/* Small flower */}
      <g transform="translate(80, 180)">
        <ellipse cx="0" cy="-10" rx="12" ry="18" fill="#F19C98" stroke="#4A3B36" strokeWidth="0.5" />
        <ellipse cx="10" cy="0" rx="12" ry="18" fill="#F3C1B6" stroke="#4A3B36" strokeWidth="0.5" transform="rotate(72)" />
        <ellipse cx="-10" cy="0" rx="12" ry="18" fill="#E8A39A" stroke="#4A3B36" strokeWidth="0.5" transform="rotate(-72)" />
        <circle cx="0" cy="0" r="6" fill="#FDEAE3" />
      </g>
      <path d="M80 198 Q85 240 90 280" stroke="#5E8C7A" strokeWidth="2" fill="none" />
      <path d="M85 220 Q100 215 100 230 Q90 225 85 220Z" fill="#5E8C7A" stroke="#4A3B36" strokeWidth="0.3" />
    </svg>
  )
}

export function FloralSmall({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g transform="translate(40, 35)">
        <ellipse cx="0" cy="-12" rx="10" ry="16" fill="#F19C98" stroke="#4A3B36" strokeWidth="0.5" />
        <ellipse cx="10" cy="-4" rx="10" ry="16" fill="#E8A39A" stroke="#4A3B36" strokeWidth="0.5" transform="rotate(40)" />
        <ellipse cx="8" cy="8" rx="10" ry="16" fill="#F3C1B6" stroke="#4A3B36" strokeWidth="0.5" transform="rotate(80)" />
        <ellipse cx="-4" cy="10" rx="10" ry="16" fill="#F19C98" stroke="#4A3B36" strokeWidth="0.5" transform="rotate(120)" />
        <ellipse cx="-10" cy="0" rx="10" ry="16" fill="#E8A39A" stroke="#4A3B36" strokeWidth="0.5" transform="rotate(-40)" />
        <circle cx="0" cy="0" r="5" fill="#FDEAE3" />
      </g>
      <path d="M40 51 Q42 65 40 80" stroke="#5E8C7A" strokeWidth="1.5" fill="none" />
    </svg>
  )
}
