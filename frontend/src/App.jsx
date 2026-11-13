import { useState, useEffect } from 'react'
import api from './api/axios'
import Applications from './Applications'
import Login from './Login'
import Skills from './Skills'
import Interviews from './Interviews'
import Profile from './Profile'
import Register from './Register'



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem('accessToken'))
  )
  const [showRegister, setShowRegister] = useState(false)
  const [activePage, setActivePage] = useState('Dashboard')
  const [applications, setApplications] = useState([])
  const [interviews, setInterviews] = useState([])
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')



  useEffect(() => {
      if (!isLoggedIn) return
  async function fetchDashboardData() {
  setLoading(true)
  setError('')

  try {
      const applicationsResponse = await api.get('applications/')
      const interviewsResponse = await api.get('interviews/')
      const skillsResponse = await api.get('skills/')

      setApplications(applicationsResponse.data)
      setInterviews(interviewsResponse.data)
      setSkills(skillsResponse.data)


    } catch (err) {
  console.error(
    'Error fetching dashboard data:',
    err.response?.data || err
  )

  setError('Failed to load dashboard data. Please try again.')
}
    finally {
  setLoading(false)
}
  }

  fetchDashboardData()
}, [isLoggedIn, activePage])



const appliedCount = applications.filter(
  (app) => app.status === 'APPLIED'
).length

const interviewCount = applications.filter(
  (app) => app.status === 'INTERVIEW'
).length

const selectedCount = applications.filter(
  (app) => app.status === 'SELECTED'
).length

const rejectedCount = applications.filter(
  (app) => app.status === 'REJECTED'
).length



const successRate = applications.length > 0
  ? ((selectedCount / applications.length) * 100).toFixed(1)
  : 0

function handleLogout() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  setIsLoggedIn(false)

  
}



