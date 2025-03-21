// Load environment variables
require('dotenv').config();

// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import models
const User = require('./models/User');
const Listing = require('./models/Listing');
const Message = require('./models/Message');

// Initialize the app
const app = express();

// Set up PORT and Mongo URI from environment variables
const PORT = process.env.PORT || 3978;
const MONGO_URI = process.env.MONGO_URI;

// Middleware for CORS and JSON parsing
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection setup
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Routes for user registration and login
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = new User({ username, password });
        await user.save();
        res.status(201).send("User registered successfully!");
    } catch (error) {
        res.status(400).send(error.message);
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username, password });
        if (user) {
            res.status(200).send("Login successful!");
        } else {
            res.status(400).send("Invalid credentials.");
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Routes for managing listings
app.post('/listing', async (req, res) => {
    const { name, price, imageUrl, sellerId } = req.body;
    try {
        const listing = new Listing({ name, price, imageUrl, seller: sellerId });
        await listing.save();
        res.status(201).send("Listing created successfully!");
    } catch (error) {
        res.status(400).send(error.message);
    }
});

app.get('/listings', async (req, res) => {
    try {
        const listings = await Listing.find().populate('seller');
        res.status(200).json(listings);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Routes for messaging
app.post('/message', async (req, res) => {
    const { senderId, receiverId, message } = req.body;
    try {
        const newMessage = new Message({ sender: senderId, receiver: receiverId, message });
        await newMessage.save();
        res.status(201).send("Message sent successfully!");
    } catch (error) {
        res.status(400).send(error.message);
    }
});

app.get('/messages/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const messages = await Message.find({
            $or: [{ sender: userId }, { receiver: userId }]
        }).populate('sender receiver');
        res.status(200).json(messages);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
