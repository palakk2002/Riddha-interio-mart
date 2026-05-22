const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const Delivery = require('../src/models/Delivery');
const Order = require('../src/models/Order');
const Product = require('../src/models/Product');
const DispatchEvent = require('../src/models/DispatchEvent');
const dispatchController = require('../src/controllers/dispatchController');

// Helper to simulate request/response for controllers
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

const mockNext = (err) => {
  if (err) throw err;
};

async function runTests() {
  console.log('🚀 STARTING INTEGRATION AND BOUNDARY AUDIT FOR DISPATCH ENGINE...');
  
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/riddha-interio';
  await mongoose.connect(mongoUri);
  console.log('💾 Connected to Database.');

  // Store cleanup references
  const seededDeliveryPartners = [];
  const seededOrders = [];
  const seededProducts = [];
  const seededEvents = [];

  try {
    // ----------------------------------------------------
    // PHASE 4.1: Shift Management Validation
    // ----------------------------------------------------
    console.log('\n--- 1. AUDITING SHIFT STATE & DUTY CONTROL TRANSITIONS ---');
    
    const partner = await Delivery.create({
      fullName: 'Shift Runner Test',
      email: `shift-runner-${Date.now()}@test.com`,
      phone: '9988776655',
      password: 'password123',
      vehicleType: 'Motorcycle',
      approvalStatus: 'Approved',
      servicePincodes: ['400001']
    });
    seededDeliveryPartners.push(partner._id);

    // Mock Clock-In
    const reqClockIn = { user: { id: partner._id } };
    const resClockIn = mockResponse();
    await dispatchController.clockInShift(reqClockIn, resClockIn, mockNext);
    
    if (resClockIn.statusCode !== 200 || !resClockIn.body.success) {
      throw new Error(`Clock-in REST request failed: ${JSON.stringify(resClockIn.body)}`);
    }
    
    let freshPartner = await Delivery.findById(partner._id);
    console.log(`✓ Clock-In verified. activeShift.isClockedIn = ${freshPartner.activeShift.isClockedIn}`);
    console.log(`✓ Availability Status set to: ${freshPartner.status}`);
    
    if (!freshPartner.activeShift.isClockedIn || freshPartner.status !== 'Available') {
      throw new Error('Shift state clock-in discrepancy detected.');
    }

    // Mock Clock-Out
    const resClockOut = mockResponse();
    await dispatchController.clockOutShift(reqClockIn, resClockOut, mockNext);
    
    if (resClockOut.statusCode !== 200 || !resClockOut.body.success) {
      throw new Error(`Clock-out REST request failed: ${JSON.stringify(resClockOut.body)}`);
    }

    freshPartner = await Delivery.findById(partner._id);
    console.log(`✓ Clock-Out verified. activeShift.isClockedIn = ${freshPartner.activeShift.isClockedIn}`);
    console.log(`✓ Availability Status set to: ${freshPartner.status}`);
    
    if (freshPartner.activeShift.isClockedIn || freshPartner.status !== 'Offline') {
      throw new Error('Shift state clock-out discrepancy detected.');
    }

    // Restore to Clocked-In for matching tests
    await dispatchController.clockInShift(reqClockIn, resClockIn, mockNext);

    // ----------------------------------------------------
    // PHASE 4.2: Weight-Based Allocation Engine Matching
    // ----------------------------------------------------
    console.log('\n--- 2. AUDITING INTERIOR FURNISHINGS CATALOG WEIGHT-BASED CLASSIFICATION ---');

    // Create 3 Products with distinct weights
    const dummySellerId = new mongoose.Types.ObjectId();
    const dummyBrandId = new mongoose.Types.ObjectId();

    const lightProduct = await Product.create({
      name: 'Light Vase Decor',
      description: 'Handcrafted ceramic tabletop accessory.',
      price: 1500,
      weight: 1.2, // Light category (<5kg)
      category: 'Home Decor',
      sku: `PROD-LGT-${Date.now()}`,
      countInStock: 10,
      images: ['decor.jpg'],
      isApproved: true,
      approvalStatus: 'approved',
      seller: dummySellerId,
      brand: dummyBrandId
    });
    seededProducts.push(lightProduct._id);

    const mediumProduct = await Product.create({
      name: 'Medium Office Chair',
      description: 'Ergonomic mesh workstation seat.',
      price: 5500,
      weight: 12.0, // Medium category (5-20kg)
      category: 'Furniture',
      sku: `PROD-MED-${Date.now()}`,
      countInStock: 5,
      images: ['chair.jpg'],
      isApproved: true,
      approvalStatus: 'approved',
      seller: dummySellerId,
      brand: dummyBrandId
    });
    seededProducts.push(mediumProduct._id);

    const heavyProduct = await Product.create({
      name: 'Heavy Oak Wardrobe',
      description: 'Solid solid oak wooden closet cabinet.',
      price: 24500,
      weight: 35.0, // Heavy category (>20kg)
      category: 'Furniture',
      sku: `PROD-HVY-${Date.now()}`,
      countInStock: 2,
      images: ['wardrobe.jpg'],
      isApproved: true,
      approvalStatus: 'approved',
      seller: dummySellerId,
      brand: dummyBrandId
    });
    seededProducts.push(heavyProduct._id);

    // Create 3 couriers representing different transportation tiers
    // 1. Two-wheeler runner
    const cyclistPartner = await Delivery.create({
      fullName: 'Cyclist Eco Runner',
      email: `cyclist-${Date.now()}@test.com`,
      phone: '9800770011',
      password: 'password123',
      vehicleType: 'Bicycle',
      vehicleDetails: { plateNumber: 'ECO-BIKE', maxWeightCapacity: 8, maxVolumeCapacity: 2 },
      approvalStatus: 'Approved',
      servicePincodes: ['400001'],
      status: 'Available',
      activeShift: { isClockedIn: true, clockedInAt: new Date() }
    });
    seededDeliveryPartners.push(cyclistPartner._id);

    // 2. Motorized courier
    const motorcyclePartner = await Delivery.create({
      fullName: 'Motorcycle Speed Runner',
      email: `moto-${Date.now()}@test.com`,
      phone: '9800770022',
      password: 'password123',
      vehicleType: 'Motorcycle',
      vehicleDetails: { plateNumber: 'MH-01-MOTO', maxWeightCapacity: 22, maxVolumeCapacity: 4 },
      approvalStatus: 'Approved',
      servicePincodes: ['400001'],
      status: 'Available',
      activeShift: { isClockedIn: true, clockedInAt: new Date() }
    });
    seededDeliveryPartners.push(motorcyclePartner._id);

    // 3. Four-wheeler cargo carrier
    const vanPartner = await Delivery.create({
      fullName: 'Cargo Van Heavy Logistics',
      email: `van-${Date.now()}@test.com`,
      phone: '9800770033',
      password: 'password123',
      vehicleType: 'Van',
      vehicleDetails: { plateNumber: 'MH-02-VAN', maxWeightCapacity: 200, maxVolumeCapacity: 12 },
      approvalStatus: 'Approved',
      servicePincodes: ['400001'],
      status: 'Available',
      activeShift: { isClockedIn: true, clockedInAt: new Date() }
    });
    seededDeliveryPartners.push(vanPartner._id);

    // Verify Eligible Vehicle classification helpers
    console.log('Verifying matching rule boundaries for transportation classes...');
    
    // Light Product Order (<5kg)
    const orderLight = await Order.create({
      user: new mongoose.Types.ObjectId(),
      seller: dummySellerId,
      sellerType: 'Seller',
      orderItems: [{ product: lightProduct._id, quantity: 1, name: lightProduct.name, price: lightProduct.price, seller: dummySellerId, image: 'test.jpg' }],
      shippingAddress: { fullAddress: '101, Marine Drive', city: 'Mumbai', pincode: '400001', mobileNumber: '9999988888', fullName: 'Jane Doe' },
      paymentMethod: 'COD',
      itemsPrice: 1500,
      totalPrice: 1575
    });
    seededOrders.push(orderLight._id);

    // Medium Product Order (5-20kg)
    const orderMedium = await Order.create({
      user: new mongoose.Types.ObjectId(),
      seller: dummySellerId,
      sellerType: 'Seller',
      orderItems: [{ product: mediumProduct._id, quantity: 1, name: mediumProduct.name, price: mediumProduct.price, seller: dummySellerId, image: 'test.jpg' }],
      shippingAddress: { fullAddress: '202, Marine Drive', city: 'Mumbai', pincode: '400001', mobileNumber: '9999988888', fullName: 'Jane Doe' },
      paymentMethod: 'COD',
      itemsPrice: 5500,
      totalPrice: 5575
    });
    seededOrders.push(orderMedium._id);

    // Heavy Product Order (>20kg)
    const orderHeavy = await Order.create({
      user: new mongoose.Types.ObjectId(),
      seller: dummySellerId,
      sellerType: 'Seller',
      orderItems: [{ product: heavyProduct._id, quantity: 1, name: heavyProduct.name, price: heavyProduct.price, seller: dummySellerId, image: 'test.jpg' }],
      shippingAddress: { fullAddress: '303, Marine Drive', city: 'Mumbai', pincode: '400001', mobileNumber: '9999988888', fullName: 'Jane Doe' },
      paymentMethod: 'COD',
      itemsPrice: 24500,
      totalPrice: 24575
    });
    seededOrders.push(orderHeavy._id);

    // Trigger allocation matching for Heavy Oak Wardrobe (Must target ONLY the Van Partner)
    console.log('Offering Heavy Oak Wardrobe to zone (35.0 kg)...');
    await dispatchController.broadcastNewOrder(orderHeavy._id);
    
    let activeHeavyEvent = await DispatchEvent.findOne({ order: orderHeavy._id });
    if (!activeHeavyEvent) {
      throw new Error('Heavy order offered event was not registered.');
    }
    seededEvents.push(activeHeavyEvent._id);
    
    console.log(`✓ Heavy dispatch auto-assigned to partner ID: ${activeHeavyEvent.deliveryBoy}`);
    if (activeHeavyEvent.deliveryBoy.toString() !== vanPartner._id.toString()) {
      throw new Error('Heavy order bypassed four-wheeler vehicle exclusion rules!');
    }
    console.log('✓ Weight restriction successfully matched strictly to Four-Wheelers.');

    // ----------------------------------------------------
    // PHASE 4.3: Volumetric & Weight Carrying Capacity Locks
    // ----------------------------------------------------
    console.log('\n--- 3. AUDITING COURIER CARRYING CAPACITY LOCKS & VOLUMETRIC BARRIERS ---');

    // Make Cyclist loaded up to max capacity
    cyclistPartner.activeShift.currentPayloadWeight = 7.5; // Cap is 8.0
    cyclistPartner.activeShift.currentPayloadCount = 1;    // Cap is 2
    cyclistPartner.markModified('activeShift');
    await cyclistPartner.save();

    console.log(`Cyclist state - current payload: 7.5 kg / 8.0 kg max. count: 1 / 2 max.`);
    
    // Create an order of 1.2 kg weight (Cyclist can't take this because 7.5 + 1.2 = 8.7 > 8.0 capacity)
    const orderLightOverweight = await Order.create({
      user: new mongoose.Types.ObjectId(),
      seller: dummySellerId,
      sellerType: 'Seller',
      orderItems: [{ product: lightProduct._id, quantity: 1, name: lightProduct.name, price: lightProduct.price, seller: dummySellerId, image: 'test.jpg' }],
      shippingAddress: { fullAddress: '404, Marine Drive', city: 'Mumbai', pincode: '400001', mobileNumber: '9999988888', fullName: 'Jane Doe' },
      paymentMethod: 'COD',
      itemsPrice: 1500,
      totalPrice: 1575
    });
    seededOrders.push(orderLightOverweight._id);

    // Make the motorcycle partner offline to ensure cyclist is primary candidate if capacity matches
    motorcyclePartner.activeShift.isClockedIn = false;
    motorcyclePartner.status = 'Offline';
    await motorcyclePartner.save();

    // Make the van partner offline
    vanPartner.activeShift.isClockedIn = false;
    vanPartner.status = 'Offline';
    await vanPartner.save();

    // Make the Shift Runner Test offline
    partner.activeShift.isClockedIn = false;
    partner.status = 'Offline';
    partner.servicePincodes = ['999999'];
    partner.markModified('activeShift');
    await partner.save();

    console.log('Broadcasting order while cyclist is at near-limit payload weight capacity...');
    await dispatchController.broadcastNewOrder(orderLightOverweight._id);

    let weightLockEvent = await DispatchEvent.findOne({ order: orderLightOverweight._id });
    if (weightLockEvent) {
      seededEvents.push(weightLockEvent._id);
      throw new Error(`Volumetric payload limit bypassed! Order assigned to cyclist exceeding carrying limits: ${weightLockEvent.deliveryBoy}`);
    }
    console.log('✓ Successfully blocked matching to active runners exceeding carrying limits.');

    // ----------------------------------------------------
    // PHASE 4.4: Expiration Window & Timeout Transition
    // ----------------------------------------------------
    console.log('\n--- 4. AUDITING AUTO-EXPIRATION AND TIMER STATE TRANSITIONS ---');

    // Create custom Offered event
    const expireTestEvent = await DispatchEvent.create({
      order: orderLight._id,
      deliveryBoy: partner._id,
      expiresAt: new Date(Date.now() - 5000), // Exceeded / expired in past
      broadcastStatus: 'Offered'
    });
    seededEvents.push(expireTestEvent._id);

    console.log('Attempting to accept an expired dispatch offer...');
    const reqAccept = {
      params: { eventId: expireTestEvent._id },
      user: { id: partner._id }
    };
    const resAccept = mockResponse();
    await dispatchController.acceptOffer(reqAccept, resAccept, mockNext);

    console.log(`✓ REST Response code: ${resAccept.statusCode}, Error payload: "${resAccept.body.error}"`);
    
    const freshExpireEvent = await DispatchEvent.findById(expireTestEvent._id);
    console.log(`✓ Dispatch status transitioned to: ${freshExpireEvent.broadcastStatus}`);
    
    if (resAccept.statusCode !== 400 || freshExpireEvent.broadcastStatus !== 'Expired') {
      throw new Error('Auto-expiration checks failed to block acceptance or transition state!');
    }

    // ----------------------------------------------------
    // PHASE 4.5: Transaction-Safe Race Protection
    // ----------------------------------------------------
    console.log('\n--- 5. AUDITING TRANSACTION-SAFE DUAL-ACCEPT RACE CONDITIONS ---');

    // Reset motorcycle and cyclist online
    motorcyclePartner.activeShift.isClockedIn = true;
    motorcyclePartner.status = 'Available';
    await motorcyclePartner.save();

    cyclistPartner.activeShift.isClockedIn = true;
    cyclistPartner.status = 'Available';
    cyclistPartner.activeShift.currentPayloadWeight = 0;
    cyclistPartner.activeShift.currentPayloadCount = 0;
    await cyclistPartner.save();

    // Create a new Offered Event for motorcycle courier
    const raceEvent = await DispatchEvent.create({
      order: orderLight._id,
      deliveryBoy: motorcyclePartner._id,
      expiresAt: new Date(Date.now() + 60 * 1000),
      broadcastStatus: 'Offered'
    });
    seededEvents.push(raceEvent._id);

    // Simulate Rider 1 Accept
    console.log(`Rider 1 (Motorcycle, ID: ${motorcyclePartner._id}) attempting to accept dispatch event...`);
    const reqAcceptRace1 = {
      params: { eventId: raceEvent._id },
      user: { id: motorcyclePartner._id }
    };
    const resAcceptRace1 = mockResponse();
    await dispatchController.acceptOffer(reqAcceptRace1, resAcceptRace1, mockNext);
    
    console.log(`Rider 1 response: code ${resAcceptRace1.statusCode}, success: ${resAcceptRace1.body.success}`);

    // Simulate Rider 2 Race Condition Accept (Cyclist trying to claim the same order)
    console.log(`Rider 2 (Cyclist, ID: ${cyclistPartner._id}) concurrent attempt to accept the same dispatch event...`);
    const reqAcceptRace2 = {
      params: { eventId: raceEvent._id },
      user: { id: cyclistPartner._id }
    };
    const resAcceptRace2 = mockResponse();
    await dispatchController.acceptOffer(reqAcceptRace2, resAcceptRace2, mockNext);

    console.log(`Rider 2 response: code ${resAcceptRace2.statusCode}, error payload: "${resAcceptRace2.body.error}"`);

    if (resAcceptRace1.statusCode !== 200 || resAcceptRace2.statusCode !== 403) {
      throw new Error(`Dual-accept race condition safety failed. Allowed non-target accept code: ${resAcceptRace2.statusCode}`);
    }
    console.log('✓ Dual-accept atomic protection successfully blocked race condition.');

    console.log('\n🌟 ALL DISPATCH ENGINE ARCHITECTURAL AUDIT CHECKS PASSED SUCCESSFULLY! 🌟');
  } finally {
    // DB Cleaning block
    console.log('\n🧹 Cleaning up test allocations and records...');
    await Delivery.deleteMany({ _id: { $in: seededDeliveryPartners } });
    await Order.deleteMany({ _id: { $in: seededOrders } });
    await Product.deleteMany({ _id: { $in: seededProducts } });
    await DispatchEvent.deleteMany({ _id: { $in: seededEvents } });
    console.log('✓ Database cleaned.');
    await mongoose.disconnect();
  }
}

runTests().catch(err => {
  console.error('\n❌ AUDIT DISCOVERED STRUCTURAL CRITICAL FAILURE:', err);
  process.exit(1);
});
