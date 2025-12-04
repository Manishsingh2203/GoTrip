import React from "react";
import { Link } from "react-router-dom";

const Sitemap = () => {
  const sections = [
    {
      title: "Company",
      links: [
        { name: "About Us", url: "/about" },
        { name: "Team", url: "/team" },
        { name: "Careers", url: "/careers" },
        { name: "Blog", url: "/blog" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", url: "/help" },
        { name: "Contact Us", url: "/contact" },
        { name: "Privacy Policy", url: "/privacy" },
        { name: "Terms of Service", url: "/terms" },
      ],
    },
    {
      title: "Travel Services",
      links: [
        { name: "Flights Search", url: "/flights" },
        { name: "Hotels Search", url: "/hotels" },
        { name: "Trains Search", url: "/trains" },
        { name: "Cabs & Transport", url: "/transport" },
        { name: "Nearby Places", url: "/places" },
      ],
    },
    {
      title: "AI Features",
      links: [
        { name: "AI Trip Planner", url: "/plan" },
        { name: "Itinerary Builder", url: "/itinerary" },
        { name: "Saved Places", url: "/saved" },
      ],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-14 overflow-x-hidden">
      <h1 className="text-3xl font-bold text-[#222222] mb-6">GoTrip Sitemap</h1>
      <p className="text-[#767676] mb-10">
        Quickly navigate through all major sections of the GoTrip website.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {sections.map((section, idx) => (
          <div key={idx}>
            <h3 className="text-[#222222] font-semibold text-lg mb-4">{section.title}</h3>
            <ul className="space-y-2">
              {section.links.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.url}
                    className="text-[#767676] hover:text-[#1e599e] transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sitemap;