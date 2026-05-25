const mongoose = require('mongoose');
const path = require('path');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const cacheService = require('../src/services/cacheService');
const { protect } = require('../src/middleware/auth');
const Category = require('../src/models/Category');
const { getCategories } = require('../src/controllers/categoryController');

async function runScalabilityVerification() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected successfully!\n');

    console.log('--- 📋 Task 1: In-Memory Cache deep-cloning guards ---');
    const mutationKey = 'test:mutation:guard';
    const originalObject = { name: 'Scalable Cluster', specs: { cores: 8, memory: 16 } };
    
    cacheService.set(mutationKey, originalObject, 5);
    
    // Fetch and mutate
    const fetched1 = cacheService.get(mutationKey);
    fetched1.specs.cores = 128; // Attempt inline mutation
    
    // Fetch again
    const fetched2 = cacheService.get(mutationKey);
    console.log(`   Fetched cores count after mutation attempt: ${fetched2.specs.cores} (Expected: 8)`);
    if (fetched2.specs.cores !== 8) {
      throw new Error('Mutation guard failed! Objects are leaking memory references.');
    }
    console.log('✅ Task 1 Passed!\n');

    console.log('--- 📋 Task 2: Wildcard Pattern Cache Invalidation ---');
    cacheService.set('products:list:page1', [{ id: 1 }], 60);
    cacheService.set('products:list:page2', [{ id: 2 }], 60);
    cacheService.set('products:single:abc', { id: 'abc' }, 60);
    
    console.log('   Clearing product list caches matching pattern: "products:list:*"');
    cacheService.delPattern('products:list:*');
    
    const list1 = cacheService.get('products:list:page1');
    const list2 = cacheService.get('products:list:page2');
    const single = cacheService.get('products:single:abc');
    
    console.log(`   products:list:page1 present: ${!!list1} (Expected: false)`);
    console.log(`   products:list:page2 present: ${!!list2} (Expected: false)`);
    console.log(`   products:single:abc present: ${!!single} (Expected: true)`);
    
    if (list1 !== null || list2 !== null || single === null) {
      throw new Error('Pattern invalidation failed! Wildcard clear did not isolate lists.');
    }
    console.log('✅ Task 2 Passed!\n');

    console.log('--- 📋 Task 3: Database Bypass & Category Read Caching ---');
    
    // Setup dummy category
    let testCat = await Category.findOne({ name: 'Fintech Cache Cat' });
    if (!testCat) {
      testCat = await Category.create({ name: 'Fintech Cache Cat' });
    }

    cacheService.del('categories:all'); // Clean slate

    // Mock Express Req/Res
    const mockReq = { query: {} };
    let responseData = null;
    const mockRes = {
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      json: function(data) {
        responseData = data;
        return this;
      }
    };

    console.log('1. First category request (Cache Miss)...');
    await getCategories(mockReq, mockRes, (err) => { if (err) throw err; });
    console.log(`   Response success: ${responseData.success} | Cached flag: ${responseData.cached} (Expected: false)`);
    
    const countAfterMiss = responseData.count;
    
    console.log('2. Second category request (Cache Hit)...');
    await getCategories(mockReq, mockRes, (err) => { if (err) throw err; });
    console.log(`   Response success: ${responseData.success} | Cached flag: ${responseData.cached} (Expected: true)`);
    
    if (responseData.cached !== true || responseData.count !== countAfterMiss) {
      throw new Error('Category caching failed! Response was not served from cache.');
    }
    console.log('✅ Task 3 Passed!\n');

    console.log('--- 📋 Task 4: Stateless Access Token Blacklist Security ---');
    
    // 1. Generate a mock access token
    const testUserId = new mongoose.Types.ObjectId().toString();
    const tokenSecret = process.env.ACCESS_TOKEN_SECRET || 'your_jwt_secret_key_here';
    const mockAccessToken = jwt.sign({ id: testUserId, role: 'user' }, tokenSecret, { expiresIn: '15m' });
    
    const authReq = {
      cookies: { access_token: mockAccessToken },
      signedCookies: {},
      headers: {}
    };

    let authResponseData = null;
    const authRes = {
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      json: function(data) {
        authResponseData = data;
        return this;
      }
    };

    // 2. Blacklist the mock token
    const tokenHash = crypto.createHash('sha256').update(mockAccessToken).digest('hex');
    cacheService.set(`blacklist:token:${tokenHash}`, true, 10); // Blacklist for 10 seconds
    console.log('   Mock access token blacklisted.');

    // 3. Fire request to protect middleware
    console.log('   Invoking protect middleware with blacklisted token...');
    await protect(authReq, authRes, (err) => {
      if (err) throw err;
    });

    console.log(`   Auth status code: ${authRes.statusCode} (Expected: 401)`);
    console.log(`   Auth error message: "${authResponseData.error}"`);

    if (authRes.statusCode !== 401 || !authResponseData.error.includes('Session has been invalidated')) {
      throw new Error('Token blacklist verification failed! Blacklisted token bypassed middleware.');
    }
    console.log('✅ Task 4 Passed!\n');

    // Clean up
    await Category.deleteOne({ _id: testCat._id });
    cacheService.clear();
    console.log('--- 🧹 Cleanup completed ---');
    
    console.log('\n🌟 ALL SCALABILITY AND CACHING CHECKS PASSED GLAWLESSLY!');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ SCALABILITY TEST FAILED WITH ERROR:', err);
    process.exit(1);
  }
}

runScalabilityVerification();
