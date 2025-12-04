const Careers = () => {
  return (
    <div className="bg-[#F7F7F7] min-h-screen py-12 overflow-x-hidden">
      <div className="max-w-5xl mx-auto px-4">

        <h1 className="text-4xl font-bold text-[#222222] mb-6">Careers</h1>
        <p className="text-[#767676] mb-10">
          Join us and build the future of AI-powered travel.
        </p>

        <div className="bg-white shadow-lg border border-gray-200 rounded-xl p-8 text-center">
          <h3 className="text-xl font-semibold text-[#222222] mb-2">No Open Positions</h3>
          <p className="text-[#484848] mb-4">
            We are not hiring right now, but you can still share your resume.
          </p>
          <span className="font-medium text-[#1e599e]">careers@gotrip.com</span>
        </div>

      </div>
    </div>
  );
};

export default Careers;