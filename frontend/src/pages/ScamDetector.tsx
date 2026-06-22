import { useState } from 'react';
import { Shield, ShieldCheck, ShieldAlert, ShieldQuestion, ArrowLeft, Search, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
      case 'safe': return { bg: 'bg-green-50 border-green-200', text: 'text-green-800', icon: 'text-green-600' };
      case 'caution': return { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-800', icon: 'text-amber-600' };
      case 'danger': return { bg: 'bg-red-50 border-red-200', text: 'text-red-800', icon: 'text-red-600' };
      default: return { bg: 'bg-slate-50 border-slate-200', text: 'text-slate-800', icon: 'text-slate-600' };
    }
  };

  const getRiskIcon = () => {
    switch (result?.risk) {
      case 'safe': return <ShieldCheck size={72} className="text-green-600" />;
      case 'caution': return <ShieldAlert size={72} className="text-amber-600" />;
      case 'danger': return <ShieldAlert size={72} className="text-red-600" />;
      default: return <ShieldQuestion size={72} className="text-slate-400" />;
    }
  };

  const getRiskLabel = () => {
    switch (result?.risk) {
      case 'safe': return 'Looks Safe';
      case 'caution': return 'Use Caution';
      case 'danger': return 'Likely a Scam!';
      default: return '';
    }
  };

  const getProbabilityColor = () => {
    if (!result) return '';
    if (result.probability >= 60) return 'bg-red-500';
    if (result.probability >= 30) return 'bg-amber-500';
    return 'bg-green-500';
  };

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
          <Shield size={36} className="text-blue-600" />
          Scam Detector
        </h1>
        <p className="text-xl text-slate-600 mt-2">
          Paste an email, text message, or URL below to check if it's a scam.
        </p>
      </header>

      {/* Input Section */}
      <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8">
        <label className="block text-2xl font-bold text-slate-800 mb-4">
          Paste the message or link to analyze
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste the suspicious email, text, or URL here..."
          className="w-full min-h-[160px] p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xl focus:border-blue-500 focus:outline-none transition-all resize-y"
          rows={5}
        />
        <button
          onClick={analyzeText}
          disabled={!input.trim() || isScanning}
          className={`mt-4 w-full py-5 rounded-2xl text-2xl font-bold flex items-center justify-center gap-3 transition-all ${
            !input.trim() || isScanning
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-blue-600 text-white shadow-lg hover:bg-blue-700'
          }`}
        >
          <Search size={28} />
          {isScanning ? 'Analyzing...' : 'Analyze Message'}
        </button>
      </section>

      {/* Results Section */}
      {result && (
        <section className={`rounded-3xl p-8 border-2 ${getRiskColor().bg} ${getRiskColor().text} transition-all`}>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="flex-shrink-0">
              {getRiskIcon()}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className={`text-3xl font-bold mb-2 ${getRiskColor().text}`}>
                {getRiskLabel()}
              </h2>
              <p className="text-2xl font-semibold mb-4">
                Scam Probability: <span className="font-black">{result.probability}%</span>
              </p>

              {/* Probability Bar */}
              <div className="w-full bg-slate-200 rounded-full h-6 mb-6 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${getProbabilityColor()}`}
                  style={{ width: `${result.probability}%` }}
                />
              </div>

              {/* Reasons */}
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <AlertTriangle size={24} />
                  Analysis Details
                </h3>
                <ul className="space-y-3">
                  {result.reasons.map((reason, i) => (
                    <li key={i} className="flex items-start gap-3 text-lg">
                      <Info size={22} className="flex-shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Actions */}
              <div>
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <CheckCircle size={24} />
                  Recommended Actions
                </h3>
                <ul className="space-y-3">
                  {result.actions.map((action, i) => (
                    <li key={i} className="flex items-start gap-3 text-lg font-medium">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold mt-0.5">
                        {i + 1}
                      </span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tips */}
      <section className="mt-8 bg-amber-50 border-2 border-amber-200 rounded-3xl p-6">
        <h3 className="text-xl font-bold text-amber-800 mb-3">🛡️ Tips to Stay Safe</h3>
        <ul className="space-y-2 text-lg text-amber-900">
          <li>• Never share passwords, PINs, or social security numbers via email or text</li>
          <li>• Legitimate companies won't ask for gift card payments</li>
          <li>• Hover over links before clicking to see where they really go</li>
          <li>• When in doubt, contact the company directly using a trusted number</li>
          <li>• Report scams to the FTC at <strong>ReportFraud.ftc.gov</strong></li>
        </ul>
      </section>
    </div>
  );
};

export default ScamDetector;