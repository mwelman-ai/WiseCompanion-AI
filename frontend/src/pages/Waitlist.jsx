import { useState, useEffect } from 'react';
import { apiRequest } from '../api/client';
import { Link } from 'react-router-dom';

export default function Waitlist() {
  const [email, setEmail] = useState('');
  const [niche, setNiche] = useState('Tech');
  const [count, setCount] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const data = await apiRequest('/waitlist/count');
        setCount(data.count);
      } catch (err) {
        console.error('Failed to fetch waitlist count', err);
        // Fallback or silence error for count
      }
    };
    fetchCount();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await apiRequest('/waitlist/join', {
        method: 'POST',
        body: JSON.stringify({ email, niche }),
      });
      setSubmitted(true);
      // Refresh count
      const data = await apiRequest('/waitlist/count');
      setCount(data.count);
    } catch (err) {
      setError(err.message || 'Failed to join waitlist');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="waitlist-page-wrapper">
      <header className="navbar">
        <div className="navbar-container container">
          <Link to="/" className="navbar-logo">✨ SparkStream</Link>
        </div>
      </header>

      <main className="waitlist-container container">
        <div className="waitlist-card">
          <h1 className="waitlist-title">Get Early Access to SparkStream</h1>
          <p className="waitlist-subtitle">Be the first to try AI-powered content ideas</p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="waitlist-form">
              {error && <p className="error-message">{error}</p>}
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="waitlist-input"
                />
              </div>
              <div className="form-group">
                <select
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  className="waitlist-select"
                >
                  <option value="Tech">Tech</option>
                  <option value="Beauty">Beauty</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Cooking">Cooking</option>
                  <option value="Business">Business</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <button 
                type="submit" 
                className="btn btn-primary btn-lg btn-block"
                disabled={isLoading}
              >
                {isLoading ? 'Joining...' : 'Join the Waitlist'}
              </button>
            </form>
          ) : (
            <div className="waitlist-success">
              <h2>You're on the list! 🎉</h2>
              <p>We'll let you know as soon as SparkStream is ready for you.</p>
              <Link to="/" className="btn btn-secondary" style={{ marginTop: '20px' }}>Back to Home</Link>
            </div>
          )}

          <div className="waitlist-stats">
            <p className="social-proof">
              Join <span className="highlight">{count}+</span> creators waiting
            </p>
          </div>
        </div>
      </main>

      <footer className="footer" style={{ marginTop: 'auto' }}>
        <div className="container">
          <p className="footer-bottom" style={{ borderTop: 'none' }}>&copy; 2025 SparkStream. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
