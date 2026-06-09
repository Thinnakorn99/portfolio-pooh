import './Blog.css'

const weeklyPlan = [
  {
    phase: 'สัปดาห์ 1-2',
    goal: 'สร้างนิสัยและเช็กฟอร์ม',
    work: '3 วัน/สัปดาห์: push-up 3x5-10, squat 3x10-15, dead bug หรือ plank 3 เซ็ต, เดินเร็ว/วิ่งสลับเดิน 20-30 นาที',
  },
  {
    phase: 'สัปดาห์ 3-4',
    goal: 'เพิ่ม volume แบบไม่รีบ',
    work: '4 วัน/สัปดาห์: push-up รวม 30-50 ครั้ง, squat รวม 50-70 ครั้ง, core รวม 30-50 ครั้ง, cardio 30-40 นาที',
  },
  {
    phase: 'สัปดาห์ 5-6',
    goal: 'เข้าใกล้ครึ่งสูตรไซตามะ',
    work: '4-5 วัน/สัปดาห์: push-up 50-70 ครั้ง, squat 70-90 ครั้ง, core 60-80 ครั้ง, วิ่ง/เดินเร็ว 4-7 กม.',
  },
  {
    phase: 'สัปดาห์ 7-8',
    goal: 'ทดสอบสูตรเต็มแบบมีวันพัก',
    work: '2-3 วัน/สัปดาห์ลอง 100/100/100 และวิ่ง 7-10 กม. วันที่เหลือทำเบา, mobility, หรือพัก',
  },
]

