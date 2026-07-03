const express = require('express');
const dns = require('dns');

// Configure DNS fallback if the local resolver is misconfigured
const dnsServers = dns.getServers();
if (dnsServers.length === 0 || dnsServers.includes('127.0.0.1') || dnsServers.includes('::1')) {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
}

const mongoose = require('mongoose');
const cors = require('cors'); // Import the CORS security package

const app = express();
const PORT = 5000;

// MIDDLEWARE
app.use(cors()); // Turn on CORS (allows Aniket's port 5173 to connect)
app.use(express.json()); // Tells your server to read incoming JSON data automatically

// DATABASE CONNECTION
const dbURI = 'mongodb+srv://mountainup5126:bella601602@fridgely.tbrf70p.mongodb.net/fridgely?retryWrites=true&w=majority';

mongoose.connect(dbURI)
    .then(() => {
        console.log("🚀 Connected to MongoDB Cloud successfully!");
        seedRecipes(); // Seed default recipes if database is empty
    })
    .catch((err) => console.error("❌ Database connection error:", err));

// 1. DATA BLUEPRINTS (Schemas)
const IngredientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    expiryDate: { type: Date, required: true } // Keeps track of expiration dates
});
const Ingredient = mongoose.model('Ingredient', IngredientSchema);

// Blueprint for a recipe in our collection
const RecipeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    ingredientsRequired: [{ type: String }] // e.g., ["rice", "tomato", "onion"]
});
const Recipe = mongoose.model('Recipe', RecipeSchema);

// Helper function to automatically add sample recipes to your cloud DB if it's empty
async function seedRecipes() {
    try {
        const count = await Recipe.countDocuments();
        if (count === 0) {
            const sampleDishes = [
                { title: "Jeera Rice", ingredientsRequired: ["rice", "jeera", "oil"] },
                { title: "Paneer Bhurji", ingredientsRequired: ["paneer", "onion", "tomato", "chilli"] },
                { title: "Classic Maggi", ingredientsRequired: ["maggi", "water", "onion", "tomato"] },
                { title: "Tomato Rice", ingredientsRequired: ["rice", "tomato", "onion"] }
            ];
            await Recipe.insertMany(sampleDishes);
            console.log("📚 Recipe library seeded successfully!");
        }
    } catch (err) {
        console.error("❌ Seeding error:", err);
    }
}

// 2. API ROUTES
// Route A: Fetch all inventory items sorted by closest expiry date
app.get('/api/ingredients', async (req, res) => {
    try {
        const items = await Ingredient.find().sort({ expiryDate: 1 });
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route B: Add a new ingredient
app.post('/api/ingredients', async (req, res) => {
    try {
        const newItem = new Ingredient({ 
            name: req.body.name.toLowerCase().trim(),
            expiryDate: new Date(req.body.expiryDate)
        });
        const savedItem = await newItem.save();
        res.json(savedItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route C: Delete an item (when eaten or thrown away)
app.delete('/api/ingredients/:id', async (req, res) => {
    try {
        await Ingredient.findByIdAndDelete(req.params.id);
        res.json({ message: "Item removed from fridge." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CORE ENGINE ROUTE: Match recipes based on active ingredients in the fridge
app.get('/api/recipes/match', async (req, res) => {
    try {
        // 1. Fetch whatever ingredients are currently inside the user's fridge
        const userIngredients = await Ingredient.find();
        const availableNames = userIngredients.map(item => item.name.toLowerCase());

        // 2. Fetch our library of recipes
        const allRecipes = await Recipe.find();

        // 3. Loop through recipes and calculate what matches and what is missing
        const calculation = allRecipes.map(recipe => {
            const missing = recipe.ingredientsRequired.filter(reqIng => !availableNames.includes(reqIng));
            const matchPercentage = ((recipe.ingredientsRequired.length - missing.length) / recipe.ingredientsRequired.length) * 100;
            
            return {
                _id: recipe._id,
                title: recipe.title,
                ingredientsRequired: recipe.ingredientsRequired,
                missingIngredients: missing,
                matchPercentage: Math.round(matchPercentage)
            };
        });

        // 4. Return only recipes where the user has at least ONE matching ingredient, highest match first
        const recommended = calculation
            .filter(item => item.matchPercentage > 0)
            .sort((a, b) => b.matchPercentage - a.matchPercentage);

        res.json(recommended);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running smoothly on http://localhost:${PORT}`);
});