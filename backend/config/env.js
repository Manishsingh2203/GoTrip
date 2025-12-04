const Joi = require('joi');
require("dotenv").config();

const envVarsSchema = Joi.object({
  // Server Configuration
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(5000),
  
  // Database
  MONGODB_URI: Joi.string().required().description('MongoDB connection string'),
  
  // JWT Secrets (Updated for dual tokens)
  JWT_ACCESS_SECRET: Joi.string().required().description('JWT Access Token Secret'),
  JWT_REFRESH_SECRET: Joi.string().required().description('JWT Refresh Token Secret'),
  JWT_EXPIRE: Joi.string().default('7d'),
  
  // Email Service (Brevo)
  BREVO_API_KEY: Joi.string().required().description('Brevo API Key for email service'),
  FROM_EMAIL: Joi.string().email().required().description('Sender email address'),
  
  // OAuth Social Logins
  GOOGLE_CLIENT_ID: Joi.string().optional().description('Google OAuth Client ID'),
  FACEBOOK_APP_ID: Joi.string().optional().description('Facebook OAuth App ID'),
  
  // API Keys for External Services
  GEMINI_API_KEY: Joi.string().required().description('Google Gemini AI API Key'),
  OPENROUTESERVICE_API_KEY: Joi.string().required().description('OpenRouteService API Key'),
  WEATHER_API_KEY: Joi.string().required().description('Weather API Key'),
  
  // Optional: Google Maps API if needed
  GOOGLE_MAPS_API_KEY: Joi.string().optional().description('Google Maps API Key'),
  
}).unknown().required();

const { value: envVars, error } = envVarsSchema.validate(process.env, {
  abortEarly: false,
  stripUnknown: true
});

if (error) {
  const errorMessage = error.details.map(detail => detail.message).join(', ');
  throw new Error(`Config validation error: ${errorMessage}`);
}

// Validate required fields based on environment
// Validate required fields based on environment
if (envVars.NODE_ENV === 'production') {
  const productionSchema = Joi.object({
    JWT_ACCESS_SECRET: Joi.string().min(32).required(),
    JWT_REFRESH_SECRET: Joi.string().min(32).required(),
    MONGODB_URI: Joi.string().uri().required(),
  }).unknown(true);   // <<< IMPORTANT
  
  const { error: productionError } = productionSchema.validate(envVars);
  if (productionError) {
    throw new Error(`Production config validation error: ${productionError.message}`);
  }
}


module.exports = {
  // Server
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  
  // Database
  mongoose: {
    url: envVars.MONGODB_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },
  
pexels: {
    apiKey: process.env.PEXELS_API_KEY,
  },

  // JWT Configuration (Updated for dual tokens)
  jwt: {
    accessSecret: envVars.JWT_ACCESS_SECRET,
    refreshSecret: envVars.JWT_REFRESH_SECRET,
    expire: envVars.JWT_EXPIRE,
  },
  
  // OAuth Social Logins
  oauth: {
    google: {
      clientId: envVars.GOOGLE_CLIENT_ID || ''
    },
    facebook: {
      appId: envVars.FACEBOOK_APP_ID || ''
    }
  },
  
  // Email Service
  email: {
    brevoApiKey: envVars.BREVO_API_KEY,
    fromEmail: envVars.FROM_EMAIL
  },
  
  // External APIs
  gemini: {
    apiKey: envVars.GEMINI_API_KEY,
  },
  openRouteService: {
    apiKey: envVars.OPENROUTESERVICE_API_KEY,
  },
  weather: {
    apiKey: envVars.WEATHER_API_KEY,
  },
  
  // Optional APIs
  googleMaps: {
    apiKey: envVars.GOOGLE_MAPS_API_KEY || ''
  }
};