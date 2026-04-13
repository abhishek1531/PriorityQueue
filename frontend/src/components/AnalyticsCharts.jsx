import { useEffect, useState } from "react"
import axios from "axios"

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js"

import { Bar } from "react-chartjs-2"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

function AnalyticsCharts() {

  const [chartData, setChartData] = useState({
    labels: ["Queued", "Processing", "Completed", "Failed"],
    datasets: [
      {
        label: "Requests",
        data: [0, 0, 0, 0],
        backgroundColor: ["#3b82f6","#f59e0b","#22c55e","#ef4444"]
      }
    ]
  })

  useEffect(() => {

    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/stats")
        const stats = res.data

        setChartData({
          labels: ["Queued", "Processing", "Completed", "Failed"],
          datasets: [
            {
              label: "Requests",
              data: [
                stats.queued,
                stats.processing,
                stats.completed,
                stats.failed
              ],
              backgroundColor: ["#3b82f6","#f59e0b","#22c55e","#ef4444"]
            }
          ]
        })

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
      <h2>Request Analytics</h2>
      <Bar data={chartData} />
    </div>
  )
}

export default AnalyticsCharts