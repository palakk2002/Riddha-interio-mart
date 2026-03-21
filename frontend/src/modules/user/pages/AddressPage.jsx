import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../data/UserContext';
import { FiArrowLeft, FiMapPin, FiHome, FiCheck } from 'react-icons/fi';
import Button from '../../../shared/components/Button';

const AddressPage = () => {
  const navigate = useNavigate();
  const { saveAddress } = useUser();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    pincode: '560001',
    address: '',
    landmark: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    addressType: 'Home' // Home, Work, Other
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.phone && formData.address && formData.pincode) {
      saveAddress(formData);
      navigate('/cart');
    }
  };

  const addressTypes = [
    { id: 'Home', icon: <FiHome /> },
    { id: 'Work', icon: <FiMapPin /> },
    { id: 'Other', icon: <FiCheck /> }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-soft-oatmeal/5 pb-32"
    >
      {/* Header */}
      <div className="px-6 py-6 bg-white flex items-center gap-6 border-b border-soft-oatmeal/10 sticky top-0 z-10">
        <button onClick={() => navigate(-1)}>
          <FiArrowLeft className="h-6 w-6 text-deep-espresso" />
        </button>
        <h1 className="text-xl font-bold text-deep-espresso">Add Delivery Address</h1>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* Contact Info Section */}
        <div className="space-y-4">
          <h3 className="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-warm-sand flex items-center gap-2">
            <span className="w-4 h-px bg-warm-sand/30" /> Contact Info
          </h3>
          <div className="space-y-3">
            <input 
              required
              type="text" 
              placeholder="Full Name" 
              className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50 focus:border-warm-sand focus:bg-white focus:outline-none font-medium transition-all"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">+91</span>
              <input 
                required
                type="tel" 
                pattern="[0-9]{10}"
                placeholder="Mobile Number" 
                className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50 focus:border-warm-sand focus:bg-white focus:outline-none font-medium transition-all"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})}
              />
            </div>
          </div>
        </div>

        {/* Address Details Section */}
        <div className="space-y-4 pt-4">
          <h3 className="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-warm-sand flex items-center gap-2">
            <span className="w-4 h-px bg-warm-sand/30" /> Address Details
          </h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <input 
                required
                type="text" 
                maxLength="6"
                placeholder="Pincode" 
                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50 focus:border-warm-sand focus:bg-white focus:outline-none font-medium transition-all"
                value={formData.pincode}
                onChange={(e) => setFormData({...formData, pincode: e.target.value.replace(/\D/g, '').slice(0, 6)})}
              />
              <input 
                required
                type="text" 
                placeholder="City" 
                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50 focus:border-warm-sand focus:bg-white focus:outline-none font-medium transition-all"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
              />
            </div>
            <textarea 
              required
              placeholder="Flat, House no., Building, Apartment" 
              className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50 focus:border-warm-sand focus:bg-white focus:outline-none font-medium transition-all min-h-[100px]"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
            <input 
              type="text" 
              placeholder="Landmark (Optional)" 
              className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50 focus:border-warm-sand focus:bg-white focus:outline-none font-medium transition-all"
              value={formData.landmark}
              onChange={(e) => setFormData({...formData, landmark: e.target.value})}
            />
          </div>
        </div>

        {/* Address Type Section */}
        <div className="space-y-4 pt-4">
          <h3 className="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-warm-sand flex items-center gap-2">
            <span className="w-4 h-px bg-warm-sand/30" /> Save As
          </h3>
          <div className="flex gap-2">
            {addressTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setFormData({...formData, addressType: type.id})}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all font-bold text-xs ${
                  formData.addressType === type.id 
                  ? 'border-warm-sand bg-warm-sand text-white shadow-md shadow-warm-sand/10' 
                  : 'border-gray-200 bg-white text-gray-400'
                }`}
              >
                {type.icon}
                {type.id}
              </button>
            ))}
          </div>
        </div>
        <div className="px-2 py-2 flex items-center gap-3">
          <input 
            type="checkbox" 
            id="saveAddress" 
            className="w-5 h-5 accent-warm-sand rounded border-gray-300"
            defaultChecked
          />
          <label htmlFor="saveAddress" className="text-xs font-bold text-deep-espresso uppercase tracking-wider">
            Save this address for future use
          </label>
        </div>

        <div className="px-2 py-4 pb-20">
          <Button 
            type="submit"
            size="lg" 
            className="w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-warm-sand/20"
          >
            SAVE ADDRESS
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddressPage;
