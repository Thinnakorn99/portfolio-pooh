import './Header.css'

export default function Header() {
  return (
    <header className="header">
      <nav className="header__nav" aria-label="Primary navigation">
        <a href="#hero">AboutMe</a>
        <a href="#techstack">Techstack</a>
        <a href="#experience">Experience</a>
        <a href="#certificate">Certificate</a>
        <a href="/blog">Blog</a>
        <a href="/private">Private</a>
      </nav>
    </header>
  )
}

