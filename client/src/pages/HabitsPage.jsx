import {useState, useEffect} from 'react'
import api from '../api/axios'
import Navbar from '../components/Navbar'
import HabitForm from '../components/HabitForm'

const HabitsPage = () => {
    const [habits, setHabits] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [editingHabit, setEditing] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchHabits()
    }, [])

    const fetchHabits = async () => {
        try {
            const res = await api.get('/habits')
            setHabits(res.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleAdd = async (data) => {
        try {
            const res = await api.post('/habits', data)
            setHabits([res.data, ...habits])
            setShowForm(false)
        } catch (err) {
            console.error(err)
        }
    }

    const handleEdit = async (data) => {
        try {
            const res = await api.put(`/habits/${editingHabit._id}`, data)
            setHabits(habits.map(h => h._id === editingHabit._id ? res.data : h))
            setEditing(null)
        } catch (err) {
            console.error(err)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Na pewno usunąć ten nawyk?')) return
        try {
            await api.delete(`/habits/${id}`)
            setHabits(habits.filter(h => h._id !== id))
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div>
            <Navbar/>
            <div style={styles.container}>
                <div style={styles.header}>
                    <h1 style={{margin: 0}}>Moje nawyki</h1>
                    <button onClick={() => setShowForm(true)} style={styles.addBtn}>+ Dodaj nawyk</button>
                </div>

                {loading && <p>Ładowanie...</p>}

                {!loading && habits.length === 0 && (
                    <p style={styles.empty}>Nie masz jeszcze żadnych nawyków.</p>
                )}

                <div style={styles.list}>
                    {habits.map(habit => (
                        <div key={habit._id} style={{...styles.card, borderLeft: `5px solid ${habit.color}`}}>
                            <div style={styles.info}>
                                <p style={styles.name}>{habit.name}</p>
                                {habit.description && <p style={styles.desc}>{habit.description}</p>}
                                <span style={styles.freq}>
                  {habit.frequency === 'daily' ? 'codziennie' : habit.frequency === 'weekly' ? 'tygodniowo' : 'miesięcznie'}
                </span>
                            </div>
                            <div style={styles.actions}>
                                <button
                                    onClick={() => setEditing(habit)}
                                    style={styles.editBtn}
                                >Edytuj
                                </button>
                                <button
                                    onClick={() => handleDelete(habit._id)}
                                    style={styles.deleteBtn}
                                >Usuń
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showForm && (
                <HabitForm
                    onSubmit={handleAdd}
                    onCancel={() => setShowForm(false)}
                />
            )}

            {editingHabit && (
                <HabitForm
                    initial={editingHabit}
                    onSubmit={handleEdit}
                    onCancel={() => setEditing(null)}
                />
            )}
        </div>
    )
}

const styles = {
    container: {maxWidth: '700px', margin: '2rem auto', padding: '0 1rem'},
    header: {display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'},
    addBtn: {
        background: '#6c63ff',
        color: '#fff',
        border: 'none',
        padding: '0.6rem 1.25rem',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '500'
    },
    empty: {color: '#888'},
    list: {display: 'flex', flexDirection: 'column', gap: '0.75rem'},
    card: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#fff',
        padding: '1rem 1.25rem',
        borderRadius: '8px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
    },
    info: {flex: 1},
    name: {margin: '0 0 0.25rem', fontWeight: '500'},
    desc: {margin: '0 0 0.25rem', color: '#888', fontSize: '0.85rem'},
    freq: {fontSize: '0.8rem', color: '#aaa'},
    actions: {display: 'flex', gap: '0.5rem'},
    editBtn: {
        padding: '0.4rem 0.9rem',
        borderRadius: '4px',
        border: '1px solid #6c63ff',
        color: '#6c63ff',
        background: '#fff',
        cursor: 'pointer'
    },
    deleteBtn: {
        padding: '0.4rem 0.9rem',
        borderRadius: '4px',
        border: '1px solid #e53935',
        color: '#e53935',
        background: '#fff',
        cursor: 'pointer'
    },
}

export default HabitsPage