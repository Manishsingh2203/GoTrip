const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database');
const config = require('./config/env');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/auth');
const placeRoutes = require('./routes/places');
const hotelRoutes = require('./routes/hotels');
const restaurantRoutes = require('./routes/restaurants');
const tripRoutes = require('./routes/trips');
const distanceRoutes = require('./routes/distance');
const weatherRoutes = require('./routes/weather');
const aiDealsRoutes = require("./routes/aiDeals");
const aiDealDetailsRoutes = require("./routes/aiDealDetails");
const aiRoutes = require('./routes/ai');
const nearbyRoutes = require('./routes/nearby');
const utilProxy = require("./routes/utilProxy");
const savedPlacesRoute = require("./routes/savedPlaces");
const itineraries = require("./routes/itineraries");
const reviews = require("./routes/reviews");
const proxy = require("./routes/proxy");
const aiTravelRoutes = require('./routes/aiTravel');
const queryDetectRoutes = require("./routes/queryDetect");
const Notify = require("./models/Notify");


// Connect to database
connectDB();

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  process.env.FRONTEND_URL   // 👉 Vercel URL from env
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS: " + origin), false);
    }
  },
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));


// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// ✅ Cookie Parser (Required for HttpOnly cookies in authentication)
app.use(cookieParser());

// ✅ Rate limiting configuration
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: config.env === 'production' ? 100 : 1000, // More lenient in development
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting based on environment
app.use(limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ✅ Handle preflight requests globally
app.options('*', cors());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/distance', distanceRoutes);
app.use('/api/weather', weatherRoutes);

app.use('/api/ai', aiRoutes);
app.use('/api/nearby', nearbyRoutes);
app.use("/api/util", utilProxy);
app.use("/api/saved", savedPlacesRoute);

app.use('/api/itineraries', itineraries);
app.use('/api/reviews', reviews);
app.use('/api/proxy', proxy);
app.use('/api/currency', require('./routes/currency'));
app.use('/api/safety', require('./routes/safety'));
// other routes...

app.use('/ai', aiTravelRoutes);
app.use("/ai", queryDetectRoutes);
app.use("/api/ai", aiDealsRoutes);
app.use("/api/ai", aiDealDetailsRoutes);
app.use("/api/ai", require("./routes/aiChecklist"));
app.use("/api/help", require("./routes/help"));


// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'GoTrip AI Backend is running',
    timestamp: new Date().toISOString(),
    environment: config.env,
    version: '1.0.0'
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to GoTrip AI Backend API',
    documentation: '/api/docs',
    health: '/api/health'
  });
});


app.get("/api/placeholder/:w/:h", (req, res) => {
  const { w, h } = req.params;
  const url = `https://placehold.co/${w}x${h}?text=No+Image`;

  res.redirect(url);
});


app.post("/api/notify", async (req, res) => {
  try {
    const { email } = req.body;

    await Notify.create({ email });

    return res.json({ message: "Saved Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});





// 404 handler for unmatched routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handler middleware (should be last)
app.use(errorHandler);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log('❌ Unhandled Rejection at:', promise, 'reason:', err);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('❌ Uncaught Exception thrown:', err);
  process.exit(1);
});

const PORT = config.port || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 GoTrip AI Backend running in ${config.env} mode on port ${PORT}`);
  console.log(`🌐 CORS enabled for: http://localhost:3000`);
  console.log(`📊 Rate limit: ${config.env === 'production' ? '100' : '1000'} requests per minute`);
  console.log(`🔐 Authentication: OTP + JWT with HttpOnly cookies`);
  console.log(`📧 Email service: Brevo API`);
  // ✅ FIX: Use the correct config path
  console.log(`💾 Database: ${config.mongoose.url.includes('localhost') ? 'Local MongoDB' : 'Cloud Database'}`);
});

module.exports = app;