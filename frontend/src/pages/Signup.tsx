import { useState } from 'react';
import { Sparkles, Heart, ArrowRight, Check, Mail, Smartphone } from 'lucide-react';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [interest, setInterest] = useState('both');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, interest, source: 'signup-page' }),
      });
      if (res.ok) setSubmitted(true);
    } catch {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div style={{ maxWidth: 500, margin: '80px auto', padding: '0 20px', textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: 20, background: 'linear-gradient(135deg, #0d9488, #14b8a6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <Check size={40} color="white" />
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 800, margin: '0 0 12px', color: '#1e293b' }}>You're In! 🎉</h1>
        <p style={{ fontSize: 19, color: '#64748b', lineHeight: 1.6 }}>
          Thanks {name || 'friend'}! We'll keep you posted on SparkStream and WiseCompanion updates.
          No spam, unsubscribe anytime.
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 520, margin: '60px auto', padding: '0 20px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #0d9488, #14b8a6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={24} color="white" />
          </div>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #0d9488, #14b8a6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Heart size={24} color="white" fill="white" />
          </div>
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 800, margin: '0 0 8px', color: '#1e293b' }}>
          Stay in the Loop
        </h1>
        <p style={{ fontSize: 19, color: '#64748b', lineHeight: 1.6, margin: 0 }}>
          Get updates on <strong style={{ color: '#0d9488' }}>SparkStream</strong> (AI content ideas) &{' '}
          <strong style={{ color: '#0d9488' }}>WiseCompanion</strong> (AI for seniors 50+).
          New features, tips, and launch announcements.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{
        background: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: 20,
        padding: 36,
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
      }}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontWeight: 700, marginBottom: 8, fontSize: 17, color: '#1e293b' }}>
            Your Name
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter your name"
            style={{
              width: '100%',
              minHeight: 52,
              borderRadius: 12,
              border: '2px solid #e2e8f0',
              padding: '0 16px',
              fontSize: 18,
              fontFamily: 'inherit',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = '#0d9488'}
            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontWeight: 700, marginBottom: 8, fontSize: 17, color: '#1e293b' }}>
            Email Address <span style={{ color: '#dc2626' }}>*</span>
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{
              width: '100%',
              minHeight: 52,
              borderRadius: 12,
              border: '2px solid #e2e8f0',
              padding: '0 16px',
              fontSize: 18,
              fontFamily: 'inherit',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = '#0d9488'}
            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
          />
        </div>

        <div style={{ marginBottom: 28 }}>
          <label style={{ display: 'block', fontWeight: 700, marginBottom: 8, fontSize: 17, color: '#1e293b' }}>
            I'm interested in
          </label>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {[
              { value: 'sparkstream', label: '🚀 SparkStream' },
              { value: 'wisecompanion', label: '👴 WiseCompanion' },
              { value: 'both', label: '🔥 Both!' },
            ].map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setInterest(opt.value)}
                style={{
                  flex: 1,
                  minWidth: 120,
                  padding: '14px 20px',
                  borderRadius: 12,
                  border: interest === opt.value ? '2px solid #0d9488' : '2px solid #e2e8f0',
                  background: interest === opt.value ? 'rgba(13,148,136,0.06)' : 'white',
                  color: interest === opt.value ? '#0d9488' : '#64748b',
                  fontSize: 17,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            minHeight: 56,
            borderRadius: 14,
            border: 'none',
            background: 'linear-gradient(135deg, #0d9488, #14b8a6)',
            color: 'white',
            fontSize: 20,
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            fontFamily: 'inherit',
            transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: '0 4px 16px rgba(13,148,136,0.3)',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(13,148,136,0.4)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(13,148,136,0.3)'; }}
        >
          Join the List <ArrowRight size={22} />
        </button>

        <p style={{ textAlign: 'center', fontSize: 15, color: '#94a3b8', marginTop: 16, marginBottom: 0 }}>
          No spam. Unsubscribe anytime.
        </p>
      </form>

      {/* Products */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 24 }}>
        <a href="https://spark-stream-zaw9.vercel.app" target="_blank" rel="noopener noreferrer"
          style={{ textDecoration: 'none', padding: 16, borderRadius: 14, border: '1px solid #e2e8f0', background: 'white', textAlign: 'center', transition: 'all 0.2s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#0d9488'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}>
          <Sparkles size={24} style={{ color: '#0d9488', marginBottom: 6 }} />
          <div style={{ fontWeight: 700, color: '#1e293b', fontSize: 16 }}>SparkStream</div>
          <div style={{ fontSize: 14, color: '#64748b' }}>AI Content Ideas</div>
        </a>
        <a href="https://frontend-five-sigma-5n7kymm3xk.vercel.app" target="_blank" rel="noopener noreferrer"
          style={{ textDecoration: 'none', padding: 16, borderRadius: 14, border: '1px solid #e2e8f0', background: 'white', textAlign: 'center', transition: 'all 0.2s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#0d9488'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}>
          <Heart size={24} style={{ color: '#0d9488', marginBottom: 6 }} fill="#0d9488" />
          <div style={{ fontWeight: 700, color: '#1e293b', fontSize: 16 }}>WiseCompanion</div>
          <div style={{ fontSize: 14, color: '#64748b' }}>AI for Seniors 50+</div>
        </a>
      </div>
    </div>
  );
};

export default Signup;