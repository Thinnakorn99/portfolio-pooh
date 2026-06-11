import './CyberpunkBackground.css'
import discordLogo from '../assets/discord-logo.svg'

const buildings = [
  { className: 'building building--left', windows: 20 },
  { className: 'building building--mid', windows: 24 },
  { className: 'building building--tower', windows: 18 },
  { className: 'building building--right', windows: 22 },
]

const techSignals = [
  {
    name: 'VS Code',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg',
  },
  {
    name: 'Python',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  },
  {
    name: 'HTML5',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
  },
  {
    name: 'CSS3',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
  },
  {
    name: 'React',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  },
  {
    name: 'MongoDB',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
  },
  {
    name: 'Discord',
    icon: discordLogo,
  },
]

export default function CyberpunkBackground() {
  return (
    <div className="cyber-bg" aria-hidden="true">
      <div className="cyber-bg__sky" />
      <div className="cyber-bg__meteors">
        {Array.from({ length: 1 }, (_, index) => (
          <span
            key={index}
            style={{
              '--x': `${(index * 17) % 100}vw`,
              '--y': `${6 + ((index * 23) % 42)}vh`,
              '--delay': '0s',
              '--duration': '15s',
              '--scale': `${0.72 + (index % 4) * 0.14}`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      <div className="cyber-bg__city">
        {buildings.map((building) => (
          <div className={building.className} key={building.className}>
            {Array.from({ length: building.windows }, (_, index) => (
              <span key={index} />
            ))}
          </div>
        ))}
        <div className="neon-sign neon-sign--green">PORTFOLIO</div>
        <div className="neon-sign neon-sign--pink">WEB DEV</div>
        <div className="neon-sign neon-sign--blue">CS LAB</div>
      </div>

      <div className="cyber-bg__traffic cyber-bg__techstream">
        {techSignals.map((tech, index) => (
          <span className={`tech-runner tech-runner--${index + 1}`} key={tech.name}>
            <img src={tech.icon} alt="" loading="lazy" />
          </span>
        ))}
      </div>

      <div className="cyber-bg__street">
        <div className="street__lane street__lane--one" />
        <div className="street__lane street__lane--two" />
      </div>
    </div>
  )
}
