import React from 'react';
import { Sun, Clock, Moon, Utensils, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const DayPlanCard = ({ day, title, morning, afternoon, evening, food }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const timeSlots = [
    { time: 'Morning', icon: Sun, content: morning },
    { time: 'Afternoon', icon: Clock, content: afternoon },
    { time: 'Evening', icon: Moon, content: evening },
    { time: 'Dining', icon: Utensils, content: food }
  ].filter(slot => slot.content);

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div 
        className="p-4 border-b border-gray-200 cursor-pointer hover:bg-[#F7F7F7] transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-[#222222]">Day {day}</span>
            </div>
            <h3 className="font-semibold text-[#222222]">{title}</h3>
          </div>
          <button className="text-[#767676] hover:text-[#484848]">
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-4">
          <div className="space-y-4">
            {timeSlots.map((slot, index) => {
              const Icon = slot.icon;
              return (
                <div key={slot.time} className="flex gap-3">
                  <Icon className="h-5 w-5 text-[#767676] mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-medium text-[#222222] text-sm mb-1">{slot.time}</h4>
                    <p className="text-[#484848] text-sm leading-relaxed">{slot.content}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DayPlanCard;