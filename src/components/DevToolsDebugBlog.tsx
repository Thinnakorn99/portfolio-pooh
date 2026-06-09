import './Blog.css'

export default function DevToolsDebugBlog() {
  return (
    <main className="blog-page">
      <nav className="blog-page__nav" aria-label="Blog navigation">
        <a href="/" className="blog-page__brand">Thinnakorn</a>
        <a href="/blog" className="blog-page__back">Back to Blog</a>
      </nav>

      <section className="blog" id="blog" aria-labelledby="devtools-blog-title">
        <article className="blog__article" itemScope itemType="https://schema.org/BlogPosting">
          <header className="blog__header">
            <p className="blog__kicker">Debugging Guide</p>
            <h2 id="devtools-blog-title" className="blog__title" itemProp="headline">
              วิธีใช้ Chrome DevTools Debug เว็บแบบเป็นขั้นตอน
            </h2>
            <p className="blog__subtitle" itemProp="description">
              คู่มือไล่ปัญหาเว็บหน้าแตก รูปไม่ขึ้น API ไม่ตอบ JavaScript error และ performance ช้า
              ด้วย Elements, Console, Network, Sources และ Lighthouse
            </p>
            <div className="blog__byline">
              <div className="blog__avatar" aria-hidden="true">TJ</div>
              <div>
                <p><span itemProp="author" itemScope itemType="https://schema.org/Person"><span itemProp="name">Thinnakorn Jintakawes</span></span></p>
                <time dateTime="2026-06-09" itemProp="datePublished">Jun 9, 2026</time>
                <span aria-hidden="true"> · </span>
                <span>9 min read</span>
              </div>
            </div>
          </header>

          <div className="blog__tools" aria-label="Article sections">
            <a href="#devtools-overview">Overview</a>
            <a href="#devtools-flow">Debug flow</a>
            <a href="#devtools-checklist">Checklist</a>
          </div>

          <div className="blog__content" itemProp="articleBody">
            <p className="blog__lead" id="devtools-overview">
              Chrome DevTools คือกล่องเครื่องมือที่ช่วยตอบคำถามว่า “เว็บพังตรงไหน”
              แทนที่จะเดาสุ่ม เราสามารถดู DOM, CSS, error, request, response, local storage,
              performance และ accessibility ได้จากเบราว์เซอร์โดยตรง
            </p>

            <h3 id="devtools-flow">ขั้นตอนที่ 1: เปิด DevTools และดู Console ก่อน</h3>
            <p>
              กด <code>F12</code> หรือคลิกขวา Inspect แล้วไปที่ Console ถ้ามี error สีแดง
              ให้อ่านจากบนลงล่าง เพราะ error แรกมักเป็นสาเหตุจริง ส่วน error หลัง ๆ อาจเป็นผลตามมา
            </p>
            <pre><code>{`Common clues:
- Cannot read properties of undefined
- Failed to fetch
- 404 Not Found
- CORS policy
- Uncaught SyntaxError`}</code></pre>

            <h3>ขั้นตอนที่ 2: ใช้ Elements ตรวจ layout</h3>
            <p>
              ถ้าหน้าเว็บเบี้ยว ข้อความซ้อน ปุ่มล้น หรือรูปไม่พอดี ให้ใช้แท็บ Elements
              คลิก element ที่มีปัญหา แล้วดู CSS ด้านขวา ลองปิด property ทีละตัว เช่น
              <code>position</code>, <code>width</code>, <code>height</code>, <code>overflow</code>
              เพื่อหาว่ากฎไหนทำให้ layout พัง
            </p>

            <h3>ขั้นตอนที่ 3: ใช้ Network ตรวจ API และ asset</h3>
            <p>
              ถ้ารูปไม่ขึ้นหรือข้อมูลไม่มา ให้เปิดแท็บ Network แล้ว reload หน้า ดู status code:
            </p>
            <div className="blog__settings" role="table" aria-label="Network status meaning">
              <div role="row"><strong role="cell">200</strong><span role="cell">โหลดสำเร็จ ปัญหาอาจอยู่ที่การ render หรือข้อมูลข้างใน</span></div>
              <div role="row"><strong role="cell">304</strong><span role="cell">ใช้ cache ไม่ใช่ error</span></div>
              <div role="row"><strong role="cell">404</strong><span role="cell">path ผิดหรือไฟล์ไม่มีอยู่จริง</span></div>
              <div role="row"><strong role="cell">500</strong><span role="cell">server error ต้องดูฝั่ง backend/log</span></div>
              <div role="row"><strong role="cell">CORS</strong><span role="cell">server ยังไม่อนุญาต origin ของเว็บเรา</span></div>
            </div>

            <h3>ขั้นตอนที่ 4: Debug JavaScript ด้วย Sources</h3>
            <p>
              แทนที่จะใส่ <code>console.log</code> เยอะ ๆ ให้ลอง breakpoint ใน Sources
              คลิกเลขบรรทัดที่ต้องการ หยุดโปรแกรมตอนโค้ดวิ่งถึงจุดนั้น แล้วดูค่าตัวแปรทีละขั้น
            </p>
            <pre><code>{`Debug habit:
1. Reproduce bug
2. Set breakpoint near suspicious code
3. Reload or repeat action
4. Inspect variables
5. Step over / step into
6. Fix the smallest root cause`}</code></pre>

            <h3>ขั้นตอนที่ 5: ตรวจ Responsive mode</h3>
            <p>
              กดไอคอนมือถือใน DevTools เพื่อดู mobile viewport แล้วเช็กว่า navbar, card,
              button, text และ image ยังไม่ล้นกรอบ ลองขนาด 360px, 390px, 768px และ desktop
            </p>

            <h3>ขั้นตอนที่ 6: ใช้ Lighthouse เป็น checklist รอบสุดท้าย</h3>
            <p>
              Lighthouse ช่วยจับเรื่อง performance, accessibility, best practices และ SEO
              แต่ไม่ควรดูคะแนนอย่างเดียว ให้อ่าน audit detail แล้วแก้จากสิ่งที่กระทบผู้ใช้จริงก่อน
            </p>

            <h3 id="devtools-checklist">Debug checklist ที่ใช้ได้ทุกโปรเจค</h3>
            <pre><code>{`1. Console: มี error อะไรเป็นตัวแรก
2. Elements: layout พังจาก CSS rule ไหน
3. Network: request ไหน fail และ status code คืออะไร
4. Sources: breakpoint ตรง logic ที่สงสัย
5. Application: ตรวจ localStorage/sessionStorage/cookies
6. Responsive: เช็ก mobile/desktop
7. Lighthouse: ใช้เป็นรอบ polish สุดท้าย`}</code></pre>

            <h3>ตัวอย่างปัญหาที่เจอบ่อย</h3>
            <ul>
              <li>รูปไม่ขึ้น: path ผิด, ไฟล์ไม่ได้ import, หรือ deploy แล้ว asset hash เปลี่ยน</li>
              <li>ปุ่มกดไม่ได้: element ถูก overlay ทับ หรือ event handler ไม่ถูก bind</li>
              <li>API ไม่มา: endpoint ผิด, server down, CORS, token หมดอายุ</li>
              <li>หน้า mobile ล้น: width fixed, text ไม่ wrap, image ไม่มี max-width</li>
            </ul>
          </div>
        </article>
      </section>
    </main>
  )
}
