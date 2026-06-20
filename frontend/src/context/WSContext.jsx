import { createContext, useContext, useEffect, useRef, useState } from 'react'

const WSContext = createContext(null)

export function WSProvider({ children }) {
  const [lastEvent, setLastEvent] = useState(null)
  const wsRef = useRef(null)

  useEffect(() => {
    const connect = () => {
      let wsUrl
      if (import.meta.env.VITE_API_URL) {
        // Production: ชี้ตรงไปที่ backend
        const base = import.meta.env.VITE_API_URL
          .replace('https://', 'wss://')
          .replace('http://', 'ws://')
        wsUrl = `${base}/api/cats/ws`
      } else {
        // Local: ผ่าน vite proxy
        const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
        wsUrl = `${protocol}://${window.location.host}/api/cats/ws`
      }

      const ws = new WebSocket(wsUrl)
      ws.onmessage = (e) => {
        try { setLastEvent(JSON.parse(e.data)) } catch {}
      }
      ws.onclose = () => setTimeout(connect, 3000)
      wsRef.current = ws
    }

    connect()
    return () => wsRef.current?.close()
  }, [])

  return (
    <WSContext.Provider value={{ lastEvent }}>
      {children}
    </WSContext.Provider>
  )
}

export const useWS = () => useContext(WSContext)
