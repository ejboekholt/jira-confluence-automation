import { useState } from 'react'
import './App.css'

function App() {
  const [reportText, setReportText] = useState('')
  const [errorText, setErrorText] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    setErrorText('')

    try {
      const response = await fetch('http://localhost:3001/api/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const payload = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(payload.error || response.statusText || 'Request failed')
      }

      setReportText(payload.body || '')
    } catch (error) {
      setReportText('')
      setErrorText(error.message || String(error))
    } finally {
      setIsGenerating(false)
    }
  }

  const previewText = errorText || reportText || 'No report generated yet. Use the button to create the draft.'
  const reportStateClass = errorText ? 'error' : reportText ? 'ready' : 'waiting'
  const reportStateLabel = errorText ? 'Error' : reportText ? 'Ready for review' : 'Awaiting report'

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Delivery manager</p>
          <h1>Weekly status report</h1>
        </div>
        <button
          type="button"
          className="primary-button"
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate weekly report'}
        </button>
      </header>

      <section className="filters-bar" aria-label="Report settings">
        <span>Project: SHELSSW</span>
        <span>Window: Last 7 calendar days</span>
        <span>Issue type: Story</span>
        <span>Status: To Do, In Progress, Done</span>
      </section>

      <section className="report-panel" aria-label="Report preview">
        <div className="report-panel__header">
          <h2>Plain-text email draft</h2>
          <span className={`report-state ${reportStateClass}`}>
            {reportStateLabel}
          </span>
        </div>

        <pre className="report-preview" aria-live="polite">
          {previewText}
        </pre>
      </section>
    </main>
  )
}

export default App
