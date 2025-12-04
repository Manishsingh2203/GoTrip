import React, { useState } from 'react';
import { Lightbulb, Shield, ChevronDown, ChevronUp } from 'lucide-react';

const TipsCard = ({ title, items }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!items || !items.length) return null;

  // Determine icon based on title
  const getIcon = () => {
    switch (title.toLowerCase()) {
      case 'safety notes':
        return Shield;
      case 'travel tips':
        return Lightbulb;
      default:
        return Lightbulb;
    }
  };

  const Icon = getIcon();

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div 
        className="p-4 border-b border-gray-200 cursor-pointer hover:bg-[#F7F7F7] transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5 text-[#767676]" />
            <div>
              <h3 className="font-semibold text-[#222222]">{title}</h3>
              <p className="text-sm text-[#767676]">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>
          <button className="text-[#767676] hover:text-[#484848]">
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-4">
          <div className="space-y-3">
            {items.map((tip, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#0CA9A5] rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-[#484848] text-sm leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TipsCard;