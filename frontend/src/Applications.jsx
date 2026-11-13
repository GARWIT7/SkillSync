
import { useState, useEffect } from 'react'
import api from './api/axios'





function Applications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)

useEffect(() => {

  async function fetchApplications() {
    setLoading(true)
    try {
      setError('')
      const response = await api.get('applications/')

      const formattedApplications = response.data.map((app) => ({
        id: app.id,
        company: app.company_name,
        position: app.job_title,
        location: app.location,
        status: app.status,
      }))

      setApplications(formattedApplications)
    } catch (error) {
      
      console.error('Error fetching applications:', error)
      setError('Failed to load applications. Please try again.')
    }finally {
    setLoading(false)
  }
  }

  fetchApplications()
}, [retry])



  
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const [editingId, setEditingId] = useState(null)

  const [company, setCompany] = useState('')
  const [position, setPosition] = useState('')
  const [location, setLocation] = useState('')
  const [status, setStatus] = useState('APPLIED')

 async function handleSubmit(e) {
  e.preventDefault()

  const applicationData = {
    company_name: company,
    job_title: position,
    location: location,
    status: status,
  }

  try {
    if (editingId !== null) {
      const response = await api.patch(
        `applications/${editingId}/`,
        applicationData
      )

      setApplications(
        applications.map((app) =>
          app.id === editingId
            ? {
                ...app,
                company: response.data.company_name,
                position: response.data.job_title,
                location: response.data.location,
                status: response.data.status,
              }
            : app
        )
      )

      setEditingId(null)
    } else {
      const response = await api.post('applications/', applicationData)

      const newApplication = {
        id: response.data.id,
        company: response.data.company_name,
        position: response.data.job_title,
        location: response.data.location,
        status: response.data.status,
      }

      setApplications([...applications, newApplication])
    }

    setCompany('')
    setPosition('')
    setLocation('')
    setStatus('APPLIED')

  } catch (error) {
    console.error('Error saving application:', error.response?.data || error)
    alert('Could not save application. Check the console.')
  }
}

function handleEdit(app) {
  setEditingId(app.id)
  setCompany(app.company)
  setPosition(app.position)
  setLocation(app.location)
  setStatus(app.status)
}

  async function handleDelete(id) {
  try {
    await api.delete(`applications/${id}/`)

    setApplications(
      applications.filter((app) => app.id !== id)
    )
  } catch (error) {
    console.error('Error deleting application:', error.response?.data || error)
    alert('Could not delete application.')
  }
}

  async function handleStatusChange(id, newStatus) {
  try {
    const response = await api.patch(
      `applications/${id}/`,
      { status: newStatus }
    )

    setApplications(
      applications.map((app) =>
        app.id === id
          ? { ...app, status: response.data.status }
          : app
      )
    )
  } catch (error) {
    console.error(
      'Error updating status:',
      error.response?.data || error
    )
    alert('Could not update application status.')
  }
}

const filteredApplications = applications.filter((app) => {
  const matchesSearch =
    app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.position.toLowerCase().includes(searchTerm.toLowerCase())

  const matchesStatus =
    statusFilter === 'ALL' || app.status === statusFilter

  return matchesSearch && matchesStatus
})


return (
  <div>
    {loading ? (
      
      <div className="flex justify-center items-center py-20">
        <p className="text-slate-500 text-lg">
          Loading applications...
        </p>
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
        <h2 className="text-3xl font-bold text-slate-800 mb-2">
        Applications
      </h2>

      <p className="text-slate-500 mb-8">
        Manage and track your job applications.
      </p>

      {/* Add Application Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 md:p-6 rounded-xl shadow-sm mb-8"
      >
        <h3 className="text-xl font-bold mb-5">
          Add New Application
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">

          <input
            type="text"
            placeholder="Company Name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="border p-3 rounded-lg"
            required
          />

          <input
            type="text"
            placeholder="Job Position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="border p-3 rounded-lg"
            required
          />

          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border p-3 rounded-lg"
            required
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border p-3 rounded-lg"
          >
            <option value="APPLIED">Applied</option>
            <option value="INTERVIEW">Interview</option>
            <option value="SELECTED">Selected</option>
            <option value="REJECTED">Rejected</option>
          </select>

        </div>

       <button
  type="submit"
  className="mt-5 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
>
  {editingId !== null ? 'Update Application' : 'Add Application'}
</button>
      </form>

      {/* Applications List */}
      <section className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 mb-6">

  {/* Search */}
  <input
    type="text"
    placeholder="Search company or job title..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="border p-3 rounded-lg flex-1"
  />

  {/* Status Filter */}
  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="border p-3 rounded-lg"
  >
    <option value="ALL">All Statuses</option>
    <option value="APPLIED">Applied</option>
    <option value="INTERVIEW">Interview</option>
    <option value="SELECTED">Selected</option>
    <option value="REJECTED">Rejected</option>
  </select>

</div>
        <h3 className="text-xl font-bold mb-5">
          Your Applications ({filteredApplications.length})
        </h3>

       {filteredApplications.length === 0 ? (
  <p className="text-slate-500">
    {applications.length === 0
      ? 'No applications yet. Add your first application above.'
      : 'No applications match your search or filter.'}
  </p>
) : (
          <div className="overflow-x-auto">
           <table className="w-full min-w-[650px] text-left">
              <thead>
                <tr className="border-b text-slate-500">
                  <th className="py-3">Company</th>
                  <th className="py-3">Position</th>
                  <th className="py-3">Location</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="border-b">
                    <td className="py-4 font-medium">{app.company}</td>
                    <td className="py-4">{app.position}</td>
                    <td className="py-4">{app.location}</td>
                   <td className="py-4">
  <select
    value={app.status}
    onChange={(e) => handleStatusChange(app.id, e.target.value)}
    className="border rounded-lg p-2"
  >
    <option value="APPLIED">Applied</option>
    <option value="INTERVIEW">Interview</option>
    <option value="SELECTED">Selected</option>
    <option value="REJECTED">Rejected</option>
  </select>
</td>
                    <td className="py-4 whitespace-nowrap">
                     <div className="flex flex-wrap gap-3">
  <button
    onClick={() => handleEdit(app)}
    className="text-blue-600 hover:text-blue-800"
  >
    Edit
  </button>

  <button
    onClick={() => handleDelete(app.id)}
    className="text-red-600 hover:text-red-800"
  >
    Delete
  </button>
  </div>
</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
       </>
    )}
    </div>
  )
}

export default Applications
