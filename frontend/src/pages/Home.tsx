import { useNavigate } from 'react-router-dom';
import { Shield, MessageCircle, Apple, Pill, Plane, Users, Star, Sparkles, ArrowRight } from 'lucide-react';

const features = [
  { icon: MessageCircle, title: 'Voice-First Companion', desc: 'Chat naturally using your voice. WiseCompanion listens, speaks back, and is always ready to help.', gradient: 'from-violet-500 to-purple-600' },
  { icon: Shield, title: 'Scam Detector', desc: 'Paste suspicious emails or texts and get instant safety analysis. Green means safe, red means block it.', gradient: 'from-emerald-500 to-green-600' },
  { icon: Apple, title: 'Health & Wellness', desc: 'Track your steps, water, weight, and discover gentle exercises and healthy recipes.', gradient: 'from-green-500 to-emerald-600' },
  { icon: Pill, title: 'Medication Reminders', desc: 'Never miss a dose. Set friendly reminders for your pills, vitamins, and supplements.', gradient: 'from-purple-500 to-violet-600' },
  { icon: Plane, title: 'Travel Assistant', desc: 'Smart packing lists, airport tips, and travel advice tailored for stress-free trips.', gradient: 'from-amber-500 to-orange-600' },
  { icon: Users, title: 'Stay Connected', desc: 'Send messages to family, call loved ones, and strengthen bonds with easy tools.', gradient: 'from-rose-500 to-pink-600' },
];

const testimonials = [
  { name: 'Margaret, 72', text: 'My daughter set this up for me. Now I check my health every day and I love the scam checker — it caught a fake Amazon email!' },
  { name: 'Robert, 68', text: 'The voice chat is incredible. I just talk to it like I would a friend. It reminds me of my walks and my pills.' },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #e11d48 100%)' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 0%, transparent 50%), radial-gradient(circle at 80% 20%, white 0%, transparent 30%)' }} />
        <div className="relative px-6 py-20 md:py-32 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md rounded-full px-6 py-3 mb-8 border border-white/20">
            <Sparkles size={20} className="text-yellow-300" />
            <span className="text-lg font-semibold text-white">AI-Powered Companion for Adults 50+</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight mb-6">
            Your Warm, <br />
            <span className="text-yellow-300">Wise Companion</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed">
            Voice chat, scam protection, health tracking, and family connection —<br />
            all designed with large text and warm colors for easy use.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button onClick={() => navigate('/onboarding')} className="inline-flex items-center gap-2 bg-white text-violet-700 font-bold text-xl px-10 py-4 rounded-2xl hover:shadow-2xl hover:scale-105 transition-all shadow-lg">
              Get Started Free <ArrowRight size={24} />
            </button>
            <button onClick={() => navigate('/pricing')} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white font-bold text-xl px-10 py-4 rounded-2xl border-2 border-white/30 hover:bg-white/20 transition-all">
              See Pricing
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            Everything You Need, <span className="gradient-text">Simply Designed</span>
          </h2>
          <p className="text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto">
            Big buttons, clear text, and a warm friendly feel — built for comfort and ease.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} onClick={() => {
              const paths: Record<number, string> = { 0: '/ask', 1: '/scam-detector', 2: '/health', 3: '/medications', 4: '/travel', 5: '/family' };
              navigate(paths[i] || '/dashboard');
            }} className="bg-white dark:bg-[var(--bg-card)] border border-[var(--color-border)] rounded-2xl p-8 cursor-pointer transition-all hover:-translate-y-2 hover:shadow-xl group" style={{ boxShadow: '0 1px 3px rgba(124,58,237,0.08)' }}>
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 text-white shadow-lg`}>
                <f.icon size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-3">{f.title}</h3>
              <p className="text-lg text-[var(--color-text-muted)] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 rounded-3xl bg-[var(--bg-card)] border border-[var(--color-border)] px-8 mb-10">
        <h2 className="text-4xl font-extrabold text-center mb-12">
          How It <span className="gradient-text">Works</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          {[
            { step: '1', title: 'Tell Us About You', desc: 'Share your name, interests, and preferences in a quick 3-step setup.' },
            { step: '2', title: 'Explore Your Dashboard', desc: 'Your personal hub for health, safety, family, and AI chat — all in one place.' },
            { step: '3', title: 'Chat & Stay Safe', desc: 'Use voice or text to ask questions, check for scams, track health, and connect.' },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-5 shadow-lg">
                {item.step}
              </div>
              <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
              <p className="text-lg text-[var(--color-text-muted)]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-10 mb-10">
        <h2 className="text-4xl font-extrabold text-center mb-12">
          Loved by <span className="gradient-text">Real Users</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white dark:bg-[var(--bg-card)] border border-[var(--color-border)] rounded-2xl p-8" style={{ boxShadow: '0 1px 3px rgba(124,58,237,0.08)' }}>
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => <Star key={j} size={20} className="text-amber-400 fill-amber-400" />)}
              </div>
              <p className="text-lg text-[var(--color-text-muted)] mb-4 italic">"{t.text}"</p>
              <p className="font-bold text-lg">{t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 rounded-3xl text-center text-white mb-10" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #e11d48 100%)' }}>
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
          Start Your Journey Today
        </h2>
        <p className="text-xl text-white/90 max-w-xl mx-auto mb-10">
          Free to start. No credit card needed. Your warm wise companion is waiting.
        </p>
        <button onClick={() => navigate('/onboarding')} className="inline-flex items-center gap-2 bg-white text-violet-700 font-bold text-xl px-12 py-5 rounded-2xl hover:shadow-2xl hover:scale-105 transition-all shadow-lg">
          Get Started Free <ArrowRight size={24} />
        </button>
      </section>
    </div>
  );
};

export default Home;