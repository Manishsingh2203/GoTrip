import React, { createContext, useState, useContext } from 'react';

const TripContext = createContext();

export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};

export const TripProvider = ({ children }) => {
  const [currentTrip, setCurrentTrip] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [itinerary, setItinerary] = useState([]);
  const [budget, setBudget] = useState(0);

  const createTrip = (tripData) => {
    setCurrentTrip(tripData);
  };

  const updateItinerary = (newItinerary) => {
    setItinerary(newItinerary);
  };

  const updateBudget = (newBudget) => {
    setBudget(newBudget);
  };

  const clearTrip = () => {
    setCurrentTrip(null);
    setItinerary([]);
    setBudget(0);
    setSelectedPlace(null);
  };

  const value = {
    currentTrip,
    selectedPlace,
    itinerary,
    budget,
    createTrip,
    updateItinerary,
    updateBudget,
    setSelectedPlace,
    clearTrip,
  };

  return (
    <TripContext.Provider value={value}>
      {children}
    </TripContext.Provider>
  );
};