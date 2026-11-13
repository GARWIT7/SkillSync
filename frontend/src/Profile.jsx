import { useState, useEffect } from 'react'
import api from './api/axios'


function Profile() {
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    full_name: '',
    college: '',
    graduation_year: '',
    target_role: '',
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0) 
  const [saving, setSaving] = useState(false) 

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true)
      setError('')
      try {
        const response = await api.get('users/profile/')
        setProfile(response.data)
      } catch (error) {
        console.error('Error fetching profile:', error.response?.data || error)
        setError('Failed to load profile. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [retry])


async function handleSave() {
  try {
    setSaving(true)
    const response = await api.patch('users/profile/', {
      full_name: profile.full_name,
      email: profile.email,
      college: profile.college,
      graduation_year: profile.graduation_year || null,
      target_role: profile.target_role,
    })

    setProfile(response.data)
    alert('Profile updated successfully!')
  } catch (error) {
    console.error('Error updating profile:', error.response?.data || error)
    alert('Could not update profile.')
  }finally {
  setSaving(false)
}
}



  if (loading) {
    return <p className="text-slate-500">Loading profile...</p>
  }
  if (error) {
  return (
    <div className="text-center py-10">
      <p className="text-red-600 text-lg mb-4">{error}</p>

      <button
  onClick={() => setRetry(retry + 1)}
  className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
>
  Retry
</button>
    </div>
  )
}

  return (
    <div className="bg-white p-4 md:p-8 rounded-xl shadow-sm">
      <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-6">
        My Profile
      </h2>

     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

        <div>
          <label className="block text-sm font-medium mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={profile.full_name}
            onChange={(e) =>
              setProfile({ ...profile, full_name: e.target.value })
            }
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Username
          </label>
          <input
            type="text"
            value={profile.username}
            disabled
            className="w-full border rounded-lg p-3 bg-slate-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) =>
              setProfile({ ...profile, email: e.target.value })
            }
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            College
          </label>
          <input
            type="text"
            value={profile.college}
            onChange={(e) =>
              setProfile({ ...profile, college: e.target.value })
            }
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Graduation Year
          </label>
          <input
            type="number"
            value={profile.graduation_year ?? ''}
            onChange={(e) =>
              setProfile({ ...profile, graduation_year: e.target.value })
            }
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Target Role
          </label>
          <input
            type="text"
            value={profile.target_role}
            onChange={(e) =>
              setProfile({ ...profile, target_role: e.target.value })
            }
            className="w-full border rounded-lg p-3"
          />
        </div>

            </div>

      <button
        onClick={handleSave}
        className="mt-6 w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        Save Changes
      </button>
    </div>
  )
}

export default Profile