import { useNavigate } from 'react-router-dom';
import { Heart, Check, Star, Sparkles, ChevronRight } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Perfect for getting started with basic companion features.',
    features: [
      'Voice chat companion (10 questions/day)',
      'Scam detector — analyze messages',
      'Basic health & wellness tracking',
      'Medication reminders',
      'Family messaging',
    ],
    cta: 'Get Started Free',
    highlighted: false,
  },
  {
    name: 'Premium',
    price: '$9.99',
    period: '/month',
    description: 'Unlock everything — unlimited chat, full health suite, and priority support.',
    popular: true,
    features: [
      'Unlimited voice chat & questions',
      'Advanced scam detection',
      'Full health & wellness suite',
      'Unlimited medication reminders',
      'Travel assistant with packing lists',
      'Priority voice support',
      'Dark mode & accessibility features',
      'No ads — ever',
    ],
    cta: 'Upgrade to Premium',
    highlighted: true,
  },
];

const featureCompare = [
  { name: 'Voice Chat', free: '10 questions/day', premium: 'Unlimited' },
  { name: 'Scam Detector', free: 'Basic analysis', premium: 'Advanced analysis' },
  { name: 'Health Tracking', free: 'Basic', premium: 'Full suite' },
  { name: 'Medication Reminders', free: 'Up to 3 meds', premium: 'Unlimited' },
  { name: 'Travel Assistant', free: '—', premium: '✓ Full access' },
  { name: 'Priority Support', free: '—', premium: '✓ Priority' },
  { name: 'Dark Mode', free: '—', premium: '✓ Included' },
];

const Pricing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
            <span className="text-2xl font-bold tracking-tight">WiseCompanion</span>
          </button>
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/')} className="text-lg font-medium hover:text-rose-500 transition-colors">Home</button>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-slate-900 text-white px-6 py-2 rounded-full font-bold text-lg hover:opacity-90 transition-opacity"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-50 rounded-full px-6 py-3 mb-6 shadow-sm border border-amber-200">
          <Sparkles size={20} className="text-amber-500" />
          <span className="text-lg font-semibold text-amber-800">Simple, Transparent Pricing</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-4">
          Plans for Every Stage
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto">
          Start free, upgrade when you want more. No hidden fees, no complicated contracts.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`rounded-3xl p-8 border-2 transition-all hover:shadow-xl ${
                plan.highlighted
                  ? 'bg-gradient-to-b from-white to-blue-50 border-blue-500 shadow-lg scale-105 md:scale-110'
                  : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              {plan.popular && (
                <div className="inline-flex items-center gap-1 bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-bold mb-4">
                  <Star size={16} className="fill-white" /> Most Popular
                </div>
              )}
              <h2 className="text-3xl font-bold text-slate-900 mb-2">{plan.name}</h2>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-5xl font-extrabold text-slate-900">{plan.price}</span>
                <span className="text-xl text-slate-400">{plan.period}</span>
              </div>
              <p className="text-lg text-slate-500 mb-8">{plan.description}</p>

              <button
                onClick={() => navigate('/dashboard')}
                className={`w-full py-5 rounded-2xl text-xl font-bold transition-all flex items-center justify-center gap-2 ${
                  plan.highlighted
                    ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700'
                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                }`}
              >
                {plan.cta} <ChevronRight size={24} />
              </button>

              <ul className="mt-8 space-y-4">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3 text-lg">
                    <Check size={22} className={`flex-shrink-0 mt-0.5 ${plan.highlighted ? 'text-blue-600' : 'text-emerald-500'}`} />
                    <span className="text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="bg-slate-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-12">Compare Plans Side by Side</h2>
          <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="grid grid-cols-3 gap-4 p-6 bg-slate-50 border-b border-slate-200 font-bold text-lg text-slate-700">
              <div>Feature</div>
              <div className="text-center">Free</div>
              <div className="text-center text-blue-600">Premium</div>
            </div>
            {featureCompare.map((item, i) => (
              <div
                key={i}
                className={`grid grid-cols-3 gap-4 p-5 text-lg ${
                  i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                } border-b border-slate-100 last:border-0`}
              >
                <div className="font-medium text-slate-800">{item.name}</div>
                <div className="text-center text-slate-500">{item.free}</div>
                <div className="text-center text-emerald-600 font-medium">{item.premium}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-emerald-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Start Your Free Journey Today</h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10">
            No credit card needed. Join thousands of happy seniors who have a companion by their side.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-white text-slate-900 px-12 py-6 rounded-2xl text-2xl font-bold shadow-xl hover:bg-slate-100 transition-all inline-flex items-center gap-3"
          >
            Get Started Free <Heart size={28} className="text-rose-500" />
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

export default Pricing;