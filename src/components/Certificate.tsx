import './Certificate.css'
import certAws from '../assets/cert-aws.png'
import certDocker from '../assets/cert-docker.png'

const certs = [
  {
    img: certAws,
    label: 'POWER OF',
    title: 'AWS CLOUD BASIC FOUNDATION',
    subtitle: 'MASTER OF',
    subtitle2: 'AWS CLOUD BASIC FOUNDATION',
    link: '#',
  },
  {
    img: certDocker,
    label: 'POWER OF',
    title: 'DOCKER DEPLOYING AND SCALING ON CLOUD PLATFORM',
    subtitle: 'MASTER OF',
    subtitle2: 'DOCKER IN ACTION: DEPLOYING AND SCALING ON CLOUD PLATFORM',
    link: '#',
  },
]

export default function Certificate() {
  return (
    <section className="certificate" id="certificate">
      {/* Title — orange gradient */}
      <h2 className="certificate__title">CERTIFICATE</h2>

      {/* Certificate cards — 2 column grid */}
      <div className="certificate__grid">
        {certs.map((cert, i) => (
          <div className="cert-card" key={i}>
            {/* Certificate image with hands holding phone/tablet */}
            <div className="cert-card__img">
              <img src={cert.img} alt={cert.title} />
            </div>

            {/* Card text */}
            <div className="cert-card__body">
              <p className="cert-card__label">{cert.label}</p>
              <h3 className="cert-card__name">{cert.title}</h3>
              <p className="cert-card__subtitle">{cert.subtitle}</p>
              <p className="cert-card__subtitle2">{cert.subtitle2}</p>
              <a href={cert.link} className="cert-card__link" target="_blank" rel="noopener noreferrer">
                CLICK HERE TO VISIT →
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
