import './Blog.css'

const deployChecklist = [
  'มีบัญชี GitHub หรือ GitLab และ push โปรเจคขึ้น repository แล้ว',
  'โปรเจค build ผ่านบนเครื่องด้วย npm run build',
  'รู้ build command และ output directory ของ framework ที่ใช้',
  'มีบัญชี Cloudflare และเข้าเมนู Workers & Pages ได้',
]

export default function Blog() {
  return (
    <main className="blog-page">
      <nav className="blog-page__nav" aria-label="Blog navigation">
        <a href="/" className="blog-page__brand">Thinnakorn</a>
        <a href="/blog" className="blog-page__back">Back to Blog</a>
      </nav>

      <section className="blog" id="blog" aria-labelledby="blog-title">
      <article className="blog__article" itemScope itemType="https://schema.org/BlogPosting">
        <header className="blog__header">
          <p className="blog__kicker">Deployment Guide</p>
          <h2 id="blog-title" className="blog__title" itemProp="headline">
            การ Deploy โปรเจคด้วย Cloudflare Pages แบบละเอียด
          </h2>
          <p className="blog__subtitle" itemProp="description">
            คู่มือสำหรับนำเว็บ React, Vite หรือ static frontend ขึ้นออนไลน์ด้วย Cloudflare Pages
            ตั้งแต่เตรียมโปรเจค เชื่อม Git ตั้งค่า build ไปจนถึงตรวจหลัง deploy
          </p>

          <div className="blog__byline">
            <div className="blog__avatar" aria-hidden="true">TJ</div>
            <div>
              <p>
                <span itemProp="author" itemScope itemType="https://schema.org/Person">
                  <span itemProp="name">Thinnakorn Jintakawes</span>
                </span>
              </p>
              <time dateTime="2026-06-09" itemProp="datePublished">
                Jun 9, 2026
              </time>
              <span aria-hidden="true"> · </span>
              <span>8 min read</span>
            </div>
          </div>
        </header>

        <div className="blog__tools" aria-label="Article actions">
          <a href="#cloudflare-pages-overview">Overview</a>
          <a href="#cloudflare-pages-steps">Steps</a>
          <a href="#cloudflare-pages-troubleshooting">Fix errors</a>
        </div>

        <div className="blog__content" itemProp="articleBody">
          <p className="blog__lead" id="cloudflare-pages-overview">
            Cloudflare Pages คือบริการ deploy เว็บไซต์แบบ static และ frontend application
            ที่เหมาะกับโปรเจค React + Vite มาก เพราะเราแค่ push โค้ดขึ้น Git แล้วให้
            Cloudflare install dependency, run build, และนำไฟล์ในโฟลเดอร์ output ไปเผยแพร่
            เป็น URL สาธารณะให้เอง
          </p>

          <h3>สิ่งที่ต้องเตรียมก่อนเริ่ม</h3>
          <ul>
            {deployChecklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h3>ภาพรวม flow การ deploy</h3>
          <p>
            กระบวนการที่แนะนำคือเขียนโค้ดในเครื่อง, ทดสอบ build, push เข้า GitHub หรือ GitLab,
            สร้าง Pages project ใน Cloudflare, ตั้งค่า build, แล้วปล่อยให้ Cloudflare deploy
            อัตโนมัติทุกครั้งที่มี commit ใหม่บน branch production
          </p>

          <pre aria-label="Deployment flow">
            <code>{`Local project -> GitHub/GitLab -> Cloudflare Pages build -> dist -> live URL`}</code>
          </pre>

          <h3 id="cloudflare-pages-steps">ขั้นตอนที่ 1: ตรวจว่าโปรเจค build ผ่านในเครื่อง</h3>
          <p>
            ก่อนส่งให้ Cloudflare build ควรทดสอบบนเครื่องก่อนเสมอ ถ้าเป็น React + Vite
            ให้ใช้คำสั่งนี้จาก root ของโปรเจค
          </p>
          <pre>
            <code>{`npm install
npm run build`}</code>
          </pre>
          <p>
            ถ้า build สำเร็จ Vite จะสร้างโฟลเดอร์ <code>dist</code> ซึ่งเป็นไฟล์ static
            ที่พร้อม deploy ถ้าคำสั่งนี้ error บนเครื่อง Cloudflare ก็มักจะ error เช่นกัน
          </p>

          <h3>ขั้นตอนที่ 2: push โค้ดขึ้น GitHub หรือ GitLab</h3>
          <p>
            Cloudflare Pages Git integration รองรับ GitHub และ GitLab เมื่อเชื่อม repository แล้ว
            Cloudflare จะ deploy ใหม่ทุกครั้งที่ push commit เข้า branch ที่กำหนด
          </p>
          <pre>
            <code>{`git add .
git commit -m "Prepare project for Cloudflare Pages"
git push origin main`}</code>
          </pre>

          <h3>ขั้นตอนที่ 3: สร้างโปรเจคใน Cloudflare Pages</h3>
          <ol>
            <li>เข้าสู่ Cloudflare Dashboard</li>
            <li>ไปที่ Workers &amp; Pages</li>
            <li>เลือก Create application</li>
            <li>เลือก Pages</li>
            <li>เลือก Import from an existing Git repository</li>
            <li>เลือก repository ของเว็บที่ต้องการ deploy</li>
          </ol>

          <h3>ขั้นตอนที่ 4: ตั้งค่า build ให้ถูกต้อง</h3>
          <p>
            สำหรับ React + Vite ให้ใช้ค่าหลักตามนี้ Cloudflare ระบุ preset ของ React (Vite)
            ว่า build command คือ <code>npm run build</code> และ build output directory คือ
            <code>dist</code>
          </p>
          <div className="blog__settings" role="table" aria-label="Cloudflare Pages build settings">
            <div role="row">
              <strong role="cell">Framework preset</strong>
              <span role="cell">React (Vite)</span>
            </div>
            <div role="row">
              <strong role="cell">Build command</strong>
              <span role="cell">npm run build</span>
            </div>
            <div role="row">
              <strong role="cell">Build output directory</strong>
              <span role="cell">dist</span>
            </div>
            <div role="row">
              <strong role="cell">Root directory</strong>
              <span role="cell">ปล่อยว่าง ถ้า package.json อยู่ root repository</span>
            </div>
          </div>

          <h3>ขั้นตอนที่ 5: กด Save and Deploy</h3>
          <p>
            หลังบันทึก Cloudflare จะเริ่ม pipeline แรก โดยติดตั้ง dependencies, รัน build command,
            แล้ว upload ไฟล์จาก output directory เมื่อเสร็จจะได้ URL รูปแบบ
            <code>your-project.pages.dev</code> สำหรับเปิดเว็บจริง
          </p>

          <h3>ขั้นตอนที่ 6: ตรวจหลัง deploy</h3>
          <ol>
            <li>เปิด URL <code>*.pages.dev</code> แล้วตรวจว่าหน้าเว็บโหลดครบ</li>
            <li>เปิด DevTools Console ดูว่าไม่มี error สำคัญ</li>
            <li>ทดสอบ refresh หน้าเว็บ ถ้าเป็น SPA ต้องแน่ใจว่า route ไม่ 404</li>
            <li>รัน Lighthouse ตรวจ Performance, Accessibility, Best Practices และ SEO</li>
            <li>ถ้ามี custom domain ให้เพิ่มจากเมนู Custom domains ใน Pages project</li>
          </ol>

          <h3>การตั้ง custom domain</h3>
          <p>
            ใน Cloudflare Pages ให้เข้า project แล้วไปที่ Custom domains จากนั้นกด Set up a domain
            และใส่โดเมนที่ต้องการ ถ้าเป็น apex domain เช่น <code>example.com</code> ควรให้โดเมน
            อยู่ใน Cloudflare zone เดียวกัน ถ้าเป็น subdomain เช่น <code>www.example.com</code>
            ให้ชี้ CNAME ไปยังโดเมน <code>your-project.pages.dev</code> ตามขั้นตอนของ Cloudflare
          </p>

          <h3 id="cloudflare-pages-troubleshooting">ปัญหาที่พบบ่อยและวิธีแก้</h3>
          <h4>Build failed เพราะหา package ไม่เจอ</h4>
          <p>
            ตรวจว่า commit มี <code>package.json</code> และ <code>package-lock.json</code>
            อยู่ใน repository แล้ว ถ้าโปรเจคอยู่ในโฟลเดอร์ย่อย ให้ตั้ง Root directory ให้ตรง
          </p>

          <h4>Deploy ผ่าน แต่หน้าเว็บว่าง</h4>
          <p>
            ตรวจค่า Build output directory ต้องตรงกับโฟลเดอร์ที่ build สร้างจริง สำหรับ Vite คือ
            <code>dist</code> และตรวจ path ของ asset ว่าไม่ได้ hardcode เป็น path จากเครื่องตัวเอง
          </p>

          <h4>Environment variables ไม่ทำงาน</h4>
          <p>
            เพิ่มตัวแปรที่ Pages project ใน Settings &gt; Environment variables ถ้าเป็น Vite
            ตัวแปรที่ต้อง expose ไปยัง browser ควรขึ้นต้นด้วย <code>VITE_</code> เช่น
            <code>VITE_API_URL</code> แล้วค่อย deploy ใหม่
          </p>

          <h3>Checklist สั้น ๆ สำหรับ AI crawler</h3>
          <pre>
            <code>{`1. Build locally: npm install && npm run build
2. Push project to GitHub or GitLab
3. Cloudflare Dashboard -> Workers & Pages -> Create application -> Pages
4. Import repository
5. Set Framework preset: React (Vite)
6. Set Build command: npm run build
7. Set Build output directory: dist
8. Save and Deploy
9. Open *.pages.dev URL and verify the website
10. Add custom domain in Pages -> Custom domains if needed`}</code>
          </pre>

          <h3>แหล่งอ้างอิง</h3>
          <p>
            อ่านเอกสารทางการเพิ่มเติมได้ที่{' '}
            <a href="https://developers.cloudflare.com/pages/framework-guides/deploy-a-vite3-project/" target="_blank" rel="noopener noreferrer">
              Cloudflare Pages Vite guide
            </a>
            ,{' '}
            <a href="https://developers.cloudflare.com/pages/configuration/build-configuration/" target="_blank" rel="noopener noreferrer">
              Build configuration
            </a>
            , และ{' '}
            <a href="https://developers.cloudflare.com/pages/configuration/custom-domains/" target="_blank" rel="noopener noreferrer">
              Custom domains
            </a>
            .
          </p>
        </div>
      </article>
      </section>
    </main>
  )
}
