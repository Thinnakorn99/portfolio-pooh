import './Hero.css'
import avatar from '../assets/avatar.png'

export default function Hero() {
  return (
    <section className="hero" id="about">
      <div className="hero__stage" aria-hidden="true">
        <span className="hero__beam hero__beam--one" />
        <span className="hero__beam hero__beam--two" />
        <span className="hero__spark hero__spark--one" />
        <span className="hero__spark hero__spark--two" />
      </div>

      <p className="hero__eyebrow">Web Designer &amp; Developer Intern</p>

      <div className="hero__avatar-wrap">
        <img src={avatar} alt="Thinnakorn Jintakawes" className="hero__avatar" />
      </div>

      <h1 className="hero__title">
        I craft experiences<br />
        and code them into <span className="hero__title--grad">reality!</span>
      </h1>

      <p className="hero__bio">
        I'm Thinnakorn Jintakawes, a Computer Science student at Kasetsart University
        and a Web Designer &amp; Developer Intern. My goal is to combine creative design
        thinking with clean, structured code to build modern and impactful web
        applications.
      </p>

      <div className="hero__metrics" aria-label="Portfolio highlights">
        <div>
          <strong>03</strong>
          <span>Featured Works</span>
        </div>
        <div>
          <strong>02</strong>
          <span>Certificates</span>
        </div>
        <div>
          <strong>2025</strong>
          <span>Current Focus</span>
        </div>
      </div>

      <div className="hero__btns">
        <a href="#contact" className="hero__btn hero__btn--filled">
          Get In Touch
        </a>
        <a href="/resume.pdf" className="hero__btn hero__btn--outline" target="_blank" rel="noopener noreferrer">
          Download CV
        </a>
      </div>
    </section>
  )
}
