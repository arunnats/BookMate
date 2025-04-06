import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Login({ setIsAuthenticated }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('http://localhost:3000/login-admin', {
                username,
                password,
            })

            if (response.status === 200) {
                localStorage.setItem("token", response.data.token)
                setIsAuthenticated(true)
                navigate('/dashboard')
            }
        } catch (err) {
            setError('Invalid credentials')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F5E3C2] w-screen">
            <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-xl shadow-lg text-[#3E2C1F]">
                <h2 className="text-3xl font-bold text-center text-[#0F3D3E]">Admin</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[#0F3D3E]">Username</label>
                        <input
                            type="text"
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-[#0F3D3E] focus:outline-none 
                         text-[#3E2C1F]"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#0F3D3E]">Password</label>
                        <input
                            type="password"
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-[#0F3D3E] focus:outline-none 
                         text-[#3E2C1F]"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-[#0F3D3E] hover:bg-[#0D3536] text-white font-semibold 
                       py-2 rounded-lg transition duration-200"
                    >
                        Log In
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login
