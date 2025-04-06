import { useState, useEffect } from 'react'
import axios from 'axios'

function Dashboard() {
    // State for app status toggle
    const [appStatus, setAppStatus] = useState(false)
    const nodeURL = "http://localhost:3000/"

    const token = localStorage.getItem("token");
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // State for start time form
    const [startTime, setStartTime] = useState({
        date: '',
        month: '',
        year: '',
        hour: '',
        minute: '',
    })
    const [startTimeMessage, setStartTimeMessage] = useState('')

    // State for deadline form
    const [deadline, setDeadline] = useState({
        date: '',
        month: '',
        year: '',
        hour: '',
        minute: '',
    })
    const [deadlineMessage, setDeadlineMessage] = useState('')

    // State for new admin form
    const [newAdmin, setNewAdmin] = useState({
        username: '',
        password: '',
    })
    const [adminMessage, setAdminMessage] = useState('')

    // useEffect(() => {
    //     axios.get(`${nodeURL}get-starttime`)
    //         .then(res => {
    //             console.log('Current start time:', res.data.starttime)
    //         })
    //         .catch(err => console.log('No current start time'))

    //     axios.get(`${nodeURL}get-deadline`)
    //         .then(res => {
    //             console.log('Current deadline:', res.data.deadline)
    //         })
    //         .catch(err => console.log('No current deadline'))
    // }, [nodeURL])

    // Handler for toggling app status
    const handleToggleStatus = async () => {
        if (appStatus) {
            await axios.get(`${nodeURL}turn-off-app`)
        } else {
            await axios.get(`${nodeURL}turn-on-app`)
        }
        setAppStatus(prev => !prev)
    }

    // Handler for start time submission
    const handleStartTimeSubmit = async (e) => {
        e.preventDefault()
        const payload = {
            date: Number(startTime.date),
            month: Number(startTime.month),
            year: Number(startTime.year),
            hour: Number(startTime.hour),
            minute: Number(startTime.minute),
        }
        try {
            const res = await axios.post(`${nodeURL}update-starttime`, payload)
            setStartTimeMessage(res.data.message)
        } catch (err) {
            setStartTimeMessage(err.response?.data.error || 'Error updating start time')
        }
    }

    // Handler for deadline submission
    const handleDeadlineSubmit = async (e) => {
        e.preventDefault()
        const payload = {
            date: Number(deadline.date),
            month: Number(deadline.month),
            year: Number(deadline.year),
            hour: Number(deadline.hour),
            minute: Number(deadline.minute),
        }
        try {
            const res = await axios.post(`${nodeURL}update-deadline`, payload)
            setDeadlineMessage(res.data.message)
        } catch (err) {
            setDeadlineMessage(err.response?.data.error || 'Error updating deadline')
        }
    }

    // Handler for creating new admin
    const handleNewAdminSubmit = async (e) => {
        e.preventDefault()
        if (!newAdmin.username || !newAdmin.password) {
            return
        }
        try {
            const res = await axios.post(`${nodeURL}create-admin`, newAdmin)
            setAdminMessage(res.data.message)
        } catch (err) {
            setAdminMessage(err.response?.data.error || 'Error creating admin')
        }
    }

    return (
        <div className="min-h-screen bg-[#F5E3C2] flex flex-col items-center py-10 w-screen text-[#3E2C1F]">
            <div className="w-full max-w-4xl bg-[#f2ebdc] shadow-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold text-center text-[#4c2c17] mb-8">Dashboard</h2>

                {/* App Status Toggle */}
                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-2 text-[#4c2c17]">App Status</h3>
                    <div className="flex items-center">
                        <span className="mr-4">{appStatus ? 'On' : 'Off'}</span>
                        <button
                            onClick={handleToggleStatus}
                            className="px-4 py-2 bg-[#0F3D3E] hover:bg-[#0D3536] text-white rounded 
                         transition duration-200"
                        >
                            Toggle Status
                        </button>
                    </div>
                </div>

                {/* Update Start Time */}
                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-2 text-[#4c2c17]">Set Start Time</h3>
                    <form onSubmit={handleStartTimeSubmit} className="grid grid-cols-5 gap-4">
                        {['date', 'month', 'year', 'hour', 'minute'].map((field) => {
                            const limits = {
                                date: { min: 1, max: 31 },
                                month: { min: 1, max: 12 },
                                hour: { min: 0, max: 23 },
                                minute: { min: 0, max: 59 },
                            }

                            return (
                                <input
                                    key={field}
                                    type="number"
                                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                    value={startTime[field]}
                                    onChange={(e) => setStartTime({ ...startTime, [field]: e.target.value })}
                                    className="col-span-1 p-2 border border-gray-300 rounded 
                             focus:outline-none focus:ring-2 focus:ring-[#0F3D3E]"
                                    required
                                    min={limits[field]?.min}
                                    max={limits[field]?.max}
                                />
                            )
                        })}
                        <button
                            type="submit"
                            className="col-span-5 mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white 
                         rounded transition duration-200"
                        >
                            Set Start Time
                        </button>
                    </form>
                    {startTimeMessage && (
                        <p className="mt-2 text-sm text-center text-green-600">{startTimeMessage}</p>
                    )}
                </div>

                {/* Update Deadline */}
                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-2 text-[#4c2c17]">Set Deadline</h3>
                    <form onSubmit={handleDeadlineSubmit} className="grid grid-cols-5 gap-4">
                        {['date', 'month', 'year', 'hour', 'minute'].map((field) => {
                            const limits = {
                                date: { min: 1, max: 31 },
                                month: { min: 1, max: 12 },
                                hour: { min: 0, max: 23 },
                                minute: { min: 0, max: 59 },
                            }

                            return (
                                <input
                                    key={field}
                                    type="number"
                                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                    value={deadline[field]}
                                    onChange={(e) => setDeadline({ ...deadline, [field]: e.target.value })}
                                    className="col-span-1 p-2 border border-gray-300 rounded 
                             focus:outline-none focus:ring-2 focus:ring-[#0F3D3E]"
                                    required
                                    min={limits[field]?.min}
                                    max={limits[field]?.max}
                                />
                            )
                        })}
                        <button
                            type="submit"
                            className="col-span-5 mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 
                         text-white rounded transition duration-200"
                        >
                            Set Deadline
                        </button>
                    </form>
                    {deadlineMessage && (
                        <p className="mt-2 text-sm text-center text-green-600">{deadlineMessage}</p>
                    )}
                </div>

                {/* Create New Admin */}
                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-2 text-[#4c2c17]">Create New Admin</h3>
                    <form onSubmit={handleNewAdminSubmit} className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Username"
                            value={newAdmin.username}
                            onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                            className="col-span-1 p-2 border border-gray-300 rounded 
                         focus:outline-none focus:ring-2 focus:ring-[#0F3D3E]"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={newAdmin.password}
                            onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                            className="col-span-1 p-2 border border-gray-300 rounded 
                         focus:outline-none focus:ring-2 focus:ring-[#0F3D3E]"
                            required
                        />
                        <button
                            type="submit"
                            className="col-span-2 mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 
                         text-white rounded transition duration-200"
                        >
                            Create Admin
                        </button>
                    </form>
                    {adminMessage && (
                        <p className="mt-2 text-sm text-center text-green-600">{adminMessage}</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Dashboard
