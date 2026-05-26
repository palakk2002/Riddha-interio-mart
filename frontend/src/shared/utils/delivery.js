/**
 * Calculates estimated delivery time based on pincode
 * @param {string} pincode 
 * @returns {Object} { time: string, isExpress: boolean }
 */
export const getDeliveryEstimate = (pincode) => {
  if (!pincode || pincode === 'default') {
    return { time: '4 hours', isExpress: true };
  }

  // Clean pincode
  const pc = pincode.toString().trim();

  // Mock Logic for demonstration:
  // 56xxxx: Bengaluru area (Express)
  if (pc.startsWith('56')) {
    return { time: '2-4 hours', isExpress: true };
  }

  // 40xxxx - 44xxxx: Maharashtra/Mumbai (Fast)
  if (pc.startsWith('40') || pc.startsWith('41') || pc.startsWith('42')) {
    return { time: 'Next Day', isExpress: false };
  }

  // 11xxxx: Delhi area (Fast)
  if (pc.startsWith('11')) {
    return { time: '1-2 Days', isExpress: false };
  }

  // Default for other areas
  return { time: '3-5 Days', isExpress: false };
};

/**
 * Resolves a dynamic city name from an Indian postal pincode
 * @param {string} pincode 
 * @returns {string} City name
 */
export const getCityFromPincode = (pincode) => {
  if (!pincode || pincode === 'default') {
    return 'Kolkata';
  }

  const pc = pincode.toString().trim();

  // West Bengal pincodes (starts with 70 to 74)
  if (
    pc.startsWith('70') || 
    pc.startsWith('71') || 
    pc.startsWith('72') || 
    pc.startsWith('73') || 
    pc.startsWith('74')
  ) {
    return 'Kolkata';
  }

  // Delhi pincodes (starts with 11)
  if (pc.startsWith('11')) {
    return 'Delhi';
  }

  // Maharashtra / Mumbai pincodes (starts with 40 to 44)
  if (
    pc.startsWith('40') || 
    pc.startsWith('41') || 
    pc.startsWith('42') || 
    pc.startsWith('43') || 
    pc.startsWith('44')
  ) {
    return 'Mumbai';
  }

  // Karnataka / Bengaluru pincodes (starts with 56 to 59)
  if (
    pc.startsWith('56') || 
    pc.startsWith('57') || 
    pc.startsWith('58') || 
    pc.startsWith('59')
  ) {
    return 'Bengaluru';
  }

  // Tamil Nadu / Chennai pincodes (starts with 60 to 64)
  if (
    pc.startsWith('60') || 
    pc.startsWith('61') || 
    pc.startsWith('62') || 
    pc.startsWith('63') || 
    pc.startsWith('64')
  ) {
    return 'Chennai';
  }

  // Andhra Pradesh & Telangana / Hyderabad (starts with 50 to 53)
  if (
    pc.startsWith('50') || 
    pc.startsWith('51') || 
    pc.startsWith('52') || 
    pc.startsWith('53')
  ) {
    return 'Hyderabad';
  }

  // Gujarat / Ahmedabad (starts with 38)
  if (pc.startsWith('38')) {
    return 'Ahmedabad';
  }

  return 'India';
};

