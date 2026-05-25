import React, { useState, useEffect, useRef } from 'react';
import PageWrapper from '../components/PageWrapper';
import { 
  LuZap, 
  LuClock, 
  LuPackage, 
  LuScale, 
  LuMapPin, 
  LuCheck, 
  LuX, 
  LuVolume2, 
  LuVolumeX, 
  LuStore, 
  LuCompass,
  LuTrendingUp,
  LuChevronRight
} from 'react-icons/lu';
import { FiAlertTriangle, FiLoader } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../shared/utils/api';
import { useUser } from '../../user/data/UserContext';
import { connectSocket, getSocket } from '../../../shared/utils/socket';
import { toast } from 'react-hot-toast';

const DispatchCenter = () => {
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeShiftTime, setActiveShiftTime] = useState('00h 00m 00s');
  
  // Dispatch offer queue
  const [offers, setOffers] = useState([]);
  const [activeOffer, setActiveOffer] = useState(null);
  const [countdown, setCountdown] = useState(60);

  // Hub queue mock loading
  const [hubs, setHubs] = useState([
    { id: 1, name: 'StoneAge Central Hub', pincode: '400001', activeOrders: 14, status: 'High Load' },
    { id: 2, name: 'Worli Furniture Depot', pincode: '400002', activeOrders: 5, status: 'Moderate Load' },
    { id: 3, name: 'Bandra Deco Hub', pincode: '400003', activeOrders: 2, status: 'Optimal' },
    { id: 4, name: 'Lower Parel Mart Hub', pincode: '400004', activeOrders: 9, status: 'High Load' },
  ]);

  const countdownIntervalRef = useRef(null);

  // Play standard double synth chime
  const playSynthesizedChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      // High-pitch sweet D5 note
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, ctx.currentTime);
      gain1.gain.setValueAtTime(0, ctx.currentTime);
      gain1.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.05);
      gain1.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      
      // Harmonics A5 note (slightly delayed)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.12);
      gain2.gain.setValueAtTime(0, ctx.currentTime + 0.12);
      gain2.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.17);
      gain2.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.9);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      
      osc1.start();
      osc2.start(ctx.currentTime + 0.12);
      osc1.stop(ctx.currentTime + 1.0);
      osc2.stop(ctx.currentTime + 1.2);
    } catch (err) {
      console.warn('[Dispatch Center] Could not initialize Web Audio API.', err);
    }
  };

  const fetchStatusAndOffers = async () => {
    try {
      setLoading(true);
      // Fetch latest profile state to see active payload details & shift state
      const { data: profile } = await api.get('/delivery/me');
      if (profile.success) {
        setUser(prev => ({ ...prev, ...profile.data }));
      }

      // Fetch outstanding unexpired dispatches
      const { data: liveOffers } = await api.get('/dispatch/offers');
      if (liveOffers.success && liveOffers.data.length > 0) {
        setOffers(liveOffers.data);
        setupActiveOffer(liveOffers.data[0]);
      }
    } catch (err) {
      console.error('Failed to sync dispatcher status:', err);
    } finally {
      setLoading(false);
    }
  };

  const setupActiveOffer = (offer) => {
    setActiveOffer(offer);
    
    // Calculate remaining countdown seconds
    const expTime = new Date(offer.expiresAt).getTime();
    const now = Date.now();
    const remainingSecs = Math.max(0, Math.floor((expTime - now) / 1000));
    setCountdown(remainingSecs);
    playSynthesizedChime();

    // Setup active countdown timer
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    
    countdownIntervalRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current);
          setActiveOffer(null);
          // Refresh list
          fetchStatusAndOffers();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Clock-in
  const handleClockIn = async () => {
    setSyncing(true);
    try {
      const { data } = await api.put('/dispatch/clock-in');
      if (data.success) {
        setUser(prev => ({ ...prev, ...data.data }));
        toast.success('Shift Clocked-In. Ready for live allocations!', {
          style: { background: '#0F172A', color: '#10B981', border: '1px solid #1E293B' }
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Clock-in failed.');
    } finally {
      setSyncing(false);
    }
  };

  // Clock-out
  const handleClockOut = async () => {
    setSyncing(true);
    try {
      const { data } = await api.put('/dispatch/clock-out');
      if (data.success) {
        setUser(prev => ({ ...prev, ...data.data }));
        setActiveOffer(null);
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        toast.error('Shift Clocked-Out. Offline.', {
          style: { background: '#0F172A', color: '#EF4444', border: '1px solid #1E293B' }
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Clock-out failed.');
    } finally {
      setSyncing(false);
    }
  };

  // Accept Dispatch Offer
  const handleAcceptOffer = async (eventId) => {
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    try {
      const { data } = await api.post(`/dispatch/offers/${eventId}/accept`);
      if (data.success) {
        toast.success('Assignment Accepted! View in Orders section.', {
          icon: '🚀',
          style: { background: '#0F172A', color: '#10B981', border: '1px solid #1E293B' }
        });
        setActiveOffer(null);
        fetchStatusAndOffers();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to accept offer.');
      setActiveOffer(null);
      fetchStatusAndOffers();
    }
  };

  // Reject Dispatch Offer
  const handleRejectOffer = async (eventId) => {
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    try {
      const { data } = await api.post(`/dispatch/offers/${eventId}/reject`, {
        rejectionReason: 'Courier declined offer'
      });
      if (data.success) {
        toast.error('Assignment Declined.', {
          style: { background: '#0F172A', color: '#F87171', border: '1px solid #1E293B' }
        });
        setActiveOffer(null);
        fetchStatusAndOffers();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Rejection failed.');
      setActiveOffer(null);
      fetchStatusAndOffers();
    }
  };

  // Initial Sync
  useEffect(() => {
    fetchStatusAndOffers();

    // Listen for WebSocket dispatches
    const socket = connectSocket({ token: user?.token || 'cookie' });
    if (socket) {
      socket.on('dispatch:offer', (payload) => {
        // Construct event payload structure locally
        const localEvent = {
          _id: payload.eventId,
          order: {
            _id: payload.orderId,
            totalPrice: payload.totalBill,
            shippingAddress: {
              fullAddress: payload.deliveryAddress.split(',')[0],
              city: payload.deliveryAddress.split(',')[1] || 'Mumbai'
            }
          },
          expiresAt: new Date(Date.now() + payload.expiresInSeconds * 1000).toISOString(),
          broadcastStatus: 'Offered',
          // Metadata fields
          shopName: payload.shopName,
          weight: payload.weight
        };

        toast.success(`[Dispatch] New Assignment Offered!`, {
          icon: '⚡',
          style: { background: '#0F172A', color: '#60A5FA', border: '1px solid #1E293B' }
        });
        setupActiveOffer(localEvent);
      });
    }

    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      if (socket) socket.off('dispatch:offer');
    };
  }, []);

  // Shift Timer ticks
  useEffect(() => {
    let intervalId;
    const isClocked = user?.activeShift?.isClockedIn;
    const startTimeStr = user?.activeShift?.clockedInAt;

    if (isClocked && startTimeStr) {
      const updateTimer = () => {
        const diffMs = Date.now() - new Date(startTimeStr).getTime();
        if (diffMs <= 0) {
          setActiveShiftTime('00h 00m 00s');
          return;
        }
        const totalSecs = Math.floor(diffMs / 1000);
        const hours = Math.floor(totalSecs / 3600);
        const mins = Math.floor((totalSecs % 3600) / 60);
        const secs = totalSecs % 60;
        
        const pad = (num) => String(num).padStart(2, '0');
        setActiveShiftTime(`${pad(hours)}h ${pad(mins)}m ${pad(secs)}s`);
      };

      updateTimer();
      intervalId = setInterval(updateTimer, 1000);
    } else {
      setActiveShiftTime('Offline');
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [user?.activeShift?.isClockedIn, user?.activeShift?.clockedInAt]);

  const isClockedIn = user?.activeShift?.isClockedIn || false;
  
  // Capacity Metrics
  const currentCount = user?.activeShift?.currentPayloadCount || 0;
  const maxCount = user?.vehicleDetails?.maxVolumeCapacity || 4;
  const currentWeight = user?.activeShift?.currentPayloadWeight || 0;
  const maxWeight = user?.vehicleDetails?.maxWeightCapacity || 20;

  const countPercentage = Math.min(100, Math.floor((currentCount / maxCount) * 100));
  const weightPercentage = Math.min(100, Math.floor((currentWeight / maxWeight) * 100));

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
          <FiLoader className="animate-spin text-[#189D91]" size={40} />
          <p className="text-slate-500 font-bold text-sm">Syncing Dispatch Console...</p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      {/* High-fidelity glowing Dark Cockpit frame */}
      <div className="bg-[#0D1220] rounded-[2.5rem] p-6 lg:p-8 text-slate-100 shadow-2xl border border-slate-800/80 max-w-[1600px] mx-auto overflow-hidden relative">
        {/* Neon decorative background blurs */}
        <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-[#189D91]/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Dashboard Header Panel */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-800 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-8 bg-gradient-to-b from-cyan-400 to-indigo-500 rounded-full"></div>
              <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                DISPATCH <span className="text-[#189D91]">CONSOLE</span>
              </h1>
              <span className="bg-[#189D91]/10 text-[#189D91] border border-[#189D91]/30 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-[0.1em] hidden sm:inline">
                Real-Time
              </span>
            </div>
            <p className="text-slate-400 font-semibold text-xs flex items-center gap-2">
              <LuCompass className="text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
              Live allocation engine powered by auto-assign logistics
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-3 rounded-2xl border transition-all ${soundEnabled ? 'bg-slate-800/80 border-slate-700 text-cyan-400 hover:text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-400'}`}
              title="Toggle Audio Notifications"
            >
              {soundEnabled ? <LuVolume2 size={18} /> : <LuVolumeX size={18} />}
            </button>
            
            {/* Main Shift Duty controller */}
            {user?.approvalStatus !== 'Approved' ? (
              <div className="flex items-center gap-2 px-5 py-3 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-2xl text-xs font-black uppercase">
                <FiAlertTriangle size={16} />
                Approval Pending
              </div>
            ) : isClockedIn ? (
              <button 
                onClick={handleClockOut}
                disabled={syncing}
                className="flex-1 md:flex-none flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-rose-500/20 to-orange-500/20 hover:from-rose-500/30 hover:to-orange-500/30 border border-rose-500/40 hover:border-rose-500/60 text-rose-400 hover:text-rose-300 transition-all duration-300 rounded-2xl font-black text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(239,68,68,0.1)] active:scale-[0.98]"
              >
                {syncing ? <FiLoader className="animate-spin" size={14} /> : <LuX size={14} />}
                Clock Out Shift
              </button>
            ) : (
              <button 
                onClick={handleClockIn}
                disabled={syncing}
                className="flex-1 md:flex-none flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-[#189D91]/20 to-indigo-500/20 hover:from-[#189D91]/30 hover:to-indigo-500/30 border border-[#189D91]/40 hover:border-cyan-500/60 text-cyan-400 hover:text-cyan-300 transition-all duration-300 rounded-2xl font-black text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(24,157,145,0.15)] active:scale-[0.98]"
              >
                {syncing ? <FiLoader className="animate-spin" size={14} /> : <LuZap size={14} />}
                Clock In Duty
              </button>
            )}
          </div>
        </div>

        {/* Dashboard Grid System */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8 relative z-10">
          
          {/* Shift Telemetry Panel */}
          <div className="xl:col-span-1 space-y-6">
            
            {/* Glassmorphic Shift Status Card */}
            <div className="bg-[#12182B]/60 backdrop-blur-md rounded-3xl p-6 border border-slate-800 shadow-[0_4px_30px_rgba(0,0,0,0.4)] flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                <LuClock size={120} className="text-white" />
              </div>
              
              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <h3 className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-1">Shift Duration</h3>
                  <p className={`text-3xl font-black font-mono tracking-wider ${isClockedIn ? 'text-cyan-400' : 'text-slate-500'}`}>
                    {activeShiftTime}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.1em] flex items-center gap-1.5 border ${
                  isClockedIn 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                    : 'bg-slate-800/80 border-slate-700 text-slate-400'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${isClockedIn ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`} />
                  {isClockedIn ? 'Clocked-In' : 'Offline'}
                </div>
              </div>

              <div className="mt-8 relative z-10 border-t border-slate-800/80 pt-4 flex justify-between items-center text-xs text-slate-400 font-semibold">
                <span>Vehicle Type</span>
                <span className="text-white font-bold bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700">
                  {user?.vehicleType || 'Motorcycle'}
                </span>
              </div>
            </div>

            {/* Glowing Payload Telemetry Indicators */}
            <div className="bg-[#12182B]/60 backdrop-blur-md rounded-3xl p-6 border border-slate-800 shadow-[0_4px_30px_rgba(0,0,0,0.4)] space-y-6">
              <div>
                <h3 className="text-white font-black text-sm uppercase tracking-wider flex items-center gap-2 mb-4">
                  <LuTrendingUp className="text-[#189D91]" />
                  Payload Telemetry
                </h3>
                <p className="text-slate-400 text-xs">
                  Active tracking of weight limits and package volumes restricted by vehicle parameters.
                </p>
              </div>

              {/* Volume (Package Count) Meter */}
              <div className="space-y-2">
                <div className="flex justify-between items-center gap-2 text-xs font-bold">
                  <span className="text-slate-300 flex items-center gap-1.5 min-w-0">
                    <LuPackage size={14} className="text-indigo-400 shrink-0" />
                    <span className="truncate">Payload Volume</span>
                  </span>
                  <span className="text-white font-mono shrink-0">{currentCount} / {maxCount} Pkgs</span>
                </div>
                <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${countPercentage}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-[#189D91] to-indigo-500 rounded-full"
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold">
                  <span>Capacity: {countPercentage}% loaded</span>
                  {currentCount >= maxCount && <span className="text-rose-400">Volumetric Max Locked</span>}
                </div>
              </div>

              {/* Weight Load Meter */}
              <div className="space-y-2">
                <div className="flex justify-between items-center gap-2 text-xs font-bold">
                  <span className="text-slate-300 flex items-center gap-1.5 min-w-0">
                    <LuScale size={14} className="text-cyan-400 shrink-0" />
                    <span className="truncate">Payload Weight</span>
                  </span>
                  <span className="text-white font-mono shrink-0">{currentWeight.toFixed(1)} / {maxWeight}.0 kg</span>
                </div>
                <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${weightPercentage}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full"
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold">
                  <span>Capacity: {weightPercentage}% loaded</span>
                  {currentWeight >= maxWeight && <span className="text-rose-400">Weight Limit Exceeded</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Core Dispatch Operations Console */}
          <div className="xl:col-span-2 space-y-6">
            
            {/* Live assignments panel */}
            <div className="bg-[#12182B]/60 backdrop-blur-md rounded-3xl p-6 border border-slate-800 shadow-[0_4px_30px_rgba(0,0,0,0.4)] min-h-[280px] flex flex-col relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-4">
                <div>
                  <h3 className="text-white font-black text-sm uppercase tracking-wider flex items-center gap-2">
                    <LuZap className="text-cyan-400 animate-pulse" />
                    Incoming Dispatches
                  </h3>
                  <p className="text-slate-400 text-xs mt-0.5">Offered jobs queue matching your service area</p>
                </div>
                
                {/* Active indicator */}
                {isClockedIn ? (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-700" />
                )}
              </div>

              {/* Offered Job Card Overlay / Window */}
              <AnimatePresence mode="wait">
                {!isClockedIn ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 space-y-3"
                  >
                    <div className="w-14 h-14 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center text-slate-600">
                      <LuX size={24} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm">System Offline</h4>
                      <p className="text-xs text-slate-500 mt-1 max-w-[280px] mx-auto">
                        Clock in your shift at the top-right to register your device in the live auto-assignment queue.
                      </p>
                    </div>
                  </motion.div>
                ) : activeOffer ? (
                  <motion.div
                    key={activeOffer._id}
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="bg-[#1A223B]/80 border border-[#2D3B6B]/60 rounded-2xl p-6 relative overflow-hidden"
                  >
                    {/* Glowing highlight border */}
                    <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-cyan-400 via-[#189D91] to-indigo-500" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      
                      {/* Left: Earnings and Info */}
                      <div className="md:col-span-2 space-y-4">
                        <div className="flex items-center gap-3">
                          <span className="bg-[#189D91]/20 text-cyan-300 border border-cyan-400/30 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            Direct Auto-Assign Offer
                          </span>
                          <span className="text-slate-400 font-mono text-xs">
                            #{activeOffer._id.slice(-8).toUpperCase()}
                          </span>
                        </div>

                        <div className="flex items-baseline gap-2">
                          <span className="text-slate-400 text-xs font-semibold">Total payout:</span>
                          <span className="text-3xl font-black text-white">₹{activeOffer.order.totalPrice}</span>
                        </div>

                        {/* Pickup and Drop Address */}
                        <div className="space-y-3 pt-2">
                          <div className="flex items-start gap-2.5 text-xs text-slate-300">
                            <LuStore className="text-indigo-400 shrink-0 mt-0.5" size={16} />
                            <div>
                              <p className="font-bold text-white">Pickup Store Hub</p>
                              <p className="text-slate-400 mt-0.5">{activeOffer.shopName || 'StoneAge Operations Hub'}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2.5 text-xs text-slate-300">
                            <LuMapPin className="text-[#189D91] shrink-0 mt-0.5" size={16} />
                            <div>
                              <p className="font-bold text-white">Customer Address</p>
                              <p className="text-slate-400 mt-0.5">
                                {activeOffer.order.shippingAddress.fullAddress}, {activeOffer.order.shippingAddress.city}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Order weight parameter */}
                        <div className="flex items-center gap-4 text-xs font-semibold border-t border-slate-800/80 pt-3 text-slate-400">
                          <span className="flex items-center gap-1">
                            <LuScale size={14} className="text-cyan-400" />
                            Weight: {activeOffer.weight || 1.5} kg
                          </span>
                          <span className="flex items-center gap-1">
                            <LuClock size={14} className="text-indigo-400" />
                            Time Limit: 60s Acceptance
                          </span>
                        </div>
                      </div>

                      {/* Right: Timer ring & Actions */}
                      <div className="flex flex-col items-center justify-between border-t md:border-t-0 md:border-l border-slate-800/85 md:pl-6 pt-6 md:pt-0">
                        {/* Circular progress countdown */}
                        <div className="relative w-24 h-24 flex items-center justify-center">
                          <svg className="absolute inset-0 w-full h-full -rotate-90">
                            <circle 
                              cx="48" 
                              cy="48" 
                              r="40" 
                              className="stroke-slate-800 fill-none" 
                              strokeWidth="6"
                            />
                            <motion.circle 
                              cx="48" 
                              cy="48" 
                              r="40" 
                              className="stroke-cyan-500 fill-none" 
                              strokeWidth="6"
                              strokeDasharray="251.2"
                              animate={{ strokeDashoffset: 251.2 - (251.2 * countdown) / 60 }}
                              transition={{ duration: 1, ease: "linear" }}
                            />
                          </svg>
                          <span className="text-2xl font-black font-mono text-white relative z-10">
                            {countdown}s
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 w-full mt-6">
                          <button 
                            onClick={() => handleRejectOffer(activeOffer._id)}
                            className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all active:scale-[0.98]"
                          >
                            Decline
                          </button>
                          <button 
                            onClick={() => handleAcceptOffer(activeOffer._id)}
                            className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-[#189D91] hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
                          >
                            <LuCheck size={14} />
                            Accept
                          </button>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 space-y-3"
                  >
                    <div className="w-14 h-14 bg-slate-900 border border-slate-850 rounded-full flex items-center justify-center text-cyan-400 animate-pulse">
                      <LuZap size={22} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm">Waiting for Dispatches</h4>
                      <p className="text-xs text-slate-500 mt-1 max-w-[280px] mx-auto">
                        Your device is online in the pool. When an order matches your zone and carrying capacity, it will stream here in real-time.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Active Hub Load queue table */}
            <div className="bg-[#12182B]/60 backdrop-blur-md rounded-3xl p-6 border border-slate-800 shadow-[0_4px_30px_rgba(0,0,0,0.4)] flex flex-col">
              <div className="mb-4">
                <h3 className="text-white font-black text-sm uppercase tracking-wider">Store Logistics Hubs</h3>
                <p className="text-slate-400 text-xs mt-0.5">Real-time unassigned order volumes at neighborhood dispatch offices</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500">
                      <th className="pb-3 text-[10px] uppercase font-bold tracking-wider">Logistics Depot</th>
                      <th className="pb-3 text-[10px] uppercase font-bold tracking-wider">Coverage Pincode</th>
                      <th className="pb-3 text-[10px] uppercase font-bold tracking-wider">Unassigned Orders</th>
                      <th className="pb-3 text-[10px] uppercase font-bold tracking-wider text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {hubs.map((hub) => (
                      <tr key={hub.id} className="hover:bg-slate-800/10 transition-colors group">
                        <td className="py-3.5 flex items-center gap-2">
                          <LuStore size={14} className="text-slate-400 group-hover:text-cyan-400 transition-colors" />
                          <span className="text-xs font-bold text-slate-200">{hub.name}</span>
                        </td>
                        <td className="py-3.5">
                          <span className="text-xs font-semibold text-slate-400 font-mono">{hub.pincode}</span>
                        </td>
                        <td className="py-3.5">
                          <span className="text-xs font-black text-white">{hub.activeOrders} orders pending</span>
                        </td>
                        <td className="py-3.5 text-right">
                          <span className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                            hub.status === 'High Load' 
                              ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400' 
                              : hub.status === 'Moderate Load' 
                                ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400' 
                                : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                          }`}>
                            {hub.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>

      </div>
    </PageWrapper>
  );
};

export default DispatchCenter;
