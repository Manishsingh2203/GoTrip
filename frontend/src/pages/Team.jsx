const Team = () => {
  return (
    <div className="bg-[#F7F7F7] min-h-screen py-12 overflow-x-hidden">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#222222] mb-3">
            Meet Our Team
          </h1>
          <p className="text-sm sm:text-base text-[#767676] max-w-2xl mx-auto">
            Go.Trip is crafted and maintained by a single, passionate builder who
            designs, codes and improves every part of the experience.
          </p>
        </div>

        <div className="flex justify-center">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-md px-8 py-8 sm:px-10 sm:py-10 max-w-md w-full text-center">
            <div className="h-40 w-40 sm:h-44 sm:w-44 mx-auto rounded-full mb-5 overflow-hidden bg-[#F7F7F7] flex items-center justify-center">
              <img
                src="../../public/admin.jpeg"
                alt="Team member"
                className="h-full w-full object-cover"
              />
            </div>

            <h3 className="text-xl font-semibold text-[#222222] mb-1">
              Manish Singh
            </h3>
            <p className="text-sm text-[#767676] mb-3">
              Founder &amp; Full-Stack Developer
            </p>
            <p className="text-xs font-medium text-[#1e599e] mb-4">
              Product • Engineering
            </p>

            <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#767676] bg-[#F7F7F7] px-4 py-2 rounded-full">
              <span>Building end-to-end travel experiences with care.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;