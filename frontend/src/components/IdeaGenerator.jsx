import { useState } from 'react';
import { api } from '../api/client';

const PLATFORMS = ['tiktok', 'instagram', 'youtube', 'twitter'];

export default function IdeaGenerator({ onIdeasGenerated }) {
  const [niche, setNiche] = useState('');
  const [platform, setPlatform] = useState('tiktok');
  const [count, setCount] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!niche.trim()) {
      setError('Please enter a niche');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const res = await api.ideas.generate(niche, platform, count);
      if (onIdeasGenerated) onIdeasGenerated(res.ideas);
    } catch (err) {
      setError(err.message || 'Failed to generate ideas');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="idea-generator">
      <h2>Generate Content Ideas</h2>
      <form onSubmit={handleGenerate} className="generator-form">
        <div className="form-group">
          <label htmlFor="niche">Your Niche</label>
          <input
            id="niche"
            type="text"
            placeholder="e.g., tech, beauty, fitness, gaming"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="platform">Platform</label>
            <select id="platform" value={platform} onChange={(e) => setPlatform(e.target.value)} disabled={isLoading}>
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="count">Number of Ideas</label>
            <select id="count" value={count} onChange={(e) => setCount(Number(e.target.value))} disabled={isLoading}>
              {[3, 5, 10].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>
        {error && <div className="form-error">{error}</div>}
        <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
          {isLoading ? '✨ Generating...' : '✨ Generate Ideas'}
        </button>
      </form>
    </div>
  );
}