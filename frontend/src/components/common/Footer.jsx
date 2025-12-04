import React from "react";
import { Link } from "react-router-dom";
import { Plane } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#f2f0f0] text-[#767676] pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-6">

        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12">

          {/* BRAND INFO */}
          <div className="">
            <Link to="/" className="flex items-center space-x-3 mb-4">
              {/* Plane Icon Box */}
             
               
              
              <span
                className="text-2xl font-extrabold tracking-tight font-[Nunito_Sans] bg-gradient-to-r from-[#FF7A32] via-[#FF9F4A] to-[#FF7A32] bg-clip-text text-transparent"
              >
                Go.Trip
              </span>
            </Link>

            <p className="text-[#1b1e21] text-sm leading-relaxed mb-6 max-w-sm">
              Your intelligent travel companion. AI-powered trip planning with
              real-time data, curated guides & personalized itineraries.
            </p>
          </div>

          {/* PRODUCTS */}
          <div>
            <h3 className="text-[#1b1e21] font-semibold text-sm uppercase tracking-wide mb-4">
              Products
            </h3>
            <ul className="space-y-3">
              <li><Link to="/" className="hover:text-[#5c5c5c] text-[#1b1e21] transition-colors">Home</Link></li>
              <li><Link to="/places" className="hover:text-[#5c5c5c] text-[#1b1e21] transition-colors">Places</Link></li>
              <li><Link to="/plan-trip" className="hover:text-[#5c5c5c] text-[#1b1e21] transition-colors">Plan Trip</Link></li>
              <li><Link to="/hotels-search" className="hover:text-[#5c5c5c] text-[#1b1e21] transition-colors">Hotels</Link></li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h3 className="text-[#1b1e21] font-semibold text-sm uppercase tracking-wide mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              <li><a href="/about" className="hover:text-[#5c5c5c] text-[#1b1e21] transition-colors">About Us</a></li>
              <li><a href="/team" className="hover:text-[#5c5c5c] text-[#1b1e21] transition-colors">Team</a></li>
              <li><a href="/careers" className="hover:text-[#5c5c5c] text-[#1b1e21] transition-colors">Careers</a></li>
              <li><a href="/blog" className="hover:text-[#5c5c5c] text-[#1b1e21] transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h3 className="text-[#1b1e21] font-semibold text-sm uppercase tracking-wide mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              <li><a href="/help" className="hover:text-[#5c5c5c] text-[#1b1e21] transition-colors">Help Center</a></li>
              <li><a href="/contact" className="hover:text-[#5c5c5c] text-[#1b1e21] transition-colors">Contact Us</a></li>
              <li><a href="/privacy" className="hover:text-[#5c5c5c] text-[#1b1e21] transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-[#5c5c5c] text-[#1b1e21] transition-colors">Terms of Service</a></li>
            </ul>
          </div>

        </div>

        {/* BIG CENTERED SOCIAL ICONS */}
        <div className="py-10 border-t border-[#484848]">
          <div className="flex items-center justify-center space-x-12">

            <a href="https://www.instagram.com/_manishsinghh" className="text-[#1b1e21] hover:text-[#1e599e] transition-colors">
              <i className="fa-brands fa-instagram text-4xl"></i>
            </a>

            <a href="https://x.com/_ManishSingh01" className="text-[#1b1e21] hover:text-[#1e599e] transition-colors">
              <i className="fa-brands fa-x-twitter text-4xl"></i>
            </a>

            <a href="https://www.linkedin.com/in/manish-singh-967o4o42" className="text-[#1b1e21] hover:text-[#1e599e] transition-colors">
              <i className="fa-brands fa-linkedin text-4xl"></i>
            </a>

            <a href="https://www.facebook.com/share/19j45P5dsL/" className="text-[#1b1e21] hover:text-[#1e599e] transition-colors">
              <i className="fa-brands fa-facebook text-4xl"></i>
            </a>

          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 border-t border-[#484848]">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-[#1b1e21] text-sm">
              © 2025 GoTrip . All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a href="/privacy" className="text-[#1b1e21] hover:text-[#5c5c5c] text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-[#1b1e21] hover:text-[#5c5c5c] text-sm transition-colors">
                Terms of Service
              </a>
              <a href="/careers" className="text-[#1b1e21] hover:text-[#5c5c5c] text-sm transition-colors">
                Careers
              </a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;