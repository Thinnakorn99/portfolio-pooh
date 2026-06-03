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
    width: 780,
    height: 704,
  },
  {
    img: certDocker,
    label: 'POWER OF',
    title: 'DOCKER DEPLOYING AND SCALING ON CLOUD PLATFORM',
    subtitle: 'MASTER OF',
    subtitle2: 'DOCKER IN ACTION: DEPLOYING AND SCALING ON CLOUD PLATFORM',
    width: 778,
    height: 704,
  },
]

export default function Certificate() {
  return (
    <section className="certificate" id="certificate">
      <h2 className="certificate__title">CERTIFICATE</h2>

      <div className="certificate__grid">
        {certs.map((cert, i) => (
          <article className="cert-card" key={i}>
            <div className="cert-card__img">
              <img
                src={cert.img}
                alt={`${cert.title} certificate`}
                width={cert.width}
                height={cert.height}
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className="cert-card__body">
              <p className="cert-card__label">{cert.label}</p>
              <h3 className="cert-card__name">{cert.title}</h3>
              <p className="cert-card__subtitle">{cert.subtitle}</p>
              <p className="cert-card__subtitle2">{cert.subtitle2}</p>
              <a
                href={cert.img}
                className="cert-card__link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${cert.title} certificate image`}
              >
                VIEW CERTIFICATE
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
