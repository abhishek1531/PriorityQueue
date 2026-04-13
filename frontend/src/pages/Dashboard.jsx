import QueueMonitor from "../components/QueueMonitor"
import WorkerHealth from "../components/WorkerHealth"
import SLAMonitor from "../components/SLAMonitor"
import AnalyticsCharts from "../components/AnalyticsCharts"
import LiveJobs from "../components/LiveJobs"
import RequestSender from "../components/requestSender" 

import "../styles/dashboard.css"

function Dashboard() {
  return (
    <div className="dashboard-container">

      <h1 className="dashboard-title">Admin Monitoring Dashboard</h1>

      {/* Top */}
      <div className="dashboard-top">
        <QueueMonitor />
        <WorkerHealth />
      </div>

      {/*  NEW: Request Sender  */}
      <div className="dashboard-middle">
        <RequestSender />
      </div>

      {/* Chart */}
      <div className="dashboard-middle">
        <AnalyticsCharts />
      </div>

      {/* Bottom */}
      <div className="dashboard-bottom">
        <SLAMonitor />
        <LiveJobs />
      </div>

    </div>
  )
}

export default Dashboard //