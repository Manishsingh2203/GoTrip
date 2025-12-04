const mongoose = require('mongoose');
const User = require('../models/User');
const Place = require('../models/Place');
const Hotel = require('../models/Hotel');
const Restaurant = require('../models/Restaurant');
const config = require('../config/env');

const getHotelsData = (placeId, placeName) => {
  const baseHotels = {
    'Goa Beach': [
      {
        name: "Taj Fort Aguada Resort & Spa",
        priceRange: "$$$$",
        rating: 4.8,
        address: "Sinquerim Beach, Bardez, Goa 403515",
        amenities: ["Infinity Pool", "Beach Access", "Spa", "Fine Dining", "Water Sports"],
        bookingLink: "https://tajhotels.com",
        distanceFromPlace: 0.1,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop",
        place: placeId
      },
      {
        name: "W Goa",
        priceRange: "$$$$",
        rating: 4.7,
        address: "Vagator Beach, Goa 403509",
        amenities: ["Beach Club", "Luxury Spa", "Multiple Pools", "Bars", "Fitness Center"],
        bookingLink: "https://marriott.com",
        distanceFromPlace: 0.3,
        image: "https://images.unsplash.com/photo-1551776235-dde6d4829808?w=600&h=400&fit=crop",
        place: placeId
      },
      {
        name: "Novotel Goa Resort & Spa",
        priceRange: "$$$",
        rating: 4.5,
        address: "Calangute Beach, Goa 403516",
        amenities: ["Swimming Pool", "Spa", "Kids Club", "Restaurant", "Beach Access"],
        bookingLink: "https://accor.com",
        distanceFromPlace: 0.2,
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop",
        place: placeId
      },
      {
        name: "Goa Marriott Resort & Spa",
        priceRange: "$$$",
        rating: 4.6,
        address: "Miramar, Panaji, Goa 403001",
        amenities: ["River View", "Spa", "Pool", "Fitness Center", "Multiple Dining"],
        bookingLink: "https://marriott.com",
        distanceFromPlace: 1.5,
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=400&fit=crop",
        place: placeId
      },
      {
        name: "The Leela Goa",
        priceRange: "$$$$",
        rating: 4.9,
        address: "Cavelossim Beach, Salcete, Goa 403731",
        amenities: ["Private Beach", "Golf Course", "Luxury Spa", "Fine Dining", "Water Sports"],
        bookingLink: "https://theleela.com",
        distanceFromPlace: 0.05,
        image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&h=400&fit=crop",
        place: placeId
      }
    ],
    'Manali': [
      {
        name: "Snow Valley Resorts",
        priceRange: "$$$",
        rating: 4.6,
        address: "Circuit House Road, Manali 175131",
        amenities: ["Mountain View", "Heated Pool", "Spa", "Restaurant", "Adventure Sports"],
        bookingLink: "https://snowvalleyresorts.com",
        distanceFromPlace: 2.1,
        image: "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=600&h=400&fit=crop",
        place: placeId
      },
      {
        name: "The Himalayan Resort & Spa",
        priceRange: "$$$$",
        rating: 4.8,
        address: "Prini, Manali 175131",
        amenities: ["River View", "Luxury Spa", "Fine Dining", "Hot Tub", "Mountain Guides"],
        bookingLink: "https://himalayanresort.com",
        distanceFromPlace: 3.5,
        image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop",
        place: placeId
      },
      {
        name: "Johnson Hotel & Cafe",
        priceRange: "$$",
        rating: 4.3,
        address: "The Mall, Manali 175131",
        amenities: ["Central Location", "Cafe", "Garden", "Free WiFi", "Tour Desk"],
        bookingLink: "https://johnsonhotel.com",
        distanceFromPlace: 1.2,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop",
        place: placeId
      },
      {
        name: "Span Resort & Spa",
        priceRange: "$$$",
        rating: 4.7,
        address: "Kullu Valley, Manali 175131",
        amenities: ["River Front", "Spa", "Pool", "Adventure Desk", "Multiple Cuisines"],
        bookingLink: "https://spanresorts.com",
        distanceFromPlace: 4.2,
        image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&h=400&fit=crop",
        place: placeId
      },
      {
        name: "Apple Country Resort",
        priceRange: "$$",
        rating: 4.4,
        address: "Aleo, Manali 175131",
        amenities: ["Orchard View", "Restaurant", "Garden", "Bonfire", "Trekking"],
        bookingLink: "https://applecountryresort.com",
        distanceFromPlace: 2.8,
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop",
        place: placeId
      }
    ],
    'Taj Mahal': [
      {
        name: "Oberoi Amarvilas",
        priceRange: "$$$$",
        rating: 4.9,
        address: "Taj East Gate Road, Agra 282001",
        amenities: ["Taj View", "Luxury Pool", "Spa", "Fine Dining", "Butler Service"],
        bookingLink: "https://oberoihotels.com",
        distanceFromPlace: 0.6,
        image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&h=400&fit=crop",
        place: placeId
      },
      {
        name: "Taj Hotel & Convention Centre",
        priceRange: "$$$",
        rating: 4.7,
        address: "Taj Nagri, Phase 2, Agra 282001",
        amenities: ["Conference Facilities", "Pool", "Spa", "Multiple Restaurants", "Golf"],
        bookingLink: "https://tajhotels.com",
        distanceFromPlace: 1.8,
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=400&fit=crop",
        place: placeId
      },
      {
        name: "ITC Mughal",
        priceRange: "$$$",
        rating: 4.6,
        address: "Taj Ganj, Agra 282001",
        amenities: ["Mughal Gardens", "Luxury Spa", "Pool", "Fine Dining", "Cultural Shows"],
        bookingLink: "https://itchotels.com",
        distanceFromPlace: 1.2,
        image: "https://images.unsplash.com/photo-1551776235-dde6d4829808?w=600&h=400&fit=crop",
        place: placeId
      },
      {
        name: "Courtyard by Marriott",
        priceRange: "$$",
        rating: 4.4,
        address: "Fatehabad Road, Agra 282001",
        amenities: ["Modern Amenities", "Fitness Center", "Pool", "Restaurant", "Business Center"],
        bookingLink: "https://marriott.com",
        distanceFromPlace: 2.3,
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop",
        place: placeId
      },
      {
        name: "Hotel Atulyaa Taj",
        priceRange: "$$",
        rating: 4.2,
        address: "Taj East Gate, Agra 282001",
        amenities: ["Rooftop Restaurant", "Taj View", "Free WiFi", "Travel Desk", "AC Rooms"],
        bookingLink: "https://atulyaataj.com",
        distanceFromPlace: 0.8,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop",
        place: placeId
      }
    ],
    'Mumbai City': [
      {
        name: "Taj Mahal Palace",
        priceRange: "$$$$",
        rating: 4.9,
        address: "Apollo Bunder, Mumbai 400001",
        amenities: ["Sea View", "Luxury Spa", "Historic Charm", "Fine Dining", "Butler Service"],
        bookingLink: "https://tajhotels.com",
        distanceFromPlace: 3.2,
        image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&h=400&fit=crop",
        place: placeId
      },
      {
        name: "The St. Regis Mumbai",
        priceRange: "$$$$",
        rating: 4.8,
        address: "Lower Parel, Mumbai 400013",
        amenities: ["Skyline Views", "Infinity Pool", "Luxury Spa", "Butler Service", "Fine Dining"],
        bookingLink: "https://marriott.com",
        distanceFromPlace: 5.1,
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=400&fit=crop",
        place: placeId
      },
      {
        name: "Trident Nariman Point",
        priceRange: "$$$",
        rating: 4.6,
        address: "Marine Drive, Mumbai 400021",
        amenities: ["Sea Facing", "Pool", "Business Center", "Multiple Restaurants", "Spa"],
        bookingLink: "https://tridenthotels.com",
        distanceFromPlace: 2.8,
        image: "https://images.unsplash.com/photo-1551776235-dde6d4829808?w=600&h=400&fit=crop",
        place: placeId
      },
      {
        name: "The Leela Mumbai",
        priceRange: "$$$$",
        rating: 4.7,
        address: "Sahar, Mumbai 400059",
        amenities: ["Luxury Gardens", "Award-winning Spa", "Fine Dining", "Pool", "Art Collection"],
        bookingLink: "https://theleela.com",
        distanceFromPlace: 8.5,
        image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&h=400&fit=crop",
        place: placeId
      },
      {
        name: "JW Marriott Mumbai",
        priceRange: "$$$",
        rating: 4.5,
        address: "Juhu Tara Road, Mumbai 400049",
        amenities: ["Beach Proximity", "Spa", "Pool", "Fitness Center", "Business Facilities"],
        bookingLink: "https://marriott.com",
        distanceFromPlace: 12.3,
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop",
        place: placeId
      }
    ]
  };
  
  return baseHotels[placeName] || [];
};

