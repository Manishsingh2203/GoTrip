import React from "react";

const Loader = ({ size = "md", text = "Loading..." }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-10 w-10",
    xl: "h-14 w-14",
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className={`relative ${sizeClasses[size]}`}>
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 w-[8%] h-[30%] bg-[#1e599e] rounded-full"
            style={{
              transform: `rotate(${i * 30}deg) translateY(-145%)`,
              animation: "iosFade 1s linear infinite",
              animationDelay: `${i * -0.08}s`,
            }}
          ></span>
        ))}
      </div>

      {text && <p className="text-[#767676] text-sm">{text}</p>}
    </div>
  );
};

export default Loader;
