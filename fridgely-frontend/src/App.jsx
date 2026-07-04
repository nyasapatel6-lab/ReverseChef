import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Leaf, 
  Milk, 
  Beef, 
  Fish, 
  Egg, 
  Apple, 
  Flame, 
  Soup, 
  Cookie, 
  Utensils, 
  Trash2, 
  Calendar,
  Sparkles,
  Inbox,
  CheckCircle,
  AlertTriangle,
  Plus
} from 'lucide-react';

const BASE_URL = import.meta.env.VITE_API_URL;

function App() {
  const [nameInput, setNameInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [myFridge, setMyFridge] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load everything when the website first fires up
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const fridgeRes = await axios.get(`${BASE_URL}/api/ingredients`);
      setMyFridge(fridgeRes.data);

      const recipeRes = await axios.get(`${BASE_URL}/api/recipes/match`);
      setRecipes(recipeRes.data);
    } catch (error) {
      console.error("Error updating dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!nameInput.trim() || !dateInput) return alert("Please fill out both fields!");

    try {
      await axios.post(`${BASE_URL}/api/ingredients`, {
        name: nameInput,
        expiryDate: dateInput
      });
      setNameInput("");
      setDateInput("");
      loadDashboardData(); // Refresh inventory lists and recipe logic together
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/ingredients/${id}`);
      loadDashboardData(); // Refresh instantly
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // Helper function to visually color code the urgency level of expiring foods
  const getExpiryBadgeStyle = (dateStr) => {
    const expiry = new Date(dateStr);
    expiry.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    
    // Assume typical shelf-life max of 14 days for progress bar
    const progressPercent = daysLeft <= 0 ? 0 : Math.min(100, (daysLeft / 14) * 100);

    if (daysLeft <= 0) {
      return {
        badgeClass: 'bg-red-50 text-[#DC2626] border border-red-100',
        borderClass: 'border-red-200/50',
        iconBgClass: 'bg-red-50 text-[#DC2626]',
        progressClass: 'bg-[#DC2626]',
        label: 'Expired',
        daysLeft,
        progressPercent,
      };
    }
    if (daysLeft <= 3) {
      return {
        badgeClass: 'bg-amber-50 text-[#D97706] border border-amber-100',
        borderClass: 'border-amber-200/50',
        iconBgClass: 'bg-amber-50 text-[#D97706]',
        progressClass: 'bg-[#D97706]',
        label: daysLeft === 1 ? '1 day left' : `${daysLeft} days left`,
        daysLeft,
        progressPercent,
      };
    }
    return {
      badgeClass: 'bg-emerald-50 text-[#059669] border border-emerald-100',
      borderClass: 'border-emerald-200/50',
      iconBgClass: 'bg-emerald-50 text-[#059669]',
      progressClass: 'bg-[#059669]',
      label: `${daysLeft} days left`,
      daysLeft,
      progressPercent,
    };
  };

  // Helper to map ingredients to clean Lucide icons
  const getIngredientIcon = (name) => {
    const lowercaseName = name.toLowerCase();
    
    if (lowercaseName.includes('milk') || lowercaseName.includes('cheese') || lowercaseName.includes('paneer') || lowercaseName.includes('butter') || lowercaseName.includes('yogurt') || lowercaseName.includes('cream') || lowercaseName.includes('dairy') || lowercaseName.includes('dahi') || lowercaseName.includes('tofu')) {
      return <Milk className="w-5 h-5" />;
    }
    if (lowercaseName.includes('beef') || lowercaseName.includes('meat') || lowercaseName.includes('pork') || lowercaseName.includes('chicken') || lowercaseName.includes('lamb') || lowercaseName.includes('bacon') || lowercaseName.includes('steak') || lowercaseName.includes('turkey') || lowercaseName.includes('ham') || lowercaseName.includes('salami')) {
      return <Beef className="w-5 h-5" />;
    }
    if (lowercaseName.includes('fish') || lowercaseName.includes('salmon') || lowercaseName.includes('tuna') || lowercaseName.includes('shrimp') || lowercaseName.includes('seafood') || lowercaseName.includes('crab') || lowercaseName.includes('lobster') || lowercaseName.includes('prawn')) {
      return <Fish className="w-5 h-5" />;
    }
    if (lowercaseName.includes('egg')) {
      return <Egg className="w-5 h-5" />;
    }
    if (lowercaseName.includes('apple') || lowercaseName.includes('banana') || lowercaseName.includes('orange') || lowercaseName.includes('grape') || lowercaseName.includes('strawberry') || lowercaseName.includes('mango') || lowercaseName.includes('fruit') || lowercaseName.includes('peach') || lowercaseName.includes('berry') || lowercaseName.includes('lemon') || lowercaseName.includes('lime') || lowercaseName.includes('watermelon') || lowercaseName.includes('pineapple')) {
      return <Apple className="w-5 h-5" />;
    }
    if (lowercaseName.includes('tomato') || lowercaseName.includes('onion') || lowercaseName.includes('garlic') || lowercaseName.includes('leaf') || lowercaseName.includes('salad') || lowercaseName.includes('lettuce') || lowercaseName.includes('spinach') || lowercaseName.includes('veg') || lowercaseName.includes('carrot') || lowercaseName.includes('cucumber') || lowercaseName.includes('potato') || lowercaseName.includes('broccoli') || lowercaseName.includes('cabbage') || lowercaseName.includes('herb') || lowercaseName.includes('ginger') || lowercaseName.includes('coriander') || lowercaseName.includes('mint') || lowercaseName.includes('cilantro')) {
      return <Leaf className="w-5 h-5" />;
    }
    if (lowercaseName.includes('chili') || lowercaseName.includes('spicy') || lowercaseName.includes('hot') || lowercaseName.includes('pepper') || lowercaseName.includes('spice') || lowercaseName.includes('masala')) {
      return <Flame className="w-5 h-5" />;
    }
    if (lowercaseName.includes('soup') || lowercaseName.includes('broth') || lowercaseName.includes('sauce') || lowercaseName.includes('gravy') || lowercaseName.includes('curry')) {
      return <Soup className="w-5 h-5" />;
    }
    if (lowercaseName.includes('bread') || lowercaseName.includes('wheat') || lowercaseName.includes('rice') || lowercaseName.includes('pasta') || lowercaseName.includes('grain') || lowercaseName.includes('flour') || lowercaseName.includes('cereal') || lowercaseName.includes('oats') || lowercaseName.includes('cookie') || lowercaseName.includes('biscuit') || lowercaseName.includes('roti') || lowercaseName.includes('tortilla') || lowercaseName.includes('naan')) {
      return <Cookie className="w-5 h-5" />;
    }
    return <Utensils className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#1F2937] font-sans antialiased py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center w-full">
      <div className="max-w-6xl w-full mx-auto flex flex-col lg:flex-row gap-8 items-start">
        
        {/* LEFT COLUMN: Input Control & Shelf Inventory */}
        <div className="flex-1 w-full lg:max-w-md space-y-6">
          
          {/* Header Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-4 border border-slate-100">
            <div className="p-3 bg-emerald-50 rounded-xl text-[#059669]">
              <Utensils className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1F2937] tracking-tight">
                Fridgely Control Center
              </h1>
              <p className="text-xs font-semibold text-[#4B5563] uppercase tracking-wider mt-0.5">
                Smart Anti-Waste Hostel Tracker
              </p>
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleAddItem} className="flex flex-col gap-5 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-[#1F2937] border-b border-slate-100 pb-2 flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#059669]" /> Add New Ingredient
            </h2>
            
            {/* Floating Label - Ingredient Name */}
            <div className="relative">
              <input
                type="text"
                id="nameInput"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder=" "
                className="peer block w-full px-4 pt-6 pb-2 text-sm text-[#1F2937] bg-[#F9FAFB] border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#059669] focus:border-[#059669] transition-all placeholder-transparent"
              />
              <label
                htmlFor="nameInput"
                className={`absolute text-xs font-bold uppercase tracking-wider duration-150 transform origin-[0] left-4 top-4 z-10 pointer-events-none transition-all
                  ${nameInput ? 'scale-85 -translate-y-3 text-[#059669]' : 'scale-100 translate-y-0 text-[#4B5563] peer-focus:scale-85 peer-focus:-translate-y-3 peer-focus:text-[#059669]'}
                `}
              >
                Ingredient Name
              </label>
            </div>
            
            {/* Floating Label - Expiry Date */}
            <div className="relative">
              <input
                type="date"
                id="dateInput"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                placeholder=" "
                className="peer block w-full px-4 pt-6 pb-2 text-sm text-[#1F2937] bg-[#F9FAFB] border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#059669] focus:border-[#059669] transition-all placeholder-transparent"
              />
              <label
                htmlFor="dateInput"
                className={`absolute text-xs font-bold uppercase tracking-wider duration-150 transform origin-[0] left-4 top-4 z-10 pointer-events-none transition-all
                  ${dateInput ? 'scale-85 -translate-y-3 text-[#059669]' : 'scale-100 translate-y-0 text-[#4B5563] peer-focus:scale-85 peer-focus:-translate-y-3 peer-focus:text-[#059669]'}
                `}
              >
                Expiry Date
              </label>
            </div>
            
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 25
              }}
              className="w-full mt-2 py-3.5 bg-[#059669] hover:bg-[#047857] active:bg-[#065f46] text-white font-bold rounded-lg shadow-sm hover:shadow transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 text-sm border-none"
            >
              <Inbox className="w-4 h-4" /> Secure Item inside Fridge
            </motion.button>
          </form>

          {/* Shelf Inventory - Card Deck */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
            <h3 className="text-md font-bold text-[#1F2937] flex items-center justify-between">
              <span>My Inventory</span>
              <span className="text-xs bg-[#F9FAFB] border border-slate-200 text-[#4B5563] px-2.5 py-0.5 rounded-full font-medium">
                Sorted by Expiry
              </span>
            </h3>
            
            <div className="max-h-[380px] overflow-y-auto space-y-3 pr-1">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#059669]"></div>
                  <p className="text-xs text-[#4B5563] mt-3 font-semibold text-center">Loading inventory...</p>
                </div>
              ) : myFridge.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-400 text-sm">Fridge is empty.</p>
                  <p className="text-slate-500 text-xs mt-1">Add ingredients above to start tracking!</p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {myFridge.map((item, index) => {
                    const badge = getExpiryBadgeStyle(item.expiryDate);
                    return (
                      <motion.div
                        key={item._id}
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 25,
                          y: { delay: index * 0.04 }
                        }}
                        className={`bg-[#F9FAFB] border border-slate-100 p-4 rounded-xl flex flex-col justify-between hover:shadow-sm transition-all duration-200`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-xl ${badge.iconBgClass} border border-slate-200/50`}>
                              {getIngredientIcon(item.name)}
                            </div>
                            <div className="flex flex-col">
                              <span className="capitalize font-bold text-[#1F2937] text-sm">
                                {item.name}
                              </span>
                              <span className="text-[10px] text-[#4B5563] font-medium">
                                Added Ingredient
                              </span>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleDeleteItem(item._id)}
                            className="p-1.5 hover:bg-slate-200/50 rounded-lg text-[#4B5563] hover:text-[#DC2626] transition-colors duration-150 cursor-pointer"
                            title="Delete item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${badge.badgeClass}`}>
                            {badge.label}
                          </span>
                          <span className="text-[10px] text-[#4B5563] flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#4B5563]" />
                            {new Date(item.expiryDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}
                          </span>
                        </div>

                        {/* Freshness progress bar */}
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-3.5">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${badge.progressClass}`}
                            style={{ width: `${badge.progressPercent}%` }}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Cooking Suggestions Panel */}
        <div className="flex-[1.2] w-full bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-[#1F2937] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#059669] animate-pulse" /> Cooking Suggestions Engine
            </h2>
            <p className="text-sm text-[#4B5563] mt-1">
              Real-time match scoring based on your active items:
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#059669]"></div>
                <p className="text-sm text-[#4B5563] mt-4 font-semibold text-center">
                  Connecting to suggestions engine...
                </p>
              </div>
            ) : recipes.length === 0 ? (
              <div className="bg-[#F9FAFB] border border-slate-200 p-6 rounded-2xl text-center text-[#4B5563] leading-relaxed shadow-sm">
                <span className="block text-xl mb-1 text-slate-400">ℹ</span>
                No direct recipe matches yet. Try adding <strong className="text-[#059669]">Tomato</strong>, <strong className="text-[#059669]">Onion</strong>, <strong className="text-[#059669]">Paneer</strong>, or <strong className="text-[#059669]">Rice</strong> to test the tracking library engine.
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {recipes.map((recipe, index) => {
                  const radius = 16;
                  const circumference = 2 * Math.PI * radius;
                  const strokeDashoffset = circumference - (recipe.matchPercentage / 100) * circumference;
                  
                  return (
                    <motion.div
                      key={recipe._id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 25,
                        y: { delay: index * 0.05 }
                      }}
                      className="bg-[#F9FAFB] border border-slate-100 p-5 rounded-xl hover:shadow-sm transition duration-200 space-y-4"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-[#1F2937] text-base lg:text-lg">
                          {recipe.title}
                        </h3>
                        
                        {/* High-contrast circular match indicator */}
                        <div className="relative flex items-center justify-center w-12 h-12 shrink-0">
                          <svg className="w-12 h-12 transform -rotate-90">
                            <circle
                              cx="24"
                              cy="24"
                              r={radius}
                              stroke="currentColor"
                              strokeWidth="3"
                              fill="transparent"
                              className="text-slate-200"
                            />
                            <circle
                              cx="24"
                              cy="24"
                              r={radius}
                              stroke={recipe.matchPercentage === 100 ? "#059669" : "#D97706"}
                              strokeWidth="3.5"
                              fill="transparent"
                              strokeDasharray={circumference}
                              strokeDashoffset={strokeDashoffset}
                              strokeLinecap="round"
                              className="transition-all duration-500"
                            />
                          </svg>
                          <span className="absolute text-[10px] font-black text-[#1F2937]">
                            {recipe.matchPercentage}%
                          </span>
                        </div>
                      </div>
                      
                      {/* Required Ingredients tags */}
                      <div className="space-y-2">
                        <span className="block text-[10px] font-bold text-[#4B5563] uppercase tracking-wider">
                          Required Ingredients
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {recipe.ingredientsRequired.map((ing, idx) => {
                            const isMissing = recipe.missingIngredients.includes(ing);
                            return (
                              <span 
                                key={idx} 
                                className={`text-xs px-2.5 py-1 rounded-lg border font-medium capitalize flex items-center gap-1.5 transition-all ${
                                  isMissing 
                                    ? 'bg-white text-[#4B5563]/60 border-slate-250 line-through decoration-slate-350' 
                                    : 'bg-white text-[#1F2937] border-slate-200'
                                }`}
                              >
                                {!isMissing && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                                )}
                                {isMissing && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                )}
                                {ing}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                      
                      {/* Missing Ingredients alerts / status */}
                      {recipe.missingIngredients.length > 0 ? (
                        <div className="pt-3 border-t border-slate-200">
                          <div className="text-[10px] font-bold text-[#DC2626] flex items-center gap-1.5 mb-2 uppercase tracking-wider">
                            <AlertTriangle className="w-3.5 h-3.5 text-[#DC2626] shrink-0" />
                            <span>Missing Ingredients</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {recipe.missingIngredients.map((ing, idx) => (
                              <span 
                                key={idx} 
                                className="text-xs px-2.5 py-1 bg-white text-[#1F2937] rounded-lg border border-slate-200 flex items-center gap-1.5 font-semibold capitalize shadow-sm"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
                                {ing}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="pt-3 border-t border-slate-200">
                          <div className="text-xs text-[#059669] flex items-center gap-1.5 font-bold px-3 py-2 bg-emerald-50 rounded-xl border border-emerald-100 w-fit">
                            <CheckCircle className="w-4 h-4 text-[#059669] shrink-0" />
                            <span>Ready to cook! You have all ingredients.</span>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;