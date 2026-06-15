import { useNavigate } from 'react-router-dom';
import { Heart, Shield, MessageCircle, Apple, Pill, Plane, Users, ChevronRight, Star, Sparkles, Volume2 } from 'lucide-react';

const features = [
  { icon: MessageCircle, title: 'Voice-First Companion', desc: 'Chat naturally using your voice. WiseCompanion listens, speaks back, and is always ready to help — just like a real friend.', color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: Shield, title: 'Scam Detector', desc: 'Paste suspicious emails or texts and get instant safety analysis. Green means safe, red means block it.', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { icon: Apple, title: 'Health & Wellness', desc: 'Track your steps, water intake, weight, and discover gentle exercises and healthy recipes.', color: 'text-green-600', bg: 'bg-green-50' },
  { icon: Pill, title: 'Medication Reminders', desc: 'Never miss a dose. Set friendly reminders for your pills, vitamins, and supplements.', color: 'text-purple-600', bg: 'bg-purple-50' },
  { icon: Plane, title: 'Travel Assistant', desc: 'Smart packing lists, airport tips, and travel advice tailored for stress-free trips.', color: 'text-amber-600', bg: 'bg-amber-50' },
  { icon: Users, title: 'Stay Connected', desc: 'Send messages to family, call loved ones, and strengthen bonds with easy communication tools.', color: 'text-rose-600', bg: 'bg-rose-50' },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 mb-8 shadow-sm border border-slate-200">
              <Sparkles size={20} className="text-amber-500" />
              <span className="text-lg font-semibold text-slate-700">AI-Powered Companion for Adults 50+</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight mb-6">
              Your Warm, <br />
              <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">Wise Companion</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              WiseCompanion is your friendly AI assistant — helping with health, safety, medication, travel, 
              and staying connected. Just speak naturally, and it listens.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-blue-600 text-white px-10 py-5 rounded-2xl text-xl font-bold shadow-xl hover:bg-blue-700 transition-all flex items-center gap-3"
              >
                Get Started Free <ChevronRight size={28} />
              </button>
              <button
                onClick={() => navigate('/pricing')}
                className="bg-white text-slate-800 px-10 py-5 rounded-2xl text-xl font-bold border-2 border-slate-200 hover:border-blue-300 hover:text-blue-600 transition-all flex items-center gap-3"
              >
                See Plans <Star size={24} />
              </button>
            </div>
            <p className="text-lg text-slate-400 mt-6">No credit card required • Free tier available</p>
          </div>

          {/* Floating feature preview cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mt-20">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 text-center shadow-sm border border-slate-100">
              <Volume2 size={32} className="mx-auto text-blue-600 mb-2" />
              <p className="text-lg font-bold text-slate-800">Voice Chat</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 text-center shadow-sm border border-slate-100">
              <Shield size={32} className="mx-auto text-emerald-600 mb-2" />
              <p className="text-lg font-bold text-slate-800">Scam Safety</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 text-center shadow-sm border border-slate-100">
              <Heart size={32} className="mx-auto text-rose-600 mb-2" />
              <p className="text-lg font-bold text-slate-800">Wellness</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 text-center shadow-sm border border-slate-100">
              <Users size={32} className="mx-auto text-amber-600 mb-2" />
              <p className="text-lg font-bold text-slate-800">Family</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Everything You Need, Simply Designed</h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">Large buttons, clear text, voice support — built for comfort and ease of use.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, i) => (
            <div key={i} className="group bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className={`w-16 h-16 ${feature.bg} rounded-2xl flex items-center justify-center mb-5`}>
                <feature.icon size={36} className={feature.color} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-lg text-slate-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-slate-50 py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-slate-900 mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-4xl font-bold text-white">1</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Sign Up Free</h3>
              <p className="text-lg text-slate-600">Create your account in seconds. No complicated forms or technical know-how needed.</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-4xl font-bold text-white">2</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Speak or Type</h3>
              <p className="text-lg text-slate-600">Ask questions, check messages, track medications — using your voice or by tapping.</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-4xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Stay Safe & Happy</h3>
              <p className="text-lg text-slate-600">WiseCompanion watches out for you — from scam alerts to wellness tracking.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-600 to-emerald-600 rounded-3xl p-12 text-center text-white shadow-2xl">
          <div className="text-6xl mb-6">👵</div>
          <p className="text-2xl md:text-3xl font-bold leading-relaxed mb-8">
            "WiseCompanion helps me stay organized and safe. I love that I can just talk to it — 
            no buttons to figure out!"
          </p>
          <div className="flex items-center justify-center gap-2">
            {[...Array(5)].map((_, i) => <Star key={i} size={24} className="fill-amber-400 text-amber-400" />)}
          </div>
          <p className="text-xl mt-4 opacity-90">— Margaret, 72</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-900 py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Meet Your WiseCompanion?</h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            Join thousands of seniors who have a warm, helpful companion by their side.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-white text-slate-900 px-12 py-6 rounded-2xl text-2xl font-bold shadow-xl hover:bg-slate-100 transition-all inline-flex items-center gap-3"
          >
            Start Free Today <Heart size={28} className="text-rose-500" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-slate-50">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-lg text-slate-500">© 2026 WiseCompanion AI. Built with love for seniors.</p>
          <div className="flex gap-8 text-lg font-medium">
            <a href="#" className="hover:text-rose-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-rose-500 transition-colors">Terms</a>
            <a href="#" className="hover:text-rose-500 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;