const getRestaurantsData = (placeId, placeName) => {
  const baseRestaurants = {
    'Goa Beach': [
      {
        name: "Martin's Corner",
        place: placeId,
        rating: 4.7,
        cuisine: ["Goan", "Seafood", "Portuguese"],
        priceRange: "$$$",
        location: {
          address: "Binwaddo, Betalbatim, Goa 403713",
          city: "Goa",
          state: "Goa",
          country: "India"
        },
        openingHours: { open: "11:00", close: "23:30" },
        contact: {
          phone: "+91 832 288 0061",
          email: "info@martinscornergoa.com"
        },
        images: ["https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop"],
        dietaryOptions: ["Vegetarian", "Non-vegetarian", "Seafood"]
      },
      {
        name: "Fisherman's Wharf",
        place: placeId,
        rating: 4.5,
        cuisine: ["Goan", "Seafood", "Continental"],
        priceRange: "$$$",
        location: {
          address: "Riverside, Cavelossim, Goa 403731",
          city: "Goa",
          state: "Goa",
          country: "India"
        },
        openingHours: { open: "12:00", close: "23:00" },
        contact: {
          phone: "+91 832 287 0303",
          email: "contact@fishermanswharfgoa.com"
        },
        images: ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop"],
        dietaryOptions: ["Vegetarian", "Non-vegetarian", "Seafood"]
      },
      {
        name: "Bomra's",
        place: placeId,
        rating: 4.8,
        cuisine: ["Burmese", "Asian", "Fusion"],
        priceRange: "$$$$",
        location: {
          address: "247, Fort Aguada Road, Candolim, Goa 403515",
          city: "Goa",
          state: "Goa",
          country: "India"
        },
        openingHours: { open: "19:00", close: "23:30" },
        contact: {
          phone: "+91 832 249 4403",
          email: "reservations@bomras.com"
        },
        images: ["https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&h=400&fit=crop"],
        dietaryOptions: ["Vegetarian", "Non-vegetarian"]
      },
      {
        name: "Gunpowder",
        place: placeId,
        rating: 4.6,
        cuisine: ["South Indian", "Regional Indian"],
        priceRange: "$$",
        location: {
          address: "House 13/390, Assagao, Goa 403507",
          city: "Goa",
          state: "Goa",
          country: "India"
        },
        openingHours: { open: "12:30", close: "15:30", openDinner: "19:00", closeDinner: "22:30" },
        contact: {
          phone: "+91 832 226 8484",
          email: "gunpowdergoa@gmail.com"
        },
        images: ["https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop"],
        dietaryOptions: ["Vegetarian", "Non-vegetarian"]
      },
      {
        name: "Thalassa",
        place: placeId,
        rating: 4.7,
        cuisine: ["Greek", "Mediterranean"],
        priceRange: "$$$$",
        location: {
          address: "Vagator Hill Top, Vagator, Goa 403509",
          city: "Goa",
          state: "Goa",
          country: "India"
        },
        openingHours: { open: "12:00", close: "16:00", openDinner: "18:30", closeDinner: "23:30" },
        contact: {
          phone: "+91 832 227 5745",
          email: "thalassagoa@gmail.com"
        },
        images: ["https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=600&h=400&fit=crop"],
        dietaryOptions: ["Vegetarian", "Non-vegetarian", "Seafood"]
      }
    ],
    'Manali': [
      {
        name: "Johnson's Cafe",
        place: placeId,
        rating: 4.5,
        cuisine: ["Continental", "Israeli", "Indian"],
        priceRange: "$$",
        location: {
          address: "The Mall, Manali 175131",
          city: "Manali",
          state: "Himachal Pradesh",
          country: "India"
        },
        openingHours: { open: "08:00", close: "22:30" },
        contact: {
          phone: "+91 1902 252 123",
          email: "johnsonscafe@gmail.com"
        },
        images: ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop"],
        dietaryOptions: ["Vegetarian", "Non-vegetarian"]
      },
      {
        name: "Il Forno",
        place: placeId,
        rating: 4.6,
        cuisine: ["Italian", "Wood-fired Pizza"],
        priceRange: "$$$",
        location: {
          address: "Log Huts Area, Manali 175131",
          city: "Manali",
          state: "Himachal Pradesh",
          country: "India"
        },
        openingHours: { open: "12:00", close: "22:00" },
        contact: {
          phone: "+91 1902 252 456",
          email: "ilfornomanali@gmail.com"
        },
        images: ["https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop"],
        dietaryOptions: ["Vegetarian", "Non-vegetarian"]
      },
      {
        name: "Dylan's Toasted & Roasted",
        place: placeId,
        rating: 4.4,
        cuisine: ["Cafe", "Bakery", "Continental"],
        priceRange: "$",
        location: {
          address: "The Mall, Manali 175131",
          city: "Manali",
          state: "Himachal Pradesh",
          country: "India"
        },
        openingHours: { open: "08:30", close: "21:00" },
        contact: {
          phone: "+91 1902 252 789",
          email: "dylanstoasted@gmail.com"
        },
        images: ["https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=400&fit=crop"],
        dietaryOptions: ["Vegetarian"]
      },
      {
        name: "Chopsticks",
        place: placeId,
        rating: 4.3,
        cuisine: ["Tibetan", "Chinese", "Thai"],
        priceRange: "$$",
        location: {
          address: "Model Town, Manali 175131",
          city: "Manali",
          state: "Himachal Pradesh",
          country: "India"
        },
        openingHours: { open: "11:00", close: "22:30" },
        contact: {
          phone: "+91 1902 252 321",
          email: "chopsticksmanali@gmail.com"
        },
        images: ["https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&h=400&fit=crop"],
        dietaryOptions: ["Vegetarian", "Non-vegetarian"]
      },
      {
        name: "The Lazy Dog",
        place: placeId,
        rating: 4.7,
        cuisine: ["Continental", "Himachali", "Multi-cuisine"],
        priceRange: "$$$",
        location: {
          address: "Old Manali, Manali 175131",
          city: "Manali",
          state: "Himachal Pradesh",
          country: "India"
        },
        openingHours: { open: "10:00", close: "23:00" },
        contact: {
          phone: "+91 1902 252 654",
          email: "lazydogmanali@gmail.com"
        },
        images: ["https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&h=400&fit=crop"],
        dietaryOptions: ["Vegetarian", "Non-vegetarian"]
      }
    ],
    'Taj Mahal': [
      {
        name: "Esphahan",
        place: placeId,
        rating: 4.9,
        cuisine: ["North Indian", "Mughlai", "Awadhi"],
        priceRange: "$$$$",
        location: {
          address: "Oberoi Amarvilas, Taj East Gate Road, Agra 282001",
          city: "Agra",
          state: "Uttar Pradesh",
          country: "India"
        },
        openingHours: { open: "19:00", close: "23:30" },
        contact: {
          phone: "+91 562 223 1515",
          email: "esphagan@oberoi.com"
        },
        images: ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop"],
        dietaryOptions: ["Vegetarian", "Non-vegetarian"]
      },
      {
        name: "Peshawri",
        place: placeId,
        rating: 4.8,
        cuisine: ["North West Frontier", "Barbecue"],
        priceRange: "$$$$",
        location: {
          address: "ITC Mughal, Taj Ganj, Agra 282001",
          city: "Agra",
          state: "Uttar Pradesh",
          country: "India"
        },
        openingHours: { open: "12:30", close: "14:45", openDinner: "19:00", closeDinner: "23:45" },
        contact: {
          phone: "+91 562 402 1700",
          email: "peshawri@itchotels.in"
        },
        images: ["https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop"],
        dietaryOptions: ["Non-vegetarian"]
      },
      {
        name: "Dasaprakash",
        place: placeId,
        rating: 4.3,
        cuisine: ["South Indian", "Vegetarian"],
        priceRange: "$$",
        location: {
          address: "Meher Theatre Complex, Agra 282001",
          city: "Agra",
          state: "Uttar Pradesh",
          country: "India"
        },
        openingHours: { open: "08:00", close: "22:30" },
        contact: {
          phone: "+91 562 246 2044",
          email: "dasaprakashagra@gmail.com"
        },
        images: ["https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop"],
        dietaryOptions: ["Vegetarian"]
      },
      {
        name: "Joney's Place",
        place: placeId,
        rating: 4.4,
        cuisine: ["Indian", "Chinese", "Continental"],
        priceRange: "$",
        location: {
          address: "Near Taj Mahal, Taj Ganj, Agra 282001",
          city: "Agra",
          state: "Uttar Pradesh",
          country: "India"
        },
        openingHours: { open: "05:00", close: "22:00" },
        contact: {
          phone: "+91 562 223 1066",
          email: "joneysplace@gmail.com"
        },
        images: ["https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=400&fit=crop"],
        dietaryOptions: ["Vegetarian", "Non-vegetarian"]
      },
      {
        name: "The Salt Cafe",
        place: placeId,
        rating: 4.5,
        cuisine: ["Continental", "Italian", "Fusion"],
        priceRange: "$$$",
        location: {
          address: "Fatehabad Road, Agra 282001",
          city: "Agra",
          state: "Uttar Pradesh",
          country: "India"
        },
        openingHours: { open: "11:00", close: "23:00" },
        contact: {
          phone: "+91 562 400 2244",
          email: "thesaltcafeagra@gmail.com"
        },
        images: ["https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&h=400&fit=crop"],
        dietaryOptions: ["Vegetarian", "Non-vegetarian"]
      }
    ],
    'Mumbai City': [
      {
        name: "Bombay Canteen",
        place: placeId,
        rating: 4.7,
        cuisine: ["Modern Indian", "Regional Indian"],
        priceRange: "$$$",
        location: {
          address: "Kamala Mills, Lower Parel, Mumbai 400013",
          city: "Mumbai",
          state: "Maharashtra",
          country: "India"
        },
        openingHours: { open: "12:00", close: "23:30" },
        contact: {
          phone: "+91 22 4966 6666",
          email: "hello@bombaycanteen.com"
        },
        images: ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop"],
        dietaryOptions: ["Vegetarian", "Non-vegetarian"]
      },
      {
        name: "Trishna",
        place: placeId,
        rating: 4.6,
        cuisine: ["Seafood", "Coastal Indian"],
        priceRange: "$$$$",
        location: {
          address: "7 Sai Baba Marg, Fort, Mumbai 400001",
          city: "Mumbai",
          state: "Maharashtra",
          country: "India"
        },
        openingHours: { open: "12:00", close: "15:30", openDinner: "18:00", closeDinner: "23:30" },
        contact: {
          phone: "+91 22 2270 3213",
          email: "trishna.restaurant@gmail.com"
        },
        images: ["https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop"],
        dietaryOptions: ["Vegetarian", "Non-vegetarian", "Seafood"]
      },
      {
        name: "Britannia & Co.",
        place: placeId,
        rating: 4.4,
        cuisine: ["Parsi", "Iranian"],
        priceRange: "$$",
        location: {
          address: "Wakefield House, Ballard Estate, Mumbai 400001",
          city: "Mumbai",
          state: "Maharashtra",
          country: "India"
        },
        openingHours: { open: "11:30", close: "16:00" },
        contact: {
          phone: "+91 22 2261 5264",
          email: "britannia.co@gmail.com"
        },
        images: ["https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop"],
        dietaryOptions: ["Vegetarian", "Non-vegetarian"]
      },
      {
        name: "The Table",
        place: placeId,
        rating: 4.8,
        cuisine: ["California", "European", "Fusion"],
        priceRange: "$$$$",
        location: {
          address: "CS No. 1, Kalapesi Trust Building, Mumbai 400013",
          city: "Mumbai",
          state: "Maharashtra",
          country: "India"
        },
        openingHours: { open: "12:00", close: "23:00" },
        contact: {
          phone: "+91 22 2282 5000",
          email: "reservations@thetable.in"
        },
        images: ["https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=400&fit=crop"],
        dietaryOptions: ["Vegetarian", "Non-vegetarian"]
      },
      {
        name: "Leopold Cafe",
        place: placeId,
        rating: 4.3,
        cuisine: ["Continental", "Chinese", "Indian"],
        priceRange: "$$",
        location: {
          address: "Oberoi Road, Colaba, Mumbai 400001",
          city: "Mumbai",
          state: "Maharashtra",
          country: "India"
        },
        openingHours: { open: "07:30", close: "00:00" },
        contact: {
          phone: "+91 22 2282 8185",
          email: "leopoldcafe@gmail.com"
        },
        images: ["https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&h=400&fit=crop"],
        dietaryOptions: ["Vegetarian", "Non-vegetarian"]
      }
    ]
  };
  
  return baseRestaurants[placeName] || [];
};

