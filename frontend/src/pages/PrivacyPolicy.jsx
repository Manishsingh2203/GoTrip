const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 overflow-x-hidden">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>

      <p className="text-gray-600 leading-relaxed mb-6">
        At <span className="font-semibold text-gray-800">GoTrip</span>, your privacy and trust matter to us. 
        This Privacy Policy explains how we collect, use, and protect your information when you use our website or services.
      </p>

      {/* Section 1 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">1. Information We Collect</h2>
        <p className="text-gray-600 leading-relaxed">
          We may collect basic information such as your name, email address, search preferences, and trip details when you interact 
          with features like AI Trip Planner, Search, or Booking tools.  
          <br />
          We also collect non-personal data like device type, browser, and general analytics.
        </p>
      </div>

      {/* Section 2 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">2. How We Use Your Information</h2>
        <ul className="list-disc pl-6 text-gray-600 space-y-1">
          <li>To improve your travel recommendations and AI responses</li>
          <li>To send updates, notifications or important service messages</li>
          <li>To analyze website performance for a better user experience</li>
          <li>To enhance security and prevent misuse</li>
        </ul>
      </div>

      {/* Section 3 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">3. Data Protection & Security</h2>
        <p className="text-gray-600 leading-relaxed">
          Your data is stored securely and we implement industry-standard safeguards.  
          We never sell your personal data to third parties.
        </p>
      </div>

      {/* Section 4 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">4. Third-Party Services</h2>
        <p className="text-gray-600 leading-relaxed">
          We may use trusted third-party APIs (such as AI providers, analytics tools, or hotel/flight partners)  
          to enhance your travel experience.  
          These partners follow their own privacy policies.
        </p>
      </div>

      {/* Section 5 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">5. Cookies & Tracking</h2>
        <p className="text-gray-600 leading-relaxed">
          GoTrip may use cookies to improve site performance, remember your preferences, and deliver relevant content.  
          You can disable cookies anytime in your browser settings.
        </p>
      </div>

      {/* Section 6 */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">6. Contact Us</h2>
        <p className="text-gray-600 leading-relaxed">
          If you have any questions regarding this Privacy Policy, please contact us at:  
          <br />
          <span className="font-medium text-gray-800">support@gotrip.com</span>
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
