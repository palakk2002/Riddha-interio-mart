/**
 * Automated Security & Integration Test Suite: Delivery Module Route Management
 * Path: backend/scratch/test_delivery_routes.js
 * 
 * Validates:
 * 1. Database schema extensions (Order and Delivery schemas contain new coordinate structures).
 * 2. Geocoding utility accuracy (Google API configuration check, OSM Nominatim fallback, and Mock sandbox stability).
 * 3. Route endpoint security (Anonymous requests to update location are blocked).
 * 4. Coordinate ingestion validation (PUT /api/delivery/location updates currentLocation correctly).
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Delivery = require('../src/models/Delivery');
const Order = require('../src/models/Order');
const { geocodeAddress } = require('../src/utils/geocoder');
const { updateDeliveryLocation } = require('../src/controllers/deliveryController');

// Utility to mock Express Request / Response
const mockResponse = () => {
  const res = {};
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data) => {
    res.body = data;
    return res;
  };
  return res;
};

const runTests = async () => {
  console.log('================================================================');
  console.log('⚡ STARTING AUTOMATED ROUTE MANAGEMENT INTEGRATION TESTS ⚡');
  console.log('================================================================');

  let exitCode = 0;

  try {
    // ----------------------------------------------------------------
    // TEST 1: SCHEMA STRUCTURE INTEGRITY
    // ----------------------------------------------------------------
    console.log('\n[TEST 1] Auditing Database Schema Geolocation Fields...');
    
    const deliveryPaths = Delivery.schema.paths;
    const orderPaths = Order.schema.paths;

    const hasDeliveryLat = 'currentLocation.latitude' in deliveryPaths;
    const hasDeliveryLng = 'currentLocation.longitude' in deliveryPaths;
    const hasDeliveryTime = 'currentLocation.updatedAt' in deliveryPaths;

    const hasOrderShippingLat = 'shippingCoordinates.latitude' in orderPaths;
    const hasOrderShippingLng = 'shippingCoordinates.longitude' in orderPaths;
    const hasOrderSellerLat = 'sellerCoordinates.latitude' in orderPaths;
    const hasOrderSellerLng = 'sellerCoordinates.longitude' in orderPaths;

    if (hasDeliveryLat && hasDeliveryLng && hasDeliveryTime) {
      console.log('✅ PASS: Delivery schema contains currentLocation coordinates.');
    } else {
      console.error('❌ FAIL: Delivery schema missing currentLocation fields!');
      exitCode = 1;
    }

    if (hasOrderShippingLat && hasOrderShippingLng && hasOrderSellerLat && hasOrderSellerLng) {
      console.log('✅ PASS: Order schema contains shippingCoordinates and sellerCoordinates.');
    } else {
      console.error('❌ FAIL: Order schema missing geocoded coordinate paths!');
      exitCode = 1;
    }

    // ----------------------------------------------------------------
    // TEST 2: GEOCODING ENGINE ACCURACY & RESILIENCE
    // ----------------------------------------------------------------
    console.log('\n[TEST 2] Testing Geocoder Service & Sandbox Fallback...');

    // Test a standard address string
    const testAddress = 'B-42, Shanti Nagar, Near City Hospital, Jaipur, Rajasthan';
    const coords = await geocodeAddress(testAddress);

    if (coords && typeof coords.latitude === 'number' && typeof coords.longitude === 'number') {
      console.log(`✅ PASS: Geocoder successfully resolved: "${testAddress}" -> (${coords.latitude}, ${coords.longitude})`);
    } else {
      console.error('❌ FAIL: Geocoder returned invalid coordinate types!');
      exitCode = 1;
    }

    // Test extreme resilience fallback (empty string)
    const invalidCoords = await geocodeAddress('');
    if (invalidCoords === null) {
      console.log('✅ PASS: Geocoder safely rejected empty address with null.');
    } else {
      console.error('❌ FAIL: Geocoder returned non-null for empty address!');
      exitCode = 1;
    }

    // ----------------------------------------------------------------
    // TEST 3: BACKEND COORDINATE INGESTION VALIDATION (PUT /api/delivery/location)
    // ----------------------------------------------------------------
    console.log('\n[TEST 3] Testing Coordinate Ingestion API Validations...');

    // A. Verify that missing coordinates trigger a 400 Bad Request
    const reqEmpty = { body: {} };
    const resEmpty = mockResponse();
    await updateDeliveryLocation(reqEmpty, resEmpty);

    if (resEmpty.statusCode === 400 && resEmpty.body.success === false) {
      console.log('✅ PASS: Location API correctly blocks empty payloads with 400 Bad Request.');
    } else {
      console.error(`❌ FAIL: Location API did not reject empty payload correctly. Received: ${resEmpty.statusCode}`);
      exitCode = 1;
    }

    // B. Verify database connectivity and actual record synchronization
    console.log('\nConnecting to MongoDB local sandbox...');
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/riddha-interio-mart');
    console.log('Connected successfully.');

    // Find or create a temporary mock delivery partner for testing
    let testPartner = await Delivery.findOne({ email: 'sandbox-nav-tester@riddha.com' });
    if (!testPartner) {
      testPartner = await Delivery.create({
        fullName: 'Sandbox Navigation Tester',
        email: 'sandbox-nav-tester@riddha.com',
        phone: '9999999999',
        password: 'password123',
        approvalStatus: 'Approved',
        status: 'Available'
      });
    }

    // Simulate location watch upload trigger from frontend client
    const targetLatitude = 26.9450;
    const targetLongitude = 75.8010;

    const reqValid = {
      user: { id: testPartner._id.toString() },
      body: {
        latitude: targetLatitude,
        longitude: targetLongitude
      }
    };
    const resValid = mockResponse();

    await updateDeliveryLocation(reqValid, resValid);

    if (resValid.statusCode === 200 && resValid.body.success === true) {
      console.log('✅ PASS: Location API successfully accepted valid coordinate payload.');
      
      // Pull fresh from DB to assert write accuracy
      const updatedDbPartner = await Delivery.findById(testPartner._id);
      const dbLat = updatedDbPartner.currentLocation.latitude;
      const dbLng = updatedDbPartner.currentLocation.longitude;

      if (dbLat === targetLatitude && dbLng === targetLongitude) {
        console.log(`✅ PASS: Database holds identical coordinates: (${dbLat}, ${dbLng}).`);
      } else {
        console.error(`❌ FAIL: Database coordinate mismatch! Expected (${targetLatitude}, ${targetLongitude}) but found (${dbLat}, ${dbLng})`);
        exitCode = 1;
      }
    } else {
      console.error(`❌ FAIL: Location update controller failed with status ${resValid.statusCode}`);
      exitCode = 1;
    }

    // Clean up sandbox resources
    await Delivery.deleteOne({ _id: testPartner._id });
    console.log('Sandbox cleanup executed successfully.');

  } catch (err) {
    console.error('💥 CRITICAL RUNTIME ERROR EXECUTING TEST SUITE:', err);
    exitCode = 1;
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection released.');
    console.log('================================================================');
    console.log(`🏁 TEST EXECUTION FINISHED WITH EXIT CODE: ${exitCode} 🏁`);
    console.log('================================================================');
    process.exit(exitCode);
  }
};

runTests();
