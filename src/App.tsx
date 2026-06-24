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
import Private from './components/Private'
import PrivateGate from './components/PrivateGate'


const DISCORD_WEBHOOK_URL = import.meta.env.VITE_DISCORD_WEBHOOK_URL || ''
const WEBHOOK_SESSION_KEY = 'portfolio-open-webhook-sent'
const DISCORD_AVATAR_URL =
  'https://api.dicebear.com/9.x/pixel-art/png?seed=MheePooh&backgroundColor=0f172a,1e1b4b&radius=50'

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
  const localTime = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'medium',
  }).format(now)

  return `${localTime}\n${now.toISOString()}`
}

function notifySiteOpen() {
  if (!DISCORD_WEBHOOK_URL) {
    return
  }

  const now = new Date()
  const userAgent = navigator.userAgent
  const pageUrl = window.location.href
  const referrer = document.referrer || 'Direct / Unknown'
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown timezone'
  const languages = navigator.languages?.length ? navigator.languages.join(', ') : navigator.language
  const viewport = `${window.innerWidth} x ${window.innerHeight}`
  const screenSize = `${window.screen.width} x ${window.screen.height}`

  const payload = {
    username: 'MheePooh Monitor',
    avatar_url: DISCORD_AVATAR_URL,
    embeds: [
      {
        author: {
          name: 'MheePooh Cyber Watch',
          icon_url: DISCORD_AVATAR_URL,
        },
        title: '\u{1F303} New Portfolio Visit',
        description: '\u{2728} Someone just entered the neon portfolio zone.',
        url: pageUrl,
        color: 0x22d3ee,
        fields: [
          {
            name: '\u{1F517} Page',
            value: `[Open portfolio](${pageUrl})`,
            inline: true,
          },
          {
            name: '\u{1F9ED} Source',
            value: limitDiscordField(referrer, 180),
            inline: true,
          },
          {
            name: '\u{1F552} Time',
            value: formatVisitTime(now),
            inline: true,
          },
          {
            name: '\u{1F310} Browser',
            value: getBrowserName(userAgent),
            inline: true,
          },
          {
            name: '\u{1F4BB} OS',
            value: getOperatingSystem(userAgent),
            inline: true,
          },
          {
            name: '\u{1F4F1} Device',
            value: getDeviceType(),
            inline: true,
          },
          {
            name: '\u{1F5E3}\u{FE0F} Language',
            value: languages || 'Unknown language',
            inline: true,
          },
          {
            name: '\u{1F570}\u{FE0F} Timezone',
            value: timezone,
            inline: true,
          },
          {
            name: '\u{1F5A5}\u{FE0F} Viewport / Screen',
            value: `${viewport} / ${screenSize}`,
            inline: true,
          },
        ],
        footer: {
          text: '\u{26A1} Cyberpunk portfolio visitor monitor',
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

function PrivateGatedRoute() {
  const [isAuthorized, setIsAuthorized] = useState(() => {
    return sessionStorage.getItem('private_authorized') === 'true'
  })

  if (!isAuthorized) {
    return <PrivateGate onAccessGranted={() => setIsAuthorized(true)} />
  }

  return <Private />
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

  if (normalizedPath === '/private') {
    return <PrivateGatedRoute />
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




