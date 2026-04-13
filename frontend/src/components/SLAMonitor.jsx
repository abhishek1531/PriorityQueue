import { useEffect, useState } from "react"
import axios from "axios"

function SLAMonitor() {

  const [violations, setViolations] = useState([])

  useEffect(() => {

    const fetchViolations = async () => {
      const res = await axios.get("http://localhost:5000/api/sla")
      setViolations(res.data || [])
    }

    fetchViolations()
    const interval = setInterval(fetchViolations, 1000)

    return () => clearInterval(interval)

  }, [])

  return (
    <div>
      <h2>SLA Violations</h2>

      {violations.length === 0 ? (
        <p>No SLA issues</p>
      ) : (
        violations.map(v => (
          <p key={v._id}>
            {v.requestId} 
          </p>
        ))
      )}
    </div>
  )
}

export default SLAMonitor