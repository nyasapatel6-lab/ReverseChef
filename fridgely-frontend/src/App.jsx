import React, { useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.headers.common['Bypass-Tunnel-Reminder'] = 'true';

function App() {
  const [nameInput, setNameInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [myFridge, setMyFridge] = useState([]);
  const [recipes, setRecipes] = useState([]);

  // Fetch all data from Nyasa's server when the dashboard boots up
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const fridgeRes = await axios.get('https://forty-animals-fry.loca.lt/api/ingredients');
      setMyFridge(fridgeRes.data);

      const recipeRes = await axios.get('https://forty-animals-fry.loca.lt/api/recipes/match');
      setRecipes(recipeRes.data);
    } catch (error) {
      console.error("Error updating dashboard data:", error);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!nameInput.trim() || !dateInput) return alert("Please enter both an ingredient name and an expiry date!");

    try {
      await axios.post('https://forty-animals-fry.loca.lt/api/ingredients', {
        name: nameInput,
        expiryDate: dateInput
      });
      setNameInput("");
      setDateInput("");
      loadDashboardData(); // Refresh list and recipes dynamically
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`https://forty-animals-fry.loca.lt/api/ingredients/${id}`);
      loadDashboardData(); // Refresh list and recipes instantly
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // Helper function to color code expiry status visually
  const getExpiryBadgeStyle = (dateStr) => {
    const daysLeft = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 0) return { bg: '#ffcdd2', text: '#b71c1c', label: 'Expired' };
    if (daysLeft <= 3) return { bg: '#fff9c4', text: '#f57f17', label: `${daysLeft} days left` };
    return { bg: '#c8e6c9', text: '#2e7d32', label: `${daysLeft} days left` };
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Segoe UI, sans-serif', maxWidth: '900px', margin: '0 auto', display: 'flex', gap: '30px' }}>

      {/* LEFT COLUMN: Input Control & Inventory Tracker */}
      <div style={{ flex: 1, minWidth: '350px' }}>
        <h1 style={{ color: '#2e7d32', marginBottom: '5px' }}>🥗 Fridgely Control Center</h1>
        <p style={{ color: '#666', fontSize: '14px', marginTop: '0', marginBottom: '25px' }}>Smart Anti-Waste Hostel Tracker</p>

        {/* Form Input Setup */}
        <form onSubmit={handleAddItem} style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '25px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '13px' }}>Ingredient Name</label>
            <input
              type="text"
              placeholder="e.g. Tomato, Paneer, Milk"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              style={{ padding: '10px', width: '93%', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '13px' }}>Expiry Date</label>
            <input
              type="date"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              style={{ padding: '10px', width: '93%', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <button type="submit" style={{ padding: '12px', backgroundColor: '#2e7d32', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginTop: '5px' }}>
            📥 Secure Item inside Fridge
          </button>
        </form>

        {/* Dynamic Shelf Display */}
        <h3>My Inventory (Sorted by Expiry):</h3>
        <div style={{ maxHeight: '350px', overflowY: 'auto', background: '#f9f9f9', padding: '15px', borderRadius: '8px', border: '1px solid #eee' }}>
          {myFridge.length === 0 ? <p style={{ color: '#999', textAlign: 'center' }}>Fridge is empty. Add ingredients above!</p> : null}
          {myFridge.map((item) => {
            const badge = getExpiryBadgeStyle(item.expiryDate);
            return (
              <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '12px', borderRadius: '6px', marginBottom: '10px', borderLeft: `5px solid ${badge.text}`, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div>
                  <span style={{ textTransform: 'capitalize', fontWeight: '600' }}>{item.name}</span>
                  <span style={{ marginLeft: '10px', fontSize: '11px', padding: '3px 8px', borderRadius: '12px', backgroundColor: badge.bg, color: badge.text, fontWeight: 'bold' }}>{badge.label}</span>
                </div>
                <button onClick={() => handleDeleteItem(item._id)} style={{ border: 'none', background: 'none', color: '#d32f2f', cursor: 'pointer', fontSize: '16px' }}>🗑️</button>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT COLUMN: The AI Recipe Recommendation Desk */}
      <div style={{ flex: 1.2 }}>
        <h2 style={{ color: '#1565c0', marginTop: '10px' }}>🍽️ Cooking Suggestions Engine</h2>
        <p style={{ color: '#666', fontSize: '14px' }}>Real-time match scoring based on your active items:</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
          {recipes.length === 0 ? (
            <div style={{ background: '#e3f2fd', padding: '20px', borderRadius: '8px', textAlign: 'center', color: '#0d47a1' }}>
              ℹ️ No direct recipe matches yet. Try adding <strong>Tomato</strong>, <strong>Onion</strong>, <strong>Paneer</strong>, or <strong>Rice</strong> to test the tracking library engine.
            </div>
          ) : null}

          {recipes.map((recipe) => (
            <div key={recipe._id} style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.08)', border: '1px solid #e0e0e0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ margin: '0', color: '#333' }}>{recipe.title}</h3>
                <span style={{ fontSize: '13px', padding: '4px 10px', borderRadius: '4px', backgroundColor: recipe.matchPercentage === 100 ? '#e8f5e9' : '#fff3e0', color: recipe.matchPercentage === 100 ? '#2e7d32' : '#e65100', fontWeight: 'bold' }}>
                  {recipe.matchPercentage}% Match
                </span>
              </div>

              <div style={{ fontSize: '13px', color: '#555' }}>
                <strong>Required:</strong> {recipe.ingredientsRequired.join(', ')}
              </div>

              {recipe.missingIngredients.length > 0 ? (
                <div style={{ fontSize: '13px', color: '#c62828', marginTop: '6px' }}>
                  ⚠️ <strong>Missing:</strong> {recipe.missingIngredients.join(', ')}
                </div>
              ) : (
                <div style={{ fontSize: '13px', color: '#2e7d32', marginTop: '6px', fontWeight: '600' }}>
                  ✅ You have all ingredients! Ready to cook.
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default App;