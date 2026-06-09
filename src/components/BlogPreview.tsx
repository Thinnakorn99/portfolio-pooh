import './BlogPreview.css'
import cloudflareCover from '../assets/cloudflare-pages-cover.svg'
import devtoolsCover from '../assets/devtools-debug-cover.svg'
import gitCover from '../assets/git-workflow-cover.svg'

const previewPosts = [
  {
    href: '/blog/chrome-devtools-debugging',
    cover: devtoolsCover,
    coverAlt: 'Chrome DevTools debugging workflow illustration',
    title: 'DEBUG FRONTEND WITH DEVTOOLS',
    label: 'DEBUGGING GUIDE',
    headline: 'วิธีใช้ Chrome DevTools Debug เว็บ',
    meta: 'DevTools · Console · Network',
    summary:
      'ไล่ปัญหาเว็บหน้าแตก รูปไม่ขึ้น API ไม่ตอบ และ JavaScript error ด้วยเครื่องมือใน Chrome DevTools',
  },
  {
    href: '/blog/git-github-workflow',
    cover: gitCover,
    coverAlt: 'Git branch and pull request workflow illustration',
    title: 'GIT WORKFLOW FOR PROJECTS',
    label: 'CODING WORKFLOW',
    headline: 'Git และ GitHub Workflow สำหรับโปรเจค',
    meta: 'Git · GitHub · Pull Request',
    summary:
      'จัด branch, commit, pull request, conflict และ merge ให้เป็นระบบ เพื่อให้ main เป็นเวอร์ชันที่ deploy ได้เสมอ',
  },
  {
    href: '/blog/cloudflare-pages-deploy',
    cover: cloudflareCover,
    coverAlt: 'Cloudflare Pages deployment workflow illustration',
    title: 'DEPLOY WITH CLOUDFLARE PAGES',
    label: 'DEPLOYMENT GUIDE',
    headline: 'การ Deploy โปรเจคด้วย Cloudflare Pages',
    meta: 'React · Vite · Cloudflare Pages',
    summary:
      'บทความ step-by-step สำหรับนำเว็บขึ้น Cloudflare Pages ตั้งแต่เตรียมโปรเจค ตั้งค่า build ไปจนถึงแก้ปัญหาที่เจอบ่อย',
  },
]

export default function BlogPreview() {
  return (
    <section className="blog-preview" id="blog-preview" aria-labelledby="blog-preview-title">
      <h2 className="blog-preview__title" id="blog-preview-title">BLOG</h2>

      <div className="blog-preview__grid">
        {previewPosts.map((post) => (
          <article className="blog-preview-card" key={post.href}>
            <a href={post.href} className="blog-preview-card__cover" aria-label={`Read ${post.headline}`}>
              <img src={post.cover} alt={post.coverAlt} />
            </a>

            <a href={post.href} className="blog-preview-card__strip">
              <span>CLICK HERE TO READ</span>
              <strong>{post.title}</strong>
              <b aria-hidden="true">↗</b>
            </a>

            <div className="blog-preview-card__body">
              <p className="blog-preview-card__label">{post.label}</p>
              <h3>{post.headline}</h3>
              <p className="blog-preview-card__meta">{post.meta}</p>
              <p className="blog-preview-card__summary">{post.summary}</p>
              <a href={post.href} className="blog-preview-card__button">
                READ ARTICLE
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
