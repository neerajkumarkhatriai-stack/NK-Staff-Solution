import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { JobDetailPage } from './pages/JobDetailPage';
import { AdminPage } from './pages/AdminPage';
import { ApplyPage } from './pages/ApplyPage';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/job/:id" element={<JobDetailPage />} />
            <Route path="/apply/:jobId" element={<ApplyPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
        
        <footer className="bg-white border-t border-gray-100 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gray-500 text-sm mb-4">
              © {new Date().getFullYear()} NK Staff Solution. All rights reserved.
            </p>
            <p className="text-gray-400 text-xs">
              Helping Sonipat's manufacturing industry find the right talent.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}
