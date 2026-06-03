import { useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import TechStack from './components/TechStack'
import Experience from './components/Experience'
import Certificate from './components/Certificate'
import Footer from './components/Footer'

const DISCORD_WEBHOOK_URL =
  'https://discord.com/api/webhooks/1511558594817036308/3Pljvxt56tbymTaknVN2g0eeslq25OaP3lnWiSwmHbyTEkMy7phwo6Acu9ItSw7SFZ1Y'
const WEBHOOK_SESSION_KEY = 'portfolio-open-webhook-sent'
const DISCORD_PIXEL_GIF_URL =
  'https://cdn.pixabay.com/animation/2024/05/16/21/45/21-45-34-3_512.gif'

function limitDiscordField(value: string, maxLength = 1000) {
  return value.length > maxLength ? `${value.slice(0, maxLength - 3)}...` : value
}

function getBrowserName(userAgent: string) {
  if (userAgent.includes('Edg/')) return 'Microsoft Edge'
  if (userAgent.includes('OPR/') || userAgent.includes('Opera')) return 'Opera'
  if (userAgent.includes('Chrome/')) return 'Google Chrome'
  if (userAgent.includes('Firefox/')) return 'Mozilla Firefox'
  if (userAgent.includes('Safari/') && !userAgent.includes('Chrome/')) return 'Safari'
  return 'Unknown browser'
}

function getOperatingSystem(userAgent: string) {
  if (userAgent.includes('Windows NT')) return 'Windows'
  if (userAgent.includes('Mac OS X')) return 'macOS'
  if (userAgent.includes('Android')) return 'Android'
  if (userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'iOS / iPadOS'
  if (userAgent.includes('Linux')) return 'Linux'
  return 'Unknown OS'
}

function getDeviceType() {
  if (navigator.maxTouchPoints > 1 && window.innerWidth < 900) return 'Mobile / Tablet'
  if (navigator.maxTouchPoints > 1) return 'Touch device'
  return 'Desktop'
}

function formatVisitTime(now: Date) {
  const localTime = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'medium',
  }).format(now)

  return [
    `🕒 Local: ${localTime}`,
    `🌍 UTC: ${now.toISOString()}`,
  ].join('\n')
}

function notifySiteOpen() {
  const now = new Date()
  const userAgent = navigator.userAgent
  const pageUrl = window.location.href
  const referrer = document.referrer || 'Direct / Unknown'
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown timezone'
  const languages = navigator.languages?.length ? navigator.languages.join(', ') : navigator.language
  const viewport = `${window.innerWidth} x ${window.innerHeight}`
  const screenSize = `${window.screen.width} x ${window.screen.height}`

  const payload = {
    username: 'Portfolio Watch ✨',
    content: 'Website ของคุณโดนตรวจพบ 👀',
    embeds: [
      {
        title: '🌟 มีคนเข้าชม Portfolio แล้ว!',
        description: 'ระบบตรวจพบผู้เข้าชมเว็บไซต์ของคุณ รายละเอียดอยู่ด้านล่างนี้ครับ',
        color: 0xff8560,
        image: {
          url: DISCORD_PIXEL_GIF_URL,
        },
        fields: [
          {
            name: '🔗 หน้าเว็บ',
            value: `[กดเปิดหน้าเว็บ](${pageUrl})`,
          },
          {
            name: '🧭 แหล่งที่มา',
            value: limitDiscordField(referrer),
          },
          {
            name: '🌐 Browser',
            value: getBrowserName(userAgent),
            inline: true,
          },
          {
            name: '💻 OS',
            value: getOperatingSystem(userAgent),
            inline: true,
          },
          {
            name: '📱 Device',
            value: getDeviceType(),
            inline: true,
          },
          {
            name: '🗣️ ภาษา',
            value: languages || 'Unknown language',
            inline: true,
          },
          {
            name: '🕰️ Timezone',
            value: timezone,
            inline: true,
          },
          {
            name: '🖼️ Viewport',
            value: viewport,
            inline: true,
          },
          {
            name: '🖥️ Screen',
            value: screenSize,
            inline: true,
          },
          {
            name: '⏰ เวลาที่ตรวจพบ',
            value: formatVisitTime(now),
          },
          {
            name: '🧾 ข้อมูล Browser ดิบ',
            value: limitDiscordField(userAgent),
          },
        ],
        footer: {
          text: 'Portfolio visitor monitor • webhook-lab',
        },
        timestamp: now.toISOString(),
      },
    ],
  }

  const formData = new FormData()
  formData.append('payload_json', JSON.stringify(payload))

  if (navigator.sendBeacon?.(DISCORD_WEBHOOK_URL, formData)) {
    return
  }

  void fetch(DISCORD_WEBHOOK_URL, {
    method: 'POST',
    body: formData,
    mode: 'no-cors',
    keepalive: true,
  }).catch(() => undefined)
}

function App() {
  useEffect(() => {
    if (sessionStorage.getItem(WEBHOOK_SESSION_KEY)) {
      return
    }

    sessionStorage.setItem(WEBHOOK_SESSION_KEY, 'true')
    notifySiteOpen()
  }, [])

  return (
    <>
      <Header />
      <Hero />
      <TechStack />
      <Experience />
      <Certificate />
      <Footer />
    </>
  )
}

export default App
