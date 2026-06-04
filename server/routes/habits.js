const router = require('express').Router()
const verifyToken = require('../middleware/auth')
const { getHabits, createHabit, updateHabit, deleteHabit, toggleComplete } = require('../controllers/habitController')

router.get('/', verifyToken, getHabits)
router.post('/', verifyToken, createHabit)
router.put('/:id', verifyToken, updateHabit)
router.delete('/:id', verifyToken, deleteHabit)
router.post('/:id/complete', verifyToken, toggleComplete)

module.exports = router