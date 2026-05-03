import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { PostsProvider } from "./contexts/PostsContext";
import { CategoriesProvider } from "./contexts/CategoriesContext";
import { ToastProvider } from "./contexts/ToastContext";
import { AnimatePresence } from "framer-motion";

import HomeFooter from "./pages/home/HomeFooter";
import ToastViewport from "./components/ui/ToastViewport";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyOtp from "./pages/VerifyOtp";
import ForgotPassword from "./pages/ForgotPassword";
import OAuthCallback from "./pages/OAuthCallback";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import CreateEvent from "./pages/CreateEvent";
import Features from "./pages/Features";
import About from "./pages/About";
import Contact from "./pages/Contact";

import Nav from "./pages/home/Nav";
import EventDetail from "./pages/EventDetail";
import Event from "./pages/Event";
import { PersonalizationProvider } from "./contexts/PersonalizationContext";

function AppShell() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-slate-25 font-sans text-slate-900 selection:bg-brand-600 selection:text-white">
      <ToastViewport />
      <Nav />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/oauth/callback" element={<OAuthCallback />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/super-admin" element={<SuperAdminDashboard />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/create-post" element={<CreateEvent />} />
            <Route path="/event" element={<Event />} />
            <Route path="/features" element={<Features />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/events/:id" element={<EventDetail />} />
          </Routes>
        </AnimatePresence>
      </main>
      <HomeFooter />
    </div>
  );
}

const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <PostsProvider>
          <CategoriesProvider>
            <Router>
              <PersonalizationProvider>
                <AppShell />
              </PersonalizationProvider>
            </Router>
          </CategoriesProvider>
        </PostsProvider>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
