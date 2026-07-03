const express = require('express');
const dns = require('dns');

// Configure DNS fallback if the local resolver is misconfigured
const dnsServers = dns.getServers();
if (dnsServers.length === 0 || dnsServers.includes('127.0.0.1') || dnsServers.includes('::1')) {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
}

const mongoose = require('mongoose');
const cors = require('cors'); // 1. Import the CORS security package

const app = express();
const PORT = 5000;

// MIDDLEWARE
app.use(cors()); // 2. Turn on CORS (allows Aniket's port 5173 to connect)
app.use(express.json()); // 3. Tells your server to read incoming JSON data automatically

// DATABASE CONNECTION
const dbURI = 'mongodb+srv://mountainup5126:bella601602@fridgely.tbrf70p.mongodb.net/fridgely?retryWrites=true&w=majority';

mongoose.connect(dbURI)
    .then(() => console.log("🚀 Connected to MongoDB Cloud successfully!"))
    .catch((err) => console.error("❌ Database connection error:", err));


// 4. DATA BLUEPRINT (What an ingredient looks like in MongoDB)
const IngredientSchema = new mongoose.Schema({
    name: { type: String, required: true }
});
const Ingredient = mongoose.model('Ingredient', IngredientSchema);


// 5. API ROUTES (The pathways Aniket will use)

// Route A: Fetch all ingredients from the database (GET)
app.get('/api/ingredients', async (req, res) => {
    try {
        const items = await Ingredient.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route B: Add a new ingredient to the database (POST)
app.post('/api/ingredients', async (req, res) => {
    try {
        const newItem = new Ingredient({ name: req.body.name });
        const savedItem = await newItem.save(); // Saves it to the cloud!
        res.json(savedItem); // Sends it back to the frontend to confirm
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Test Route
app.get('/api/test', (req, res) => {
    res.json({ message: "Hey Aniket! The backend is working perfectly!" });
});

app.listen(PORT, () => {
    console.log(`Server is running smoothly on http://localhost:${PORT}`);
});