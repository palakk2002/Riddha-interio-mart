import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../data/UserContext';
import { FiArrowLeft, FiHome, FiMapPin, FiCheck, FiSearch, FiUser, FiShoppingCart, FiMenu } from 'react-icons/fi';
import Button from '../../../shared/components/Button';

const AddressPage = () => {
  const navigate = useNavigate();
  const { saveAddress } = useUser();
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    pincode: '560001',
    fullAddress: '',
    landmark: '',
    city: 'Bengaluru',
    addressType: 'Home', // Home, Work, Other
    isDefault: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.fullName && formData.mobileNumber && formData.fullAddress && formData.pincode) {
      const success = await saveAddress(formData);
      if (success) {
        navigate('/cart');
      }
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
      className="min-h-screen bg-[#F8F8F8] pb-10"
    >


      <div className="max-w-xl mx-auto">
        <div className="px-6 pt-8 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-1">
            <FiArrowLeft className="h-6 w-6 text-deep-espresso" />
          </button>
          <h1 className="text-2xl font-display font-bold text-deep-espresso">Add Delivery Address</h1>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-8 space-y-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#189D91] flex items-center gap-3">
              <span className="w-6 h-px bg-[#189D91]/20" /> CONTACT INFO
            </h3>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">FULL NAME</label>
                <input
                  required
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-white focus:border-[#189D91]/30 focus:outline-none font-medium transition-all text-sm"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">MOBILE NUMBER</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm tracking-widest">+91</span>
                  <input
                    required
                    type="tel"
                    placeholder="10-digit number"
                    className="w-full pl-16 pr-5 py-4 rounded-xl border border-gray-200 bg-white focus:border-[#189D91]/30 focus:outline-none font-medium transition-all text-sm"
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Address Details */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#189D91] flex items-center gap-3">
              <span className="w-6 h-px bg-[#189D91]/20" /> ADDRESS DETAILS
            </h3>
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">PINCODE</label>
                  <input
                    required
                    type="text"
                    placeholder="560001"
                    className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-white focus:border-[#189D91]/30 focus:outline-none font-medium transition-all text-sm"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">CITY</label>
                  <input
                    required
                    type="text"
                    placeholder="Bengaluru"
                    className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-white focus:border-[#189D91]/30 focus:outline-none font-medium transition-all text-sm"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">FULL ADDRESS</label>
                <textarea
                  required
                  placeholder="Flat, House no., Building, Apartment"
                  className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-white focus:border-[#189D91]/30 focus:outline-none font-medium transition-all min-h-[100px] text-sm"
                  value={formData.fullAddress}
                  onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">LANDMARK (OPTIONAL)</label>
                <input
                  type="text"
                  placeholder="Nearby famous place"
                  className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-white focus:border-[#189D91]/30 focus:outline-none font-medium transition-all text-sm"
                  value={formData.landmark}
                  onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Save As */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#189D91] flex items-center gap-3">
              <span className="w-6 h-px bg-[#189D91]/20" /> SAVE AS
            </h3>
            <div className="flex gap-4">
              {addressTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, addressType: type.id })}
                  className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl border transition-all font-bold text-xs ${formData.addressType === type.id
                    ? 'border-[#189D91] bg-[#189D91] text-white shadow-xl shadow-[#189D91]/20'
                    : 'border-gray-100 bg-white text-gray-400'
                    }`}
                >
                  {type.icon}
                  {type.id}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 py-2">
            <div
              onClick={() => setFormData({ ...formData, isDefault: !formData.isDefault })}
              className={`w-6 h-6 rounded flex items-center justify-center cursor-pointer transition-colors ${formData.isDefault ? 'bg-[#189D91]' : 'bg-gray-200'}`}
            >
              {formData.isDefault && <FiCheck className="text-white" size={14} />}
            </div>
            <label className="text-[11px] font-black text-deep-espresso tracking-wide uppercase cursor-pointer">
              SAVE THIS ADDRESS FOR FUTURE USE
            </label>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full h-16 rounded-2xl bg-[#189D91] hover:bg-black text-white font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-[#189D91]/30"
            >
              SAVE ADDRESS
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default AddressPage;
