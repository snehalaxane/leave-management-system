import { useState, useEffect } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import { Search, Eye, Trash2 } from "lucide-react";

const LeaveHistory = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: "", leaveType: "", search: "" });
  
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append("status", filters.status);
      if (filters.leaveType) queryParams.append("leaveType", filters.leaveType);
      if (filters.search) queryParams.append("search", filters.search);
      
      const response = await axios.get(`/leaves?${queryParams.toString()}`);
      setLeaves(response.data.data);
    } catch (error) {
      console.error("Failed to fetch leaves", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchLeaves();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [filters]);

  const openCancelModal = (id) => {
    setSelectedLeaveId(id);
    setCancelModalOpen(true);
  };

  const closeCancelModal = () => {
    setCancelModalOpen(false);
    setSelectedLeaveId(null);
  };

  const handleConfirmCancel = async () => {
    try {
      await axios.delete(`/leaves/${selectedLeaveId}`);
      fetchLeaves();
      closeCancelModal();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to cancel leave");
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Leave History</h1>
        <Link to="/employee/apply" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          Apply Leave
        </Link>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px] relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by reason..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="pl-10 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2 border"
          />
        </div>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2 px-3 border bg-white"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
        <select
          value={filters.leaveType}
          onChange={(e) => setFilters({ ...filters, leaveType: e.target.value })}
          className="border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2 px-3 border bg-white"
        >
          <option value="">All Types</option>
          <option value="CASUAL">Casual</option>
          <option value="SICK">Sick</option>
          <option value="EARNED">Earned</option>
          <option value="WFH">WFH</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-500">Loading...</td></tr>
              ) : leaves.length === 0 ? (
                <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-500">No leave records found.</td></tr>
              ) : (
                leaves.map((leave) => (
                  <tr key={leave.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{leave.leaveType}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{leave.reason}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(leave.startDate).toLocaleDateString()} to {new Date(leave.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        leave.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        leave.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {leave.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-3">
                        <Link to={`/employee/leaves/${leave.id}`} className="text-indigo-600 hover:text-indigo-900" title="View Details">
                          <Eye size={18} />
                        </Link>
                        {leave.status === 'PENDING' && (
                          <button onClick={() => openCancelModal(leave.id)} className="text-red-600 hover:text-red-900" title="Cancel Request">
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Cancel Leave Request</h3>
            <p className="text-gray-500 mb-6">Are you sure you want to cancel this pending leave request?</p>
            <div className="flex justify-end gap-3">
              <button onClick={closeCancelModal} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors">
                No, Keep it
              </button>
              <button onClick={handleConfirmCancel} className="px-4 py-2 rounded-lg text-white font-medium bg-red-600 hover:bg-red-700 transition-colors">
                Yes, Cancel Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveHistory;
