
import { useState } from 'react'
import api from './api/axios'

function Register({ onRegister }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
    college: '',
    graduation_year: '',
    target_role: '',
  })

  const [error, setError] = useState('')

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  async function handleRegister(e) {
    e.preventDefault()
    setError('')

    try {
      await api.post('users/register/', {
        ...formData,
        graduation_year: formData.graduation_year || null,
      })

      alert('Registration successful! Please log in.')
      onRegister()
    } catch (error) {
      console.error('Registration error:', error.response?.data || error)
      setError('Registration failed. Check your details and try again.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Create <span className="text-blue-600">Account</span>
        </h1>

        <p className="text-slate-500 mb-6">
          Register for SkillSync
        </p>

        {[
          { name: 'username', placeholder: 'Username', type: 'text' },
          { name: 'email', placeholder: 'Email', type: 'email' },
          { name: 'password', placeholder: 'Password', type: 'password' },
          { name: 'full_name', placeholder: 'Full Name', type: 'text' },
          { name: 'college', placeholder: 'College', type: 'text' },
          { name: 'graduation_year', placeholder: 'Graduation Year', type: 'number' },
          { name: 'target_role', placeholder: 'Target Role', type: 'text' },
        ].map((field) => (
          <input
            key={field.name}
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
            value={formData[field.name]}
            onChange={handleChange}
            minLength={field.name === 'password' ? 8 : undefined}
            className="w-full border p-3 rounded-lg mb-4"
            required={field.name === 'username' || field.name === 'email' || field.name === 'password'}
          />
        ))}

        {error && (
          <p className="text-red-600 text-sm mb-4">{error}</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
        >
          Register
        </button>

        <button
          type="button"
          onClick={onRegister}
          className="w-full mt-3 text-blue-600 hover:underline"
        >
          Back to Login
        </button>
      </form>
    </div>
  )
}

export default Register
