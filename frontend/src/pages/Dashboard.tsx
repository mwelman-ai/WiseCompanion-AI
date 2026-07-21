import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Shield, Heart, Pill, Plane, Users, Sun, Moon, Sparkles, Contrast } from 'lucide-react';
import { toggleDarkMode, toggleHighContrast } from '../lib/utils';

const cards = [
  {
    title: 'Ask WiseCompanion',
    desc: 'Talk or type to your friendly AI assistant. Get warm answers and guidance.',
    icon: MessageCircle,
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    border: 'border-teal-100 hover:border-teal-400',
    path: '/ask',
    badge: 'Voice Active'
  },
  {
    title: 'Scam Detector',
    desc: 'Paste suspicious messages, texts, or links to instantly check if they are safe.',
    icon: Shield,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100 hover:border-amber-400',
    path: '/scam-detector',
    badge: 'Security'
  },
  {
    title: 'Health & Wellness',
    desc: 'Track your steps, log your water, and find gentle physical exercises.',
    icon: Heart,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100 hover:border-emerald-400',
    path: '/health',
    badge: 'Daily Log'
  },
  {
    title: 'Medication Reminders',
    desc: 'Friendly schedulers to stay on track with pills, vitamins, and dosages.',
    icon: Pill,
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    border: 'border-teal-100 hover:border-teal-400',
    path: '/medications',
    badge: 'Reminders'
  },
  {
    title: 'Travel Assistant',
    desc: 'Stress-free trip planners, packing checklists, and security tips.',
    icon: Plane,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-100 hover:border-indigo-400',
    path: '/travel',
    badge: 'Travel'
  },
  {
    title: 'Family & Friends',
    desc: 'Send messages, share updates, and stay connected with loved ones.',
    icon: Users,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-100 hover:border-rose-400',
    path: '/family',
    badge: 'Connect'
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    setIsDark(localStorage.getItem('wisecompanion-dark-mode') === 'true');
    setIsHighContrast(localStorage.getItem('wisecompanion-high-contrast') === 'true');
  }, []);

  const handleDarkToggle = () => {
    toggleDarkMode();
    setIsDark(!isDark);
  };

  const handleContrastToggle = () => {
    toggleHighContrast();
    setIsHighContrast(!isHighContrast);
  };

  return (
    <div className="app-container">
      {/* Top Bar — teal brand */}
      <nav className="mb-6 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-md">
            <Heart size={24} color="white" fill="white" />
          </div>
          <span className="text-2xl font-bold text-slate-800">WiseCompanion</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleContrastToggle}
            className="btn btn-circle btn-raised"
            title="Toggle High Contrast"
          >
            <Contrast size={22} />
          </button>
          <button
            onClick={handleDarkToggle}
            className="btn btn-circle btn-raised"
            title="Toggle Dark Mode"
          >
            {isDark ? <Sun size={22} /> : <Moon size={22} />}
          </button>
        </div>
      </nav>

      {/* Greeting Banner — teal gradient */}
      <div className="greeting-banner">
        <h2>Good morning! 🌤️</h2>
        <p>Here's your daily overview. How are you feeling today?</p>
      </div>

      {/* Feature Cards Grid — each with its own accent color */}
      <div className="cards-grid">
        {cards.map((card, i) => (
          <button
            key={i}
            onClick={() => navigate(card.path)}
            className="feature-card"
          >
            <div>
              <div className={`card-icon ${card.bg} ${card.color}`}>
                <card.icon size={32} />
              </div>
              <h2 className="text-slate-800">{card.title}</h2>
              <p className="text-slate-500">{card.desc}</p>
            </div>
            <span className={`badge mt-4 self-start ${card.bg} ${card.color}`}>{card.badge}</span>
          </button>
        ))}
      </div>

      {/* Premium CTA — teal button */}
      <div className="premium-overlay">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">
          <Sparkles size={24} className="inline text-teal-500 mr-2" />
          Go Premium
        </h3>
        <p className="text-slate-500 text-lg mb-4">
          Unlock unlimited voice chat, advanced scam detection, and more.
        </p>
        <button
          onClick={() => navigate('/pricing')}
          className="btn btn-primary btn-raised"
        >
          See Plans <Sparkles size={20} />
        </button>
      </div>
    </div>
  );
};

export default Dashboard;