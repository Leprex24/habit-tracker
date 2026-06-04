export const isCompletedToday = (completions = []) => {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    return completions.some(date => {
        const d = new Date(date)
        d.setUTCHours(0, 0, 0, 0)
        return d.getTime() === today.getTime()
    })
}

export const getCurrentStreak = (completions = []) => {
    if (completions.length === 0) return 0

    const dates = completions
        .map(d => { const x = new Date(d); x.setUTCHours(0,0,0,0); return x.getTime() })
        .filter((v, i, a) => a.indexOf(v) === i)
        .sort((a, b) => b - a)

    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)
    const yesterday = new Date(today)
    yesterday.setUTCHours(yesterday.getUTCDate() - 1)

    if (dates[0] !== today.getTime() && dates[0] !== yesterday.getTime()) return 0

    let streak = 1
    for (let i = 1; i < dates.length; i++) {
        const diff = dates[i - 1] - dates[i]
        if (diff === 86400000) {
            streak++
        } else {
            break
        }
    }
    return streak
}

export const getLongestStreak = (completions = []) => {
    if (completions.length === 0) return 0

    const dates = completions
        .map(d => { const x = new Date(d); x.setUTCHours(0,0,0,0); return x.getTime() })
        .filter((v, i, a) => a.indexOf(v) === i)
        .sort((a, b) => a - b)

    let longest = 1
    let current = 1
    for (let i = 1; i < dates.length; i++) {
        if (dates[i] - dates[i - 1] === 86400000) {
            current++
            if (current > longest) longest = current
        } else {
            current = 1
        }
    }
    return longest
}

export const isDateCompleted = (completions = [], timestamp) => {
    return completions.some(date => {
        const d = new Date(date)
        d.setUTCHours(0, 0, 0, 0)
        return d.getTime() === timestamp
    })
}

export const getLastNDays = (completions = [], n = 30) => {
    const days = []
    for (let i = n - 1; i >= 0; i--) {
        const d = new Date()
        d.setUTCHours(0, 0, 0, 0)
        d.setUTCDate(d.getUTCDate() - i)
        days.push({
            timestamp: d.getTime(),
            completed: isDateCompleted(completions, d.getTime())
        })
    }
    return days
}