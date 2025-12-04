const NearbyRestaurantsList = ({ items }) => (
  <div className="bg-white p-4 rounded-xl shadow mb-6">
    <h3 className="text-lg font-bold">🍽 Nearby Restaurants</h3>
    <ul className="mt-3 space-y-2">
      {items.map((r, i) => (
        <li key={i} className="p-2 bg-gray-50 rounded">
          {r.name}
        </li>
      ))}
    </ul>
  </div>
);

export default NearbyRestaurantsList;
