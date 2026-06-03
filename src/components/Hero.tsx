import './Hero.css'
import avatar from '../assets/avatar.png'

export default function Hero() {
  return (
    <section className="hero" id="about">
      {/* Avatar image - centered on top, no background circle */}
      <div className="hero__avatar-wrap">
        <img src={avatar} alt="Thinnakorn Jintakawes" className="hero__avatar" />
      </div>

      {/* Big title - Poppins ExtraBold, centered */}
      <h1 className="hero__title">
        I craft experiences<br />
        and code them into{' '}
        <span className="hero__title--grad">reality!</span>
      </h1>

      {/* About paragraph */}
      <p className="hero__bio">
        I'm Thinnakorn Jintakawes, a Computer Science student at Kasetsart University
        and a Web Designer &amp; Developer Intern. My goal is to combine creative design
        thinking with clean, structured code to build modern and impactful web
        applications.
      </p>

      {/* CTA Buttons */}
      <div className="hero__btns">
        {/* Filled white button */}
        <a href="#contact" className="hero__btn hero__btn--filled">
          Get In Touch
        </a>
        {/* Outline button */}
        <a href="/resume.pdf" className="hero__btn hero__btn--outline" target="_blank" rel="noopener noreferrer">
          Download CV
        </a>
      </div>
    </section>
  )
}
