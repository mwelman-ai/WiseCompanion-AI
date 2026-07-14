import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiFetch } from '../lib/api';
import { Heart, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      login(data.token, data.user);
      navigate('/pricing');
    } catch (err: any) {
      setError(err.message || 'Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: '60px auto', padding: '0 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <Heart size={48} color="#0d9488" fill="#0d9488" />
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#1e293b', margin: '12px 0 4px' }}>Welcome Back</h1>
        <p style={{ fontSize: 18, color: '#64748b', margin: 0 }}>Sign in to your WiseCompanion account</p>
      </div>

      <form onSubmit={handleSubmit} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 20, padding: 32, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
        {error && <p style={{ color: '#dc2626', fontSize: 16, margin: '0 0 16px', padding: 12, background: '#fef2f2', borderRadius: 10 }}>{error}</p>}

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 700, fontSize: 16, color: '#1e293b', display: 'block', marginBottom: 6 }}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required
            style={{ width: '100%', minHeight: 50, borderRadius: 12, border: '2px solid #e2e8f0', padding: '0 16px', fontSize: 17, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
            onFocus={e => e.target.style.borderColor = '#0d9488'}
            onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ fontWeight: 700, fontSize: 16, color: '#1e293b', display: 'block', marginBottom: 6 }}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Your password" required
            style={{ width: '100%', minHeight: 50, borderRadius: 12, border: '2px solid #e2e8f0', padding: '0 16px', fontSize: 17, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
            onFocus={e => e.target.style.borderColor = '#0d9488'}
            onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
        </div>

        <button type="submit" disabled={loading}
          style={{ width: '100%', minHeight: 54, borderRadius: 14, border: 'none', background: 'linear-gradient(135deg, #0d9488, #14b8a6)', color: 'white', fontSize: 19, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(13,148,136,0.3)' }}>
          {loading ? 'Signing in...' : 'Sign In'} <ArrowRight size={20} />
        </button>

        <p style={{ textAlign: 'center', fontSize: 16, color: '#64748b', marginTop: 20 }}>
          No account? <Link to="/signup" style={{ color: '#0d9488', fontWeight: 700, textDecoration: 'none' }}>Create one free</Link>
        </p>
      </form>
    </div>
  );
}
