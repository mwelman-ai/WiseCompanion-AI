import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import Pricing from './pages/Pricing';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import Ask from './pages/Ask';
import Health from './pages/Health';
import Medications from './pages/Medications';
import Travel from './pages/Travel';
import Family from './pages/Family';
import ScamDetector from './pages/ScamDetector';
import SafeWeb from './pages/SafeWeb';
import Community from './pages/Community';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Success from './pages/Success';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

function App() {
  useEffect(() => {
    document.title = 'Golden Years';
    const saved = localStorage.getItem('wisecompanion-dark-mode');
    if (saved === 'true') {
      document.body.classList.add('dark-mode');
    }
    const savedFont = localStorage.getItem('wisecompanion-font-size');
    if (savedFont) {
      document.body.classList.add(savedFont);
    }
  }, []);

  const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('wisecompanion-dark-mode', isDark.toString());
  };

  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar onToggleDarkMode={toggleDarkMode} />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/ask" element={<Ask />} />
              <Route path="/health" element={<Health />} />
              <Route path="/medications" element={<Medications />} />
              <Route path="/travel" element={<Travel />} />
              <Route path="/family" element={<Family />} />
              <Route path="/scam-detector" element={<ScamDetector />} />
              <Route path="/safe-web" element={<SafeWeb />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/success" element={<Success />} />
              <Route path="/community" element={<Community />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
