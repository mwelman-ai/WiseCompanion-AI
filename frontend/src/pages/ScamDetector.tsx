import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ShieldCheck, ShieldAlert, ShieldQuestion, ArrowLeft, Search, AlertTriangle, Info, CheckCircle } from 'lucide-react';

type RiskLevel = 'safe' | 'caution' | 'danger' | null;

interface ScanResult {
  risk: RiskLevel;
  probability: number;
  reasons: string[];
  actions: string[];
}

const ScamDetector = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  const analyzeText = async () => {
    if (!input.trim()) return;
    setIsScanning(true);
    setResult(null);

    try {
      // Try backend API first, fall back to local analysis
      const API_BASE = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${API_BASE}/api/scam/detect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input })
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        throw new Error('API unavailable');
      }
    } catch {
      // Local analysis fallback
      const text = input.toLowerCase();
      const scamKeywords = [
        'urgent', 'verify', 'account suspended', 'click here', 'gift card',
        'wire transfer', 'western union', 'money gram', 'ssn', 'social security',
        'irs', 'lottery', 'you won', 'free prize', 'inheritance', 'prince',
        'nigerian', 'password reset', 'confirm your', 'bank account', 'credit card',
        'paypal', 'bitcoin', 'crypto', 'investment opportunity', 'guaranteed return',
        'act now', 'limited time', 'exclusive offer', 'dear customer', 'suspicious activity'
      ];
      const urlPattern = /https?:\/\/[^\s]+/gi;
      const urls = text.match(urlPattern) || [];
      
      let foundKeywords = scamKeywords.filter(k => text.includes(k));
      let hasUrgency = /\b(urgent|immediately|asap|now|today only|expires)\b/i.test(text);
      let hasSuspiciousUrl = urls.some(u => {
        const suspicious = ['.xyz', '.top', '.club', '.online', '.site', 'bit.ly', 'tinyurl', 'goo.gl'];
        return suspicious.some(s => u.includes(s));
      });
      let requestsPersonal = /\b(password|ssn|social security|credit card|bank account|pin|atm)\b/i.test(text);
      let poorGrammar = /\b(dear customer|valued customer|kindly|be advised)\b/i.test(text) && hasUrgency;

      let score = 0;
      let reasons: string[] = [];
      let actions: string[] = [];

      if (foundKeywords.length > 3) {
        score += 35;
        reasons.push(`Contains ${foundKeywords.length} scam-related keywords (${foundKeywords.slice(0, 5).join(', ')})`);
      }
      if (hasUrgency) { score += 15; reasons.push('Creates false urgency to pressure you'); }
      if (hasSuspiciousUrl) { score += 20; reasons.push('Contains suspicious or shortened URLs'); }
      if (requestsPersonal) { score += 20; reasons.push('Requests sensitive personal information'); }
      if (poorGrammar) { score += 10; reasons.push('Uses common scam language patterns'); }

      // Cap at 99
      score = Math.min(99, score);

      if (score >= 60) {
        actions = ['Do not reply or click any links', 'Block the sender', 'Report to the FTC at ReportFraud.ftc.gov', 'Forward phishing emails to spam@uce.gov'];
      } else if (score >= 30) {
        actions = ['Do not share personal information', 'Verify the sender through a trusted channel', 'Hover over links to check where they really go'];
      } else {
        actions = ['No immediate action needed', 'Stay vigilant with unfamiliar messages'];
      }

      let risk: RiskLevel = score >= 60 ? 'danger' : score >= 30 ? 'caution' : 'safe';

      setResult({
        risk,
        probability: score,
        reasons: reasons.length > 0 ? reasons : ['No suspicious patterns detected'],
        actions,
      });
    } finally {
      setIsScanning(false);
    }
  };

  const getRiskColor = () => {
    switch (result?.risk) {
      case 'safe': return { bg: 'bg-emerald-50 border-emerald-200 text-emerald-950', text: 'text-emerald-900', icon: 'text-emerald-600', border: 'border-b-emerald-300' };
      case 'caution': return { bg: 'bg-amber-50 border-amber-200 text-amber-950', text: 'text-amber-900', icon: 'text-amber-600', border: 'border-b-amber-300' };
      case 'danger': return { bg: 'bg-rose-50 border-rose-200 text-rose-950', text: 'text-rose-900', icon: 'text-rose-600', border: 'border-b-rose-300' };
      default: return { bg: 'bg-slate-50 border-slate-200 text-slate-800', text: 'text-slate-900', icon: 'text-slate-600', border: 'border-b-slate-300' };
    }
  };

  const getRiskIcon = () => {
    switch (result?.risk) {
      case 'safe': return <ShieldCheck size={72} className="text-emerald-600 flex-shrink-0" />;
      case 'caution': return <ShieldAlert size={72} className="text-amber-600 flex-shrink-0" />;
      case 'danger': return <ShieldAlert size={72} className="text-rose-600 flex-shrink-0" />;
      default: return <ShieldQuestion size={72} className="text-slate-400 flex-shrink-0" />;
    }
  };

  const getRiskLabel = () => {
    switch (result?.risk) {
      case 'safe': return 'This Message Looks Safe!';
      case 'caution': return 'Please Use Caution!';
      case 'danger': return 'Warning: Likely a Scam!';
      default: return '';
    }
  };

  const getProbabilityColor = () => {
    if (!result) return '';
    if (result.probability >= 60) return 'bg-rose-500';
    if (result.probability >= 30) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 px-4 text-slate-800">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b-2 border-slate-100 pb-4 mb-8 gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-700 hover:text-slate-900 text-lg font-bold min-h-[48px] px-5 py-2.5 bg-white border-2 border-slate-200 border-b-4 border-b-slate-300 hover:border-slate-300 hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-2 transition-all rounded-2xl shadow-sm hover:shadow-md"
        >
          <ArrowLeft size={24} /> Back
        </button>

        <div className="flex items-center gap-3">
          <Shield size={36} className="text-teal-600 hidden sm:inline" />
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950">Scam Detector</h1>
        </div>
        <div className="w-[80px] hidden sm:block" />
      </div>

      <p className="text-xl text-slate-600 mb-8 font-medium leading-relaxed">
        Keep yourself safe from digital fraud. Paste any email message, text, or link below to run an instant safety evaluation.
      </p>

      {/* Input Section */}
      <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 mb-8">
        <label className="block text-2xl font-black text-slate-900 mb-4">
          Paste the message or link to analyze
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste the suspicious text, email, or website link here..."
          className="w-full min-h-[160px] p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-xl focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all resize-y font-medium"
          rows={5}
        />
        <button
          onClick={analyzeText}
          disabled={!input.trim() || isScanning}
          className={`mt-4 w-full py-5 rounded-2xl text-2xl font-black flex items-center justify-center gap-3 transition-all border-b-4 hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-2 shadow-md ${
            !input.trim() || isScanning
              ? 'bg-slate-200 border-transparent text-slate-400 border-b-0 cursor-not-allowed shadow-none'
              : 'bg-teal-600 border-teal-800 hover:border-teal-700 text-white'
          }`}
        >
          <Search size={28} />
          {isScanning ? 'Analyzing message closely...' : 'Analyze Message'}
        </button>
      </section>

      {/* Results Section */}
      {result && (
        <section className={`rounded-2xl p-6 md:p-8 border-2 border-b-4 shadow-md ${getRiskColor().bg} ${getRiskColor().border} ${getRiskColor().text} transition-all`}>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
            <div className="flex-shrink-0 bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
              {getRiskIcon()}
            </div>
            <div className="flex-1 text-center md:text-left w-full">
              <h2 className="text-3xl font-black mb-2 leading-tight">
                {getRiskLabel()}
              </h2>
              <p className="text-2xl font-bold mb-4">
                Scam Probability Score: <span className="font-black underline">{result.probability}%</span>
              </p>

              {/* Probability Bar */}
              <div className="w-full bg-slate-200/80 rounded-full h-7 mb-6 overflow-hidden border border-slate-350">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${getProbabilityColor()}`}
                  style={{ width: `${result.probability}%` }}
                />
              </div>

              {/* Reasons */}
              <div className="mb-6 bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-slate-200/20">
                <h3 className="text-xl font-black mb-3 flex items-center justify-center md:justify-start gap-2 border-b border-slate-300/30 pb-2">
                  <AlertTriangle size={24} className="text-amber-600" />
                  Analysis Details
                </h3>
                <ul className="space-y-3.5 text-left">
                  {result.reasons.map((reason, i) => (
                    <li key={i} className="flex items-start gap-3 text-lg font-bold">
                      <Info size={22} className="flex-shrink-0 mt-0.5 text-teal-600" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Actions */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-slate-200/20">
                <h3 className="text-xl font-black mb-3 flex items-center justify-center md:justify-start gap-2 border-b border-slate-300/30 pb-2">
                  <CheckCircle size={24} className="text-emerald-600" />
                  Recommended Safe Actions
                </h3>
                <ul className="space-y-3.5 text-left">
                  {result.actions.map((action, i) => (
                    <li key={i} className="flex items-start gap-3 text-lg font-bold">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center text-sm font-black mt-0.5">
                        {i + 1}
                      </span>
                      <span className="leading-snug">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Safety Tips */}
      <section className="mt-8 bg-amber-50 border-2 border-amber-200 border-b-4 border-b-amber-300 rounded-2xl p-6 md:p-8">
        <h3 className="text-xl font-black text-amber-950 mb-4 flex items-center gap-2">🛡️ Daily Security Guidelines</h3>
        <ul className="space-y-3 text-lg text-amber-900 font-bold leading-relaxed">
          <li className="flex items-start gap-2">
            <span className="text-amber-500">•</span>
            <span>Never share sensitive passwords, login PINs, or social security details via email or text message.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-500">•</span>
            <span>Legitimate commercial institutions or banks will never demand payment in Gift Cards or Bitcoin.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-500">•</span>
            <span>Hover or carefully review links before tapping on them to see exactly where they are directing you.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-500">•</span>
            <span>When in deep doubt, always contact the company directly using a phone number printed on your physical statement.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-500">•</span>
            <span>Report suspicious messages to the Federal Trade Commission at <strong className="underline">ReportFraud.ftc.gov</strong>.</span>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default ScamDetector;
