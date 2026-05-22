const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const connectDB = require('../src/config/db');

// Models
const Seller = require('../src/models/Seller');
const Admin = require('../src/models/Admin');
const SupportTicket = require('../src/models/SupportTicket');

// Controllers
const {
  createTicket,
  getSellerTickets,
  getTicketById,
  replyToTicket,
  updateTicketStatus,
  getAdminTickets
} = require('../src/controllers/supportController');

async function runTests() {
  console.log('=== SELLER HELP & SUPPORT INTEGRATION TEST RUNNER ===');
  await connectDB();

  let testSeller = null;
  let testAdmin = null;
  let createdTicketId = null; // Mongo ObjectId
  let createdTicketCode = null; // RIDDHA-XXXXX

  try {
    // 1. Setup / Verify test records
    console.log('\n[Step 1] Setting up dummy Seller and Admin records...');

    testSeller = await Seller.findOne({ email: 'support_seller@example.com' });
    if (!testSeller) {
      testSeller = await Seller.create({
        fullName: 'Support Test Seller',
        email: 'support_seller@example.com',
        password: 'password123',
        phone: '7777777777',
        shopName: 'Support test Shop',
        shopAddress: '456, Support Lane, Mumbai',
        status: 'approved',
        isVerified: true
      });
      console.log('Created test Seller.');
    } else {
      console.log('Found existing test Seller.');
      // Ensure status is approved so middleware checks pass
      testSeller.status = 'approved';
      await testSeller.save();
    }

    testAdmin = await Admin.findOne({ email: 'support_admin@example.com' });
    if (!testAdmin) {
      testAdmin = await Admin.create({
        fullName: 'Support Test Admin',
        email: 'support_admin@example.com',
        password: 'password123',
        phone: '1111111111',
        role: 'admin',
        type: 'superadmin'
      });
      console.log('Created test Admin.');
    } else {
      console.log('Found existing test Admin.');
    }

    // Clean up any old support tickets for this seller
    await SupportTicket.deleteMany({ seller: testSeller._id });

    // 2. Test Ticket Creation (Seller)
    console.log('\n[Step 2] Testing support ticket creation via Controller...');
    const createReq = {
      body: {
        subject: 'Payment payout delayed for Order #RIDDHA-39210',
        category: 'Payments',
        priority: 'High',
        description: 'My payouts for orders delivered last week are still in pending status. Please assist.',
        attachments: ['https://cloudinary.com/test-screenshot.png']
      },
      user: {
        _id: testSeller._id,
        role: 'seller'
      }
    };

    const createRes = {
      statusCode: 200,
      status: function(code) { this.statusCode = code; return this; },
      json: function(data) { this.body = data; return this; }
    };

    await createTicket(createReq, createRes);
    
    if (createRes.statusCode !== 201 || !createRes.body.success) {
      throw new Error(`Ticket creation failed: ${JSON.stringify(createRes.body)}`);
    }

    createdTicketId = createRes.body.data._id;
    createdTicketCode = createRes.body.data.ticketId;
    console.log(`Ticket created successfully. ID: ${createdTicketId}, Code: ${createdTicketCode}`);
    if (!createdTicketCode.startsWith('RIDDHA-')) {
      throw new Error(`Expected ticket ID to start with RIDDHA-, got ${createdTicketCode}`);
    }

    // 3. Test retrieving seller tickets
    console.log('\n[Step 3] Testing get seller tickets...');
    const getSellerReq = {
      query: {
        page: '1',
        limit: '10'
      },
      user: {
        _id: testSeller._id,
        role: 'seller'
      }
    };
    const getSellerRes = {
      statusCode: 200,
      status: function(code) { this.statusCode = code; return this; },
      json: function(data) { this.body = data; return this; }
    };

    await getSellerTickets(getSellerReq, getSellerRes);
    if (getSellerRes.statusCode !== 200 || !getSellerRes.body.success) {
      throw new Error(`Get seller tickets failed: ${JSON.stringify(getSellerRes.body)}`);
    }
    console.log(`Retrieved ${getSellerRes.body.count} ticket(s) successfully.`);
    if (getSellerRes.body.count !== 1) {
      throw new Error(`Expected 1 ticket, got ${getSellerRes.body.count}`);
    }

    // 4. Test retrieving single ticket details with replies
    console.log('\n[Step 4] Testing get ticket by ID (Seller)...');
    const getByIdReq = {
      params: { id: createdTicketId },
      user: {
        _id: testSeller._id,
        role: 'seller'
      }
    };
    const getByIdRes = {
      statusCode: 200,
      status: function(code) { this.statusCode = code; return this; },
      json: function(data) { this.body = data; return this; }
    };

    await getTicketById(getByIdReq, getByIdRes);
    if (getByIdRes.statusCode !== 200 || !getByIdRes.body.success) {
      throw new Error(`Get ticket by ID failed: ${JSON.stringify(getByIdRes.body)}`);
    }
    console.log(`Ticket details loaded: Subject: "${getByIdRes.body.data.subject}", Status: "${getByIdRes.body.data.status}"`);

    // 5. Test role protection (Unauthorized Seller view block)
    console.log('\n[Step 5] Testing role protection (Seller block)...');
    const wrongSeller = new mongoose.Types.ObjectId();
    const wrongSellerReq = {
      params: { id: createdTicketId },
      user: {
        _id: wrongSeller,
        role: 'seller'
      }
    };
    const wrongSellerRes = {
      statusCode: 200,
      status: function(code) { this.statusCode = code; return this; },
      json: function(data) { this.body = data; return this; }
    };
    await getTicketById(wrongSellerReq, wrongSellerRes);
    if (wrongSellerRes.statusCode !== 403) {
      throw new Error(`Expected 403 Forbidden for unauthorized seller, got ${wrongSellerRes.statusCode}`);
    }
    console.log('Role protection successfully blocked unauthorized seller.');

    // 6. Test Admin replying to the ticket (status should change to In Progress)
    console.log('\n[Step 6] Testing Admin reply addition...');
    const adminReplyReq = {
      params: { id: createdTicketId },
      body: { text: 'Hello, we are checking this payout delay with our bank partner. Should resolve within 2 hours.' },
      user: {
        _id: testAdmin._id,
        role: 'admin'
      }
    };
    const adminReplyRes = {
      statusCode: 200,
      status: function(code) { this.statusCode = code; return this; },
      json: function(data) { this.body = data; return this; }
    };
    await replyToTicket(adminReplyReq, adminReplyRes);
    if (adminReplyRes.statusCode !== 200 || !adminReplyRes.body.success) {
      throw new Error(`Admin reply failed: ${JSON.stringify(adminReplyRes.body)}`);
    }
    console.log(`Reply added successfully. Ticket Status now: "${adminReplyRes.body.data.status}"`);
    if (adminReplyRes.body.data.status !== 'In Progress') {
      throw new Error(`Expected ticket status to update to "In Progress", got "${adminReplyRes.body.data.status}"`);
    }
    if (adminReplyRes.body.data.replies.length !== 1) {
      throw new Error(`Expected 1 reply, got ${adminReplyRes.body.data.replies.length}`);
    }

    // 7. Test Admin changing status directly
    console.log('\n[Step 7] Testing direct ticket status transition (Admin)...');
    const updateStatusReq = {
      params: { id: createdTicketId },
      body: { status: 'Resolved' },
      user: {
        _id: testAdmin._id,
        role: 'admin'
      }
    };
    const updateStatusRes = {
      statusCode: 200,
      status: function(code) { this.statusCode = code; return this; },
      json: function(data) { this.body = data; return this; }
    };
    await updateTicketStatus(updateStatusReq, updateStatusRes);
    if (updateStatusRes.statusCode !== 200 || !updateStatusRes.body.success) {
      throw new Error(`Update status failed: ${JSON.stringify(updateStatusRes.body)}`);
    }
    console.log(`Ticket status successfully updated to: "${updateStatusRes.body.data.status}"`);

    // 8. Test Seller replying to Resolved ticket (status should change back to Open)
    console.log('\n[Step 8] Testing Seller reply to resolved ticket (Smart Reopen)...');
    const sellerReplyReq = {
      params: { id: createdTicketId },
      body: { text: 'Thank you, but I still see the payout is pending in my bank dashboard. Please re-verify.' },
      user: {
        _id: testSeller._id,
        role: 'seller'
      }
    };
    const sellerReplyRes = {
      statusCode: 200,
      status: function(code) { this.statusCode = code; return this; },
      json: function(data) { this.body = data; return this; }
    };
    await replyToTicket(sellerReplyReq, sellerReplyRes);
    if (sellerReplyRes.statusCode !== 200 || !sellerReplyRes.body.success) {
      throw new Error(`Seller reply failed: ${JSON.stringify(sellerReplyRes.body)}`);
    }
    console.log(`Reply added. Ticket Status re-opened to: "${sellerReplyRes.body.data.status}"`);
    if (sellerReplyRes.body.data.status !== 'Open') {
      throw new Error(`Expected ticket status to revert to "Open", got "${sellerReplyRes.body.data.status}"`);
    }
    if (sellerReplyRes.body.data.replies.length !== 2) {
      throw new Error(`Expected 2 replies, got ${sellerReplyRes.body.data.replies.length}`);
    }

    // 9. Test Admin list with filters
    console.log('\n[Step 9] Testing Admin ticket list retrieval with category filter...');
    const adminGetReq = {
      query: {
        category: 'Payments',
        page: '1',
        limit: '10'
      },
      user: {
        _id: testAdmin._id,
        role: 'admin'
      }
    };
    const adminGetRes = {
      statusCode: 200,
      status: function(code) { this.statusCode = code; return this; },
      json: function(data) { this.body = data; return this; }
    };
    await getAdminTickets(adminGetReq, adminGetRes);
    if (adminGetRes.statusCode !== 200 || !adminGetRes.body.success) {
      throw new Error(`Admin ticket retrieval failed: ${JSON.stringify(adminGetRes.body)}`);
    }
    console.log(`Admin retrieved ${adminGetRes.body.count} matching ticket(s).`);
    if (adminGetRes.body.count !== 1) {
      throw new Error(`Expected 1 ticket under "Payments" category, got ${adminGetRes.body.count}`);
    }

    console.log('\n=== ALL SELLER HELP & SUPPORT INTEGRATION TESTS PASSED SUCCESSFULLY! ===\n');

  } catch (error) {
    console.error('\n❌ INTEGRATION TEST FAILED:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    // Clean up database support ticket records
    if (testSeller) {
      await SupportTicket.deleteMany({ seller: testSeller._id });
      console.log('Cleaned up test support tickets.');
    }
    mongoose.connection.close();
    console.log('Database connection closed.');
  }
}

runTests();
