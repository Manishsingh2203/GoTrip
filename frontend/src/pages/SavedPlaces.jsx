import React, { useEffect, useState } from 'react';
import { savedAPI } from '../services/savedAPI';
import PlaceCard from '../components/cards/PlaceCard';

const SavedPlaces = () => {
  const [items, setItems] = useState([]);
  useEffect(() => {
    (async () => {
      const res = await savedAPI.getAll();
      setItems(res.data.data);
    })();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 overflow-x-hidden">
      <h1 className="text-2xl font-bold mb-6">Saved Places</h1>
      {items.length === 0 ? (
        <p>No saved places yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map(s => <PlaceCard key={s._id} place={s.data} />)}
        </div>
      )}
    </div>
  );
};

export default SavedPlaces;
