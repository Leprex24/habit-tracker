require('dotenv').config();
const express = require('express');
const connectDB = require('./db');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();
connectDB();

app.use(express.json())
app.use(cors())

app.use('/api/auth', authRoutes)

app.get('/', (req, res) => {
    res.json({ message: "Habit Tracker API działa" })
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Serwer nasłuchuje na porcie ${PORT}`));