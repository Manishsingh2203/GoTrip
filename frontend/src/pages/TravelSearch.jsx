// frontend/src/pages/TravelSearch.jsx
import React, { useState } from "react";
import Tabs from "../components/ui/Tabs";
import FlightForm from "../components/forms/FlightForm";
import HotelForm from "../components/forms/HotelForm";
import TrainForm from "../components/forms/TrainForm";
import "../styles/premium.css";

export default function TravelSearch() {
  const [tab, setTab] = useState("flights");

  return (
    <div className="pg-travel overflow-x-hidden">
      <div className="hero">
        <div className="hero-inner">
          <h1 className="hero-title">Plan your next trip with GoTrip</h1>
          <p className="hero-sub">Flights, hotels and trains — smart, beautiful and fast.</p>

          <Tabs value={tab} onChange={setTab} options={[
            { key: "flights", label: "Flights" },
            { key: "hotels", label: "Hotels" },
            { key: "trains", label: "Trains" },
          ]} />
        </div>
      </div>

      <div className="search-area">
        {tab === "flights" && <FlightForm />}
        {tab === "hotels" && <HotelForm />}
        {tab === "trains" && <TrainForm />}
      </div>
    </div>
  );
}
