import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Heart, Footprints, Droplets, Apple, Weight, StretchHorizontal,
  Plus, Check, TrendingUp, Flame, Activity
} from 'lucide-react';

// --- Types ---
interface Exercise {
  name: string;
  duration: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  description: string;
  benefits: string;
}

interface WeightEntry {
  date: string;
  weight: number;
}

// --- Sample Data ---
const dailyExercises: Exercise[] = [
  { name: 'Morning Stretch', duration: '10 min', difficulty: 'Easy', description: 'Gentle full-body stretches to wake up your muscles.', benefits: 'Improves flexibility and reduces stiffness' },
  { name: 'Chair Yoga', duration: '15 min', difficulty: 'Easy', description: 'Seated yoga poses perfect for seniors.', benefits: 'Enhances balance and joint mobility' },
  { name: 'Brisk Walk', duration: '20 min', difficulty: 'Moderate', description: 'A steady-paced walk around the neighborhood.', benefits: 'Boosts cardiovascular health' },
  { name: 'Arm & Leg Lifts', duration: '10 min', difficulty: 'Moderate', description: 'Simple resistance exercises using your own body weight.', benefits: 'Builds strength and bone density' },
];

const stretchingRoutines = [
  { name: 'Neck Rolls', duration: '2 min', description: 'Slowly roll your head in a circle to release neck tension.', benefit: 'Reduces neck stiffness' },
  { name: 'Shoulder Rolls', duration: '2 min', description: 'Roll shoulders forward and backward to loosen up.', benefit: 'Improves upper body mobility' },
  { name: 'Hamstring Stretch', duration: '3 min', description: 'Sit on a chair and gently extend one leg forward, leaning slightly.', benefit: 'Prevents lower back pain' },
  { name: 'Cat-Cow Stretch', duration: '3 min', description: 'On hands and knees, alternate arching and rounding your back.', benefit: 'Relieves back tension' },
  { name: 'Ankle Circles', duration: '2 min', description: 'Rotate each ankle clockwise and counter-clockwise.', benefit: 'Improves ankle flexibility and balance' },
];

const recipes = [
  { name: 'Oatmeal with Berries', prep: '10 min', calories: 320, ingredients: ['1/2 cup oats', '1 cup almond milk', '1/2 cup mixed berries', '1 tbsp honey'], benefits: 'Heart-healthy fiber and antioxidants' },
  { name: 'Grilled Salmon Salad', prep: '20 min', calories: 420, ingredients: ['4oz salmon', '2 cups mixed greens', 'Cherry tomatoes', 'Olive oil & lemon'], benefits: 'Omega-3s for brain and joint health' },
  { name: 'Veggie Stir-Fry', prep: '15 min', calories: 280, ingredients: ['Broccoli', 'Bell peppers', 'Carrots', 'Tofu or chicken', 'Low-sodium soy sauce'], benefits: 'Packed with vitamins and plant protein' },
  { name: 'Greek Yogurt Parfait', prep: '5 min', calories: 240, ingredients: ['1 cup Greek yogurt', 'Granola', 'Sliced banana', 'Drizzle of honey'], benefits: 'Probiotics for gut health, calcium for bones' },
];

