import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth} from "../context/AuthContext"

const Login = () => {
    const [data, setData] = useState({ email: '', password: ''})
    const [error, setError] = useState('')
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleChange = ({ target }) => {
        setData({ ...data, [target.name]: target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            const res = await api.post('/auth/login', data)
            login(res.data.user, res.data.token)
            navigate('/')
        } catch (error) {
            if (error.response?.status >= 400 && error.response?.status < 500) {
                setError(error.response.data.message)
            }
        }
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2>Zaloguj się</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        style={styles.input}
                        type="email"
                        name="email"
                        placeholder="E-mail"
                        value={data.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        style={styles.input}
                        type="password"
                        name="password"
                        placeholder="Hasło"
                        value={data.password}
                        onChange={handleChange}
                        required
                    />
                    {error && <p style={styles.error}>{error}</p>}
                    <button style={styles.button} type="submit">Zaloguj się</button>
                </form>
                <p>Nie masz konta? <Link to="/register">Zarejestruj się</Link></p>
            </div>
        </div>
    )
}

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' },
    card: { background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '360px' },
    input: { display: 'block', width: '100%', padding: '0.6rem', marginBottom: '1rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' },
    button: { width: '100%', padding: '0.7rem', background: '#6c63ff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    error: { color: 'red', marginBottom: '1rem', fontSize: '0.9rem' },
}

export default Login