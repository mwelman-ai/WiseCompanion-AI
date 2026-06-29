/**
 * Frontend component tests for the SparkStream App
 * 
 * Tests the App component renders routing correctly
 * and tests individual page components.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext.jsx';
import App from '../App.jsx';

beforeEach(() => {
  cleanup();
  localStorage.clear();
});

// Helper to render with router and auth context
function renderWithProviders(ui, { initialEntries = ['/'] } = {}) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <AuthProvider>
        {ui}
      </AuthProvider>
    </MemoryRouter>
  );
}

// Simplified wrapper for components that don't use AuthContext
function renderWithRouter(ui, { initialEntries = ['/'] } = {}) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      {ui}
    </MemoryRouter>
  );
}

describe('App Routing', () => {
  it('renders the landing page at root path', () => {
    render(<App />);
    expect(screen.getByText(/SparkStream/i)).toBeInTheDocument();
  });

  it('renders Navbar with branding', () => {
    render(<App />);
    const brandElements = screen.getAllByText(/SparkStream/i);
    expect(brandElements.length).toBeGreaterThanOrEqual(1);
  });
});

describe('Landing Page', () => {
  it('renders the hero section', async () => {
    const Landing = (await import('../pages/Landing.jsx')).default;
    renderWithProviders(<Landing />);
    
    expect(screen.getByText(/SparkStream/i)).toBeInTheDocument();
    expect(screen.getByText(/Never Run Out of/i)).toBeInTheDocument();
    expect(screen.getByText(/Content Ideas/i)).toBeInTheDocument();
  });

  it('renders call-to-action buttons', async () => {
    const Landing = (await import('../pages/Landing.jsx')).default;
    renderWithProviders(<Landing />);
    
    expect(screen.getByText('Start Creating Free →')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('renders features section', async () => {
    const Landing = (await import('../pages/Landing.jsx')).default;
    renderWithProviders(<Landing />);
    
    expect(screen.getByText('Why Creators Love SparkStream')).toBeInTheDocument();
    expect(screen.getByText('AI Ideas Tailored to Your Niche')).toBeInTheDocument();
    expect(screen.getByText('Hooks That Grab Attention')).toBeInTheDocument();
    expect(screen.getByText('Beat Content Block Forever')).toBeInTheDocument();
  });

  it('renders pricing section', async () => {
    const Landing = (await import('../pages/Landing.jsx')).default;
    renderWithProviders(<Landing />);
    
    expect(screen.getByText('Simple, Transparent Pricing')).toBeInTheDocument();
    expect(screen.getByText('Free')).toBeInTheDocument();
    expect(screen.getByText('Pro')).toBeInTheDocument();
    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('renders how it works section', async () => {
    const Landing = (await import('../pages/Landing.jsx')).default;
    renderWithProviders(<Landing />);
    
    expect(screen.getByText('How It Works')).toBeInTheDocument();
    expect(screen.getByText('Pick Your Niche')).toBeInTheDocument();
    expect(screen.getByText('Get AI Ideas Instantly')).toBeInTheDocument();
    expect(screen.getByText('Create & Post')).toBeInTheDocument();
  });

  it('renders footer', async () => {
    const Landing = (await import('../pages/Landing.jsx')).default;
    renderWithProviders(<Landing />);
    
    expect(screen.getByText(/2025 SparkStream/)).toBeInTheDocument();
  });
});

describe('Login Page', () => {
  it('renders login form', async () => {
    const Login = (await import('../pages/Login.jsx')).default;
    renderWithProviders(<Login />);
    
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('renders signup link in login page', async () => {
    const Login = (await import('../pages/Login.jsx')).default;
    renderWithProviders(<Login />);
    
    expect(screen.getByText('No account?')).toBeInTheDocument();
    expect(screen.getByText('Sign up')).toBeInTheDocument();
  });
});

describe('Signup Page', () => {
  it('renders signup form', async () => {
    const Signup = (await import('../pages/Signup.jsx')).default;
    renderWithProviders(<Signup />);
    
    expect(screen.getAllByText('Sign Up').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });
});

describe('Pricing Page', () => {
  it('renders pricing plans', async () => {
    const Pricing = (await import('../pages/Pricing.jsx')).default;
    renderWithProviders(<Pricing />);
    
    expect(screen.getByText('Free')).toBeInTheDocument();
    expect(screen.getByText('Pro')).toBeInTheDocument();
    expect(screen.getByText('Premium')).toBeInTheDocument();
  });
});

describe('Navbar Component', () => {
  it('renders navigation links when not authenticated', async () => {
    const Navbar = (await import('../components/Navbar.jsx')).default;
    renderWithProviders(<Navbar />);
    
    expect(screen.getByText(/SparkStream/i)).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Pricing')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });
});