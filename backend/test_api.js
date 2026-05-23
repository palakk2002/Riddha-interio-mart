const axios = require('axios');
async function test() {
  try {
    const res = await axios.get('http://localhost:5001/api/favourite-section');
    console.log(JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error(err);
  }
}
test();
