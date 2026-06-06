const Habit = require('../models/Habit')
const Joi = require('joi')

const getHabits = async (req, res) => {
    try {
        const habits = await Habit.find({ userId: req.user._id }).sort({ createdAt: -1 })
        res.status(200).json(habits)
    } catch (error) {
        res.status(500).json({ message: 'Błąd serwera' })
    }
}

const createHabit = async (req, res) => {
    try {
        const { error } = validateHabit(req.body)
        if (error) return res.status(400).json({ message: error.details[0].message })

        const habit = new Habit({
            userId: req.user._id,
            name: req.body.name,
            description: req.body.description,
            color: req.body.color,
            frequency: req.body.frequency
        })

        await habit.save()
        res.status(201).json(habit)
    } catch (error) {
        console.error('createHabit error:',error.message)
        res.status(500).json({ message: 'Błąd serwera' })
    }
}

const updateHabit = async (req, res) => {
    try {
        const { error } = validateHabit(req.body)
        if (error) return res.status(400).json({ message: error.details[0].message })

        const habit = await Habit.findOne({ _id: req.params.id, userId: req.user._id })
        if (!habit) return res.status(404).json({ message: 'Nawyk nie znaleziony' })

        habit.name = req.body.name
        habit.description = req.body.description
        habit.color = req.body.color
        habit.frequency = req.body.frequency

        await habit.save()
        res.status(200).json(habit)
    } catch (error) {
        res.status(500).json({ message: 'Błąd serwera' })
    }
}

const deleteHabit = async (req, res) => {
    try {
        const habit = await Habit.findOneAndDelete({ _id: req.params.id, userId: req.user._id })
        if (!habit) return res.status(404).json({ message: 'Nawyk nie znaleziony' })

        res.status(200).json({ message: 'Nawyk usunięty' })
    } catch (error) {
        res.status(500).json({ message: 'Błąd serwera' })
    }
}

const toggleComplete = async (req, res) => {
    try {
        const habit = await Habit.findOne({ _id: req.params.id, userId: req.user._id })
        if (!habit) return res.status(404).json({ message: 'Nawyk nie znaleziony' })

        if (habit.frequency === 'weekly') {
            const weekStart = new Date()
            weekStart.setUTCHours(0,0,0,0)
            const day = weekStart.getUTCDay()
            weekStart.setUTCDate(weekStart.getUTCDate() - (day === 0 ? 6 : day - 1))

            const weekEnd = new Date(weekStart)
            weekEnd.setUTCDate(weekEnd.getUTCDay() + 6)
            weekEnd.setUTCHours(23, 59, 59, 999)

            const doneThisWeek = habit.completions.some(date => {
                const d = new Date(date)
                return d>= weekStart && d <= weekEnd
            })

            if (doneThisWeek) {
                habit.compltions = habit.completions.filter(date => {
                    const d = new Date(date)
                    return d < weekStart || d > weekEnd
                })
            } else {
                const today = new Date()
                today.setUTCHours(0,0,0,0)
                habit.completions.push(today)
            }
        } else if (habit.frequency === 'monthly') {
            const now = new Date()
            const year = now.getUTCFullYear()
            const month = now.getUTCMonth()

            const doneThisMonth = habit.completions.some(date => {
                const d = new Date(date)
                return d.getUTCFullYear() === year && d.getUTCMonth() === month
            })

            if (doneThisMonth) {
                habit.completions = habit.completions.filter(date => {
                    const d = new Date(date)
                    return !(d.getUTCFullYear() === year && d.getUTCMonth() === month)
                })
            } else {
                const today = new Date()
                today.setUTCHours(0,0,0,0)
                habit.completions.push(today)
            }
        } else {
            const today = new Date();
            today.setUTCHours(0, 0, 0, 0)

            const alreadyDone = habit.completions.some(date => {
                const d = new Date(date)
                d.setUTCHours(0, 0, 0, 0)
                return d.getTime() === today.getTime()
            })

            if (alreadyDone) {
                habit.completions = habit.completions.filter(date => {
                    const d = new Date(date)
                    d.setUTCHours(0, 0, 0, 0)
                    return d.getTime() !== today.getTime()
                })
            } else {
                habit.completions.push(today)
            }
        }

        await habit.save()
        res.status(200).json(habit)
    } catch (errot) {
        res.status(500).json({ message: 'Błąd serwera' })
    }
}

const validateHabit = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(1).max(100).required().label('Nazwa'),
        description: Joi.string().max(300).allow('').label('Opis'),
        color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).label('Kolor'),
        frequency: Joi.string().valid('daily', 'weekly', 'monthly').label('Częstotliwość')
    })
    return schema.validate(data)
}

module.exports = { getHabits, createHabit, updateHabit, deleteHabit, toggleComplete}