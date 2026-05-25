import React, { useState, useEffect } from 'react';
import { FiDownload, FiSearch, FiTrash2 } from 'react-icons/fi';
import api from '../../../shared/utils/api';
import { toast } from 'react-hot-toast';

const BulkOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

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
      toast.error(err.response?.data?.message || 'Failed to fetch bulk orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      await api.put(`/bulk-orders/${id}`, { status: newStatus });
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status: newStatus } : o));
      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      console.error('Failed to update status:', err);
      toast.error(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = (id, name) => {
    toast((t) => (
      <div className="flex flex-col gap-2 p-1 text-left">
        <p className="text-sm font-bold text-gray-800">
          Delete inquiry from "{name}"?
        </p>
        <div className="flex justify-end gap-2 mt-1">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                setDeletingId(id);
                await api.delete(`/bulk-orders/${id}`);
                setOrders(prev => prev.filter(o => o._id !== id));
                toast.success('Bulk order inquiry deleted successfully.');
              } catch (err) {
                console.error('Failed to delete bulk order:', err);
                toast.error(err.response?.data?.message || 'Failed to delete inquiry.');
              } finally {
                setDeletingId(null);
              }
            }}
            className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-colors"
          >
            Confirm
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 bg-gray-200 text-gray-800 rounded-lg text-xs font-bold hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 6000 });
  };

  const exportToExcel = async () => {
    const XLSX = await import('xlsx');
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
    order.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.email?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 h-10 w-full animate-pulse"></div>
            {[1, 2, 3].map((n) => (
              <div key={n} className="border-b border-gray-100 p-4 space-y-2 animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-1/4"></div>
                <div className="h-3 bg-gray-100 rounded w-3/4"></div>
              </div>
            ))}
          </div>
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
                  <th className="px-4 py-3 text-center">Actions</th>
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
                      <select
                        value={order.status}
                        disabled={updatingId === order._id}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`text-xs font-bold rounded px-2 py-1 outline-none border cursor-pointer ${
                          order.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                          order.status === 'Contacted' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          order.status === 'Processing' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                          order.status === 'Resolved' ? 'bg-green-50 text-green-700 border-green-200' :
                          'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Processing">Processing</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleDelete(order._id, order.name)}
                        disabled={deletingId === order._id}
                        className="text-red-500 hover:text-red-700 transition-colors p-1 disabled:opacity-50"
                        title="Delete Inquiry"
                      >
                        <FiTrash2 size={16} />
                      </button>
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
