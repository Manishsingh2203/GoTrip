// frontend/src/components/ui/Tabs.jsx
import React from "react";

export default function Tabs({ options = [], value, onChange }) {
  return (
    <div className="tabs">
      {options.map(opt => (
        <button
          key={opt.key}
          className={`tab-btn ${value === opt.key ? "active" : ""}`}
          onClick={() => onChange(opt.key)}
          type="button"
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
