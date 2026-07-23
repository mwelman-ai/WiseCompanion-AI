import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe, Search, ShieldAlert, ShieldCheck, Check, Info, Lock, Unlock, BookOpen, AlertTriangle, HelpCircle } from 'lucide-react';

interface ScanResult {
  status: 'safe' | 'danger' | 'caution' | null;
  message: string;
  domain: string;
  reasons: string[];
  checklist: { item: string; checked: boolean }[];
}

const SafeWeb = () => {
  const navigate = useNavigate();
  const [urlInput, setUrlInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [shieldActive, setShieldActive] = useState(true);

  // Quiz state
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const scanWebsite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setIsScanning(true);
    setScanResult(null);

    setTimeout(() => {
      const url = urlInput.trim().toLowerCase();
      let status: 'safe' | 'danger' | 'caution' = 'caution';
      let message = '';
      let domain = url;
      let reasons: string[] = [];
      let checklist: { item: string; checked: boolean }[] = [];

      // Clean domain for display
      try {
        let temp = url;
        if (!temp.startsWith('http://') && !temp.startsWith('https://')) {
          temp = 'https://' + temp;
        }
        const parsed = new URL(temp);
        domain = parsed.hostname;
      } catch {
        domain = url.split('/')[0];
      }

      // Check URL characteristics
      const isKnownSafe = /^(www\.)?(google\.com|wikipedia\.org|youtube\.com|facebook\.com|nytimes\.com|amazon\.com|yahoo\.com|aarp\.org|medicare\.gov|socialsecurity\.gov)$/.test(domain);
      const isSuspiciousTLD = /\.(xyz|top|club|online|site|biz|info|cc|net)$/.test(domain);
      const containsScamWord = /(login|verify|security|bank|account|signin|gift|free|prize|irs|update|ssn|cash|crypto|wallet)/.test(domain);

      if (isKnownSafe) {
        status = 'safe';
        message = 'This is a well-known, verified website.';
        reasons = [
          'Verified domain ownership',
          'Encrypted SSL connection is active',
          'No history of malicious activity on this address'
        ];
        checklist = [
          { item: 'Secure Connection (https://)', checked: true },
          { item: 'Official Domain Verification', checked: true },
          { item: 'No suspicious spelling detected', checked: true }
        ];
      } else if (isSuspiciousTLD || (containsScamWord && !isKnownSafe)) {
        status = 'danger';
        message = 'Warning: This website exhibits common scam indicators!';
        if (isSuspiciousTLD) {
          reasons.push(`Uses a suspicious web address ending (.${domain.split('.').pop()}) often preferred by scammers.`);
        }
        if (containsScamWord) {
          reasons.push(`Contains words like "verify" or "security" attempting to mimic a real financial institution or service.`);
        }
        reasons.push('This domain is newly registered or has a low safety rating.');
        checklist = [
          { item: 'Secure Connection (https://)', checked: false },
          { item: 'Official Domain Verification', checked: false },
          { item: 'No suspicious spelling detected', checked: false }
        ];
      } else {
        status = 'caution';
        message = 'Unverified website. Proceed with standard safety precautions.';
        reasons = [
          'Not in our database of verified safe websites',
          'Domain is secure but the content is unknown',
          'Always avoid entering passwords or credit cards on unverified sites'
        ];
        checklist = [
          { item: 'Secure Connection (https://)', checked: url.startsWith('https') },
          { item: 'Official Domain Verification', checked: false },
          { item: 'No suspicious spelling detected', checked: true }
        ];
      }

      setScanResult({
        status,
        message,
        domain,
        reasons,
        checklist
      });
      setIsScanning(false);
    }, 1000);
  };

  const handleQuizSelect = (id: number) => {
    if (quizSubmitted) return;
    setQuizAnswer(id);
  };

  const handleQuizSubmit = () => {
    if (quizAnswer === null) return;
    setQuizSubmitted(true);
  };

  const handleQuizReset = () => {
    setQuizAnswer(null);
    setQuizSubmitted(false);
  };

  const quizOptions = [
    {
      id: 1,
      url: 'https://www.chase-secure-login-portal.xyz',
      isScam: true,
      explanation: 'Scam! Official banks do not use ".xyz" domains or hyphens like "chase-secure-login-portal" to conduct official business.'
    },
    {
      id: 2,
      url: 'https://www.chase.com',
      isScam: false,
      explanation: 'Safe! This is the official and verified web domain for Chase Bank.'
    },
    {
      id: 3,
      url: 'https://www.chase-banking-support.online',
      isScam: true,
      explanation: 'Scam! Scammers set up ".online" or urgent sounding domains to steal passwords.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto pb-20 px-4 text-slate-800 animate-fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b-2 border-slate-100 pb-4 mb-8 gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-700 hover:text-slate-900 text-lg font-bold min-h-[48px] px-5 py-2.5 bg-white border-2 border-slate-200 border-b-4 border-b-slate-300 hover:border-slate-300 hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-2 transition-all rounded-2xl shadow-sm hover:shadow-md"
        >
          <ArrowLeft size={24} /> Back
        </button>

        <div className="flex items-center gap-3">
          <Globe size={36} className="text-teal-600 hidden sm:inline" />
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950">Safe Web Explorer</h1>
        </div>

        <div className="flex items-center">
          <button
            onClick={() => setShieldActive(!shieldActive)}
            className={`px-5 py-2.5 rounded-2xl flex items-center gap-2 text-lg font-bold shadow-md transition-all min-h-[48px] border-b-4 ${
              shieldActive
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-800 hover:border-emerald-700'
                : 'bg-slate-300 hover:bg-slate-200 text-slate-700 border-slate-400'
            } hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-2`}
          >
            {shieldActive ? (
              <>
                <ShieldCheck size={24} /> Shield Active
              </>
            ) : (
              <>
                <Unlock size={24} /> Shield Paused
              </>
            )}
          </button>
        </div>
      </div>

      <p className="text-xl text-slate-600 mb-8 font-medium leading-relaxed">
        Learn how to identify fake websites, check if links are safe before clicking, and practice browsing the internet with confidence.
      </p>

      {/* Website URL Checker */}
      <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 mb-8">
        <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-2">
          <Search className="text-teal-600" size={28} />
          Link Safety Checker
        </h2>
        <p className="text-lg text-slate-600 mb-6 leading-relaxed font-bold">
          Received a link in an email, text, or social media message? Paste it here to verify its safety before opening.
        </p>

        <form onSubmit={scanWebsite} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Paste web link here (e.g. www.google.com)"
            className="flex-1 px-5 py-4 border-2 border-slate-200 rounded-2xl text-lg focus:outline-none focus:border-teal-500 bg-slate-50 font-medium"
          />
          <button
            type="submit"
            disabled={isScanning}
            className="bg-teal-600 hover:bg-teal-500 text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-md hover:-translate-y-0.5 active:translate-y-0.5 border-b-4 border-teal-800 hover:border-teal-700 active:border-b-2 transition-all min-h-[48px] flex items-center justify-center gap-2"
          >
            {isScanning ? 'Checking website...' : 'Verify Link'}
          </button>
        </form>

        {/* Scan Results */}
        {scanResult && (
          <div className="mt-8 border-t-2 border-slate-100 pt-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Verification Analysis:</h3>

            <div
              className={`rounded-2xl p-6 flex flex-col md:flex-row items-start gap-4 border-2 ${
                scanResult.status === 'safe'
                  ? 'bg-emerald-50 border-emerald-200'
                  : scanResult.status === 'danger'
                  ? 'bg-rose-50 border-rose-200'
                  : 'bg-amber-50 border-amber-200'
              }`}
            >
              <div className="mt-1">
                {scanResult.status === 'safe' ? (
                  <ShieldCheck size={48} className="text-emerald-600" />
                ) : scanResult.status === 'danger' ? (
                  <ShieldAlert size={48} className="text-rose-600" />
                ) : (
                  <AlertTriangle size={48} className="text-amber-600" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xl font-black font-mono break-all">{scanResult.domain}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-black uppercase ${
                      scanResult.status === 'safe'
                        ? 'bg-emerald-200 text-emerald-800'
                        : scanResult.status === 'danger'
                        ? 'bg-rose-200 text-rose-800'
                        : 'bg-amber-200 text-amber-800'
                    }`}
                  >
                    {scanResult.status === 'safe' ? 'Verified Safe' : scanResult.status === 'danger' ? 'Scam Indicator' : 'Unverified / Caution'}
                  </span>
                </div>

                <p className="text-lg font-bold text-slate-800 mb-4">{scanResult.message}</p>

                <div className="mb-4">
                  <h4 className="font-extrabold text-slate-700 mb-2">Detailed Findings:</h4>
                  <ul className="space-y-1.5">
                    {scanResult.reasons.map((reason, index) => (
                      <li key={index} className="flex items-start gap-2 text-lg text-slate-600 font-medium leading-relaxed">
                        <span className="text-teal-600 mt-1">✔</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-extrabold text-slate-700 mb-2">Technical Indicators:</h4>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {scanResult.checklist.map((c, index) => (
                      <div key={index} className="bg-white/80 rounded-xl p-3 border border-slate-200/50 flex items-center gap-2.5">
                        <span className={c.checked ? 'text-emerald-600' : 'text-slate-400'}>
                          <Check size={20} className="stroke-[3]" />
                        </span>
                        <span className="text-sm font-bold text-slate-700">{c.item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Educational Checklist */}
      <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 mb-8">
        <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
          <BookOpen className="text-teal-600" size={28} />
          Safe Web Guide for Seniors
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
              <Lock size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">1. Look for the Padlock</h3>
            <p className="text-slate-600 text-lg leading-relaxed">
              Always look for the small Padlock icon next to the website URL at the top of your screen. This means your connection is secure and private.
            </p>
          </div>

          <div className="border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
              <Info size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">2. Double Check Spelling</h3>
            <p className="text-slate-600 text-lg leading-relaxed">
              Scammers often set up fake sites with small spelling changes. For example, using a zero (0) instead of the letter 'o' (like g00gle.com).
            </p>
          </div>

          <div className="border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">3. Beware of Urgency</h3>
            <p className="text-slate-600 text-lg leading-relaxed">
              If a website flashes sudden red alerts saying "VIRUS DETECTED" or "CALL SUPPORT NOW," close the page immediately. It's a deceptive popup.
            </p>
          </div>
        </div>
      </section>

      {/* Spot the Scam Website Mini-Game */}
      <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
        <h2 className="text-2xl font-black text-slate-900 mb-3 flex items-center gap-2">
          <HelpCircle className="text-teal-600" size={28} />
          Interactive Practice: Spot the Scam Link!
        </h2>
        <p className="text-lg text-slate-600 mb-6 font-bold">
          Put your safety knowledge to the test. Which of the following web links is a fraudulent scam designed to look like Chase Bank?
        </p>

        <div className="space-y-4">
          {quizOptions.map((opt) => {
            let btnClass = 'w-full text-left p-5 border-2 border-slate-200 rounded-2xl font-mono text-lg font-bold hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer min-h-[48px] flex justify-between items-center';
            if (quizSubmitted) {
              if (opt.id === quizAnswer) {
                btnClass = opt.isScam
                  ? 'w-full text-left p-5 border-2 border-emerald-300 bg-emerald-50 rounded-2xl font-mono text-lg font-bold transition-all min-h-[48px] flex justify-between items-center'
                  : 'w-full text-left p-5 border-2 border-rose-300 bg-rose-50 rounded-2xl font-mono text-lg font-bold transition-all min-h-[48px] flex justify-between items-center';
              } else if (opt.isScam) {
                // Highlight the correct answer if user got it wrong
                btnClass = 'w-full text-left p-5 border-2 border-emerald-200 bg-emerald-50/50 rounded-2xl font-mono text-lg font-bold transition-all min-h-[48px] flex justify-between items-center';
              }
            } else if (quizAnswer === opt.id) {
              btnClass = 'w-full text-left p-5 border-2 border-teal-500 bg-teal-50 rounded-2xl font-mono text-lg font-bold transition-all min-h-[48px] flex justify-between items-center';
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleQuizSelect(opt.id)}
                className={btnClass}
                disabled={quizSubmitted}
              >
                <span className="break-all">{opt.url}</span>
                {quizSubmitted && opt.isScam && (
                  <span className="bg-emerald-600 text-white font-sans text-xs uppercase font-extrabold px-3 py-1 rounded-full flex items-center gap-1">
                    <ShieldCheck size={14} /> Scam Link Identified
                  </span>
                )}
                {quizSubmitted && !opt.isScam && opt.id === quizAnswer && (
                  <span className="bg-rose-600 text-white font-sans text-xs uppercase font-extrabold px-3 py-1 rounded-full">
                    Incorrect Choice
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Action Controls for Quiz */}
        <div className="mt-6 flex flex-wrap gap-4 items-center justify-between">
          <div>
            {quizAnswer === null && !quizSubmitted && (
              <p className="text-slate-500 font-bold text-lg">Select a link above to test yourself.</p>
            )}
            {quizAnswer !== null && !quizSubmitted && (
              <button
                onClick={handleQuizSubmit}
                className="bg-teal-600 hover:bg-teal-500 text-white px-8 py-3.5 rounded-xl font-bold text-lg shadow-md hover:-translate-y-0.5 active:translate-y-0.5 transition-all border-b-4 border-teal-800"
              >
                Submit Answer
              </button>
            )}
            {quizSubmitted && (
              <button
                onClick={handleQuizReset}
                className="bg-slate-600 hover:bg-slate-500 text-white px-8 py-3.5 rounded-xl font-bold text-lg shadow-md hover:-translate-y-0.5 active:translate-y-0.5 transition-all border-b-4 border-slate-800"
              >
                Try Again
              </button>
            )}
          </div>

          {quizSubmitted && (
            <div className="flex-1 min-w-[280px]">
              <div className={`p-4 rounded-xl border ${quizOptions.find(o => o.id === quizAnswer)?.isScam ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'}`}>
                <p className="font-bold text-lg">
                  {quizOptions.find(o => o.id === quizAnswer)?.isScam 
                    ? '🎉 Correct! Brilliant spot! You identified the deceptive link.' 
                    : '💡 Not quite! Let\'s look at why:'}
                </p>
                <p className="text-md mt-1 leading-relaxed font-semibold">
                  {quizOptions.find(o => o.id === quizAnswer)?.explanation}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default SafeWeb;
