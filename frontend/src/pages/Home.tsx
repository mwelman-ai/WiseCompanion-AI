import { useNavigate } from 'react-router-dom';
import { Shield, MessageCircle, Apple, Pill, Plane, Users, Star, Sparkles, ArrowRight, Globe, Calendar } from 'lucide-react';

const features = [
  { icon: MessageCircle, title: 'Voice-First Companion', desc: 'Chat naturally using your voice. WiseCompanion listens, speaks back, and is always ready to help.', gradient: 'from-teal-500 to-cyan-600' },
  { icon: Shield, title: 'Scam Detector', desc: 'Paste suspicious emails or texts and get instant safety analysis. Green means safe, red means block it.', gradient: 'from-emerald-500 to-teal-600' },
  { icon: Globe, title: 'Safe Web Explorer', desc: 'Browse the internet securely. Easily check if links are safe, learn to identify fake websites, and browse with complete peace of mind.', gradient: 'from-sky-500 to-blue-600' },
  { icon: Apple, title: 'Health & Wellness', desc: 'Track your steps, water, weight, and discover gentle exercises and healthy recipes.', gradient: 'from-green-500 to-emerald-600' },
  { icon: Pill, title: 'Medication Reminders', desc: 'Never miss a dose. Set friendly reminders for your pills, vitamins, and supplements.', gradient: 'from-cyan-500 to-blue-600' },
  { icon: Plane, title: 'Travel Assistant', desc: 'Smart packing lists, airport tips, and travel advice tailored for stress-free trips.', gradient: 'from-amber-500 to-orange-600' },
  { icon: Users, title: 'Stay Connected', desc: 'Send messages to family, call loved ones, and strengthen bonds with easy tools.', gradient: 'from-rose-500 to-pink-600' },
  { icon: Calendar, title: 'Community & Events', desc: 'Stay active and join virtual zoom classes, read senior bulletin boards, and request support from friendly local volunteers.', gradient: 'from-orange-500 to-amber-600' },
];

const testimonials = [
  { name: 'Margaret, 72', text: 'My daughter set this up for me. Now I check my health every day and I love the scam checker — it caught a fake Amazon email!' },
  { name: 'Robert, 68', text: 'The voice chat is incredible. I just talk to it like I would a friend. It reminds me of my walks and my pills.' },
];

const steps = [
  { step: '1', title: 'Tell Us About You', desc: 'Share your name, interests, and preferences in a quick 3-step setup.' },
  { step: '2', title: 'Explore Your Dashboard', desc: 'Your personal hub for health, safety, family, and AI chat — all in one place.' },
  { step: '3', title: 'Chat & Stay Safe', desc: 'Use voice or text to ask questions, check for scams, track health, and connect.' },
];

const Home = () => {
  const navigate = useNavigate();

  const featurePaths: Record<number, string> = {
    0: '/ask', 1: '/scam-detector', 2: '/safe-web',
    3: '/health', 4: '/medications', 5: '/travel',
    6: '/family', 7: '/community'
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 via-teal-500 to-cyan-700">
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_30%_50%,white_0%,transparent_50%),radial-gradient(circle_at_70%_20%,white_0%,transparent_30%)]" />
        <div className="relative px-6 py-20 md:py-32 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 mb-8 border border-white/10 shadow-lg">
            <Sparkles size={20} className="text-teal-300" />
            <span className="text-lg font-semibold text-white/90 font-bold uppercase tracking-wide">The All-In-One Companion for Seniors</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight mb-6">
            Your Warm, <br />
            <span className="text-teal-300">All-In-One Companion</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-10 leading-relaxed font-semibold">
            The complete, all-in-one companion for adults 50+. From friendly voice chat and expert scam protection to safe web browsing, local community events, health logging, medication scheduling, and family connection — all designed with large text and warm colors for easy use.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => navigate('/onboarding')}
              className="inline-flex items-center gap-2 bg-teal-500 text-white font-bold text-xl px-10 py-4 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:scale-105 transition-all duration-300"
            >
              Get Started Free <ArrowRight size={24} />
            </button>
            <button
              onClick={() => navigate('/pricing')}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white font-bold text-xl px-10 py-4 rounded-2xl border-2 border-white/20 shadow-lg hover:bg-white/20 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
            >
              See Pricing
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            Everything You Need, <span className="text-teal-600">Simply Designed</span>
          </h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">
            Big buttons, clear text, and a warm friendly feel — built for comfort and ease.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              onClick={() => navigate(featurePaths[i] || '/dashboard')}
              className="bg-white border border-slate-200 rounded-2xl p-8 cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group"
            >
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 text-white shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                <f.icon size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">{f.title}</h3>
              <p className="text-lg text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 rounded-3xl bg-white border border-slate-200 px-8 mb-10 shadow-sm">
        <h2 className="text-4xl font-extrabold text-slate-900 text-center mb-12">
          How It <span className="text-teal-600">Works</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          {steps.map((item, i) => (
            <div key={i} className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-5 shadow-lg">
                {item.step}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-lg text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-10 mb-10">
        <h2 className="text-4xl font-extrabold text-slate-900 text-center mb-12">
          Loved by <span className="text-teal-600">Real Users</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => <Star key={j} size={20} className="text-amber-400 fill-amber-400" />)}
              </div>
              <p className="text-lg text-slate-500 mb-4 italic">"{t.text}"</p>
              <p className="font-bold text-lg text-slate-900">{t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 rounded-3xl text-center text-white mb-10 bg-gradient-to-br from-teal-600 via-teal-500 to-cyan-700 shadow-xl">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
          Start Your Journey Today
        </h2>
        <p className="text-xl text-white/80 max-w-xl mx-auto mb-10">
          Free to start. No credit card needed. Your warm wise companion is waiting.
        </p>
        <button
          onClick={() => navigate('/onboarding')}
          className="inline-flex items-center gap-2 bg-teal-500 text-white font-bold text-xl px-12 py-5 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:scale-105 transition-all duration-300"
        >
          Get Started Free <ArrowRight size={24} />
        </button>
      </section>
    </div>
  );
};

export default Home;