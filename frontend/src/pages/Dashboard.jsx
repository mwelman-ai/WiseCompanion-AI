import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../api/client';

export default function Dashboard() {
  const [ideas, setIdeas] = useState([]);
  const [niche, setNiche] = useState('');
  const [platform, setPlatform] = useState('TikTok');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchIdeas = async () => {
    try {
      const data = await apiRequest('/ideas');
      setIdeas(data);
    } catch (err) {
      console.error('Failed to fetch ideas', err);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await apiRequest('/ideas/generate', {
        method: 'POST',
        body: JSON.stringify({ niche, platform })
      });
      setNiche('');
      fetchIdeas();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await apiRequest(`/ideas/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      fetchIdeas();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  return (
    <div className="dashboard container">
      <header className="dashboard-header">
        <h1>Content Idea Dashboard</h1>
        <p className="subtitle">Generate and manage your content strategy</p>
      </header>
      
      <section className="generation-section">
        <div className="card">
          <h2>Generate New Ideas</h2>
          <form onSubmit={handleGenerate} className="generate-form">
            <div className="form-group">
              <label>What's your niche?</label>
              <input 
                type="text" 
                placeholder="e.g. Minimalist Home Decor, Python Tutorials" 
                value={niche} 
                onChange={e => setNiche(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Target Platform</label>
              <select value={platform} onChange={e => setPlatform(e.target.value)}>
                <option value="TikTok">TikTok</option>
                <option value="Instagram">Instagram</option>
                <option value="YouTube">YouTube</option>
              </select>
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'AI is thinking...' : 'Generate 3 Ideas'}
            </button>
          </form>
          {error && (
            <div className="error-message">
              <p>{error}</p>
              {error.toLowerCase().includes('limit') && (
                <Link to="/pricing" className="btn btn-primary btn-sm" style={{ marginTop: '10px' }}>
                  Upgrade to Pro — $20/mo →
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="ideas-feed">
        <h2>Your Idea Feed</h2>
        <div className="ideas-grid">
          {ideas.length === 0 ? (
            <div className="empty-state">
              <p>No ideas yet. Use the form above to start creating!</p>
            </div>
          ) : (
            ideas.map((idea) => (
              <div key={idea.id} className={`idea-card status-${idea.status}`}>
                <div className="idea-header">
                  <span className="badge platform-badge">{idea.platform}</span>
                  <span className={`badge status-badge ${idea.status}`}>{idea.status}</span>
                </div>
                <h3>{idea.title}</h3>
                
                <div className="idea-content">
                  <div className="content-section">
                    <h4>Hook</h4>
                    <p>{idea.hook}</p>
                  </div>
                  <div className="content-section">
                    <h4>Script/Outline</h4>
                    <p>{idea.script}</p>
                  </div>
                </div>

                <div className="idea-actions">
                  <button 
                    onClick={() => updateStatus(idea.id, 'saved')}
                    disabled={idea.status === 'saved'}
                    className="btn-outline btn-sm"
                  >
                    Save
                  </button>
                  <button 
                    onClick={() => updateStatus(idea.id, 'posted')}
                    disabled={idea.status === 'posted'}
                    className="btn-outline btn-sm"
                  >
                    Mark Posted
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
