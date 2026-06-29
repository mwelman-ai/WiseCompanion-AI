import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const features = [
  {
    icon: '🧠',
    title: 'AI Ideas Tailored to Your Niche',
    description: 'Our AI generates content ideas specifically for your niche — tech, beauty, fitness, gaming, and more. No generic suggestions, just relevant inspiration.',
  },
  {
    icon: '🎣',
    title: 'Hooks That Grab Attention',
    description: 'The first 3 seconds make or break your content. Get proven hook formulas and opening lines that stop the scroll and drive engagement.',
  },
  {
    icon: '📱',
    title: 'Platform-Specific Optimization',
    description: 'Ideas optimized for TikTok, Instagram, YouTube, and Twitter. Each platform gets tailored hooks, formats, and SEO recommendations.',
  },
  {
    icon: '⚡',
    title: 'Beat Content Block Forever',
    description: 'Never stare at a blank page again. Generate unlimited ideas, save your favorites, and keep your content pipeline full.',
  },
];

export default function Landing() {
  return (
    <div className="landing-page">
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-badge">🔥 AI-Powered Content Creation</div>
        <h1 className="hero-title">
          Never Run Out of <span className="gradient-text">Content Ideas</span> Again
        </h1>
        <p className="hero-subtitle">
          SparkStream delivers AI-powered, niche-specific content ideas, hooks, and scripts
          so you can create consistently and grow your audience — without the burnout.
        </p>
        <div className="hero-cta">
          <Link to="/signup" className="btn btn-primary btn-lg">
            Start Creating Free →
          </Link>
          <Link to="/login" className="btn btn-secondary btn-lg">
            Sign In
          </Link>
        </div>
        <p className="hero-trust">No credit card required • 2 free ideas/month</p>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <h2 className="section-title">Why Creators Love SparkStream</h2>
        <p className="section-subtitle">
          Everything you need to create better content, faster.
        </p>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works" id="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <p className="section-subtitle">Three simple steps to never run out of ideas.</p>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Pick Your Niche</h3>
            <p>Tell us what you create content about — tech, beauty, fitness, gaming, or anything else.</p>
          </div>
          <div className="step-connector" />
          <div className="step">
            <div className="step-number">2</div>
            <h3>Get AI Ideas Instantly</h3>
            <p>Our AI generates attention-grabbing hooks, titles, and scripts tailored to your niche and platform.</p>
          </div>
          <div className="step-connector" />
          <div className="step">
            <div className="step-number">3</div>
            <h3>Create & Post</h3>
            <p>Use the ideas to create content fast. Track what you've posted and watch your audience grow.</p>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="pricing" id="pricing">
        <h2 className="section-title">Simple, Transparent Pricing</h2>
        <p className="section-subtitle">Start free, upgrade when you need more power.</p>
        <div className="pricing-grid">
          <div className="pricing-card">
            <h3 className="plan-name">Free</h3>
            <div className="plan-price">
              <span className="price">$0</span>
              <span className="period">/month</span>
            </div>
            <ul className="plan-features">
              <li>✓ 2 content ideas</li>
              <li>✓ Basic hooks & titles</li>
              <li>✓ Single platform</li>
            </ul>
            <Link to="/signup" className="btn btn-secondary btn-block">Get Started</Link>
          </div>
          <div className="pricing-card pricing-card-highlighted">
            <div className="popular-badge">Most Popular</div>
            <h3 className="plan-name">Pro</h3>
            <div className="plan-price">
              <span className="price">$20</span>
              <span className="period">/month</span>
            </div>
            <ul className="plan-features">
              <li>✓ 50 content ideas/month</li>
              <li>✓ Full hooks & scripts</li>
              <li>✓ All platforms</li>
              <li>✓ Trending audio alerts</li>
              <li>✓ Platform SEO optimization</li>
              <li>✓ Priority support</li>
            </ul>
            <Link to="/signup" className="btn btn-primary btn-block">Subscribe</Link>
          </div>
          <div className="pricing-card">
            <h3 className="plan-name">Premium</h3>
            <div className="plan-price">
              <span className="price">$29</span>
              <span className="period">/month</span>
            </div>
            <ul className="plan-features">
              <li>✓ Unlimited ideas</li>
              <li>✓ Full hooks & scripts</li>
              <li>✓ All platforms</li>
              <li>✓ Trending audio alerts</li>
              <li>✓ Platform SEO optimization</li>
              <li>✓ API access</li>
              <li>✓ Dedicated support</li>
            </ul>
            <Link to="/signup" className="btn btn-secondary btn-block">Subscribe</Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="cta-section">
        <h2>Ready to Break Free from Content Block?</h2>
        <p>Join thousands of creators using SparkStream to stay consistent and grow.</p>
        <Link to="/signup" className="btn btn-cta btn-lg">Start Creating Free →</Link>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="footer-logo">✨ SparkStream</span>
            <p>AI-powered content ideation for creators.</p>
          </div>
          <div className="footer-links">
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#how-it-works">How It Works</a>
          </div>
          <div className="footer-links">
            <h4>Company</h4>
            <a href="#">About</a>
            <a href="#">Blog</a>
            <a href="#">Contact</a>
          </div>
          <div className="footer-links">
            <h4>Legal</h4>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 SparkStream. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}