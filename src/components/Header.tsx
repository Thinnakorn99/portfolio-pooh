import './Header.css'

export default function Header() {
  return (
    <header className="header">
      <nav className="header__nav">
        <a href="#about">AboutMe</a>
        <a href="#techstack">Techstack</a>
        <a href="#experience">Experience</a>
        <a href="#certificate">Certificate</a>
      </nav>
    </header>
  )
}
