import { useState, useEffect } from 'react'
import api from './api/axios'

function Interviews() {
    const [interviews, setInterviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [retry, setRetry] = useState(0)
    const [application, setApplication] = useState('')
    const [editingId, setEditingId] = useState(null)    
    const [applications, setApplications] = useState([])
    const [interviewDate, setInterviewDate] = useState('')
    const [interviewType, setInterviewType] = useState('ONLINE')
    const [notes, setNotes] = useState('')

async function handleSubmit(e) {
  e.preventDefault()

  const interviewData = {
    application: Number(application),
    interview_date: interviewDate,
    interview_type: interviewType,
    notes: notes,
  }

  try {
    let response

if (editingId !== null) {
  response = await api.patch(`interviews/${editingId}/`, interviewData)
} else {
  response = await api.post('interviews/', interviewData)
}

  if (editingId !== null) {
  setInterviews(
    interviews.map((interview) =>
      interview.id === editingId ? response.data : interview
    )
  )
  setEditingId(null)
} else {
  setInterviews([...interviews, response.data])
}

    setApplication('')
    setInterviewDate('')
    setInterviewType('ONLINE')
    setNotes('')

    alert('Interview scheduled successfully!')
  } catch (error) {
    console.error(
      'Error scheduling interview:',
      error.response?.data || error
    )
    alert('Could not schedule interview. Check the console.')
  }
}


function handleEdit(interview) {
  setEditingId(interview.id)
  setApplication(interview.application)
  setInterviewDate(interview.interview_date)
  setInterviewType(interview.interview_type)
  setNotes(interview.notes)
}




async function handleDelete(id) {
  try {
    await api.delete(`interviews/${id}/`)

    setInterviews(
      interviews.filter((interview) => interview.id !== id)
    )

    alert('Interview deleted successfully!')
  } catch (error) {
    console.error(
      'Error deleting interview:',
      error.response?.data || error
    )
    alert('Could not delete interview.')
  }
}





  useEffect(() => {
  async function fetchInterviews() {
  try {
    setLoading(true)
    setError('')

    const response = await api.get('interviews/')
    setInterviews(response.data)

  } catch (error) {
    console.error('Error fetching interviews:', error)
    setError('Failed to load interviews. Please try again.')

  } finally {
    setLoading(false)
  }
}

  fetchInterviews()
}, [retry])

useEffect(() => {
  async function fetchApplications() {
    try {
      const response = await api.get('applications/')
      setApplications(response.data)
    } catch (error) {
      console.error('Error fetching applications:', error)
    }
  }

  fetchApplications()
}, [])
  
  return (
  <div className="p-4 md:p-8">
    {loading ? (
      <div className="flex justify-center items-center py-20">
        <p className="text-slate-500 text-lg">Loading interviews...</p>
      </div>
    ) : error ? (
  <div className="text-center py-10">
    <p className="text-red-600 text-lg mb-4">
      {error}
    </p>

    <button
      onClick={() => setRetry(retry + 1)}
      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
    >
      Retry
    </button>
  </div>
) : (
  <>
    <h1 className="text-3xl font-bold text-slate-800 mb-6">
      My Interviews
    </h1>
<form
  onSubmit={handleSubmit}
  className="bg-white p-4 md:p-6 rounded-xl shadow-sm mb-6"
>
  <h2 className="text-xl font-bold mb-4">
    Schedule New Interview
  </h2>




<label className="block mb-2">Select Application</label>

<select
  value={application}
  onChange={(e) => setApplication(e.target.value)}
  className="w-full border p-3 rounded-lg mb-4"
  required
>
  <option value="">Choose an application</option>

  {applications.map((app) => (
    <option key={app.id} value={app.id}>
      {app.company_name} - {app.job_title}
    </option>
  ))}
</select>





  <label className="block mb-2">Interview Date</label>
  <input
    type="datetime-local"
    required
    value={interviewDate}
    onChange={(e) => setInterviewDate(e.target.value)}
    className="w-full border p-3 rounded-lg mb-4"
  />

  <label className="block mb-2">Interview Type</label>
  <select
  required
    value={interviewType}
    onChange={(e) => setInterviewType(e.target.value)}
    className="w-full border p-3 rounded-lg mb-4"
  >
    <option value="ONLINE">Online</option>
    <option value="OFFLINE">Offline</option>
    <option value="PHONE">Phone</option>
  </select>

  <label className="block mb-2">Notes</label>
  <textarea
    value={notes}
    onChange={(e) => setNotes(e.target.value)}
    className="w-full border p-3 rounded-lg mb-4"
    placeholder="Add interview notes"
  />

  <button
    type="submit"
    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
  >
    {editingId !== null ? 'Update Interview' : 'Schedule Interview'}
  </button>
</form> 



    {interviews.length === 0 ? (
      <p className="text-slate-500">
        No interviews scheduled yet.
      </p>
    ) : (
      <div className="space-y-4">
        {interviews.map((interview) => (
          <div
            key={interview.id}
            className="bg-white p-4 md:p-5 rounded-xl shadow-sm min-w-0"
          >
            <h2 className="font-bold text-lg text-slate-800">
  {applications.find((app) => app.id === interview.application)?.company_name
    || `Application #${interview.application}`}
</h2>

<p className="text-slate-600">
  Position: {
    applications.find((app) => app.id === interview.application)?.job_title
    || 'Loading...'
  }
</p>

            <p className="text-slate-600 mt-2">
              Date: {interview.interview_date}
            </p>

            <p className="text-slate-600">
              Type: {interview.interview_type}
            </p>

            <p className="text-slate-600">
              Notes: {interview.notes || 'No notes'}
            </p>

<div className="flex flex-wrap gap-2">
<button
  onClick={() => handleEdit(interview)}
  className="mt-4 mr-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
>
  Edit Interview
</button>



<button
  onClick={() => handleDelete(interview.id)}
  className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
>
  Delete Interview
</button>
</div>
          </div>
        ))}
      </div>
     )}
      </>
    )}
  </div>
)
}
export default Interviews