import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Pricing from './pages/Pricing';
import Dashboard from './pages/Dashboard';
import Ask from './pages/Ask';
import Health from './pages/Health';
import Medications from './pages/Medications';
import Travel from './pages/Travel';
import Family from './pages/Family';
import ScamDetector from './pages/ScamDetector';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ask" element={<Ask />} />
        <Route path="/health" element={<Health />} />
        <Route path="/medications" element={<Medications />} />
        <Route path="/travel" element={<Travel />} />
        <Route path="/family" element={<Family />} />
        <Route path="/scam-detector" element={<ScamDetector />} />
      </Routes>
    </Router>
  );
}

export default App;