import { Link } from 'react-router-dom';
import { Heart, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

interface NavbarProps {
  onToggleDarkMode: () => void;
}

const Navbar = ({ onToggleDarkMode }: NavbarProps) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('wisecompanion-dark-mode');
    setIsDark(saved === 'true');
  }, []);

  const handleToggle = () => {
    setIsDark(!isDark);
    onToggleDarkMode();
  };

  return (
    <nav style={{
      backgroundColor: 'var(--bg-card)',
      borderRadius: 'var(--radius-xl)',
      padding: '12px 24px',
      marginBottom: '24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      border: '1px solid var(--color-border)',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'inherit' }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: 'linear-gradient(135deg, #0d9488, #14b8a6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Heart size={22} color="white" fill="white" />
        </div>
        <span style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-text)' }}>WiseCompanion</span>
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link to="/" style={{ fontSize: 17, fontWeight: 600, textDecoration: 'none', color: 'var(--color-text-muted)', transition: 'color 0.2s' }}
          onMouseEnter={e => { (e.target as HTMLElement).style.color = 'var(--color-primary)'; }}
          onMouseLeave={e => { (e.target as HTMLElement).style.color = 'var(--color-text-muted)'; }}>
          Home
        </Link>
        <button
          onClick={handleToggle}
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--bg-app)',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = 'var(--color-primary)'; (e.target as HTMLElement).style.color = 'var(--color-primary)'; }}
          onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = 'var(--color-border)'; (e.target as HTMLElement).style.color = 'var(--color-text-muted)'; }}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;