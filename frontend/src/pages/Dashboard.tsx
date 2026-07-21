import React from 'react';
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
    border: 'border-teal-100 hover:border-teal-500',
    path: '/ask',
    badge: 'Voice Active'
  },
  {
    title: 'Scam Detector',
    desc: 'Paste suspicious messages, texts, or links to instantly check if they are safe.',
    icon: Shield,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100 hover:border-amber-500',
    path: '/scam-detector',
    badge: 'Security'
  },
  {
    title: 'Health & Wellness',
    desc: 'Track your steps, log your water, and find gentle physical exercises.',
    icon: Heart,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100 hover:border-emerald-500',
    path: '/health',
    badge: 'Daily Log'
  },
  {
    title: 'Medication Reminders',
    desc: 'Friendly schedulers to stay on track with pills, vitamins, and dosages.',
    icon: Pill,
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    border: 'border-teal-100 hover:border-teal-500',
    path: '/medications',
    badge: 'Reminders'
  },
  {
    title: 'Travel Assistant',
    desc: 'Stress-free trip planners, packing checklists, and security tips.',
    icon: Plane,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-100 hover:border-indigo-500',
    path: '/travel',
    badge: 'Plan Trip'
  },
  {
    title: 'Family & Communication',
    desc: 'Send warm texts, generate greeting cards, and save emergency contacts.',
    icon: Users,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-100 hover:border-rose-500',
    path: '/family',
    badge: 'Stay Connected'
  }
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Sparkles className="h-6 w-6 text-teal-600 mr-2" />
              <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent dark:from-teal-400 dark:to-teal-200">
                WiseCompanion AI
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleHighContrast}
                className="p-2 text-gray-500 hover:text-teal-600 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:text-teal-400 dark:hover:bg-gray-700"
                title="Toggle High Contrast"
              >
                <Contrast className="h-5 w-5" />
              </button>
              <button
                onClick={toggleDarkMode}
                className="p-2 text-gray-500 hover:text-teal-600 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:text-teal-400 dark:hover:bg-gray-700"
                title="Toggle Dark Mode"
              >
                <Sun className="h-5 w-5 dark:hidden" />
                <Moon className="h-5 w-5 hidden dark:block" />
              </button>
              <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />
              <button 
                onClick={() => navigate('/login')}
                className="text-sm font-medium text-gray-700 hover:text-teal-600 dark:text-gray-300 dark:hover:text-teal-400"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl mb-4">
            Welcome to Your <span className="text-teal-600 dark:text-teal-400">WiseCompanion</span>
          </h1>
          <p className="max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:text-xl md:max-w-3xl">
            Your friendly, all-in-one AI assistant designed to make technology simple, helpful, and safe every single day.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, i) => (
            <div
              key={i}
              onClick={() => navigate(card.path)}
              className={`bg-white dark:bg-gray-800 rounded-2xl border ${card.border} p-6 shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col justify-between group relative overflow-hidden`}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl ${card.bg} text-teal-600 transition-colors duration-200`}>
                    <card.icon className={`h-6 w-6 ${card.color}`} />
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${card.bg} ${card.color}`}>
                    {card.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {card.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  {card.desc}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-50 dark:border-gray-700/50 flex items-center text-sm font-medium text-teal-600 dark:text-teal-400 group-hover:translate-x-1 transition-transform">
                Get Started &rarr;
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
