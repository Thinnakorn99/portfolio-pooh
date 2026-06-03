import './TechStack.css'

const techs = [
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
    name: 'GitLab',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg',
  },
  {
    name: 'MongoDB',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
  },
  {
    name: 'Discord',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/discord/discord-original.svg',
  },
]

export default function TechStack() {
  return (
    <section className="techstack" id="techstack">
      <h2 className="techstack__title">TECHSTACK</h2>
      <div className="techstack__icons">
        {techs.map((t) => (
          <div className="techstack__item" key={t.name}>
            <img src={t.icon} alt={t.name} title={t.name} loading="lazy" />
            <span>{t.name}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
