const NearbyHotelsList = ({ hotels }) => (
  <div className="bg-white p-4 rounded-xl shadow mb-6">
    <h3 className="text-lg font-bold">🏨 Nearby Hotels</h3>
    <ul className="mt-3 space-y-2">
      {hotels.map((hotel, i) => (
        <li key={i} className="p-2 bg-gray-50 rounded">
          {hotel.name}
        </li>
      ))}
    </ul>
  </div>
);

export default NearbyHotelsList;
