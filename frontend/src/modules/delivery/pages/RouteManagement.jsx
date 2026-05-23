import React, { useState, useEffect, useRef } from 'react';
import PageWrapper from '../components/PageWrapper';
import { 
  LuMapPin, 
  LuNavigation, 
  LuPackage, 
  LuPhone, 
  LuExternalLink, 
  LuRefreshCw, 
  LuActivity,
  LuCompass,
  LuMap,
  LuShieldAlert
} from 'react-icons/lu';
import api from '../../../shared/utils/api';
import { toast } from 'react-hot-toast';

const RouteManagement = () => {
  const [activeOrders, setActiveOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gpsActive, setGpsActive] = useState(false);
  const [partnerCoords, setPartnerCoords] = useState({ latitude: 26.9124, longitude: 75.7873 }); // Defaults
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [autoCenter, setAutoCenter] = useState(true);

  const mapRef = useRef(null);
  const leafletMapInstance = useRef(null);
  const markersRef = useRef([]);
  const polylineRef = useRef(null);
  const watchIdRef = useRef(null);
  const prevOrderIdRef = useRef(null);

  // Reset auto-center on order selection transition
  useEffect(() => {
    if (selectedOrder?._id && selectedOrder._id !== prevOrderIdRef.current) {
      setAutoCenter(true);
      prevOrderIdRef.current = selectedOrder._id;
    }
  }, [selectedOrder?._id]);

  // 1. Dynamically Load Leaflet JS & CSS from unpkg CDN
  // This enables professional, interactive maps with zero NPM compilation issues or Vite bundle bloat
  useEffect(() => {
    const loadLeaflet = () => {
      return new Promise((resolve, reject) => {
        if (window.L) {
          resolve(window.L);
          return;
        }

        // Intercept pending downloads by polling for script elements
        if (document.getElementById('leaflet-js')) {
          const checkReady = setInterval(() => {
            if (window.L) {
              clearInterval(checkReady);
              resolve(window.L);
            }
          }, 100);
          setTimeout(() => {
            clearInterval(checkReady);
            if (window.L) {
              resolve(window.L);
            } else {
              reject(new Error('Leaflet load timeout'));
            }
          }, 15000);
          return;
        }

        // Add Leaflet CSS if not already there
        if (!document.getElementById('leaflet-css')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          link.id = 'leaflet-css';
          document.head.appendChild(link);
        }

        // Add Leaflet JS Script
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.id = 'leaflet-js';
        script.onload = () => {
          console.log('[Leaflet] Loaded successfully');
          resolve(window.L);
        };
        script.onerror = () => {
          reject(new Error('Leaflet script failed to load'));
        };
        document.body.appendChild(script);
      });
    };

    loadLeaflet()
      .then(() => setLeafletLoaded(true))
      .catch(err => {
        console.error(err);
        toast.error('Failed to load Map Engine');
      });

    return () => {
      // Clean up watch coordinates on unmount
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      // Properly call .remove() on the Leaflet map instance during component unmount
      if (leafletMapInstance.current) {
        leafletMapInstance.current.remove();
        leafletMapInstance.current = null;
      }
    };
  }, []);

  // 2. Fetch active deliveries from the backend
  const fetchActiveDeliveries = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const { data } = await api.get('/orders');
      if (data.success) {
        // We only care about orders currently assigned to me that are NOT delivered yet
        // Meaning status matches Accepted, Picked, or Out for Delivery
        const ongoing = (data.data || []).filter(o => 
          o.deliveryStatus && ['Accepted', 'Picked', 'Out for Delivery'].includes(o.deliveryStatus)
        );
        setActiveOrders(ongoing);
        
        if (ongoing.length > 0) {
          // Default selection to first active order if none is selected
          setSelectedOrder(prev => {
            if (prev) {
              const updated = ongoing.find(o => o._id === prev._id);
              return updated || ongoing[0];
            }
            return ongoing[0];
          });
        } else {
          setSelectedOrder(null);
        }
      }
    } catch (err) {
      console.error('Failed to fetch ongoing shipments:', err);
      toast.error('Logistics Sync Failure');
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveDeliveries();
  }, []);

  // 3. Setup or Refresh Leaflet Map instance
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current) return;

    const L = window.L;

    // Initialize Map if not already created
    if (!leafletMapInstance.current) {
      leafletMapInstance.current = L.map(mapRef.current, {
        center: [partnerCoords.latitude, partnerCoords.longitude],
        zoom: 13,
        zoomControl: false // We will add a styled zoom control later
      });

      // Add Premium OpenStreetMap Tiles (Voyager / CartoDB style or standard OSM)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(leafletMapInstance.current);

      L.control.zoom({
        position: 'topright'
      }).addTo(leafletMapInstance.current);

      // Bind drag/zoom listeners to Leaflet instance to stop auto-snapping on interaction
      leafletMapInstance.current.on('dragstart zoomstart', () => {
        setAutoCenter(false);
      });
    }

    const map = leafletMapInstance.current;

    // Clear previous markers
    markersRef.current.forEach(marker => map.removeLayer(marker));
    markersRef.current = [];
    if (polylineRef.current) {
      map.removeLayer(polylineRef.current);
      polylineRef.current = null;
    }

    // Set custom icon styles
    const driverIcon = L.divIcon({
      className: 'custom-gps-icon',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-8 h-8 bg-blue-500/25 rounded-full animate-ping"></div>
          <div class="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-md flex items-center justify-center">
            <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const storeIcon = L.divIcon({
      className: 'custom-store-icon',
      html: `
        <div class="w-8 h-8 bg-teal-600 text-white rounded-full shadow-lg border-2 border-white flex items-center justify-center transform hover:scale-110 transition-transform">
          <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" class="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });

    const destIcon = L.divIcon({
      className: 'custom-dest-icon',
      html: `
        <div class="w-8 h-8 bg-amber-600 text-white rounded-full shadow-lg border-2 border-white flex items-center justify-center transform hover:scale-110 transition-transform">
          <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" class="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });

    // 1. Add Driver Marker
    const driverMarker = L.marker([partnerCoords.latitude, partnerCoords.longitude], { icon: driverIcon })
      .addTo(map)
      .bindPopup('<b class="text-slate-900 font-bold">Your Location</b>');
    markersRef.current.push(driverMarker);

    // Verify customer doorstep coordinates are fully resolved
    const hasValidCoords = !!(selectedOrder?.shippingCoordinates?.latitude);

    // If an active order is selected and coordinates are valid, plot logistics nodes and route path
    if (selectedOrder && hasValidCoords) {
      const pCoords = selectedOrder.shippingCoordinates;
      const sCoords = selectedOrder.sellerCoordinates || { latitude: partnerCoords.latitude, longitude: partnerCoords.longitude };
      
      // 2. Add Store Marker
      const storeMarker = L.marker([sCoords.latitude, sCoords.longitude], { icon: storeIcon })
        .addTo(map)
        .bindPopup(`
          <div class="p-1 space-y-1">
            <p class="font-bold text-slate-900 mb-0.5">Pickup Location</p>
            <p class="text-xs text-slate-600 font-semibold">${selectedOrder.businessDetails?.shopName || 'Merchant Hub'}</p>
          </div>
        `);
      markersRef.current.push(storeMarker);

      // 3. Add Destination Marker
      const destMarker = L.marker([pCoords.latitude, pCoords.longitude], { icon: destIcon })
        .addTo(map)
        .bindPopup(`
          <div class="p-1 space-y-1">
            <p class="font-bold text-amber-600 mb-0.5">Customer Destination</p>
            <p class="text-xs text-slate-800 font-bold">${selectedOrder.shippingAddress?.fullName}</p>
            <p class="text-xs text-slate-500 font-medium">${selectedOrder.shippingAddress?.fullAddress}</p>
          </div>
        `);
      markersRef.current.push(destMarker);

      // 4. Draw Polyline route representing navigation path
      // This connects Driver -> Store -> Destination showing complete route flow
      const pathCoordinates = [
        [partnerCoords.latitude, partnerCoords.longitude],
        [sCoords.latitude, sCoords.longitude],
        [pCoords.latitude, pCoords.longitude]
      ];

      const polyline = L.polyline(pathCoordinates, {
        color: '#189D91',
        weight: 4,
        opacity: 0.8,
        dashArray: '5, 8', // elegant dashed path
        lineCap: 'round'
      }).addTo(map);
      polylineRef.current = polyline;

      // Fit map view bounds around the entire path dynamically if autoCenter is active
      if (autoCenter) {
        const bounds = L.latLngBounds(pathCoordinates);
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    } else {
      // If no active orders or coordinates are unresolved, pan directly to partner coords if autoCenter is active
      if (autoCenter) {
        map.setView([partnerCoords.latitude, partnerCoords.longitude], 14);
      }
    }

  }, [leafletLoaded, partnerCoords, selectedOrder, autoCenter]);

  // 4. Handle Live GPS Ingestion via watchPosition
  const toggleGpsSync = () => {
    if (gpsActive) {
      // Disabling GPS
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setGpsActive(false);
      toast.success('Live GPS Synchronization Suspended');
    } else {
      // Enabling GPS
      if (!navigator.geolocation) {
        toast.error('Geolocation is not supported by your browser');
        return;
      }

      setGpsActive(true);
      const loadingToast = toast.loading('Initializing GPS Satellites...');

      watchIdRef.current = navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setPartnerCoords({ latitude, longitude });
          toast.dismiss(loadingToast);

          try {
            // Push active live coordinates stream to Express backend
            await api.put('/delivery/location', { latitude, longitude });
          } catch (err) {
            console.error('Failed to sync coordinates to server:', err);
          }
        },
        (err) => {
          toast.dismiss(loadingToast);
          setGpsActive(false);
          console.error(err);
          toast.error(`GPS Error: ${err.message || 'Signal Issues'}`);
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 }
      );
    }
  };

  // 5. Open External Navigation deep links
  const launchExternalNavigation = () => {
    if (!selectedOrder) return;
    
    const pCoords = selectedOrder.shippingCoordinates;
    const sCoords = selectedOrder.sellerCoordinates;

    if (pCoords && pCoords.latitude) {
      // Construct dynamic Google Maps navigation link
      // Passes partner coordinates as origin and customer coordinates as destination
      const origin = `${partnerCoords.latitude},${partnerCoords.longitude}`;
      const dest = `${pCoords.latitude},${pCoords.longitude}`;
      const waypoint = sCoords ? `&waypoints=${sCoords.latitude},${sCoords.longitude}` : '';
      
      const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}${waypoint}&travelmode=driving`;
      window.open(url, '_blank');
      toast.success('Opening Driving Directions in Google Maps');
    } else {
      // Address text query fallback if coordinate fetching failed
      const query = encodeURIComponent(`${selectedOrder.shippingAddress?.fullAddress || ''}, ${selectedOrder.shippingAddress?.city || ''}`);
      const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
      window.open(url, '_blank');
    }
  };

  // 6. Distance Calculator (Haversine Formula) between partner and selected address
  const getDistanceInKm = (lat1, lon1, lat2, lon2) => {
    if (!lat2 || !lon2) return '4.2'; // Safe default
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // Distance in km
    return d.toFixed(1);
  };

  const getEtaInMinutes = (distance) => {
    // Basic ETA estimation: assume average driving speed of 30 km/h in traffic
    const minutes = parseFloat(distance) * 2;
    return Math.max(Math.round(minutes), 4); // Min 4 minutes
  };

  return (
    <PageWrapper>
      <div className="max-w-[1600px] mx-auto space-y-6 pb-10">
        
        {/* Dashboard Command Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-[#189D91] rounded-full"></div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <LuMap className="text-[#189D91]" /> Route Management
              </h1>
            </div>
            <p className="text-slate-500 font-medium text-xs flex items-center gap-2">
              <LuActivity className="text-[#189D91]" />
              Compute optimized pathways and stream live GPS coordinates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={() => fetchActiveDeliveries()}
              className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-slate-500 hover:text-[#189D91] transition-all shadow-sm flex items-center justify-center"
            >
              <LuRefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
            
            <button 
              onClick={toggleGpsSync}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl border font-bold text-xs uppercase tracking-wider transition-all shadow-sm ${
                gpsActive 
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                  : 'bg-[#189D91] text-white border-teal-500 hover:bg-[#137A71]'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${gpsActive ? 'bg-emerald-500 animate-pulse' : 'bg-white'}`}></span>
              {gpsActive ? 'Live GPS Active' : 'Start GPS Sync'}
            </button>
          </div>
        </div>

        {/* Core Layout Split */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
          
          {/* Active Navigation List Panel */}
          <div className="xl:col-span-4 flex flex-col gap-5">
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4 flex-1">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <LuCompass className="text-[#189D91]" /> Active Mission Run
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-teal-50 text-[#189D91] rounded-full">
                  {activeOrders.length} Shipments
                </span>
              </div>

              {loading ? (
                <div className="space-y-3 py-10">
                  <div className="h-24 bg-slate-50 rounded-2xl animate-pulse"></div>
                  <div className="h-24 bg-slate-50 rounded-2xl animate-pulse"></div>
                </div>
              ) : activeOrders.length > 0 ? (
                <div className="space-y-3 overflow-y-auto max-h-[550px] pr-1 custom-scrollbar">
                  {activeOrders.map(order => {
                    const isSelected = selectedOrder?._id === order._id;
                    const hasCoords = !!(order.shippingCoordinates?.latitude);
                    const km = hasCoords 
                      ? getDistanceInKm(partnerCoords.latitude, partnerCoords.longitude, order.shippingCoordinates.latitude, order.shippingCoordinates.longitude)
                      : null;
                    
                    return (
                      <div 
                        key={order._id}
                        onClick={() => setSelectedOrder(order)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-teal-50/50 border-[#189D91] shadow-md shadow-teal-500/5' 
                            : 'bg-white border-slate-100 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order ID</p>
                            <p className="text-xs font-black text-slate-900">#{order._id.slice(-8).toUpperCase()}</p>
                          </div>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            order.deliveryStatus === 'Out for Delivery' 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-teal-100 text-teal-800'
                          }`}>
                            {order.deliveryStatus}
                          </span>
                        </div>

                        <div className="space-y-1.5 text-xs">
                          <p className="font-bold text-slate-800 flex items-center gap-1.5">
                            <LuPackage className="text-slate-400" size={12} /> {order.businessDetails?.shopName || 'Operations Hub'}
                          </p>
                          <p className="text-slate-500 font-medium flex items-center gap-1.5 line-clamp-1">
                            <LuMapPin className="text-[#189D91]" size={12} /> {order.shippingAddress?.fullName} - {order.shippingAddress?.fullAddress}
                          </p>
                        </div>

                        {/* Route Stats Overlay */}
                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-500">
                          <span>Est. Distance: <span className="text-slate-900 font-black">{km ? `${km} KM` : 'N/A'}</span></span>
                          <span>ETA: <span className="text-[#189D91] font-black">{km ? `${getEtaInMinutes(km)} Mins` : 'N/A'}</span></span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-20 text-center space-y-4 flex-1 flex flex-col justify-center items-center">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-[#189D91]">
                    <LuPackage size={28} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">No Active Deployments</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
                      Accept orders from the active queue to initialize mapping routes and turn-by-turn guidance.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Map Viewer Canvas Panel */}
          <div className="xl:col-span-8 flex flex-col">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[500px] xl:h-auto flex-1 relative">
              
              {/* Map Container */}
              <div 
                ref={mapRef} 
                className="flex-1 w-full h-[550px] relative bg-slate-50 z-10"
              />

              {!leafletLoaded && (
                <div className="absolute inset-0 bg-slate-50/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-6 text-center space-y-4">
                  <div className="w-12 h-12 border-4 border-[#189D91] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs font-bold text-slate-600">Spinning Map Engine...</p>
                </div>
              )}

              {/* Float Auto-Center Controls */}
              {selectedOrder && (
                <div className="absolute top-4 left-4 z-30 flex flex-col gap-2">
                  <button
                    onClick={() => setAutoCenter(prev => !prev)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all shadow-md backdrop-blur-md ${
                      autoCenter
                        ? 'bg-emerald-500/90 text-white border-emerald-400 hover:bg-emerald-600/95'
                        : 'bg-white/90 text-slate-700 border-slate-200 hover:bg-slate-50/95'
                    }`}
                  >
                    <LuNavigation size={12} className={autoCenter ? 'animate-pulse' : ''} />
                    {autoCenter ? 'Auto-Center Active' : 'Auto-Center Paused'}
                  </button>
                </div>
              )}

              {/* Float Panel Details (If order is selected) */}
              {selectedOrder && (() => {
                const hasValidCoords = !!(selectedOrder.shippingCoordinates?.latitude);
                return (
                  <div className="absolute left-6 bottom-6 right-6 md:right-auto md:w-[420px] bg-white/90 backdrop-blur-md p-5 rounded-3xl border border-slate-200/50 shadow-2xl z-30 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-5">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200/50 px-2 py-0.5 rounded-full uppercase tracking-wider">Active Route Node</span>
                        <h3 className="text-base font-black text-slate-900">
                          {selectedOrder.shippingAddress?.fullName}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
                          {selectedOrder.shippingAddress?.fullAddress}
                        </p>
                      </div>

                      <a 
                        href={`tel:${selectedOrder.shippingAddress?.mobileNumber}`}
                        className="p-3 bg-[#189D91]/10 text-[#189D91] hover:bg-[#189D91] hover:text-white rounded-2xl shadow-sm transition-all"
                      >
                        <LuPhone size={16} />
                      </a>
                    </div>

                    {/* Navigation Metrics Card */}
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-100 p-3.5 rounded-2xl">
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Distance</p>
                        <p className="text-lg font-black text-slate-900">
                          {hasValidCoords 
                            ? `${getDistanceInKm(partnerCoords.latitude, partnerCoords.longitude, selectedOrder.shippingCoordinates.latitude, selectedOrder.shippingCoordinates.longitude)} KM`
                            : 'N/A'
                          }
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Est. ETA</p>
                        <p className="text-lg font-black text-[#189D91]">
                          {hasValidCoords 
                            ? `${getEtaInMinutes(getDistanceInKm(partnerCoords.latitude, partnerCoords.longitude, selectedOrder.shippingCoordinates.latitude, selectedOrder.shippingCoordinates.longitude))} Mins`
                            : 'N/A'
                          }
                        </p>
                      </div>
                    </div>

                    {!hasValidCoords && (
                      <div className="p-3 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-2 text-rose-600 text-[10px] font-bold">
                        <LuShieldAlert size={14} className="shrink-0 mt-0.5" />
                        <span>Coordinates unresolved. Standard path disabled; driving search fallback is active.</span>
                      </div>
                    )}

                    <button 
                      onClick={launchExternalNavigation}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md"
                    >
                      <LuExternalLink size={14} /> Open in Google Maps
                    </button>
                  </div>
                );
              })()}

              {/* No Selection Warning overlay */}
              {!selectedOrder && !loading && (
                <div className="absolute top-4 left-4 right-4 bg-slate-900/85 backdrop-blur-sm px-4 py-3 rounded-2xl border border-slate-800 z-30 flex items-center gap-2 text-white/95 text-xs shadow-lg animate-in slide-in-from-top-3">
                  <LuShieldAlert size={14} className="text-[#189D91] shrink-0" />
                  <span className="font-semibold">Select an active deployment in the sidebar to trace your navigation path.</span>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </PageWrapper>
  );
};

export default RouteManagement;
