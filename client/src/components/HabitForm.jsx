import {useState, useEffect} from 'react'

const COLORS = ['#6c63ff', '#ff6584', '#43b89c', '#f9a825', '#e53935', '#1e88e5']

const HabitForm = ({onSubmit, onCancel, initial}) => {
    const [data, setData] = useState({
        name: '', description: '', color: '#6c63ff', frequency: 'daily'
    })

    useEffect(() => {
        if (initial) setData(initial)
    }, [initial])

    const handleChange = ({target}) => {
        setData({...data, [target.name]: target.value})
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!data.name.trim()) return
        onSubmit({
            name: data.name,
            description: data.description || '',
            color: data.color,
            frequency: data.frequency,
        })
    }

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h3 style={{marginTop: 0}}>{initial ? 'Edytuj nawyk' : 'Nowy nawyk'}</h3>
                <form onSubmit={handleSubmit}>
                    <label style={styles.label}>Nazwa *</label>
                    <input
                        style={styles.input}
                        name="name"
                        value={data.name}
                        onChange={handleChange}
                        placeholder="np. Bieganie"
                        required
                    />

                    <label style={styles.label}>Opis</label>
                    <input
                        style={styles.input}
                        name="description"
                        value={data.description}
                        onChange={handleChange}
                        placeholder="opcjonalny opis"
                    />

                    <label style={styles.label}>Częstotliwość</label>
                    <select style={styles.input} name="frequency" value={data.frequency} onChange={handleChange}>
                        <option value="daily">Codziennie</option>
                        <option value="weekly">Tygodniowo</option>
                        <option value="monthly">Miesięcznie</option>
                    </select>

                    <label style={styles.label}>Kolor</label>
                    <div style={styles.colors}>
                        {COLORS.map(c => (
                            <div
                                key={c}
                                onClick={() => setData({...data, color: c})}
                                style={{...styles.colorDot(c), outline: data.color === c ? `3px solid ${c}` : 'none'}}
                            />
                        ))}
                    </div>

                    <div style={styles.buttons}>
                        <button type="button" onClick={onCancel} style={styles.cancelBtn}>Anuluj</button>
                        <button type="submit" style={styles.submitBtn}>
                            {initial ? 'Zapisz' : 'Dodaj nawyk'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

const styles = {
    overlay: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100
    },
    modal: {background: '#fff', padding: '2rem', borderRadius: '12px', width: '400px', maxWidth: '90vw'},
    label: {display: 'block', marginBottom: '0.25rem', fontWeight: '500', fontSize: '0.9rem'},
    input: {
        display: 'block',
        width: '100%',
        padding: '0.6rem',
        marginBottom: '1rem',
        borderRadius: '4px',
        border: '1px solid #ddd',
        boxSizing: 'border-box'
    },
    colors: {display: 'flex', gap: '0.5rem', marginBottom: '1.5rem'},
    colorDot: (c) => ({
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        background: c,
        cursor: 'pointer',
        outlineOffset: '2px'
    }),
    buttons: {display: 'flex', gap: '0.75rem', justifyContent: 'flex-end'},
    cancelBtn: {
        padding: '0.6rem 1.25rem',
        borderRadius: '4px',
        border: '1px solid #ddd',
        background: '#fff',
        cursor: 'pointer'
    },
    submitBtn: {
        padding: '0.6rem 1.25rem',
        borderRadius: '4px',
        border: 'none',
        background: '#6c63ff',
        color: '#fff',
        cursor: 'pointer'
    },
}

export default HabitForm