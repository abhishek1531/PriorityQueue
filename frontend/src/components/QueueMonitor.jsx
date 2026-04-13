import { useEffect, useState } from "react"
import axios from "axios"

function QueueMonitor() {

  const [stats, setStats] = useState({
    total: 0,
    queued: 0,
    processing: 0,
    completed: 0,
    failed: 0
  })

  useEffect(() => {

    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/stats")
        setStats(res.data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 1000)
    return () => clearInterval(interval)

  }, [])

  return (
    <div>
      <h2>Queue Overview</h2>

      <p style={{ fontSize: "28px", fontWeight: "bold" }}>{stats.total}</p>

      <p className="status-queued">Queued: {stats.queued}</p>
      <p className="status-processing">Processing: {stats.processing}</p>
      <p className="status-completed">Completed: {stats.completed}</p>
      <p className="status-failed">Failed: {stats.failed}</p>
    </div>
  )
}

export default QueueMonitor //