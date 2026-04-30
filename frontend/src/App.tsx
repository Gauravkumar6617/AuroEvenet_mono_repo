import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PostsProvider } from './contexts/PostsContext';
import { CategoriesProvider } from './contexts/CategoriesContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyOtp from './pages/VerifyOtp';
import Home from './pages/Home';
import OAuthCallback from './pages/OAuthCallback';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <PostsProvider>
        <CategoriesProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-[#fafafa] font-sans selection:bg-black selection:text-white text-black">
              <Navbar />
              <main className="flex-grow container mx-auto px-4">
                <Routes>

                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/verify-otp" element={<VerifyOtp />} />
                  <Route path="/oauth/callback" element={<OAuthCallback />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </CategoriesProvider>
      </PostsProvider>
    </AuthProvider>
  );
};

export default App;
