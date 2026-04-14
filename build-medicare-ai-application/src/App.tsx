import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import HealthChecker from './pages/HealthChecker';
import HospitalFinder from './pages/HospitalFinder';
import Reminders from './pages/Reminders';
import About from './pages/About';
import Admin from './pages/Admin';

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/health-check" element={<HealthChecker />} />
                <Route path="/hospitals" element={<HospitalFinder />} />
                <Route path="/reminders" element={<Reminders />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </HashRouter>
    </AppProvider>
  );
}
