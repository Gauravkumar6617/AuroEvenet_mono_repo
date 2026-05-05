import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { PostsProvider } from "./contexts/PostsContext";
import { CategoriesProvider } from "./contexts/CategoriesContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyOtp from "./pages/VerifyOtp";
import Home from "./pages/Home";
import OAuthCallback from "./pages/OAuthCallback";
import UserDashboard from "./pages/UserDashboard";
import CreatePost from "./pages/CreatePost";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Features from "./pages/Features";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import AdminDashboard from "./pages/AdminDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import { AnimatePresence } from "framer-motion";
import ToastViewport from "./components/ui/ToastViewport";
import { ToastProvider } from "./contexts/ToastContext";

const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <PostsProvider>
          <CategoriesProvider>
            <Router>
              <div className="min-h-screen flex flex-col" style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: "#f5f4f0" }}>
                <Navbar />
                <ToastViewport />
                <main className="flex-grow">
                  <AnimatePresence mode="wait">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />
                      <Route path="/verify-otp" element={<VerifyOtp />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/oauth/callback" element={<OAuthCallback />} />
                      <Route path="/dashboard" element={<UserDashboard />} />
                      <Route path="/admin" element={<AdminDashboard />} />
                      <Route path="/super-admin" element={<SuperAdminDashboard />} />
                      <Route path="/create-post" element={<CreatePost />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/features" element={<Features />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/blog/:slug" element={<BlogDetail />} />
                    </Routes>
                  </AnimatePresence>
                </main>
                <Footer />
              </div>
            </Router>
          </CategoriesProvider>
        </PostsProvider>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
