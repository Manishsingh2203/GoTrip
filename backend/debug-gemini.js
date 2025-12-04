const { GoogleGenerativeAI } = require('@google/generative-ai');

// Test with your API key
const API_KEY = process.env.GEMINI_API_KEY || 'your_api_key_here';

console.log('Testing Gemini API with key:', API_KEY ? '✓ Present' : '✗ Missing');

if (!API_KEY || API_KEY === 'your_api_key_here') {
  console.error('❌ Please set GEMINI_API_KEY in your .env file');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

async function testGemini() {
  try {
    console.log('\n🔍 Testing Gemini API connection...');
    
    // Test different model names
    const modelsToTest = [
      'gemini-pro',
      'gemini-1.0-pro',
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'models/gemini-pro'
    ];

    for (const modelName of modelsToTest) {
      console.log(`\n🧪 Testing model: ${modelName}`);
      
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        
        // Simple test prompt
        const prompt = 'Hello, are you working? Respond with "Yes" if you can read this.';
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log(`✅ ${modelName}: SUCCESS - "${text}"`);
        console.log('🎉 This model works! Use it in your geminiService.js');
        return modelName; // Return the working model
        
      } catch (modelError) {
        console.log(`❌ ${modelName}: FAILED - ${modelError.message}`);
      }
    }
    
    console.log('\n💥 All models failed. Please check:');
    console.log('1. Your API key is valid');
    console.log('2. Gemini API is enabled in Google Cloud Console');
    console.log('3. You have proper billing setup');
    
  } catch (error) {
    console.error('💥 General error:', error);
  }
}

testGemini();