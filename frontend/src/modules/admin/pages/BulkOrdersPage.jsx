import React, { useState, useEffect } from 'react';
import { FiDownload, FiSearch } from 'react-icons/fi';
import api from '../../../shared/utils/api';
import * as XLSX from 'xlsx';

const BulkOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/bulk-orders');
      setOrders(res.data.data);
    } catch (err) {
      console.error('Failed to fetch bulk orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    const dataToExport = orders.map(order => ({
      'Date': new Date(order.createdAt).toLocaleDateString(),
      'Customer Name': order.name,
      'Phone Number': order.phone,
      'Email Address': order.email,
      'Products': order.items.map(i => `${i.name} (Qty: ${i.quantity})`).join(', '),
      'Message': order.message,
      'Status': order.status
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Bulk Orders");
    XLSX.writeFile(wb, `Bulk_Orders_${new Date().toLocaleDateString()}.xlsx`);
  };

  const filteredOrders = orders.filter(order => 
    order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Bulk Orders</h1>
            <p className="text-sm text-gray-500">Manage all bulk order inquiries from one place.</p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-200 rounded-lg py-2 pl-10 pr-4 text-sm w-64 focus:outline-none focus:border-purple-500"
                />
             </div>
             <button 
               onClick={exportToExcel}
               className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold hover:bg-purple-700 transition-colors"
             >
               <FiDownload /> Export to Excel
             </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading...</div>
        ) : filteredOrders.length > 0 ? (
          <div className="border border-gray-200 rounded-lg overflow-hidden overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse min-w-[1000px]">
              <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Customer Name</th>
                  <th className="px-4 py-3">Phone Number</th>
                  <th className="px-4 py-3">Email Address</th>
                  <th className="px-4 py-3">Products</th>
                  <th className="px-4 py-3">Message</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{order.name}</td>
                    <td className="px-4 py-3 text-gray-600">{order.phone}</td>
                    <td className="px-4 py-3 text-gray-600">{order.email}</td>
                    <td className="px-4 py-3">
                      <div className="max-w-[250px]">
                        {order.items.map((item, i) => (
                          <div key={i} className="text-[11px] text-gray-600 leading-tight mb-1">
                            • {item.name} <span className="text-gray-400">({item.quantity})</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-500 text-xs max-w-[150px] truncate" title={order.message}>
                        {order.message || '-'}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${order.status === 'Pending' ? 'bg-yellow-50 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-gray-200 rounded-lg text-gray-400">
            No inquiries found.
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkOrdersPage;
