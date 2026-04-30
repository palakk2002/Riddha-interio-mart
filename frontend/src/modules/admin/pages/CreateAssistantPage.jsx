import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiUser, FiMail, FiShield, FiArrowLeft, FiCheck } from 'react-icons/fi';
import { useRBAC } from '../data/RBACContext';
import { permissionsMap, DEFAULT_ASSISTANT_PERMISSIONS } from '../data/permissionsMap';
import PageWrapper from '../components/PageWrapper';
import { motion } from 'framer-motion';

const CreateAssistantPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addAssistant, assistants, updateAssistant } = useRBAC();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    permissions: { ...DEFAULT_ASSISTANT_PERMISSIONS }
  });

  useEffect(() => {
    if (isEditing) {
      const assistant = assistants.find(a => a.id === id);
      if (assistant) {
        setFormData({
          name: assistant.name,
          email: assistant.email,
          permissions: assistant.permissions
        });
      }
    }
  }, [id, assistants, isEditing]);

  const handlePermissionToggle = (key) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [key]: !prev.permissions[key]
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      updateAssistant(id, formData);
    } else {
      addAssistant(formData);
    }
    navigate('/admin/team');
  };

  const permissionKeys = Object.values(permissionsMap).filter(v => typeof v === 'string');

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <button 
            onClick={() => navigate('/admin/team')}
            className="flex items-center gap-2 text-warm-sand font-black text-[10px] uppercase tracking-widest mb-4 hover:translate-x-[-4px] transition-transform"
          >
            <FiArrowLeft /> Back to Team
          </button>
          <h1 className="text-3xl font-black text-deep-espresso tracking-tight uppercase italic">
            {isEditing ? 'Edit' : 'Create'} <span className="text-warm-sand">Assistant</span>
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="bg-white rounded-[2.5rem] border border-soft-oatmeal p-8 md:p-10 shadow-xl shadow-gray-200/20">
            <h3 className="text-sm font-black text-deep-espresso uppercase tracking-widest mb-8 flex items-center gap-2">
              <FiUser className="text-warm-sand" /> Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-sand" />
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter assistant name"
                    className="w-full bg-soft-oatmeal/20 border-none focus:ring-2 focus:ring-brand-purple rounded-2xl py-4 pl-12 pr-4 text-deep-espresso font-bold text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-sand" />
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="assistant@riddha.com"
                    className="w-full bg-soft-oatmeal/20 border-none focus:ring-2 focus:ring-brand-purple rounded-2xl py-4 pl-12 pr-4 text-deep-espresso font-bold text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="bg-white rounded-[2.5rem] border border-soft-oatmeal p-8 md:p-10 shadow-xl shadow-gray-200/20">
            <h3 className="text-sm font-black text-deep-espresso uppercase tracking-widest mb-8 flex items-center gap-2">
              <FiShield className="text-warm-sand" /> Role & Permissions
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {permissionKeys.map((key) => (
                <div 
                  key={key}
                  onClick={() => handlePermissionToggle(key)}
                  className={`
                    cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-3 text-center
                    ${formData.permissions[key] 
                      ? 'bg-purple-50 border-brand-purple text-brand-purple shadow-lg shadow-purple-900/5' 
                      : 'bg-white border-soft-oatmeal text-gray-400 hover:border-warm-sand/30'}
                  `}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formData.permissions[key] ? 'bg-brand-purple text-white' : 'bg-soft-oatmeal/50'}`}>
                    {formData.permissions[key] ? <FiCheck size={16} /> : <div className="w-2 h-2 rounded-full bg-gray-300" />}
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest">{key}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button 
              type="button"
              onClick={() => navigate('/admin/team')}
              className="px-10 py-4 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-deep-espresso transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-12 py-4 bg-deep-espresso text-white font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all hover:bg-[#240046] shadow-xl shadow-purple-900/20 active:scale-95"
            >
              {isEditing ? 'Update' : 'Save'} Assistant
            </button>
          </div>
        </form>
      </div>
    </PageWrapper>
  );
};

export default CreateAssistantPage;
