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
      borderBottom: '2px solid var(--color-border)',
      backgroundColor: 'var(--bg-card)',
      padding: '12px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: '16px',
      marginBottom: '20px',
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit' }}>
        <Heart style={{ width: 32, height: 32, color: '#f43f5e' }} />
        <span style={{ fontSize: 26, fontWeight: 800 }}>WiseCompanion</span>
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link to="/" style={{ fontSize: 18, fontWeight: 600, textDecoration: 'none', color: 'inherit' }}>
          Home
        </Link>
        <button
          onClick={handleToggle}
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            border: '2px solid var(--color-border)',
            backgroundColor: 'var(--bg-app)',
            color: 'var(--color-text)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
          }}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;