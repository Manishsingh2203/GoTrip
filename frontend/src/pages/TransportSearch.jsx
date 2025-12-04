import React, { useState } from "react";
import { Calendar, MapPin, Search, Train, Plane, Bus } from "lucide-react";
import TransportCard from "../components/cards/TransportCard";
import { transportAPI } from "../services/transportAPI";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

const TransportSearch = () => {
  const [form, setForm] = useState({
    from: "",
    to: "",
    date: "",
  });

  const [mode, setMode] = useState("flight");
  const [results, setResults] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const modes = [
    { label: "Flights", value: "flight", icon: Plane },
    { label: "Trains", value: "train", icon: Train },
    { label: "Buses", value: "bus", icon: Bus },
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const searchTransport = async () => {
    const { from, to, date } = form;
    if (!from || !to || !date) {
      return setError("Please enter all fields");
    }

    setError("");
    setLoading(true);
    setResults(null);

    try {
      let response;

      if (mode === "flight") {
        response = await transportAPI.searchFlights(from, to, date);
      } else if (mode === "train") {
        response = await transportAPI.searchTrains(from, to, date);
      } else {
        response = await transportAPI.searchBuses(from, to, date);
      }

      setResults(response.data.data);
    } catch (err) {
      setError("Something went wrong while fetching transport.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 overflow-x-hidden">
      {/* Header */}
      <div className="bg-white border-b shadow-sm py-8 mb-10">
        <h1 className="text-center text-4xl font-bold text-gray-900">
          Search Transport Options
        </h1>
        <p className="text-center mt-2 text-gray-600 text-lg">
          Check flights, trains & buses instantly 🚆✈️🚌
        </p>
      </div>

      {/* Main Search Box */}
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-md space-y-6">
        {/* Transport Tabs */}
        <div className="flex justify-center gap-4">
          {modes.map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.value}
                onClick={() => setMode(m.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border 
                text-sm font-semibold transition-all ${
                  mode === m.value
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Icon className="h-4 w-4" />
                {m.label}
              </button>
            );
          })}
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="font-semibold flex items-center text-sm mb-1">
              <MapPin className="w-4 h-4 mr-1" /> From
            </label>
            <input
              name="from"
              value={form.from}
              onChange={handleChange}
              placeholder="Delhi"
              className="input-field"
            />
          </div>

          <div>
            <label className="font-semibold flex items-center text-sm mb-1">
              <MapPin className="w-4 h-4 mr-1" /> To
            </label>
            <input
              name="to"
              value={form.to}
              onChange={handleChange}
              placeholder="Mumbai"
              className="input-field"
            />
          </div>

          <div>
            <label className="font-semibold flex items-center text-sm mb-1">
              <Calendar className="w-4 h-4 mr-1" /> Date
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="input-field"
            />
          </div>
        </div>

        {/* Search Button */}
        <button
          onClick={searchTransport}
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-blue-500 transition disabled:bg-gray-400"
        >
          <Search className="h-5 w-5" />
          {loading ? "Searching..." : `Search ${mode}s`}
        </button>

        {error && <ErrorMessage message={error} />}
      </div>

      {/* Results */}
      <div className="max-w-5xl mx-auto mt-10">
        {loading && <Loader size="lg" text="Fetching transport..." />}

        {results && (
          <div className="grid md:grid-cols-2 gap-6">
            {(results.flights ||
              results.trains ||
              results.buses ||
              []
            ).map((item, i) => (
              <TransportCard
                key={i}
                transport={item}
                type={mode}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransportSearch;
