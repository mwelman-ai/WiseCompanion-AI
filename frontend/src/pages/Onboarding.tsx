import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Heart, Shield, Sparkles, Volume2, ArrowRight } from 'lucide-react';
import { initTheme } from '../lib/utils';

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [fontSizePreference, setFontSizePreference] = useState('large'); // default senior-friendly
  const [voiceSpeed, setVoiceSpeed] = useState('slow'); // senior-friendly slower voice

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Save onboarding choices to local storage
      localStorage.setItem('wisecompanion_onboarded', 'true');
      localStorage.setItem('wisecompanion_name', name || 'Friend');
      localStorage.setItem('wisecompanion_age_range', ageRange);
      localStorage.setItem('wisecompanion_interests', JSON.stringify(selectedInterests));
      localStorage.setItem('wisecompanion_font_size', fontSizePreference);
      localStorage.setItem('wisecompanion_voice_speed', voiceSpeed);
      
      // Apply selected accessibility theme/font-size immediately
      initTheme();

      // Redirect to dashboard
      navigate('/dashboard');
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const interestsList = [
    { id: 'scams', label: '🛡️ Checking for Scams & Safety' },
    { id: 'meds', label: '💊 Remembering Daily Medications' },
    { id: 'health', label: '🥗 Tracking Steps & Daily Health' },
    { id: 'travel', label: '✈️ Travel Checklist & Packing Support' },
    { id: 'family', label: '✉️ Writing Letters & Messaging Family' },
    { id: 'ai', label: '💬 Friendly Voice Conversation with AI' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 flex flex-col justify-between py-12 px-4 md:px-8">
      {/* Upper Brand Header */}
      <header className="max-w-xl mx-auto w-full text-center mb-6">
        <span className="text-5xl">👵</span>
        <h1 className="text-3xl font-black tracking-tight text-slate-800 mt-2">
          WiseCompanion Setup
        </h1>
        <p className="text-lg text-slate-500 font-medium">Let's tailor your experience to make it comfortable & simple</p>
      </header>

      {/* Wizard Card */}
      <main className="max-w-2xl mx-auto w-full bg-white rounded-3xl p-8 md:p-12 shadow-xl border-2 border-slate-100 flex-grow flex flex-col justify-between min-h-[480px]">
        <div>
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-10">
            <span className="text-md font-bold text-slate-400">Step {step} of 3</span>
            <div className="flex gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    s === step ? 'w-10 bg-blue-600' : 'w-3 bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* STEP 1: Name and Age */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-800 rounded-2xl px-4 py-2 border border-blue-100">
                <Sparkles size={20} className="text-amber-500" />
                <span className="text-md font-semibold">Welcome Friend!</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                First, what should we call you?
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                We will use this name to greet you and when checking in on your daily activities.
              </p>

              <div className="space-y-4 pt-4">
                <label htmlFor="user-name" className="block text-xl font-bold text-slate-800">
                  Your First Name:
                </label>
                <input
                  id="user-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Margaret, Robert, or Grandma"
                  className="w-full text-xl px-6 py-4 border-3 border-slate-200 rounded-2xl focus:border-blue-500 focus:outline-none min-h-[56px]"
                />
              </div>

              <div className="space-y-4 pt-4">
                <label className="block text-xl font-bold text-slate-800">
                  Your Age Range (helps us customize features):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {['Under 60', '60 to 75', 'Over 75'].map((range) => (
                    <button
                      key={range}
                      type="button"
                      onClick={() => setAgeRange(range)}
                      className={`text-lg font-bold px-6 py-4 rounded-2xl border-2 transition-all min-h-[52px] ${
                        ageRange === range
                          ? 'bg-blue-50 border-blue-600 text-blue-700'
                          : 'border-slate-200 text-slate-600 hover:border-slate-400'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Interests */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 rounded-2xl px-4 py-2 border border-emerald-100">
                <Shield size={20} className="text-emerald-600" />
                <span className="text-md font-semibold">Custom Helper Options</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                What are you most interested in?
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Select as many as you like. We will highlight these on your dashboard.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {interestsList.map((interest) => (
                  <button
                    key={interest.id}
                    type="button"
                    onClick={() => toggleInterest(interest.id)}
                    className={`text-left text-lg font-bold px-6 py-5 rounded-2xl border-3 transition-all min-h-[70px] flex items-center justify-between ${
                      selectedInterests.includes(interest.id)
                        ? 'bg-emerald-50/50 border-emerald-600 text-emerald-900 shadow-md'
                        : 'border-slate-100 bg-slate-50 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span>{interest.label}</span>
                    <input
                      type="checkbox"
                      checked={selectedInterests.includes(interest.id)}
                      readOnly
                      className="w-6 h-6 rounded-md border-slate-300 accent-emerald-600 cursor-pointer"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Accessibility Settings */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-800 rounded-2xl px-4 py-2 border border-amber-100">
                <Volume2 size={20} className="text-amber-500" />
                <span className="text-md font-semibold">Comfort & Sound Options</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                Choose comfortable settings
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                We make our text extra large and offer voice tools. Adjust them to your preferences below.
              </p>

              {/* Font Size Selection */}
              <div className="space-y-4 pt-4">
                <span className="block text-xl font-bold text-slate-800">Preferred Text Size:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFontSizePreference('large')}
                    className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center justify-center min-h-[100px] ${
                      fontSizePreference === 'large'
                        ? 'bg-blue-50 border-blue-600 text-blue-700'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-2xl font-black">Aa</span>
                    <span className="text-lg font-bold mt-1">Slightly Large (Standard)</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setFontSizePreference('xlarge')}
                    className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center justify-center min-h-[100px] ${
                      fontSizePreference === 'xlarge'
                        ? 'bg-blue-50 border-blue-600 text-blue-700'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-3xl font-black">AA</span>
                    <span className="text-lg font-bold mt-1">Extra Large (Easiest)</span>
                  </button>
                </div>
              </div>

              {/* Voice Speed Selection */}
              <div className="space-y-4 pt-4">
                <span className="block text-xl font-bold text-slate-800">WiseCompanion Voice Speed:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: 'slow', label: '🐢 Calm & Slow' },
                    { id: 'normal', label: '👤 Friendly Normal' },
                    { id: 'fast', label: '⚡ Faster' }
                  ].map((speed) => (
                    <button
                      key={speed.id}
                      type="button"
                      onClick={() => setVoiceSpeed(speed.id)}
                      className={`text-lg font-bold px-6 py-4 rounded-2xl border-2 transition-all min-h-[52px] ${
                        voiceSpeed === speed.id
                          ? 'bg-blue-50 border-blue-600 text-blue-700'
                          : 'border-slate-200 text-slate-600 hover:border-slate-400'
                      }`}
                    >
                      {speed.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation Buttons (min height 48px, minimum touch targets) */}
        <div className="flex items-center justify-between gap-6 pt-10 border-t-2 border-slate-100 mt-10">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="flex items-center justify-center gap-2 border-2 border-slate-300 text-slate-700 hover:border-slate-400 font-bold px-6 py-4 rounded-2xl text-lg min-h-[48px] min-w-[120px] transition-all"
            >
              <ChevronLeft size={24} /> Back
            </button>
          ) : (
            <div className="w-[120px]" />
          )}

          <button
            type="button"
            onClick={handleNext}
            disabled={step === 1 && !name.trim()}
            className={`flex items-center justify-center gap-2 font-black px-10 py-4 rounded-2xl text-xl min-h-[48px] min-w-[160px] shadow-md transition-all ${
              step === 1 && !name.trim()
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {step === 3 ? (
              <>
                Let's Start! <ArrowRight size={24} />
              </>
            ) : (
              <>
                Next Step <ChevronRight size={24} />
              </>
            )}
          </button>
        </div>
      </main>

      {/* Safety Shield Info Card */}
      <footer className="max-w-xl mx-auto w-full text-center mt-6">
        <p className="text-slate-400 text-md font-medium flex items-center justify-center gap-1.5">
          <Heart size={16} className="text-rose-500" /> Your data is completely secure and never shared.
        </p>
      </footer>
    </div>
  );
};

export default Onboarding;
