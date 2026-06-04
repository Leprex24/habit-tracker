export const isCompletedToday = (completions = []) => {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    return completions.some(date => {
        const d = new Date(date)
        d.setUTCHours(0, 0, 0, 0)
        return d.getTime() === today.getTime()
    })
}
