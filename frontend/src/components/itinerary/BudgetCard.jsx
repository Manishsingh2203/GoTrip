import React from 'react';
import { Plane, Hotel, Utensils, Car, Ticket, Wallet } from 'lucide-react';

const BudgetCard = ({ budget }) => {
  const {
    flight,
    stay,
    food,
    localTravel,
    activities,
    total
  } = budget || {};

  const budgetItems = [
    { key: 'flight', label: 'Flight', icon: Plane, value: flight },
    { key: 'stay', label: 'Accommodation', icon: Hotel, value: stay },
    { key: 'food', label: 'Food & Dining', icon: Utensils, value: food },
    { key: 'localTravel', label: 'Local Travel', icon: Car, value: localTravel },
    { key: 'activities', label: 'Activities', icon: Ticket, value: activities }
  ].filter(item => item.value);

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Wallet className="h-5 w-5 text-[#767676]" />
          <h3 className="font-semibold text-[#222222]">Budget Breakdown</h3>
        </div>
      </div>

      {/* Budget Items */}
      <div className="p-4">
        <div className="space-y-4">
          {budgetItems.map((item) => {
            const Icon = item.icon;
            
            return (
              <div key={item.key} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-[#767676]" />
                  <span className="text-sm text-[#484848]">{item.label}</span>
                </div>
                <span className="font-medium text-[#222222]">{item.value}</span>
              </div>
            );
          })}
        </div>

        {/* Total Summary */}
        {total && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#222222]">Total Estimated Cost</span>
              <span className="text-lg font-bold text-[#222222]">{total}</span>
            </div>
          </div>
        )}

        {/* Budget Tip */}
        <div className="mt-4 bg-[#F7F7F7] rounded-lg p-3">
          <p className="text-sm text-[#767676]">
            This budget is optimized for the best value experience
          </p>
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;