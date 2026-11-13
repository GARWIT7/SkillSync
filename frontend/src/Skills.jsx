
import { useState, useEffect } from 'react'
import api from './api/axios'

function Skills() {
    const [skills, setSkills] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [retry, setRetry] = useState(0)
    const [skillName, setSkillName] = useState('')
    const [proficiency, setProficiency] = useState('BEGINNER')
    const [editingId, setEditingId] = useState(null)
    const [editProficiency, setEditProficiency] = useState('BEGINNER')



function handleEdit(skill) {
  setEditingId(skill.id)
  setEditProficiency(skill.proficiency)
}

async function handleSaveEdit(id) {
  try {
    const response = await api.patch(
      `skills/${id}/`,
      { proficiency: editProficiency }
    )

    setSkills(
      skills.map((skill) =>
        skill.id === id ? response.data : skill
      )
    )

    setEditingId(null)

  } catch (error) {
    console.error('Error updating skill:', error.response?.data || error)
    alert('Could not update skill.')
  }
}



async function handleDelete(id) {
  try {
    await api.delete(`skills/${id}/`)

    setSkills(
      skills.filter((skill) => skill.id !== id)
    )
  } catch (error) {
    console.error(
      'Error deleting skill:',
      error.response?.data || error
    )
    alert('Could not delete skill.')
  }
}



async function handleSubmit(e) {
  e.preventDefault()

  const skillData = {
    skill_name: skillName,
    proficiency: proficiency,
  }

  try {
    const response = await api.post('skills/', skillData)

    setSkills([...skills, response.data])

    setSkillName('')
    setProficiency('BEGINNER')
  } catch (error) {
    console.error(
      'Error adding skill:',
      error.response?.data || error
    )
    alert('Could not add skill.')
  }
}




  useEffect(() => {
  async function fetchSkills() {
  try {
    setLoading(true)
    setError('')

    const response = await api.get('skills/')
    setSkills(response.data)

  } catch (error) {
    console.error('Error fetching skills:', error)
    setError('Failed to load skills. Please try again.')

  } finally {
    setLoading(false)
  }
}

    fetchSkills()
  }, [retry])

return (
  <div className="p-4 md:p-8">
    {loading ? (
      <div className="flex justify-center items-center py-20">
        <p className="text-slate-500 text-lg">
          Loading skills...
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
      <h1 className="text-3xl font-bold text-slate-800">
        My Skills
      </h1>

      <p className="text-slate-500 mt-2 mb-8">
        Track your technical skills and proficiency.
      </p>



<form
  onSubmit={handleSubmit}
  className="bg-white p-4 md:p-6 rounded-xl shadow mb-6"
>
  <h2 className="text-xl font-bold mb-4">
    Add a New Skill
  </h2>

  <input
    type="text"
    placeholder="Enter skill (e.g. Java, Python, React)"
    value={skillName}
    onChange={(e) => setSkillName(e.target.value)}
    className="w-full border p-3 rounded-lg mb-4"
    required
  />

  <select
    value={proficiency}
    onChange={(e) => setProficiency(e.target.value)}
    className="w-full border p-3 rounded-lg mb-4"
  >
    <option value="BEGINNER">Beginner</option>
    <option value="INTERMEDIATE">Intermediate</option>
    <option value="ADVANCED">Advanced</option>
  </select>

  <button
    type="submit"
    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
  >
    Add Skill
  </button>
</form>




      <div className="bg-white p-4 md:p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">
          Your Skills ({skills.length})
        </h2>

        {skills.length === 0 ? (
          <p className="text-slate-500">
            No skills added yet.
          </p>
        ) : (
          <div className="space-y-3">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="border p-4 rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
              >
               <span className="font-medium break-words">
  {skill.skill_name}
</span>

                

<div className="flex flex-wrap items-center gap-3">

  {editingId === skill.id ? (
    <>
      <select
        value={editProficiency}
        onChange={(e) => setEditProficiency(e.target.value)}
        className="border rounded-lg p-2"
      >
        <option value="BEGINNER">Beginner</option>
        <option value="INTERMEDIATE">Intermediate</option>
        <option value="ADVANCED">Advanced</option>
      </select>

      <button
        onClick={() => handleSaveEdit(skill.id)}
        className="text-green-600 hover:text-green-800"
      >
        Save
      </button>

      <button
        onClick={() => setEditingId(null)}
        className="text-gray-500 hover:text-gray-700"
      >
        Cancel
      </button>
    </>
  ) : (
    <>
      <span className="text-blue-600">
        {skill.proficiency}
      </span>

      <button
        onClick={() => handleEdit(skill)}
        className="text-blue-600 hover:text-blue-800"
      >
        Edit
      </button>
    </>
  )}

  <button
    onClick={() => handleDelete(skill.id)}
    className="text-red-600 hover:text-red-800"
  >
    Delete
  </button>

</div>




              </div>
            ))}
          </div>
        )}
      </div>
       </>
    )}
    </div>
  )
}

export default Skills

