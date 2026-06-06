import {useState, useEffect} from 'react'
import api from '../api/axios'
import Navbar from '../components/Navbar'
import {getCurrentStreak, getLongestStreak, getLastNDays, getLastNWeeks, getLastNMonths } from '../utils/habitUtils'

const StatsPage = () => {
    const [habits, setHabits] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.get('/habits')
            .then(res => setHabits(res.data))
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <div><Navbar/><p style={{padding: '2rem'}}>Ładowanie...</p></div>

    if (habits.length === 0) return (
        <div>
            <Navbar/>
            <p style={{padding: '2rem', color: '#888'}}>Brak nawyków do wyświetlenia statystyk.</p>
        </div>
    )

    return (
        <div>
            <Navbar/>
            <div style={styles.container}>
                <h1 style={styles.title}>Statystyki</h1>

                {habits.map(habit => {
                    const current = getCurrentStreak(habit.completions)
                    const longest = getLongestStreak(habit.completions)
                    const total = habit.completions.length
                    const heatmapData = habit.frequency === 'weekly' ? getLastNWeeks(habit.completions, 12) : habit.frequency === 'monthly' ? getLastNMonths(habit.completions, 12) : getLastNDays(habit.completions, 30)
                    const heatmapLabel = habit.frequency === 'weekly' ? 'Ostatnie 12 tygodni' : habit.frequency === 'monthly' ? 'Ostatnie 12 miesięcy' : 'Ostatnie 30 dni'
                    const streakLabel = habit.frequency === 'weekly' ? 'Łącznie tygodni' : habit.frequency === 'monthly' ? 'Łącznie miesięcy' : 'Łącznie dni'

                    return (
                        <div key={habit._id} style={{...styles.card, borderLeft: `5px solid ${habit.color}`}}>
                            <div style={styles.cardHeader}>
                                <h3 style={styles.habitName}>{habit.name}</h3>
                                <span style={styles.freq}>
                  {habit.frequency === 'daily' ? 'codziennie' : habit.frequency === 'weekly' ? 'tygodniowo' : 'miesięcznie'}
                </span>
                            </div>

                            <div style={styles.counters}>
                                <div style={styles.counter}>
                                    <span style={{...styles.counterValue, color: habit.color}}>{current}</span>
                                    <span style={styles.counterLabel}>Aktualna passa</span>
                                </div>
                                <div style={styles.counter}>
                                    <span style={{...styles.counterValue, color: habit.color}}>{longest}</span>
                                    <span style={styles.counterLabel}>Najdłuższa passa</span>
                                </div>
                                <div style={styles.counter}>
                                    <span style={{...styles.counterValue, color: habit.color}}>{total}</span>
                                    <span style={styles.counterLabel}>{streakLabel}</span>
                                </div>
                            </div>

                            <p style={styles.heatmapLabel}>{heatmapLabel}</p>
                            <div style={styles.heatmap}>
                                {heatmapData.map(item => (
                                    <div
                                        key={item.timestamp}
                                        title={item.label || new Date(item.timestamp).toLocaleDateString('pl-PL')}
                                        style={{
                                            ...styles.dot,
                                            background: item.completed ? habit.color : '#e9ecef',
                                            width:  habit.frequency === 'monthly' ? '28px' : '18px',
                                            height: habit.frequency === 'monthly' ? '28px' : '18px',
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

const styles = {
    container: {maxWidth: '700px', margin: '2rem auto', padding: '0 1rem'},
    title: {marginBottom: '1.5rem'},
    card: {
        background: '#fff',
        borderRadius: '8px',
        padding: '1.25rem 1.5rem',
        marginBottom: '1rem',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
    },
    cardHeader: {display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'},
    habitName: {margin: 0},
    freq: {fontSize: '0.8rem', color: '#aaa'},
    counters: {display: 'flex', gap: '1.5rem', marginBottom: '1.25rem'},
    counter: {display: 'flex', flexDirection: 'column', alignItems: 'center'},
    counterValue: {fontSize: '2rem', fontWeight: 'bold', lineHeight: 1},
    counterLabel: {fontSize: '0.75rem', color: '#888', marginTop: '0.25rem', textAlign: 'center'},
    heatmapLabel: {margin: '0 0 0.5rem', fontSize: '0.85rem', color: '#888'},
    heatmap: {display: 'flex', gap: '3px', flexWrap: 'wrap'},
    dot: {width: '18px', height: '18px', borderRadius: '3px'},
}

export default StatsPage