export default function SaitamaWorkoutBlog() {
  return (
    <main className="blog-page">
      <nav className="blog-page__nav" aria-label="Blog navigation">
        <a href="/" className="blog-page__brand">Thinnakorn</a>
        <a href="/blog" className="blog-page__back">Back to Blog</a>
      </nav>

      <section className="blog" id="blog" aria-labelledby="saitama-blog-title">
        <article className="blog__article" itemScope itemType="https://schema.org/BlogPosting">
          <header className="blog__header">
            <p className="blog__kicker">Fitness Guide</p>
            <h2 id="saitama-blog-title" className="blog__title" itemProp="headline">
              วิธีออกกำลังกายยังไงให้เป็นไซตามะ แบบทำตามได้จริง
            </h2>
            <p className="blog__subtitle" itemProp="description">
              แปลงสูตร 100 push-up, 100 sit-up, 100 squat และวิ่ง 10 กิโลเมตร
              ให้เป็นแผนฝึกที่ค่อย ๆ ไต่ระดับ ปลอดภัยกว่า และเหมาะกับคนทั่วไป
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
                <span>10 min read</span>
              </div>
            </div>
          </header>

          <div className="blog__tools" aria-label="Article sections">
            <a href="#saitama-overview">Overview</a>
            <a href="#saitama-plan">8-week plan</a>
            <a href="#saitama-safety">Safety</a>
          </div>

          <div className="blog__content" itemProp="articleBody">
            <p className="blog__lead" id="saitama-overview">
              สูตรไซตามะจาก One Punch Man คือ 100 push-up, 100 sit-up, 100 squat
              และวิ่ง 10 กิโลเมตรทุกวัน ฟังดูเท่และจำง่าย แต่ถ้าคนเริ่มใหม่ทำทันที
              มีโอกาสเจ็บไหล่ เข่า หน้าแข้ง หลังล่าง หรือหมดไฟเร็วมาก แผนนี้จึงใช้แนวคิดเดิม
              แต่เปลี่ยนเป็น progressive training เพื่อให้ร่างกายค่อย ๆ แข็งแรงขึ้น
            </p>

            <h3>ข้อควรรู้ก่อนเริ่ม</h3>
            <p>
              ถ้ามีโรคประจำตัว เจ็บหน้าอก เวียนหัวง่าย ความดันสูงที่ควบคุมไม่ได้
              เคยบาดเจ็บเข่า/หลัง/หัวไหล่ หรือไม่ได้ออกกำลังกายมานานมาก ควรปรึกษาแพทย์
              หรือผู้เชี่ยวชาญก่อนเริ่ม แผนนี้เป็นคำแนะนำทั่วไป ไม่ใช่การวินิจฉัยหรือการรักษา
            </p>

            <h3>เป้าหมายจริงของการเป็น “ไซตามะ”</h3>
            <p>
              ไม่ใช่แค่ทำตัวเลขให้ครบ แต่คือสร้างร่างกายที่อึด แข็งแรง และฟื้นตัวได้ดี
              ดังนั้นต้องมี 4 อย่างพร้อมกัน: strength, cardio, mobility และ recovery
              ถ้าขาด recovery ต่อให้ใจสู้ ร่างกายก็อาจพังได้
            </p>

            <h3>ฟอร์มท่าพื้นฐาน</h3>
            <h4>Push-up</h4>
            <p>
              วางมือกว้างกว่าหัวไหล่เล็กน้อย เกร็งลำตัวให้ตัวเป็นเส้นตรง ลดอกลงแบบคุมจังหวะ
              แล้วดันพื้นขึ้น ถ้าทำแบบปกติยังยาก ให้เริ่มจาก incline push-up โดยวางมือบนโต๊ะหรือกำแพง
            </p>

            <h4>Squat</h4>
            <p>
              ยืนเท้าประมาณหัวไหล่ ดันสะโพกไปด้านหลัง เข่าชี้ทิศเดียวกับปลายเท้า
              ลงลึกเท่าที่คุมฟอร์มได้ แล้วดันพื้นขึ้น หลีกเลี่ยงการเด้งเข่าหรือยุบตัวเร็วเกินไป
            </p>

            <h4>Core แทน sit-up ล้วน</h4>
            <p>
              Sit-up จำนวนมากอาจรบกวนหลังล่างในบางคน ให้สลับกับ plank, dead bug, hollow hold
              หรือ reverse crunch เพื่อฝึกแกนกลางโดยไม่โหลดหลังซ้ำเกินไป
            </p>

            <h4>วิ่ง 10 กิโลเมตร</h4>
            <p>
              ไม่ควรเริ่มจาก 10 กม. ทันที ถ้ายังไม่ได้วิ่งสม่ำเสมอ ให้เริ่มจากเดินเร็ว
              วิ่งสลับเดิน แล้วเพิ่มระยะรวมทีละน้อย เป้าหมายคือวิ่งแล้ววันต่อมายังเดินได้ปกติ
            </p>

            <h3 id="saitama-plan">แผน 8 สัปดาห์เพื่อเข้าใกล้สูตรไซตามะ</h3>
            <div className="blog__settings" role="table" aria-label="Saitama workout progression plan">
              {weeklyPlan.map((week) => (
                <div role="row" key={week.phase}>
                  <strong role="cell">{week.phase}</strong>
                  <span role="cell">
                    <b>{week.goal}</b>
                    <br />
                    {week.work}
                  </span>
                </div>
              ))}
            </div>

            <h3>ตัวอย่างตาราง 1 สัปดาห์</h3>
            <pre>
              <code>{`Mon: Strength A + easy cardio
Tue: Walk, mobility, or rest
Wed: Strength B + run/walk
Thu: Rest
Fri: Strength A + easy cardio
Sat: Long walk or long easy run
Sun: Full rest or stretching`}</code>
            </pre>

            <h3>Strength A และ B ทำอะไรบ้าง</h3>
            <pre>
              <code>{`Strength A
- Push-up variation 3-5 sets
- Squat 3-5 sets
- Plank or dead bug 3 sets
- Calf raise 2-3 sets

Strength B
- Incline/normal push-up 3-5 sets
- Split squat or lunge 3 sets
- Reverse crunch 3 sets
- Hip hinge or glute bridge 3 sets`}</code>
            </pre>

            <h3>วิธีเพิ่มจำนวนแบบไม่เจ็บ</h3>
            <p>
              ใช้กฎง่าย ๆ คือเพิ่มทีละ 5-10% ต่อสัปดาห์ ถ้าสัปดาห์นี้รวม push-up ได้ 50 ครั้ง
              สัปดาห์หน้าขยับเป็น 55 ครั้งก็พอ ไม่จำเป็นต้องเพิ่มทุกท่าพร้อมกัน และควรเหลือแรง
              1-3 ครั้งก่อนหมดแรงจริงในแต่ละเซ็ต
            </p>

            <h3>กินและพักยังไงให้ร่างกายโต</h3>
            <ul>
              <li>กินโปรตีนทุกมื้อ เช่น ไข่ ไก่ ปลา เต้าหู้ นม หรือถั่ว</li>
              <li>กินคาร์โบไฮเดรตก่อนหรือหลัง cardio เช่น ข้าว กล้วย มัน ขนมปังโฮลวีต</li>
              <li>ดื่มน้ำให้พอ โดยเฉพาะวันที่วิ่งหรือเหงื่อออกเยอะ</li>
              <li>นอน 7-9 ชั่วโมง ถ้านอนน้อยให้ลด volume ในวันถัดไป</li>
              <li>มีวันพักจริง อย่างน้อย 1-2 วันต่อสัปดาห์</li>
            </ul>

            <h3 id="saitama-safety">สัญญาณที่ควรหยุดหรือถอยระดับ</h3>
            <ul>
              <li>เจ็บแปลบที่ข้อ เข่า หลังล่าง หัวไหล่ หรือหน้าแข้ง</li>
              <li>เจ็บหน้าอก หายใจผิดปกติ เวียนหัว หรือใจสั่น</li>
              <li>อาการล้าไม่หายหลังพัก 48-72 ชั่วโมง</li>
              <li>ฟอร์มพังตั้งแต่เซ็ตแรก เช่น หลังแอ่น เข่ายุบ หัวไหล่ยก</li>
            </ul>

            <h3>สูตรเต็มควรทำทุกวันไหม</h3>
            <p>
              ถ้าร่างกายยังไม่พร้อม ไม่ควรทำทุกวัน แม้คนฟิตแล้วก็ยังควรมีวันเบาและวันพัก
              เพราะกล้ามเนื้อ เอ็น ข้อต่อ และระบบประสาทต้องใช้เวลาฟื้นตัว เป้าหมายที่สมจริงกว่า
              คือทำสูตรเต็ม 2-3 วันต่อสัปดาห์ แล้วคั่นด้วยวัน cardio เบา mobility หรือพัก
            </p>

            <h3>Checklist ทำตามได้ทันที</h3>
            <pre>
              <code>{`1. เลือกระดับเริ่มต้นที่ทำได้โดยไม่เจ็บ
2. ฝึก 3 วัน/สัปดาห์ก่อน อย่าเริ่มทุกวัน
3. ทำ push-up, squat, core อย่างละ 3-5 เซ็ต
4. cardio เริ่มจากเดินเร็วหรือวิ่งสลับเดิน 20-30 นาที
5. เพิ่มจำนวนหรือระยะรวมทีละ 5-10% ต่อสัปดาห์
6. พักอย่างน้อย 1-2 วัน/สัปดาห์
7. เมื่อฟอร์มพังหรือเจ็บข้อ ให้ลดระดับทันที
8. หลัง 8 สัปดาห์ค่อยทดสอบ 100/100/100 + 7-10 กม.`}</code>
            </pre>

            <h3>แหล่งอ้างอิง</h3>
            <p>
              อ้างอิงหลักการจาก{' '}
              <a href="https://www.who.int/news-room/fact-sheets/detail/physical-activity" target="_blank" rel="noopener noreferrer">
                WHO physical activity
              </a>
              ,{' '}
              <a href="https://www.cdc.gov/physical-activity-basics/guidelines/adults.html" target="_blank" rel="noopener noreferrer">
                CDC adult activity guidelines
              </a>
              , และ{' '}
              <a href="https://acsm.org/education-resources/trending-topics-resources/physical-activity-guidelines/" target="_blank" rel="noopener noreferrer">
                ACSM physical activity guidelines
              </a>
              .
            </p>
          </div>
        </article>
      </section>
    </main>
  )
}
