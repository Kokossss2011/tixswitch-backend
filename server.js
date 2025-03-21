const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost/tixswitch', { useNewUrlParser: true, useUnifiedTopology: true });

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const ListingSchema = new mongoose.Schema({
    name: String,
    price: Number,
    imageUrl: String,
    seller: String
});

const MessageSchema = new mongoose.Schema({
    sender: String,
    receiver: String,
    message: String
});

const User = mongoose.model('User', UserSchema);
const Listing = mongoose.model('Listing', ListingSchema);
const Message = mongoose.model('Message', MessageSchema);

// Routes
// User registration
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send('Username already taken!');
        }
        const user = new User({ username, password });
        await user.save();
        res.status(201).send('Account created! Please log in.');
    } catch (error) {
        res.status(500).send('Server error!');
    }
});

// User login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username, password });
        if (!user) {
            return res.status(400).send('Invalid login credentials!');
        }
        res.status(200).send('Logged in successfully!');
    } catch (error) {
        res.status(500).send('Server error!');
    }
});

// Get all listings
app.get('/listings', async (req, res) => {
    try {
        const listings = await Listing.find();
        res.json(listings);
    } catch (error) {
        res.status(500).send('Server error!');
    }
});

// Create a new listing
app.post('/create-listing', async (req, res) => {
    const { name, price, imageUrl, seller } = req.body;
    try {
        const newListing = new Listing({ name, price, imageUrl, seller });
        await newListing.save();
        res.status(201).send('Listing created successfully!');
    } catch (error) {
        res.status(500).send('Server error!');
    }
});

// Send a message
app.post('/send-message', async (req, res) => {
    const { sender, receiver, message } = req.body;
    try {
        const newMessage = new Message({ sender, receiver, message });
        await newMessage.save();
        res.status(201).send('Message sent!');
    } catch (error) {
        res.status(500).send('Server error!');
    }
});

// Get messages
app.get('/messages/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const messages = await Message.find({
            $or: [{ sender: username }, { receiver: username }]
        });
        res.json(messages);
    } catch (error) {
        res.status(500).send('Server error!');
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
