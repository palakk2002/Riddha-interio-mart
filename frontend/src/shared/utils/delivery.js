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
