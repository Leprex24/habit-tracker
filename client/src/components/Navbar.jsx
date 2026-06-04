import { Link, useNavigate } from "react-router-dom"
import { useAuth} from "../context/AuthContext"

const Navbar = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <nav style={styles.nav}>
            <span style={styles.logo}>HabitTracker</span>
            <div style={styles.links}>
                <Link to="/" style={styles.link}>Dzisiaj</Link>
                <Link to="/habits" style={styles.link}>Moje nawyki</Link>
                <Link to="/stats" style={styles.link}>Statystyki</Link>
                <span style={styles.user}>Hej, {user?.firstName}</span>
                <button onClick={handleLogout} style={styles.btn}>Wyloguj</button>
            </div>
        </nav>
    )
}

const styles = {
    nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: '#6c63ff', color: '#fff' },
    logo: { fontSize: '1.2rem', fontWeight: 'bold' },
    links: { display: 'flex', alignItems: 'center', gap: '1.5rem' },
    link: { color: '#fff', textDecoration: 'none', fontWeight: '500' },
    user: { opacity: 0.85 },
    btn: { background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.5)', padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer' },
}

export default Navbar