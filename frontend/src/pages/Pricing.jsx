import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Pricing() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      features: ['2 content ideas', 'Basic hooks & titles', 'Single platform'],
      cta: 'Get Started',
      to: '/signup',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '$20',
      period: '/month',
      features: ['50 content ideas/month', 'Full hooks & scripts', 'All platforms', 'Trending audio alerts', 'Platform SEO optimization', 'Priority support'],
      cta: 'Subscribe',
      to: '/signup',
      highlighted: true,
    },
    {
      name: 'Premium',
      price: '$29',
      period: '/month',
      features: ['Unlimited ideas', 'Full hooks & scripts', 'All platforms', 'Trending audio alerts', 'Platform SEO optimization', 'API access', 'Dedicated support'],
      cta: 'Subscribe',
      to: '/signup',
      highlighted: false,
    },
  ];

  return (
    <div className="pricing-page">
      <Navbar />
      <div className="pricing" style={{ paddingTop: '100px' }}>
        <h2 className="section-title">Simple, Transparent Pricing</h2>
        <p className="section-subtitle">Start free, upgrade when you need more power.</p>
        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <div className={`pricing-card ${plan.highlighted ? 'pricing-card-highlighted' : ''}`} key={index}>
              {plan.highlighted && <div className="popular-badge">Most Popular</div>}
              <h3 className="plan-name">{plan.name}</h3>
              <div className="plan-price">
                <span className="price">{plan.price}</span>
                <span className="period">{plan.period}</span>
              </div>
              <ul className="plan-features">
                {plan.features.map((feature, fi) => (
                  <li key={fi}>✓ {feature}</li>
                ))}
              </ul>
              <Link to={plan.to} className={`btn ${plan.highlighted ? 'btn-primary' : 'btn-secondary'} btn-block`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}