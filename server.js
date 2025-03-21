const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();

// Load environment variables from a .env file
dotenv.config();

// Body parser middleware to parse JSON requests
app.use(express.json());

// MongoDB connection string from environment variables or local connection for development
const dbURI = process.env.MONGO_URI || 'mongodb://localhost:27017/tixswitch';

// Connect to MongoDB using mongoose
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

// Basic route to test server is running
app.get('/', (req, res) => {
    res.send('Server is running');
});

// Example of a more detailed route to demonstrate MongoDB data fetching
app.get('/data', async (req, res) => {
    try {
        // Example: Replace with actual MongoDB operations
        const data = await SomeModel.find(); // Assuming you have a model named SomeModel
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// Handle errors for undefined routes
app.all('*', (req, res) => {
    res.status(404).send('Route not found');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
