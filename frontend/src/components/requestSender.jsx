import { useState } from "react"

function RequestSender() {

  const [mode, setMode] = useState("single") 
  const [type, setType] = useState("HIGH")
  const [task, setTask] = useState("")
  const [bulkInput, setBulkInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const API = "http://localhost:5000/api/request"

  const handleSubmit = async () => {
    try {
      setLoading(true)
      setMessage("")

      let bodyData

      //  SINGLE REQUEST
      if (mode === "single") {
        if (!task.trim()) {
          setMessage(" Task is required")
          return
        }

        bodyData = {
          type,
          payload: {
            task
          }
        }
      }

      //  BULK REQUEST (ARRAY)
      else {
        if (!bulkInput.trim()) {
          setMessage(" Enter JSON array")
          return
        }

        try {
          bodyData = JSON.parse(bulkInput)

          if (!Array.isArray(bodyData)) {
            setMessage(" Must be an array of requests")
            return
          }

        } catch {
          setMessage(" Invalid JSON format")
          return
        }
      }

      const res = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bodyData)
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || "Request failed")
      }

      setMessage(" Request(s) sent successfully!")

      // Reset
      setTask("")
      setBulkInput("")

    } catch (err) {
      console.error(err)
      setMessage(" Error sending request")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.card}>

      <h3 style={styles.heading}> Request Sender</h3>

      {/* Mode Switch */}
      <div style={styles.modeSwitch}>
        <button
          style={mode === "single" ? styles.activeBtn : styles.btn}
          onClick={() => setMode("single")}
        >
          Single
        </button>
        <button
          style={mode === "bulk" ? styles.activeBtn : styles.btn}
          onClick={() => setMode("bulk")}
        >
          Bulk
        </button>
      </div>

      {/* SINGLE MODE */}
      {mode === "single" && (
        <>
          <input
            style={styles.input}
            placeholder="Enter task..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />

          <select
            style={styles.select}
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="HIGH"> HIGH</option>
            <option value="MEDIUM"> MEDIUM</option>
            <option value="LOW"> LOW</option>
            <option value="CRITICAL"> CRITICAL</option>
          </select>
        </>
      )}

      {/* BULK MODE */}
      {mode === "bulk" && (
        <textarea
          style={styles.textarea}
          placeholder={`Paste JSON array like:
[
  { "type": "HIGH", "payload": { "task": "Task 1" } },
  { "type": "LOW", "payload": { "task": "Task 2" } }
]`}
          value={bulkInput}
          onChange={(e) => setBulkInput(e.target.value)}
        />
      )}

      {/* SUBMIT */}
      <button
        style={styles.submit}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Sending..." : "Send Request"}
      </button>

      {/* MESSAGE */}
      {message && <p style={styles.message}>{message}</p>}

    </div>
  )
}

const styles = {
  card: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "12px",
    marginTop: "20px",
    color: "white",
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
  },
  heading: {
    marginBottom: "15px"
  },
  modeSwitch: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px"
  },
  btn: {
    flex: 1,
    padding: "8px",
    borderRadius: "6px",
    border: "none",
    background: "#334155",
    color: "white",
    cursor: "pointer"
  },
  activeBtn: {
    flex: 1,
    padding: "8px",
    borderRadius: "6px",
    border: "none",
    background: "#3b82f6",
    color: "white",
    cursor: "pointer"
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    marginBottom: "10px"
  },
  select: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "10px"
  },
  textarea: {
    width: "100%",
    height: "120px",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    marginBottom: "10px"
  },
  submit: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    background: "#22c55e",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold"
  },
  message: {
    marginTop: "10px"
  }
}

export default RequestSender