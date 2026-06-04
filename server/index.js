require('dotenv').config();
const express = require('express');
const connectDB = require('./db');
const cors = require('cors');

const app = express();
connectDB();

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.json({ message: "Habit Tracker API is running" })
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));