const Health = () => {
  const navigate = useNavigate();

  // Walking Tracker
  const [stepsGoal] = useState(7000);
  const [stepsToday, setStepsToday] = useState(5200);
  const [stepsInput, setStepsInput] = useState('');

  // Hydration
  const [waterGoal] = useState(8);
  const [waterCups, setWaterCups] = useState(3);

  // Weight Tracking
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([
    { date: 'Jun 1', weight: 165 },
    { date: 'Jun 7', weight: 164.5 },
    { date: 'Jun 14', weight: 163.8 },
    { date: 'Jun 21', weight: 163 },
  ]);
  const [showWeightInput, setShowWeightInput] = useState(false);
  const [newWeight, setNewWeight] = useState('');

  const addSteps = () => {
    const s = parseInt(stepsInput);
    if (!isNaN(s) && s > 0) {
      setStepsToday(prev => prev + s);
      setStepsInput('');
    }
  };

  const addWater = () => {
    if (waterCups < waterGoal) setWaterCups(prev => prev + 1);
  };

  const addWeightEntry = () => {
    const w = parseFloat(newWeight);
    if (!isNaN(w) && w > 0) {
      const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      setWeightEntries(prev => [...prev, { date: today, weight: w }].slice(-10));
      setNewWeight('');
      setShowWeightInput(false);
    }
  };

  const stepsPercent = Math.min(100, Math.round((stepsToday / stepsGoal) * 100));
  const waterPercent = Math.min(100, Math.round((waterCups / waterGoal) * 100));
  const maxWeight = Math.max(...weightEntries.map(e => e.weight)) + 5;
  const minWeight = Math.min(...weightEntries.map(e => e.weight)) - 5;

  const [activeTab, setActiveTab] = useState<'exercise' | 'walking' | 'hydration' | 'recipes' | 'weight' | 'stretching'>('exercise');

  const tabs = [
    { id: 'exercise' as const, label: 'Exercise', icon: Activity },
    { id: 'walking' as const, label: 'Walking', icon: Footprints },
    { id: 'hydration' as const, label: 'Water', icon: Droplets },
    { id: 'recipes' as const, label: 'Recipes', icon: Apple },
    { id: 'weight' as const, label: 'Weight', icon: Weight },
    { id: 'stretching' as const, label: 'Stretch', icon: StretchHorizontal },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 text-lg font-medium transition-colors"
      >
        <ArrowLeft size={24} /> Back to Dashboard
      </button>

      <header className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3">
          <Heart size={36} className="text-rose-500" />
          Health & Wellness
          <span className="gold-badge ml-3">Golden Years</span>
        </h1>
        <p className="text-xl text-slate-600 mt-2">
          Track your daily wellness, stay active, and feel your best.
        </p>
      </header>

      {/* Quick Stats Banner */}
      <section className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-3xl p-6 mb-8 text-white shadow-lg">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <Footprints size={32} className="mx-auto mb-1" />
            <div className="text-3xl font-bold">{stepsToday.toLocaleString()}</div>
            <div className="text-sm opacity-90">Steps Today</div>
          </div>
          <div>
            <Droplets size={32} className="mx-auto mb-1" />
            <div className="text-3xl font-bold">{waterCups}/{waterGoal}</div>
            <div className="text-sm opacity-90">Water Cups</div>
          </div>
          <div>
            <TrendingUp size={32} className="mx-auto mb-1" />
            <div className="text-3xl font-bold">
              {weightEntries.length > 0 ? weightEntries[weightEntries.length - 1].weight : '—'} lb
            </div>
            <div className="text-sm opacity-90">Current Weight</div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 rounded-2xl text-lg font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-slate-600 border-2 border-slate-100 hover:border-blue-200 hover:text-blue-600'
            }`}
          >
            <tab.icon size={24} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Exercise Tab */}
      {activeTab === 'exercise' && (
        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Flame className="text-orange-500" size={28} />
            Today's Exercise Suggestions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dailyExercises.map((ex, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-2xl font-bold text-slate-900">{ex.name}</h3>
                  <span className={`px-4 py-1 rounded-full text-sm font-bold ${
                    ex.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                    ex.difficulty === 'Moderate' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {ex.difficulty}
                  </span>
                </div>
                <p className="text-lg text-slate-600 mb-3">{ex.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-slate-500">⏱ {ex.duration}</span>
                  <span className="text-base text-emerald-600 font-medium">✨ {ex.benefits}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Walking Tab */}
      {activeTab === 'walking' && (
        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Footprints className="text-blue-500" size={28} />
            Walking Tracker
          </h2>
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-bold text-slate-600">Daily Goal: {stepsGoal.toLocaleString()} steps</span>
              <span className="text-xl font-bold text-slate-600">{stepsToday.toLocaleString()} steps</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-8 mb-2 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
                style={{ width: `${stepsPercent}%` }}
              />
            </div>
            <p className="text-lg text-slate-500 mb-6">{stepsPercent}% of daily goal reached</p>

            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-lg font-bold text-slate-700 mb-2">Add Steps</label>
                <input
                  type="number"
                  value={stepsInput}
                  onChange={(e) => setStepsInput(e.target.value)}
                  placeholder="Enter steps walked"
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xl focus:border-blue-500 focus:outline-none"
                />
              </div>
              <button
                onClick={addSteps}
                className="bg-blue-600 text-white px-8 py-4 rounded-2xl text-xl font-bold shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2"
              >
                <Plus size={24} /> Add
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Hydration Tab */}
      {activeTab === 'hydration' && (
        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Droplets className="text-blue-400" size={28} />
            Hydration Tracker
          </h2>
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <div className="text-center mb-8">
              <div className="text-6xl font-bold text-blue-500 mb-2">{waterCups}<span className="text-3xl text-slate-400">/{waterGoal}</span></div>
              <p className="text-xl text-slate-500">cups of water today</p>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-8 mb-6 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-300 to-blue-500 transition-all duration-500"
                style={{ width: `${waterPercent}%` }}
              />
            </div>
            <div className="flex justify-center gap-3 flex-wrap">
              {Array.from({ length: waterGoal }).map((_, i) => (
                <div
                  key={i}
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold transition-all ${
                    i < waterCups ? 'bg-blue-500 text-white shadow-md' : 'bg-slate-100 text-slate-300'
                  }`}
                >
                  {i < waterCups ? <Check size={28} /> : i + 1}
                </div>
              ))}
            </div>
            {waterCups < waterGoal && (
              <button
                onClick={addWater}
                className="mt-6 w-full bg-blue-600 text-white py-5 rounded-2xl text-2xl font-bold shadow-lg hover:bg-blue-700 transition-all"
              >
                + Log a Cup of Water
              </button>
            )}
            {waterCups >= waterGoal && (
              <div className="mt-6 text-center text-2xl font-bold text-emerald-600">
                🎉 Goal reached! Great job staying hydrated!
              </div>
            )}
          </div>
        </section>
      )}

      {/* Recipes Tab */}
      {activeTab === 'recipes' && (
        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Apple className="text-green-600" size={28} />
            Healthy Recipes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recipes.map((recipe, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-2xl font-bold text-slate-900">{recipe.name}</h3>
                  <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-bold">
                    {recipe.calories} cal
                  </span>
                </div>
                <p className="text-lg font-medium text-slate-500 mb-2">⏱ {recipe.prep}</p>
                <p className="text-lg text-emerald-700 font-medium mb-3">✨ {recipe.benefits}</p>
                <div>
                  <p className="font-bold text-slate-700 mb-2">Ingredients:</p>
                  <ul className="space-y-1">
                    {recipe.ingredients.map((ing, j) => (
                      <li key={j} className="text-lg text-slate-600 flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full flex-shrink-0" />
                        {ing}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Weight Tab */}
      {activeTab === 'weight' && (
        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp className="text-purple-500" size={28} />
            Weight Tracking
          </h2>
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-6">
            {/* Simple Chart */}
            <div className="h-48 flex items-end gap-3 mb-6" style={{ minHeight: '12rem' }}>
              {weightEntries.map((entry, i) => {
                const range = maxWeight - minWeight;
                const height = range > 0 ? ((entry.weight - minWeight) / range) * 100 : 50;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-sm font-bold text-slate-600">{entry.weight}</span>
                    <div
                      className="w-full bg-gradient-to-t from-purple-400 to-purple-600 rounded-t-lg transition-all"
                      style={{ height: `${height}%`, minHeight: '20px' }}
                    />
                    <span className="text-sm text-slate-400 font-medium">{entry.date}</span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setShowWeightInput(true)}
              className="w-full bg-purple-600 text-white py-5 rounded-2xl text-xl font-bold shadow-lg hover:bg-purple-700 transition-all flex items-center justify-center gap-2"
            >
              <Plus size={24} /> Log New Weight
            </button>
          </div>

          {showWeightInput && (
            <div className="bg-slate-50 rounded-3xl p-6 border-2 border-purple-200">
              <label className="block text-xl font-bold text-slate-700 mb-3">Enter your current weight (lbs)</label>
              <div className="flex gap-4">
                <input
                  type="number"
                  step="0.1"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  placeholder="e.g. 162.5"
                  className="flex-1 p-4 bg-white border-2 border-slate-200 rounded-2xl text-xl focus:border-purple-500 focus:outline-none"
                />
                <button
                  onClick={addWeightEntry}
                  className="bg-purple-600 text-white px-8 py-4 rounded-2xl text-xl font-bold shadow-lg hover:bg-purple-700 transition-all"
                >
                  Save
                </button>
                <button
                  onClick={() => { setShowWeightInput(false); setNewWeight(''); }}
                  className="px-6 py-4 rounded-2xl text-xl font-bold text-slate-500 border-2 border-slate-200 hover:border-slate-400 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Stretching Tab */}
      {activeTab === 'stretching' && (
        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <StretchHorizontal className="text-teal-500" size={28} />
            Stretching Routines
          </h2>
          <div className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-3xl p-6 mb-8 text-white">
            <p className="text-xl font-medium">
              Stretching daily helps maintain flexibility, reduces joint pain, and improves balance. 
              Try these gentle stretches every morning!
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stretchingRoutines.map((stretch, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-2xl font-bold text-slate-900">{stretch.name}</h3>
                  <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-bold">
                    {stretch.duration}
                  </span>
                </div>
                <p className="text-lg text-slate-600 mb-3">{stretch.description}</p>
                <p className="text-base text-teal-600 font-medium">✨ {stretch.benefit}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Health;