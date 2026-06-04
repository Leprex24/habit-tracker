const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true })

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this.id }, process.env.JWT_SECRET, { expiresIn: '7d'})
}

const User = mongoose.model('User', userSchema)

const validate = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().required().label('Imię'),
        lastName: Joi.string().required().label('Nazwisko'),
        email: Joi.string().email().required().label('Email'),
        password: passwordComplexity().required().label('Hasło')
    })
    return schema.validate(data)
}

module.exports = { User, validate }