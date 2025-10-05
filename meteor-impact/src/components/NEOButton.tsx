import { useAppStore } from '../state/store'
import { fetchNEOFeed } from '../services/nasaNeo'

export function NEOButton() {
  const { setNEOs, setLoadingNEO } = useAppStore()

  async function handleClick() {
    try {
      setLoadingNEO(true)
      const today = new Date()
      const start = today.toISOString().slice(0, 10)
      const end = start
      const neos = await fetchNEOFeed({ startDate: start, endDate: end })
      setNEOs(neos)
    } catch (e) {
      console.error(e)
      alert('Failed to fetch NEOs. Check VITE_NASA_API_KEY')
    } finally {
      setLoadingNEO(false)
    }
  }

  return (
    <button onClick={handleClick} style={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
      Fetch NEOs (NASA)
    </button>
  )
}
