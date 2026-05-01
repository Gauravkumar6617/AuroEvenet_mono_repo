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
import UserDashboard from './pages/UserDashboard';
import CreatePost from './pages/CreatePost';
import About from './pages/About';
import Contact from './pages/Contact';
import Features from './pages/Features';
import Blog from './pages/Blog';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <PostsProvider>
        <CategoriesProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-white font-sans selection:bg-black selection:text-white text-black">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/verify-otp" element={<VerifyOtp />} />
                  <Route path="/oauth/callback" element={<OAuthCallback />} />
                  <Route path="/dashboard" element={<UserDashboard />} />
                  <Route path="/create-post" element={<CreatePost />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/features" element={<Features />} />
                  <Route path="/blog" element={<Blog />} />
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
