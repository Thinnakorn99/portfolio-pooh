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

function notifySiteOpen() {
  const payload = {
    username: 'Portfolio Watch',
    content: 'Portfolio website opened',
    embeds: [
      {
        title: 'New portfolio visit',
        color: 0xff8560,
        fields: [
          {
            name: 'Page',
            value: window.location.href,
          },
          {
            name: 'Referrer',
            value: document.referrer || 'Direct / Unknown',
          },
          {
            name: 'User Agent',
            value: navigator.userAgent.slice(0, 1000),
          },
        ],
        timestamp: new Date().toISOString(),
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
