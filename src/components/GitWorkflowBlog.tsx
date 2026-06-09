import './Blog.css'

export default function GitWorkflowBlog() {
  return (
    <main className="blog-page">
      <nav className="blog-page__nav" aria-label="Blog navigation">
        <a href="/" className="blog-page__brand">Thinnakorn</a>
        <a href="/blog" className="blog-page__back">Back to Blog</a>
      </nav>

      <section className="blog" id="blog" aria-labelledby="git-blog-title">
        <article className="blog__article" itemScope itemType="https://schema.org/BlogPosting">
          <header className="blog__header">
            <p className="blog__kicker">Coding Workflow</p>
            <h2 id="git-blog-title" className="blog__title" itemProp="headline">
              Git และ GitHub Workflow สำหรับทำโปรเจคให้เป็นระบบ
            </h2>
            <p className="blog__subtitle" itemProp="description">
              คู่มือใช้ Git แบบทำงานจริง ตั้งแต่สร้าง branch เขียน commit เปิด pull request
              แก้ conflict ไปจนถึง merge โดยไม่ทำให้โปรเจคเละ
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
            <a href="#git-overview">Overview</a>
            <a href="#git-steps">Workflow</a>
            <a href="#git-checklist">Checklist</a>
          </div>

          <div className="blog__content" itemProp="articleBody">
            <p className="blog__lead" id="git-overview">
              Git ไม่ได้มีไว้แค่เซฟโค้ด แต่เป็นระบบความจำของโปรเจค ถ้าใช้ดี เราจะรู้ว่า
              เปลี่ยนอะไร เมื่อไหร่ เพราะอะไร และย้อนกลับได้เมื่อพลาด บทความนี้สรุป workflow
              ที่เหมาะกับโปรเจคส่วนตัว โปรเจคทีมเล็ก และ portfolio project
            </p>

            <h3>ภาพรวม workflow ที่แนะนำ</h3>
            <pre><code>{`main
  -> feature/header
  -> feature/blog-page
  -> fix/mobile-layout
  -> pull request
  -> review
  -> merge back to main`}</code></pre>

            <h3 id="git-steps">ขั้นตอนที่ 1: เริ่มจาก main ที่สะอาด</h3>
            <p>
              ก่อนเริ่มงานใหม่ ให้ดึง main ล่าสุดก่อนเสมอ เพื่อไม่ให้ branch ใหม่เริ่มจากฐานเก่า
            </p>
            <pre><code>{`git switch main
git pull origin main`}</code></pre>

            <h3>ขั้นตอนที่ 2: สร้าง branch ตามงาน</h3>
            <p>
              ตั้งชื่อ branch ให้บอกประเภทงานและสิ่งที่จะทำ เช่น <code>feature/blog-catalog</code>,
              <code>fix/header-mobile</code>, <code>content/saitama-blog</code>
            </p>
            <pre><code>{`git switch -c feature/blog-catalog`}</code></pre>

            <h3>ขั้นตอนที่ 3: commit เป็นก้อนเล็ก ๆ</h3>
            <p>
              commit ที่ดีควรอธิบายผลลัพธ์ ไม่ใช่แค่บอกว่า “แก้ไฟล์” ตัวอย่างเช่น
              <code>Add blog catalog route</code> ดีกว่า <code>update</code>
            </p>
            <pre><code>{`git status
git add src/components/BlogCatalog.tsx src/components/BlogCatalog.css
git commit -m "Add blog catalog page"`}</code></pre>

            <h3>ขั้นตอนที่ 4: push branch และเปิด Pull Request</h3>
            <p>
              Pull Request ช่วยให้เราดู diff รวมทั้งหมดก่อน merge และเป็นที่รวม discussion,
              screenshot, test result หรือ notes สำคัญ
            </p>
            <pre><code>{`git push origin feature/blog-catalog`}</code></pre>

            <h3>ขั้นตอนที่ 5: แก้ conflict แบบไม่ตื่น</h3>
            <p>
              conflict เกิดเมื่อ Git รวมไฟล์ให้อัตโนมัติไม่ได้ ให้เปิดไฟล์ที่ conflict,
              เลือกโค้ดที่ถูกต้อง, ลบ marker เช่น <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>,
              แล้ว commit อีกครั้ง
            </p>
            <pre><code>{`git switch feature/blog-catalog
git pull origin main
# fix conflicted files
git add .
git commit -m "Resolve merge conflict"`}</code></pre>

            <h3>ขั้นตอนที่ 6: merge เมื่อพร้อมจริง</h3>
            <p>
              ก่อน merge ควร build/test ให้ผ่าน ดูหน้าเว็บจริง และอ่าน diff อีกครั้ง ถ้าเป็นงานเดี่ยว
              ก็ยังควรใช้ PR เพราะมันบังคับให้เราทบทวนงานก่อนรวมเข้า main
            </p>

            <h3>Commit message pattern ที่ใช้ได้ง่าย</h3>
            <div className="blog__settings" role="table" aria-label="Git commit examples">
              <div role="row"><strong role="cell">Add</strong><span role="cell">เพิ่ม feature ใหม่ เช่น Add blog preview cards</span></div>
              <div role="row"><strong role="cell">Fix</strong><span role="cell">แก้ bug เช่น Fix mobile header spacing</span></div>
              <div role="row"><strong role="cell">Update</strong><span role="cell">ปรับของเดิม เช่น Update article copy</span></div>
              <div role="row"><strong role="cell">Refactor</strong><span role="cell">ปรับโค้ดโดยพฤติกรรมไม่เปลี่ยน เช่น Refactor blog data</span></div>
            </div>

            <h3 id="git-checklist">Checklist ใช้ Git แบบไม่หลง</h3>
            <pre><code>{`1. git status ก่อนเริ่มและก่อน commit
2. branch หนึ่งควรทำงานหนึ่งเรื่อง
3. commit เป็นก้อนเล็ก อ่าน diff ได้
4. push branch แล้วเปิด PR
5. build/test ก่อน merge
6. main ต้องเป็นเวอร์ชันที่ deploy ได้เสมอ`}</code></pre>
          </div>
        </article>
      </section>
    </main>
  )
}
