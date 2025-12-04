// src/components/auth/LoginPopup.jsx
import { useModal } from "../../context/ModalContext";
import Login from "./Login"; // tera existing login page

export default function LoginPopup() {
  const { loginOpen, setLoginOpen } = useModal();

  if (!loginOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl relative p-6 animate-fadeIn">
        
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
          onClick={() => setLoginOpen(false)}
        >
          ✕
        </button>

        <Login popupMode />
      </div>
    </div>
  );
}
