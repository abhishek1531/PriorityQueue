import { useEffect, useState } from "react"
import axios from "axios"

function WorkerHealth() {

  const [workers, setWorkers] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const fetchWorkers = async () => {
      try {

        const res = await axios.get("http://localhost:5000/api/stats")

        console.log(" Worker API:", res.data)

        //  Use backend value
        setWorkers(res.data.activeWorkers ?? 0)

      } catch (error) {

        console.error(" Worker API error:", error)

      } finally {
        setLoading(false)
      }
    }

    fetchWorkers()

    const interval = setInterval(fetchWorkers, 1000)

    return () => clearInterval(interval)

  }, [])

  return (
    <div>

      <h2>Worker Health</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p style={{ fontSize: "32px", fontWeight: "bold" }}>
            {workers}
          </p>

          <p
            style={{
              color:
                workers === 0
                  ? "#ef4444"
                  : workers < 3
                  ? "#facc15"
                  : "#22c55e"
            }}
          >
            {workers === 0
              ? "No Workers"
              : workers < 3
              ? "Low Capacity"
              : "Active Workers"}
          </p>
        </>
      )}

    </div>
  )
}

export default WorkerHealth