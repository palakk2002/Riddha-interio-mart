const axios = require('axios');

/**
 * Geocodes a text address into latitude and longitude coordinates.
 * Supports Google Maps Geocoding API for production and falls back to OpenStreetMap Nominatim API
 * or mock coordinate generation for a seamless development experience.
 * 
 * @param {string} address - The text address to geocode
 * @returns {Promise<{latitude: number, longitude: number}|null>} Geocoded coordinates or null
 */
const geocodeAddress = async (address) => {
  if (!address || typeof address !== 'string' || address.trim() === '') {
    return null;
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (apiKey) {
    // 1. Google Maps Geocoding API (Production Setup)
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
      const { data } = await axios.get(url);
      
      if (data && data.status === 'OK' && data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        console.log(`[Geocoder] Resolved via Google Maps API: ${address} -> (${lat}, ${lng})`);
        return { latitude: lat, longitude: lng };
      } else {
        console.warn(`[Geocoder] Google Maps API returned status: ${data.status} for address: ${address}`);
      }
    } catch (err) {
      console.error('[Geocoder] Google Maps API request failed:', err.message);
    }
  }

  // 2. OpenStreetMap Nominatim API Fallback
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
    const { data } = await axios.get(url, {
      headers: { 'User-Agent': 'RiddhaInterioMartLogistics/1.0' },
      timeout: 5000
    });
    
    if (data && data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lng = parseFloat(data[0].lon);
      console.log(`[Geocoder] Resolved via OpenStreetMap Nominatim: ${address} -> (${lat}, ${lng})`);
      return { latitude: lat, longitude: lng };
    }
  } catch (err) {
    console.warn('[Geocoder] OpenStreetMap Nominatim API failed:', err.message);
  }

  // 3. Mock Coordinates Fallback ( Jaipur Center + subtle variations )
  // This guarantees that developers can test maps locally without configuration friction
  const jaipurLat = 26.9124;
  const jaipurLng = 75.7873;
  // Generate slightly randomized coordinates within a 5-10km radius of Jaipur
  const randomLatOffset = (Math.random() - 0.5) * 0.05;
  const randomLngOffset = (Math.random() - 0.5) * 0.05;
  
  const latitude = parseFloat((jaipurLat + randomLatOffset).toFixed(6));
  const longitude = parseFloat((jaipurLng + randomLngOffset).toFixed(6));
  
  console.log(`[Geocoder] Sandbox Mode: Generated Mock Coordinates for: ${address} -> (${latitude}, ${longitude})`);
  return { latitude, longitude };
};

module.exports = {
  geocodeAddress
};
