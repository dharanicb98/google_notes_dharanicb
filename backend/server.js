require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');
const crypto = require('crypto');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const secret = crypto.randomBytes(32).toString('hex');
console.log(`JWT_SECRET=${secret}` , "this jwt token");

const connectMongodb = async () => {
    let MONGODB_URI = 'mongodb://127.0.0.1:27017/notesapp' || process.env.MONGODB_URI; 
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.log('Error in MongoDB connection:', error);
    }
};

connectMongodb();

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
