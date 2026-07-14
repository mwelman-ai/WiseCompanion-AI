import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Success() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId && sessionId.startsWith('mock_') && isAuthenticated) {
      // Auto-upgrade mock users
      fetch('/api/subscriptions/mock-upgrade-direct', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('wctoken')}`,
          'Content-Type': 'application/json',
        }
      }).catch(() => {});
    }

    const timer = setInterval(() => {
      setCountdown(c => c - 1);
    }, 1000);

    setTimeout(() => {
      navigate('/dashboard');
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)', padding: 20 }}>
      <div style={{ maxWidth: 500, width: '100%', textAlign: 'center' }}>
        <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'linear-gradient(135deg, #0d9488, #14b8a6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 8px 32px rgba(13,148,136,0.3)' }}>
          <Check size={48} color="white" strokeWidth={3} />
        </div>

        <h1 style={{ fontSize: 36, fontWeight: 800, color: '#1e293b', margin: '0 0 8px' }}>
          Welcome to Premium! 🎉
        </h1>
        <p style={{ fontSize: 19, color: '#64748b', lineHeight: 1.6, margin: '0 0 24px' }}>
          You now have unlimited access to all WiseCompanion features — voice chat, scam detection, health tracking, and more.
        </p>

        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 20, padding: 28, marginBottom: 24, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', margin: '0 0 16px' }}>
            <Sparkles size={20} style={{ color: '#0d9488', marginRight: 8, verticalAlign: 'middle' }} />
            What's unlocked:
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, textAlign: 'left' }}>
            {[
              'Unlimited voice chat',
              'Advanced scam detection',
              'Full health suite',
              'Unlimited medication reminders',
              'Travel assistant',
              'Priority support',
            ].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, color: '#334155' }}>
                <Check size={18} color="#0d9488" />
                {f}
              </div>
            ))}
          </div>
        </div>

        <div style={{ animation: 'pulse 2s infinite' }}>
          <button onClick={() => navigate('/dashboard')}
            style={{ background: 'linear-gradient(135deg, #0d9488, #14b8a6)', color: 'white', border: 'none', borderRadius: 14, padding: '16px 40px', fontSize: 20, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(13,148,136,0.3)' }}>
            Go to Dashboard →
          </button>
        </div>

        <p style={{ color: '#94a3b8', fontSize: 15, marginTop: 12 }}>
          Redirecting in {countdown} seconds...
        </p>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
      `}</style>
    </div>
  );
}