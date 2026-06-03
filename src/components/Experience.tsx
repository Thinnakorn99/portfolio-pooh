import './Experience.css'

const experiences = [
  {
    icon: 'UX',
    title: 'Movie Ticket Reservation System Analysis and Design',
    year: '2025',
    bullets: [
      'Studied how movie ticket apps work and suggested new features to make the app easier to use.',
      'Drew system diagrams (Use Case, DFD) and created a sample app design using Figma.',
    ],
  },
  {
    icon: 'AI',
    title: 'Automated Banana Quality Assessment via images',
    year: '2025',
    bullets: [
      'Built an AI model (CNN) to automatically check if bananas are ripe or unripe, achieving 35% accuracy.',
      'Improved the model by cleaning image data with OpenCV and adding more training pictures for better results.',
    ],
  },
  {
    icon: 'EC',
    title: 'Hong-Shop Online Pet Food Shop Platform',
    year: '2025',
    bullets: [
      'Developed a full-featured E-Commerce platform with a user-friendly storefront and a robust administrative control panel.',
      'Designed an intuitive User Interface for browsing pet products by categories, managing a dynamic shopping cart, and tracking order history.',
    ],
  },
]

export default function Experience() {
  return (
    <section className="experience" id="experience">
      <h2 className="experience__title">EXPERIENCE</h2>

      <div className="experience__list">
        {experiences.map((exp, i) => (
          <div className="exp-card" key={i}>
            <div className="exp-card__top">
              <span className="exp-card__icon">{exp.icon}</span>
              <h3 className="exp-card__name">{exp.title}</h3>
              <span className="exp-card__year">{exp.year}</span>
            </div>
            <ul className="exp-card__bullets">
              {exp.bullets.map((b, j) => (
                <li key={j}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
