import { useState, useEffect } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import { Eye, Check, X } from "lucide-react";

const PendingApprovals = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // "approve" or "reject"
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);
  const [managerComments, setManagerComments] = useState("");

  const fetchPending = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/manager/pending-leaves");
      setLeaves(response.data.data);
    } catch (error) {
      console.error("Failed to fetch pending leaves", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const openApproveModal = (id) => {
    setSelectedLeaveId(id);
    setModalType("approve");
    setModalOpen(true);
  };

  const openRejectModal = (id) => {
    setSelectedLeaveId(id);
    setModalType("reject");
    setManagerComments("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedLeaveId(null);
    setManagerComments("");
  };

  const handleConfirmAction = async () => {
    try {
      if (modalType === "approve") {
        await axios.put(`/manager/leaves/${selectedLeaveId}/approve`);
      } else if (modalType === "reject") {
        await axios.put(`/manager/leaves/${selectedLeaveId}/reject`, { managerComments });
      }
      fetchPending();
      closeModal();
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Pending Approvals</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-500">Loading...</td></tr>
              ) : leaves.length === 0 ? (
                <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-500">No pending leave requests.</td></tr>
              ) : (
                leaves.map((leave) => (
                  <tr key={leave.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{leave.employee?.name}</div>
                      <div className="text-sm text-gray-500">{leave.employee?.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{leave.leaveType}</div>
                      <div className="text-sm text-gray-500 truncate max-w-[200px]" title={leave.reason}>{leave.reason}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Link to={`/manager/leaves/${leave.id}`} className="bg-gray-100 p-2 rounded text-gray-600 hover:text-indigo-600 transition-colors" title="View Details">
                          <Eye size={18} />
                        </Link>
                        <button onClick={() => openApproveModal(leave.id)} className="bg-green-100 p-2 rounded text-green-700 hover:bg-green-200 transition-colors" title="Approve">
                          <Check size={18} />
                        </button>
                        <button onClick={() => openRejectModal(leave.id)} className="bg-red-100 p-2 rounded text-red-700 hover:bg-red-200 transition-colors" title="Reject">
                          <X size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Custom Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {modalType === "approve" ? "Approve Leave Request" : "Reject Leave Request"}
            </h3>
            
            {modalType === "approve" ? (
              <p className="text-gray-500 mb-6">Are you sure you want to approve this leave request?</p>
            ) : (
              <div className="mb-6">
                <p className="text-gray-500 mb-2">Please provide a reason for rejecting this leave:</p>
                <textarea
                  value={managerComments}
                  onChange={(e) => setManagerComments(e.target.value)}
                  placeholder="Manager comments..."
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ${
                  modalType === "approve" 
                    ? "bg-green-600 hover:bg-green-700" 
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {modalType === "approve" ? "Confirm Approve" : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingApprovals;
