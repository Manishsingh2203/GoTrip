const TermsOfService = () => {
  return (
    <div className="bg-[#F7F7F7] min-h-screen py-12 overflow-x-hidden">
      <div className="max-w-5xl mx-auto px-4">

        <h1 className="text-4xl font-bold text-[#222222] mb-6">Terms of Service</h1>

        <div className="bg-white border border-gray-200 rounded-xl shadow p-6 space-y-6">
          
          <div>
            <h3 className="text-lg font-semibold mb-1 text-[#222222]">1. Use of Platform</h3>
            <p className="text-[#767676]">
              GoTrip should be used responsibly and legally.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-1 text-[#222222]">2. AI Content Disclaimer</h3>
            <p className="text-[#767676]">
              AI-generated info may not always be accurate. Always verify.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-1 text-[#222222]">3. Limitations</h3>
            <p className="text-[#767676]">
              We are not responsible for third-party cancellations or inaccuracies.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default TermsOfService;