import { useEffect, useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import TechStack from './components/TechStack'
import Experience from './components/Experience'
import Certificate from './components/Certificate'
import Blog from './components/Blog'
import BlogCatalog from './components/BlogCatalog'
import BlogPreview from './components/BlogPreview'
import DevToolsDebugBlog from './components/DevToolsDebugBlog'
import GitWorkflowBlog from './components/GitWorkflowBlog'
import SaitamaWorkoutBlog from './components/SaitamaWorkoutBlog'
import CyberpunkBackground from './components/CyberpunkBackground'
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
    `๐•’ Local: ${localTime}`,
    `๐ UTC: ${now.toISOString()}`,
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
    username: 'Portfolio Watch โจ',
    content: 'Website เธเธญเธเธเธธเธ“เนเธ”เธเธ•เธฃเธงเธเธเธ ๐‘€',
    embeds: [
      {
        title: '๐ เธกเธตเธเธเน€เธเนเธฒเธเธก Portfolio เนเธฅเนเธง!',
        description: 'เธฃเธฐเธเธเธ•เธฃเธงเธเธเธเธเธนเนเน€เธเนเธฒเธเธกเน€เธงเนเธเนเธเธ•เนเธเธญเธเธเธธเธ“ เธฃเธฒเธขเธฅเธฐเน€เธญเธตเธขเธ”เธญเธขเธนเนเธ”เนเธฒเธเธฅเนเธฒเธเธเธตเนเธเธฃเธฑเธ',
        color: 0xff8560,
        image: {
          url: DISCORD_PIXEL_GIF_URL,
        },
        fields: [
          {
            name: '๐”— เธซเธเนเธฒเน€เธงเนเธ',
            value: `[เธเธ”เน€เธเธดเธ”เธซเธเนเธฒเน€เธงเนเธ](${pageUrl})`,
          },
          {
            name: '๐งญ เนเธซเธฅเนเธเธ—เธตเนเธกเธฒ',
            value: limitDiscordField(referrer),
          },
          {
            name: '๐ Browser',
            value: getBrowserName(userAgent),
            inline: true,
          },
          {
            name: '๐’ป OS',
            value: getOperatingSystem(userAgent),
            inline: true,
          },
          {
            name: '๐“ฑ Device',
            value: getDeviceType(),
            inline: true,
          },
          {
            name: '๐—ฃ๏ธ เธ เธฒเธฉเธฒ',
            value: languages || 'Unknown language',
            inline: true,
          },
          {
            name: '๐•ฐ๏ธ Timezone',
            value: timezone,
            inline: true,
          },
          {
            name: '๐–ผ๏ธ Viewport',
            value: viewport,
            inline: true,
          },
          {
            name: '๐–ฅ๏ธ Screen',
            value: screenSize,
            inline: true,
          },
          {
            name: 'โฐ เน€เธงเธฅเธฒเธ—เธตเนเธ•เธฃเธงเธเธเธ',
            value: formatVisitTime(now),
          },
          {
            name: '๐งพ เธเนเธญเธกเธนเธฅ Browser เธ”เธดเธ',
            value: limitDiscordField(userAgent),
          },
        ],
        footer: {
          text: 'Portfolio visitor monitor โ€ข webhook-lab',
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
  const [path, setPath] = useState(window.location.pathname)

  useEffect(() => {
    if (sessionStorage.getItem(WEBHOOK_SESSION_KEY)) {
      return
    }

    sessionStorage.setItem(WEBHOOK_SESSION_KEY, 'true')
    notifySiteOpen()
  }, [])

  useEffect(() => {
    const syncPath = () => setPath(window.location.pathname)

    window.addEventListener('popstate', syncPath)
    window.addEventListener('pageshow', syncPath)

    return () => {
      window.removeEventListener('popstate', syncPath)
      window.removeEventListener('pageshow', syncPath)
    }
  }, [])

  const normalizedPath = path.replace(/\/$/, '')

  if (normalizedPath === '/blog/cloudflare-pages-deploy') {
    return <Blog />
  }

  if (normalizedPath === '/blog/saitama-workout') {
    return <SaitamaWorkoutBlog />
  }

  if (normalizedPath === '/blog/git-github-workflow') {
    return <GitWorkflowBlog />
  }

  if (normalizedPath === '/blog/chrome-devtools-debugging') {
    return <DevToolsDebugBlog />
  }

  if (normalizedPath === '/blog') {
    return <BlogCatalog />
  }


  return (
    <>
      <CyberpunkBackground />
      <Header />
      <Hero />
      <TechStack />
      <Experience />
      <Certificate />
      <BlogPreview />
      <Footer />
    </>
  )
}

export default App




