const ContactUs = () => {
  return (
    <div className="bg-[#F7F7F7] min-h-screen py-12 overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-4">

        <h1 className="text-4xl font-bold text-[#222222] mb-6">Contact Us</h1>
        <p className="text-[#767676] mb-10">
          We're here to help. Reach out anytime.
        </p>

        <div className="bg-white border border-gray-200 rounded-xl shadow p-6">
          <p className="text-[#484848] mb-3">
            📧 Email: <span className="font-medium text-[#1e599e]">manishsinghbst0322@gmail.com</span>
          </p>
          <p className="text-[#484848]">
            📍 Location: Noida, India (Remote Team)
          </p>
        </div>

      </div>
    </div>
  );
};

export default ContactUs;