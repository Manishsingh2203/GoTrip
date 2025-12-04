const AboutUs = () => {
  return (
    <div className="bg-[#F7F7F7] min-h-screen py-12 overflow-x-hidden">
      <div className="max-w-5xl mx-auto px-4">

        <h1 className="text-4xl font-bold text-[#222222] mb-4">About GoTrip</h1>
        <p className="text-[#767676] text-lg mb-10">
          Your smart AI-powered companion for planning perfect trips — faster, easier and beautifully.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-[#222222] mb-2">Who We Are</h3>
            <p className="text-[#484848]">
              GoTrip is built by travel lovers, developers and AI researchers 
              aiming to simplify travel planning using cutting-edge technology.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-[#222222] mb-2">What We Do</h3>
            <p className="text-[#484848]">
              We provide AI itineraries, smart suggestions, travel deals and personalised planning tools.
            </p>
          </div>
        </div>

        <div className="mt-10 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-[#222222] mb-3">Our Mission</h3>
          <p className="text-[#484848]">
            Make travel stress-free and accessible for everyone.
          </p>
        </div>

      </div>
    </div>
  );
};

export default AboutUs;