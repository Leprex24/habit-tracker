const bcrypt = require('bcryptjs');
const { User, validate } = require('../models/User');
const Joi = require('joi');

const register = async (req, res) => {
    try {
        const {error} = validate(req.body)
        if (error) return res.status(400).json({ message: error.details[0].message })

        const exisitngUser = await User.findOne({ email: req.body.email })
        if (exisitngUser) return res.status(409).json({ message: "Użytkownik z tym emailem już istnieje" })

        const salt = await bcrypt.genSalt(Number(process.env.SALT) || 10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        const user = new User({ ...req.body, password: hashedPassword })
        await user.save()

        const token = user.generateAuthToken()
        res.status(201).json({ token, user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            },
        })
    } catch (err) {
        res.status(500).json({ message: 'Błąd serwera'})
    }
}

const login = async (req, res) => {
    try {
        const {error} = validateLogin(req.body)
        if (error) return res.status(400).json({ message: error.details[0].message })

        const user = await User.findOne({ email: req.body.email })
        if (!user) return res.status(401).json({ message: 'Nieprawidłowy email lub hasło' })

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if (!validPassword) return res.status(401).json({ message: 'Nieprawidłowy email lub hasło' })

        const token = user.generateAuthToken()
        res.status(200).json({ token, user:{
                _id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            }, })
    } catch (err) {
        res.status(500).json({ message: 'Błąd serwera' })
    }
}

const validateLogin = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label('Email'),
        password: Joi.string().required().label('Hasło'),
    })
    return schema.validate(data)
}

module.exports = { register, login}