import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div style={{padding: '2rem'}}>
            <h1>Cześć, {user?.firstName}!</h1>
            <p>Tu będą Twoje nawyki.</p>
            <button onClick={handleLogout}>Wyloguj się</button>
        </div>
    )
}

export default Dashboard