const seedData = async () => {
  try {
    await mongoose.connect(config.mongoose.url);

    // Clear existing data
    await User.deleteMany();
    await Place.deleteMany();
    await Hotel.deleteMany();
    await Restaurant.deleteMany();

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'manishsinghbst0322@gmail.com',
      password: 'admin12345678',
      role: 'admin'
    });

    console.log('✅ Admin user created');

    // Enhanced Indian places with new fields
    const places = await Place.create([
      {
        name: 'Goa Beach',
        description: 'Famous beaches with golden sand, palm trees, vibrant nightlife, and Portuguese heritage. A perfect blend of relaxation and entertainment.',
        category: 'beach',
        location: {
          address: 'Calangute Beach',
          city: 'Goa',
          state: 'Goa',
          country: 'India',
          coordinates: {
            type: 'Point',
            coordinates: [73.7559, 15.5429]
          }
        },
        images: [
          'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'
        ],
        rating: 4.6,
        bestTimeToVisit: ['November', 'December', 'January', 'February'],
        activities: ['Swimming', 'Water Sports', 'Sunbathing', 'Nightlife', 'Beach Parties', 'Dolphin Watching'],
        entryFee: 0,
        openingHours: {
          open: '06:00',
          close: '22:00'
        },
        createdBy: admin._id,
        featured: true,
        popularity: 95,
        budget: "medium",
        tags: ["beach", "nightlife", "water sports", "portuguese architecture", "seafood"],
        idealDuration: "5-7 days",
        tips: ["Rent a scooter for easy travel", "Try local seafood dishes", "Visit during Christmas for festivities", "Carry sunscreen and beachwear"],
        weather: {
          summer: { min: 25, max: 33, desc: "Hot and humid" },
          winter: { min: 20, max: 32, desc: "Pleasant and dry" },
          monsoon: { min: 24, max: 30, desc: "Heavy rainfall" }
        }
      },
      {
        name: 'Manali',
        description: 'Picturesque hill station nestled in the Himalayas, offering stunning mountain views, adventure sports, and serene landscapes.',
        category: 'mountain',
        location: {
          address: 'Manali Town',
          city: 'Manali',
          state: 'Himachal Pradesh',
          country: 'India',
          coordinates: {
            type: 'Point',
            coordinates: [77.1734, 32.2396]
          }
        },
        images: [
          'https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1579033462043-0f11a7862f7d?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1569941554646-44f3f0013805?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop'
        ],
        rating: 4.7,
        bestTimeToVisit: ['March', 'April', 'May', 'October', 'November'],
        activities: ['Trekking', 'Skiing', 'Paragliding', 'River Rafting', 'Mountain Biking', 'Temple Visits'],
        entryFee: 0,
        openingHours: {
          open: '00:00',
          close: '23:59'
        },
        createdBy: admin._id,
        featured: true,
        popularity: 88,
        budget: "medium",
        tags: ["himalayas", "adventure sports", "snow", "trekking", "hill station"],
        idealDuration: "4-6 days",
        tips: ["Carry warm clothes even in summer", "Book adventure activities in advance", "Visit Solang Valley for snow activities", "Try local Himachali cuisine"],
        weather: {
          summer: { min: 10, max: 25, desc: "Pleasant and cool" },
          winter: { min: -7, max: 10, desc: "Cold with snowfall" },
          monsoon: { min: 15, max: 22, desc: "Moderate rainfall" }
        }
      },
      {
        name: 'Taj Mahal',
        description: 'Iconic white marble mausoleum in Agra, one of the Seven Wonders of the World. A masterpiece of Mughal architecture and symbol of eternal love.',
        category: 'historical',
        location: {
          address: 'Dharmapuri, Forest Colony',
          city: 'Agra',
          state: 'Uttar Pradesh',
          country: 'India',
          coordinates: {
            type: 'Point',
            coordinates: [78.0421, 27.1751]
          }
        },
        images: [
          'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&h=600&fit=crop'
        ],
        rating: 4.9,
        bestTimeToVisit: ['October', 'November', 'February', 'March'],
        activities: ['Sightseeing', 'Photography', 'History Tour', 'Sunrise Viewing', 'Moonlight Viewing'],
        entryFee: 50,
        openingHours: {
          open: '06:00',
          close: '19:00'
        },
        createdBy: admin._id,
        featured: true,
        popularity: 98,
        budget: "low",
        tags: ["unesco", "mughal architecture", "world wonder", "historical", "marble"],
        idealDuration: "1-2 days",
        tips: ["Visit during sunrise for best photos", "Hire a licensed guide", "Avoid Fridays (closed)", "Carry water and hat"],
        weather: {
          summer: { min: 25, max: 45, desc: "Extremely hot" },
          winter: { min: 8, max: 22, desc: "Cool and pleasant" },
          monsoon: { min: 25, max: 35, desc: "Humid with occasional rain" }
        }
      },
      {
        name: 'Mumbai City',
        description: 'Vibrant metropolitan city known as the financial capital of India. A melting pot of cultures with colonial architecture, bustling markets, and Bollywood.',
        category: 'city',
        location: {
          address: 'Marine Drive',
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          coordinates: {
            type: 'Point',
            coordinates: [72.8222, 18.9220]
          }
        },
        images: [
          'https://images.unsplash.com/photo-1601961405399-801fb1f34581?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1529254479751-fbacb4c3b098?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1567594321351-1df7b2f3c8b3?w=800&h=600&fit=crop'
        ],
        rating: 4.5,
        bestTimeToVisit: ['November', 'December', 'January', 'February'],
        activities: ['City Tour', 'Shopping', 'Beach Visits', 'Bollywood Studio Tour', 'Historical Sites', 'Food Tours'],
        entryFee: 0,
        openingHours: {
          open: '00:00',
          close: '23:59'
        },
        createdBy: admin._id,
        featured: true,
        popularity: 92,
        budget: "expensive",
        tags: ["metropolitan", "bollywood", "shopping", "street food", "colonial architecture"],
        idealDuration: "3-5 days",
        tips: ["Use local trains for transportation", "Try street food at Chowpatty", "Visit Gateway of India at sunset", "Book Bollywood tours in advance"],
        weather: {
          summer: { min: 26, max: 33, desc: "Hot and humid" },
          winter: { min: 17, max: 31, desc: "Pleasant and mild" },
          monsoon: { min: 24, max: 30, desc: "Heavy rainfall" }
        }
      }
    ]);

    console.log('📍 Created ${places.length} Indian places');

    // CREATE 5 HOTELS FOR EACH PLACE using template function
    const hotels = [];
    for (const place of places) {
      const hotelsData = getHotelsData(place._id, place.name);
      const createdHotels = await Hotel.insertMany(hotelsData);
      hotels.push(...createdHotels);
    }

    console.log('🏨 Created ${hotels.length} hotels');

    // CREATE 5 RESTAURANTS FOR EACH PLACE using template function
    const restaurants = [];
    for (const place of places) {
      const restaurantsData = getRestaurantsData(place._id, place.name);
      const createdRestaurants = await Restaurant.insertMany(restaurantsData);
      restaurants.push(...createdRestaurants);
    }

    console.log('🍽 Created ${restaurants.length} restaurants');

    console.log('🎉 Seed completed successfully!');
    console.log('📊 Summary, ${places:length}, places, ${hotels:length} , hotels, ${restaurants.length} restaurants');
    process.exit(0);

  } catch (error) {
    console.error('❌ Seed data error:', error.message);
    console.error('Error details:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedData();
}

module.exports = seedData;