if (!isLoggedIn) {
  return showRegister ? (
    <Register onRegister={() => setShowRegister(false)} />
  ) : (
    <Login
      onLogin={() => setIsLoggedIn(true)}
      onShowRegister={() => setShowRegister(true)}
    />
  )
}


  return (
   <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">

      {/* Sidebar */}
     <aside className="w-full md:w-64 bg-slate-900 text-white md:min-h-screen p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-10">
          Skill<span className="text-blue-400">Sync</span>
        </h1>

        
<nav className="space-y-2 md:space-y-3 grid grid-cols-2 md:grid-cols-1 gap-2 md:gap-0">
  {['Dashboard', 'Applications', 'My Skills', 'Interviews', 'Profile'].map((page) => (
    <button
      key={page}
      onClick={() => setActivePage(page)}
     className={`block w-full text-left p-2 md:p-3 text-sm md:text-base rounded-lg transition ${
        activePage === page
          ? 'bg-blue-600 text-white'
          : 'text-white hover:bg-slate-800'
      }`}
    >
      {page}
    </button>
  ))}
</nav>
<button
  onClick={handleLogout}
  className="w-full text-left p-3 mt-6 rounded-lg text-red-400 hover:bg-slate-800"
>
  Logout
</button>

      </aside> 

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 min-w-0">
{activePage === 'Dashboard' && (
  loading ? (
    <div className="flex justify-center items-center py-20">
      <p className="text-slate-500 text-lg">
        Loading dashboard...
      </p>
    </div>
  ) : error ? (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <p className="text-red-600 font-medium">
        {error}
      </p>
    </div>
  ) : (
    <>
     
   






        {/* Header */}
       <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">
              Dashboard
            </h2>
            <p className="text-slate-500 mt-1">
              Welcome back! Track your career progress.
            </p>
          </div>

          <div className="bg-white px-5 py-3 rounded-lg shadow-sm">
            <span className="font-medium text-slate-700">
              Student
            </span>
          </div>
        </header>

        {/* Statistics */}
  <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">

          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
            <p className="text-slate-500">Total Applications</p>
            <h3 className="text-3xl font-bold mt-3 text-slate-800">
              {applications.length}
            </h3>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
            <p className="text-slate-500">Interviews</p>
            <h3 className="text-3xl font-bold mt-3 text-blue-600">
              {interviews.length}
            </h3>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
            <p className="text-slate-500">Offers Received</p>
            <h3 className="text-3xl font-bold mt-3 text-green-600">
              {applications.filter((app) => app.status === 'SELECTED').length}
            </h3>
          </div>

                    <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
            <p className="text-slate-500">Total Skills</p>
            <h3 className="text-3xl font-bold mt-3 text-purple-600">
              {skills.length}
            </h3>
          </div>


          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
  <p className="text-slate-500">Application Success Rate</p>
  <h3 className="text-3xl font-bold mt-3 text-green-600">
    {successRate}%
  </h3>
</div>

        </section>


{/* Application Status Breakdown */}
<section className="mt-8 bg-white rounded-xl shadow-sm p-6">

  <h3 className="text-xl font-bold text-slate-800 mb-6">
    Application Status Breakdown
  </h3>

 <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

    <div className="bg-blue-50 p-5 rounded-lg">
      <p className="text-blue-600 font-medium">Applied</p>
      <h4 className="text-2xl font-bold text-blue-700 mt-2">
        {appliedCount}
      </h4>
    </div>

    <div className="bg-yellow-50 p-5 rounded-lg">
      <p className="text-yellow-600 font-medium">Interview</p>
      <h4 className="text-2xl font-bold text-yellow-700 mt-2">
        {interviewCount}
      </h4>
    </div>

    <div className="bg-green-50 p-5 rounded-lg">
      <p className="text-green-600 font-medium">Selected</p>
      <h4 className="text-2xl font-bold text-green-700 mt-2">
        {selectedCount}
      </h4>
    </div>

    <div className="bg-red-50 p-5 rounded-lg">
      <p className="text-red-600 font-medium">Rejected</p>
      <h4 className="text-2xl font-bold text-red-700 mt-2">
        {rejectedCount}
      </h4>
    </div>

  </div>
</section>


{/* Recent Applications */}
<section className="mt-8 bg-white rounded-xl shadow-sm p-4 md:p-6">

  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
    <div>
      <h3 className="text-xl font-bold text-slate-800">
        Recent Applications
      </h3>
      <p className="text-sm text-slate-500 mt-1">
        Keep track of your latest job applications.
      </p>
    </div>

    <span className="text-blue-600 font-medium text-sm">
      Latest activity
    </span>
  </div>

  <div className="overflow-x-auto">
    <table className="w-full text-left">
      <thead>
        <tr className="border-b text-slate-500 text-sm">
          <th className="py-3">Company</th>
          <th className="py-3">Position</th>
          <th className="py-3">Status</th>
          <th className="py-3">Applied Date</th>
        </tr>
      </thead>

      
<tbody>
  {applications.length > 0 ? (
   [...applications]
  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  .slice(0, 5)
  .map((app) => (
      <tr key={app.id} className="border-b last:border-0">
        <td className="py-4 font-medium text-slate-800">
          {app.company_name}
        </td>

        <td className="py-4 text-slate-600">
          {app.job_title}
        </td>

        <td className="py-4">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
            {app.status}
          </span>
        </td>

        <td className="py-4 text-slate-600">
          {app.applied_date || 'Not specified'}
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="4" className="py-6 text-center text-slate-500">
        No applications found. Add your first application!
      </td>
    </tr>
  )}
</tbody>



    </table>
  </div>

</section>

{/* Upcoming Interviews */}
<section className="mt-8 bg-white rounded-xl shadow-sm p-4 md:p-6">

 <h3 className="text-xl font-bold text-slate-800 mb-2">
    Upcoming Interviews
  </h3>

  <p className="text-sm text-slate-500 mb-6">
    Prepare for your upcoming opportunities.
  </p>

  {interviews.filter(
    (interview) => new Date(interview.interview_date) >= new Date()
  ).length > 0 ? (

    interviews
      .filter(
        (interview) => new Date(interview.interview_date) >= new Date()
      )
      .sort(
        (a, b) => new Date(a.interview_date) - new Date(b.interview_date)
      )
      .slice(0, 5)
      .map((interview) => {
        const app = applications.find(
          (item) => item.id === interview.application
        )

        return (
          <div
            key={interview.id}
            className="border-b last:border-0 py-4"
          >
            <h4 className="font-semibold text-slate-800">
              {app?.company_name || 'Company not found'}
            </h4>

            <p className="text-sm text-slate-600">
              {app?.job_title || 'Position not found'}
            </p>

            <p className="text-sm text-blue-600 mt-1">
              {new Date(interview.interview_date).toLocaleString()}
            </p>

            <span className="text-xs text-slate-500">
              {interview.interview_type}
            </span>
          </div>
        )
      })

  ) : (
    <p className="text-slate-500 py-4">
      No upcoming interviews scheduled.
    </p>
  )}

</section>
          
              </>
  )
)}


{activePage === 'Applications' && <Applications />}
{activePage === 'My Skills' && <Skills />}
{activePage === 'Interviews' && <Interviews />}


{activePage === 'Profile' && <Profile />}
    


      </main>
    </div>
  )
}

export default App
