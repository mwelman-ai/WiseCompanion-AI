import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Shield, Heart, Pill, Plane, Users, Sun, Moon, Sparkles, Contrast } from 'lucide-react';
import { toggleDarkMode, toggleHighContrast } from '../lib/utils';

const cards = [
  {
    title: 'Ask WiseCompanion',
    desc: 'Talk or type to your friendly AI assistant. Get warm answers and guidance.',
    icon: MessageCircle,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100 hover:border-blue-500',
    path: '/ask',
    badge: 'Voice Active'
  },
  {
    title: 'Scam Detector',
    desc: 'Paste suspicious messages, texts, or links to instantly check if they are safe.',
    icon: Shield,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100 hover:border-emerald-500',
    path: '/scam-detector',
    badge: 'Security'
  },
  {
    title: 'Health & Wellness',
    desc: 'Track your steps, log your water, and find gentle physical exercises.',
    icon: Heart,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-100 hover:border-rose-500',
    path: '/health',
    badge: 'Daily Log'
  },
  {
    title: 'Medication Reminders',
    desc: 'Friendly schedulers to stay on track with pills, vitamins, and dosages.',
    icon: Pill,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-100 hover:border-purple-500',
    path: '/medications',
    badge: 'Reminders'
  },
  {
    title: 'Travel Assistant',
    desc: 'Stress-free trip planners, packing checklists, and security tips.',
    icon: Plane,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100 hover:border-amber-500',
    path: '/travel',
    badge: 'Plan Trip'
  },
  {
    title: 'Family & Communication',
    desc: 'Send warm texts, generate greeting cards, and save emergency contacts.',
    icon: Users,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-100 hover:border-indigo-500',
    path: '/family',
    badge: 'Stay Connected'
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Friend');
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('wisecompanion_dark_mode') === 'true');
  const [isHighContrast, setIsHighContrast] = useState(() => localStorage.getItem('wisecompanion_high_contrast') === 'true');

  useEffect(() => {
    const storedName = localStorage.getItem('wisecompanion_name');
    if (storedName) {
      setUserName(storedName);
    }
    
    // Default onboard redirect check
    const onboarded = localStorage.getItem('wisecompanion_onboarded');
    if (onboarded !== 'true') {
      navigate('/onboarding');
    }
  }, [navigate]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      {/* Top Navbar */}
      <nav className={`border-b-2 py-5 px-6 sticky top-0 z-50 backdrop-blur-md ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">👵</span>
            <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
              WiseCompanion AI
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                const nextDark = toggleDarkMode();
                setIsDarkMode(nextDark);
              }}
              className={`p-3 rounded-2xl border-2 transition-all min-h-[48px] min-w-[48px] flex items-center justify-center ${isDarkMode ? 'bg-slate-800 border-slate-700 text-yellow-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>

            <button
              onClick={() => {
                const nextContrast = toggleHighContrast();
                setIsHighContrast(nextContrast);
              }}
              className={`p-3 rounded-2xl border-2 transition-all min-h-[48px] min-w-[48px] flex items-center justify-center ${isHighContrast ? 'bg-slate-800 border-slate-700 text-yellow-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}
              aria-label="Toggle high contrast mode"
              title="Toggle High Contrast"
            >
              <Contrast size={24} />
            </button>
            
            <button
              onClick={() => {
                localStorage.removeItem('wisecompanion_onboarded');
                navigate('/onboarding');
              }}
              className="bg-slate-200 text-slate-700 hover:bg-slate-300 font-bold px-5 py-3 rounded-2xl transition-all text-lg min-h-[48px]"
            >
              Reset Setup
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Dynamic Welcome Banner */}
        <section className={`rounded-3xl p-8 mb-10 shadow-md border-2 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-transparent'}`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4 border border-white/10">
                <Sparkles size={18} className="text-yellow-300" />
                <span className="text-sm font-semibold">Senior-Citizen Focused Assistance</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-3">
                {getGreeting()}, {userName}!
              </h2>
              <p className="text-lg md:text-xl opacity-90 max-w-2xl leading-relaxed">
                Welcome back to your safe space. Select any helper below to manage your medications, double-check scams, or write to family.
              </p>
            </div>
            
            <div className={`rounded-2xl p-4 text-center border-2 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white/10 border-white/20'}`}>
              <p className="text-sm font-semibold opacity-80 uppercase tracking-widest">Today's Date</p>
              <p className="text-3xl font-black mt-1">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
              <p className="text-md font-semibold opacity-90 mt-1">
                {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
              </p>
            </div>
          </div>
        </section>

        {/* 6 Large Clickable Grid Cards (Targets > 48px) */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, i) => (
            <button
              key={i}
              onClick={() => navigate(card.path)}
              className={`group rounded-3xl p-8 text-left border-3 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 min-h-[220px] flex flex-col justify-between ${
                isDarkMode 
                  ? 'bg-slate-900 border-slate-800 hover:border-blue-500 hover:bg-slate-850' 
                  : `border-slate-100 ${card.border}`
              }`}
              aria-label={`Open ${card.title}`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 ${card.bg} rounded-2xl flex items-center justify-center`}>
                    <card.icon size={32} className={card.color} />
                  </div>
                  <span className={`text-sm font-extrabold px-3.5 py-1.5 rounded-full border-2 ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-600'
                  }`}>
                    {card.badge}
                  </span>
                </div>
                
                <h3 className={`text-2xl font-black mb-2 group-hover:text-blue-600 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {card.title}
                </h3>
                <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {card.desc}
                </p>
              </div>
              
              <div className="mt-6 flex items-center gap-2 text-lg font-black text-blue-600 group-hover:translate-x-1.5 transition-transform">
                Open Feature ➔
              </div>
            </button>
          ))}
        </section>
      </main>

      {/* Footer */}
      <footer className={`border-t-2 py-10 mt-20 text-center text-lg ${isDarkMode ? 'bg-slate-950 border-slate-900 text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
        <p className="font-semibold">© 2026 WiseCompanion AI • Warmly supporting our loved ones every day. ❤️</p>
      </footer>
    </div>
  );
};

export default Dashboard;
