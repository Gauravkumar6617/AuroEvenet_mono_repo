import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { PostsProvider } from "./contexts/PostsContext";
import { CategoriesProvider } from "./contexts/CategoriesContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ConsentBanner from "./components/ConsentBanner";

import { GuestRoute } from "./components/routing/GuestRoute";
import { ProtectedRoute } from "./components/routing/ProtectedRoute";
import { RoleGuard } from "./components/routing/RoleGuard";

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
import NotFound from "./pages/NotFound";

import UserProfile from "./pages/UserProfile";
import CommunityList from "./pages/CommunityList";
import CommunityDetail from "./pages/CommunityDetail";
import CommunityRules from "./pages/CommunityRules";
import CommunityCreatePost from "./pages/CommunityCreatePost";
import SettingsTopics from "./pages/SettingsTopics";
import PrivacyPolicy from "./pages/PrivacyPolicy";

import { AnimatePresence } from "framer-motion";
import ToastViewport from "./components/ui/ToastViewport";
import { ToastProvider } from "./contexts/ToastContext";
import SearchPage from "./pages/SearchPage";

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
                      {/* Public */}
                      <Route path="/" element={<Home />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/features" element={<Features />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/blog/:slug" element={<BlogDetail />} />
                      <Route path="/search" element={<SearchPage />} />
                      <Route path="/communities" element={<CommunityList />} />
                      <Route path="/communities/:slug" element={<CommunityDetail />} />
                      <Route path="/communities/:slug/rules" element={<CommunityRules />} />
                      <Route path="/privacy" element={<PrivacyPolicy />} />

                      {/* Auth callbacks — public but state-aware */}
                      <Route path="/oauth/callback" element={<OAuthCallback />} />

                      {/* Guest-only (redirect to home if already logged in) */}
                      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
                      <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />
                      <Route path="/verify-otp" element={<GuestRoute><VerifyOtp /></GuestRoute>} />
                      <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />

                      {/* Authenticated only */}
                      <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
                      <Route path="/create-post" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
                      <Route path="/u/:username" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                      <Route path="/settings/topics" element={<ProtectedRoute><SettingsTopics /></ProtectedRoute>} />
                      <Route path="/communities/:slug/create-post" element={<ProtectedRoute><CommunityCreatePost /></ProtectedRoute>} />

                      {/* Admin only */}
                      <Route path="/admin" element={
                        <RoleGuard allowedRoles={["admin", "super_admin"]}>
                          <AdminDashboard />
                        </RoleGuard>
                      } />

                      {/* Super-admin only */}
                      <Route path="/super-admin" element={
                        <RoleGuard allowedRoles={["super_admin"]}>
                          <SuperAdminDashboard />
                        </RoleGuard>
                      } />

                      {/* 404 fallback */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </AnimatePresence>
                </main>
                <Footer />
                <ConsentBanner />
              </div>
            </Router>
          </CategoriesProvider>
        </PostsProvider>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
