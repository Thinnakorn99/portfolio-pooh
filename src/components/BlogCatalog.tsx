import './BlogCatalog.css'
import cloudflareCover from '../assets/cloudflare-pages-cover.svg'
import devtoolsCover from '../assets/devtools-debug-cover.svg'
import gitCover from '../assets/git-workflow-cover.svg'
import saitamaCover from '../assets/saitama-workout-cover.svg'

const posts = [
  {
    href: '/blog/chrome-devtools-debugging',
    category: 'Debugging Guide',
    title: 'วิธีใช้ Chrome DevTools Debug เว็บแบบเป็นขั้นตอน',
    excerpt:
      'ไล่ปัญหาเว็บหน้าแตก รูปไม่ขึ้น API ไม่ตอบ JavaScript error และ performance ช้า ด้วย Elements, Console, Network, Sources และ Lighthouse',
    meta: 'DevTools · Debugging · Frontend',
    readTime: '9 min read',
    cover: devtoolsCover,
    coverAlt: 'Chrome DevTools debugging workflow illustration',
  },
  {
    href: '/blog/git-github-workflow',
    category: 'Coding Workflow',
    title: 'Git และ GitHub Workflow สำหรับทำโปรเจคให้เป็นระบบ',
    excerpt:
      'คู่มือใช้ Git แบบทำงานจริง ตั้งแต่สร้าง branch เขียน commit เปิด pull request แก้ conflict ไปจนถึง merge โดยไม่ทำให้โปรเจคเละ',
    meta: 'Git · GitHub · Pull Request',
    readTime: '9 min read',
    cover: gitCover,
    coverAlt: 'Git branch and pull request workflow illustration',
  },
  {
    href: '/blog/cloudflare-pages-deploy',
    category: 'Deployment Guide',
    title: 'การ Deploy โปรเจคด้วย Cloudflare Pages แบบละเอียด',
    excerpt:
      'คู่มือสำหรับนำเว็บ React, Vite หรือ static frontend ขึ้นออนไลน์ ตั้งแต่เตรียมโปรเจค เชื่อม Git ตั้งค่า build ไปจนถึงแก้ปัญหาที่พบบ่อย',
    meta: 'React · Vite · Cloudflare Pages',
    readTime: '8 min read',
    cover: cloudflareCover,
    coverAlt: 'Cloudflare Pages deployment workflow illustration',
  },
  {
    href: '/blog/saitama-workout',
    category: 'Fitness Guide',
    title: 'วิธีออกกำลังกายยังไงให้เป็นไซตามะ แบบทำตามได้จริง',
    excerpt:
      'แปลงสูตร 100 push-up, 100 sit-up, 100 squat และวิ่ง 10 กิโลเมตร ให้เป็นแผน 8 สัปดาห์ที่ค่อย ๆ ไต่ระดับ ปลอดภัยกว่า และทำตามได้จริง',
    meta: 'Strength · Cardio · Recovery',
    readTime: '10 min read',
    cover: saitamaCover,
    coverAlt: 'Saitama inspired workout routine illustration',
  },
]

export default function BlogCatalog() {
  return (
    <main className="blog-catalog">
      <nav className="blog-catalog__nav" aria-label="Blog navigation">
        <a href="/" className="blog-catalog__brand">Thinnakorn</a>
        <a href="/" className="blog-catalog__back">Back to Portfolio</a>
      </nav>

      <header className="blog-catalog__hero">
        <p>Blog</p>
        <h1>Articles, notes, and practical guides</h1>
        <span>รวมบทความด้าน computer science, coding, tools, deployment และเรื่องที่ลองทำจริง เพิ่มหัวข้อใหม่ต่อได้เรื่อย ๆ</span>
      </header>

      <section className="blog-catalog__list" aria-label="Blog articles">
        {posts.map((post) => (
          <article className="blog-catalog-card" key={post.href}>
            <a href={post.href} className="blog-catalog-card__cover" aria-label={`Read ${post.title}`}>
              <img src={post.cover} alt={post.coverAlt} />
            </a>

            <div className="blog-catalog-card__body">
              <p>{post.category}</p>
              <h2>
                <a href={post.href}>{post.title}</a>
              </h2>
              <span>{post.meta} · {post.readTime}</span>
              <p>{post.excerpt}</p>
              <a href={post.href} className="blog-catalog-card__link">
                Read article
              </a>
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}
