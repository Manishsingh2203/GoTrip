import React, { useState } from "react";
import { transportAPI } from "../services/transportAPI";
import TransportCard from "../components/cards/TransportCard";

function TransportPage() {
  const [results, setResults] = useState([]);
  const [type, setType] = useState("flights");

  const [query, setQuery] = useState({
    from: "",
    to: "",
    date: "",
  });

  const search = async () => {
    let res;
    if (type === "flights") res = await transportAPI.searchFlights(query.from, query.to, query.date);
    if (type === "trains") res = await transportAPI.searchTrains(query.from, query.to, query.date);
    if (type === "buses") res = await transportAPI.searchBuses(query.from, query.to, query.date);

    setResults(res.data.data);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 overflow-x-hidden">
      <h1 className="text-3xl font-bold mb-4">Find Transport</h1>

      <div className="flex gap-2 mb-4">
        <input placeholder="FROM" onChange={e => setQuery({...query, from: e.target.value})} />
        <input placeholder="TO" onChange={e => setQuery({...query, to: e.target.value})} />
        <input type="date" onChange={e => setQuery({...query, date: e.target.value})} />

        <select onChange={e => setType(e.target.value)}>
          <option value="flights">Flights</option>
          <option value="trains">Trains</option>
          <option value="buses">Buses</option>
        </select>

        <button onClick={search} className="btn-primary">Search</button>
      </div>

      <div className="space-y-4">
        {results.map((t, i) => (
          <TransportCard key={i} transport={t} type={type.slice(0, -1)} />
        ))}
      </div>
    </div>
  );
}

export default TransportPage;
