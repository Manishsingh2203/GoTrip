import React, { useState } from 'react';
import { Luggage, Check, ChevronDown, ChevronUp } from 'lucide-react';

const PackingCard = ({ items }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [checkedItems, setCheckedItems] = useState({});

  if (!items || !items.length) return null;

  const displayedItems = items;

  const toggleItem = (index) => {
    setCheckedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div 
        className="p-4 border-b border-gray-200 cursor-pointer hover:bg-[#F7F7F7] transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Luggage className="h-5 w-5 text-[#767676]" />
            <div>
              <h3 className="font-semibold text-[#222222]">Packing List</h3>
              <p className="text-sm text-[#767676]">
                {completedCount} of {items.length} items packed
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
          <div className="space-y-2">
            {displayedItems.map((item, idx) => (
              <div 
                key={idx}
                className="flex items-center gap-3 p-2 rounded-lg border border-gray-200 hover:bg-[#F7F7F7] transition-colors"
              >
                <button
                  onClick={() => toggleItem(idx)}
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    checkedItems[idx] 
                      ? 'bg-[#0CA9A5] border-[#0CA9A5] text-white' 
                      : 'border-gray-300 hover:border-[#FF5A5F]'
                  }`}
                >
                  {checkedItems[idx] && <Check className="h-3 w-3" />}
                </button>
                <span className={`text-sm transition-colors ${
                  checkedItems[idx] ? 'text-[#767676] line-through' : 'text-[#484848]'
                }`}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PackingCard;