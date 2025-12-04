const axios = require("axios");
const config = require("../config/env");

class TransportService {
  async searchFlights(from, to, date) {
    try {
      const res = await axios.get(
        `http://api.aviationstack.com/v1/flights`,
        {
          params: {
            access_key: config.AVIATIONSTACK_KEY,
            dep_iata: from,
            arr_iata: to,
            flight_date: date
          }
        }
      );

      return res.data.data.slice(0, 5).map(f => ({
        airline: f.airline.name,
        flightNumber: f.flight.iata,
        departure: {
          time: f.departure.scheduled,
          city: f.departure.airport,
          airport: f.departure.iata
        },
        arrival: {
          time: f.arrival.scheduled,
          city: f.arrival.airport,
          airport: f.arrival.iata
        },
        duration: f.flight_time || "N/A",
        price: Math.floor(Math.random() * 400) + 100 
      }));
    } catch (err) {
      console.log("Flight API failed, fallback", err.message);
      return [{
        airline: "Sample Airline",
        flightNumber: "AI-202",
        departure: { time: "10:00", city: from },
        arrival: { time: "12:45", city: to },
        duration: "2h 45m",
        price: 199
      }];
    }
  }

  async searchTrains(from, to, date) {
    try {
      const res = await axios.get(
        `https://irctc1.p.rapidapi.com/api/v3/trainBetweenStations`,
        {
          params: { fromStationCode: from, toStationCode: to, date },
          headers: {
            'X-RapidAPI-Key': config.IRCTC_KEY,
            'X-RapidAPI-Host': 'irctc1.p.rapidapi.com'
          }
        }
      );

      return res.data.data.slice(0, 5).map(t => ({
        trainName: t.train_name,
        trainNumber: t.train_number,
        departure: {
          time: t.from_std,
          city: t.from_station_name
        },
        arrival: {
          time: t.to_std,
          city: t.to_station_name
        },
        duration: t.duration,
        price: Math.floor(Math.random() * 500) + 200,
        seatsAvailable: t.class_type.length * 15
      }));
    } catch (err) {
      console.log("Train API failed, fallback", err.message);
      return [{
        trainName: "Superfast Express",
        departure: { time: "09:00", city: from },
        arrival: { time: "14:00", city: to },
        duration: "5h",
        price: 250,
        seatsAvailable: 20
      }];
    }
  }

  async searchBuses(from, to, date) {
    return [{
      busCompany: "RedBus Travels",
      departure: { time: "8:00", city: from },
      arrival: { time: "13:00", city: to },
      duration: "5h",
      price: 500
    }];
  }
}

module.exports = new TransportService();
