import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Services from './pages/Services';
import Booking from './pages/Booking';
import ProfilePage from './pages/ProfilePage';
import MyBookings from './pages/MyBookings';
import Footer from './components/Footer';
import AdminDashboard from './pages/AdminDashboard';
import Contact from './pages/Contact';
import ScrollToTop from './components/ScrollToTop';
import { Toaster } from 'react-hot-toast';

const AppContent = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isProfile = location.pathname === '/profile';
  const isFullWidth = isHome || isProfile;

  return (
    <>
      <ScrollToTop />
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#333',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)',
        },
      }} />
      <div className="min-h-screen flex flex-col bg-black text-white relative selection:bg-primary selection:text-white">
        <Navbar />
        <main className={`flex-grow relative z-10 ${isFullWidth ? '' : 'container mx-auto px-4 py-8'}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/services" element={<Services />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        {isHome && <Footer />}
      </div>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
