
import { useState } from 'react'
import api from './api/axios'

function Login({ onLogin, onShowRegister }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    setError('')

    try {
      const response = await api.post('users/login/', {
        username,
        password,
      })

      localStorage.setItem('accessToken', response.data.access)
      localStorage.setItem('refreshToken', response.data.refresh)

      onLogin()
    } catch (error) {
  console.log('Login error:', error.response?.data)
  console.log('Status:', error.response?.status)

  setError('Login failed. Check the browser console.')
}
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Skill<span className="text-blue-600">Sync</span>
        </h1>

        <p className="text-slate-500 mb-6">
          Login to your account
        </p>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4"
          required
        />

        {error && (
          <p className="text-red-600 text-sm mb-4">{error}</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
        >
          Login
        </button>
        <button
  type="button"
  onClick={onShowRegister}
  className="w-full mt-3 text-blue-600 hover:underline"
>
  Create an account
</button>
      </form>
    </div>
  )
}

export default Login
