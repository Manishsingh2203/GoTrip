import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Home from '../pages/Home';
import Places from '../pages/Places';
import PlaceDetails from '../pages/PlaceDetails';
import PlanTrip from '../pages/PlanTrip';
import Checklist from '../pages/Checklist';
import Login from '../pages/Login';
import Signup from '../pages/Signup';   // ✅ ADDED
import Loader from '../components/common/Loader';
import TransportPage from '../pages/Transport';
import TransportSearch from "../pages/TransportSearch";
import ItineraryPage from "../pages/ItineraryPage";
import WorldPlaces from "../pages/WorldPlaces";
import WorldPlaceDetails from "../pages/WorldPlaceDetails";
import FlightsSearch from "../pages/FlightsSearch";
import HotelsSearch from "../pages/HotelsSearch";
import TrainsSearch from "../pages/TrainsSearch";
import About from "../pages/About";
import Team from "../pages/Team";
import Careers from "../pages/Careers";
import Blog from "../pages/Blog";
import HelpCenter from "../pages/HelpCenter";
import Contact from "../pages/Contact";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import Terms from "../pages/Terms";
import Sitemap from "../pages/Sitemap";
import DownloadApp from "../pages/DownloadApp";
import LearnMore from "../pages/LearnMore";
import ExploreDeals from "../pages/ExploreDeals";
import DealDetails from "../pages/DealDetails";
import DealsComingSoon from "../pages/DealsComingSoon";
import IndiaPlaces from "../pages/IndiaPlaces";
import IndiaPlaceDetails from "../pages/IndiaPlaceDetails";
import OAuthComplete from "../pages/OAuthComplete";

// Scroll to Top
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Protected Route
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading..." />
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public/Auth Route (redirect if logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

const AppRoutes = () => {
  const location = useLocation();

  // Routes where navbar and footer should NOT show
  const hideLayoutRoutes = ["/login", "/signup"];

  const hideLayout = hideLayoutRoutes.includes(location.pathname);
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
       <Navbar/>

      <main className="flex-1">
        <Routes>

          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/places" element={<Places />} />
          <Route path="/places/:id" element={<PlaceDetails />} />
          <Route path="/plan-trip" element={<PlanTrip />} />
          <Route path="/transport" element={<TransportPage />} />
          <Route path="/transport/search" element={<TransportSearch />} />
          <Route path="/itinerary" element={<ItineraryPage />} />
          <Route path="/explore-world" element={<WorldPlaces />} />
          <Route path="/world-place-details" element={<WorldPlaceDetails />} />
          <Route path="/flights-search" element={<FlightsSearch />} />
          <Route path="/hotels-search" element={<HotelsSearch />} />
          <Route path="/trains-search" element={<TrainsSearch />} />
          <Route path="/about" element={<About />} />
          <Route path="/team" element={<Team />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/sitemap" element={<Sitemap />} />
          <Route path="/download-app" element={<DownloadApp />} />
          <Route path="/learn-more" element={<LearnMore />} />
          <Route path="/explore-deals" element={<ExploreDeals />} />
          <Route path="/more-deals" element={<DealsComingSoon />} />
          <Route path="/deal/:slug" element={<DealDetails />} />
          <Route path="/explore-india" element={<IndiaPlaces />} />
          <Route path="/india-place-details" element={<IndiaPlaceDetails />} />
          <Route path="/oauth/complete" element={<OAuthComplete />} />

          {/* Auth Routes */}
         <Route
  path="/login"
  element={
    <PublicRoute>
      <>
        <Home />
        <Login />
      </>
    </PublicRoute>
  }
/>

<Route
  path="/signup"
  element={
    <PublicRoute>
      <>
        <Home />
        <Signup />
      </>
    </PublicRoute>
  }
/>

          {/* Protected */}
          <Route
            path="/checklist"
            element={
              <ProtectedRoute>
                <Checklist />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </main>

      {!hideLayout && <Footer />}
    </div>
  );
};

export default AppRoutes;
