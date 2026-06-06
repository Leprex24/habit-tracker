import { useState, useEffect } from 'react'
import api from '../api/axios'
import Navbar from "../components/Navbar"
import { isCompletedInPeriod } from "../utils/habitUtils"

const Dashboard = () => {
    const [loading, setLoading] = useState(true)
    const [habits, setHabits] = useState([])

    useEffect(() => {
        fetchHabits()
    }, [])

    const fetchHabits = async () => {
        try {
            const res = await api.get(`/habits`)
            setHabits(res.data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleToggle = async (id) => {
        if (!id) return
        try {
            const res = await api.post(`/habits/${id}/complete`)
            setHabits(prev => prev.map(h => h._id === id ? res.data : h))
        } catch (error) {
            console.error('Toggle error:', error.response?.data?.message || error.message)
        }
    }

    const today = new Date().toLocaleDateString('pl-PL', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    })

    return (
        <div>
            <Navbar />
            <div style={styles.container}>
                <h2 style={styles.date}>{today}</h2>
                <h1 style={styles.title}>Dzisiejsze nawyki</h1>

                {loading && <p>Ładowanie...</p>}

                {!loading && habits.length === 0 && (
                    <p style={styles.empty}>Brak nawyków. <a href="/habits">Dodaj pierwszy nawyk</a></p>
                )}

                <div style={styles.list}>
                    {habits.filter(h => h?._id).map(habit => {
                        const done = isCompletedInPeriod(habit.completions, habit.frequency)
                        return (
                            <div key={habit._id} style={{
                                ...styles.card,
                                borderLeft: `5px solid ${habit.color}`,
                                opacity: done ? 0.6 : 1
                            }} onClick={() => handleToggle(habit._id)} >
                                <div style={styles.checkbox(done, habit.color)}>
                                    {done && '✓'}
                                </div>
                                <div>
                                    <p style={{
                                        ...styles.name,
                                        textDecoration: done ? 'line-through' : 'none'
                                    }}>
                                        {habit.name}
                                    </p>
                                    {habit.description && (
                                        <p style={styles.desc}>{habit.description}</p>
                                    )}
                                </div>
                                <span style={styles.freq}>
                                    {habit.frequency === 'daily' ? 'codziennie' : habit.frequency === 'weekly' ? 'tygodniowo' : 'miesięcznie'}
                                </span>
                            </div>
                        )
                    })}
                </div>

                {habits.length > 0 && (
                    <p style={styles.summary}>
                        {habits.filter(h => isCompletedInPeriod(h.completions, h.frequency)).length} / {habits.length} ukończonych dziś
                    </p>
                )}
            </div>
        </div>
    )
}

const styles = {
    container: { maxWidth: '700px', margin: '2rem auto', padding: '0 1rem' },
    date: { color: '#888', fontWeight: 'normal', marginBottom: '0.25rem' },
    title: { marginTop: 0, marginBottom: '1.5rem' },
    empty: { color: '#888' },
    list: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
    card: { display: 'flex', alignItems: 'center', gap: '1rem', background: '#fff', padding: '1rem 1.25rem', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', cursor: 'pointer', transition: 'opacity 0.2s' },
    checkbox: (done, color) => ({ width: '24px', height: '24px', borderRadius: '50%', border: `2px solid ${color}`, background: done ? color : 'transparent', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 'bold', fontSize: '0.8rem' }),
    name: { margin: 0, fontWeight: '500' },
    desc: { margin: '0.25rem 0 0', color: '#888', fontSize: '0.85rem' },
    freq: { marginLeft: 'auto', fontSize: '0.8rem', color: '#aaa', whiteSpace: 'nowrap' },
    summary: { textAlign: 'center', marginTop: '2rem', color: '#888' },
}

export default Dashboard