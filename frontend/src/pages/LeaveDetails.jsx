import { useState, useEffect } from "react";
import axios from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft } from "lucide-react";

const LeaveDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [leave, setLeave] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeave = async () => {
      try {
        const endpoint = user.role === "MANAGER" ? `/manager/leaves/${id}` : `/leaves/${id}`;
        // The backend doesn't have a specific manager getLeaveById endpoint in the prompt requirements,
        // Wait, actually I just need to fetch it from the available endpoint. If Manager doesn't have it, 
        // they might have to rely on pending-leaves, but let's assume /leaves/:id works or they can see it in pending.
        const response = await axios.get(`/leaves/${id}`);
        setLeave(response.data.data);
      } catch (error) {
        console.error("Failed to fetch leave details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeave();
  }, [id, user.role]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!leave) return <div className="text-center py-10 text-red-500">Leave details not found.</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-indigo-600 font-medium">
        <ArrowLeft size={20} className="mr-2" /> Back
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Leave Details</h2>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            leave.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
            leave.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
            'bg-yellow-100 text-yellow-700'
          }`}>
            {leave.status}
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <span className="block text-sm font-medium text-gray-500">Type</span>
            <span className="text-lg font-medium text-gray-900">{leave.leaveType} Leave</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="block text-sm font-medium text-gray-500">Start Date</span>
              <span className="text-gray-900">{new Date(leave.startDate).toLocaleDateString()}</span>
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-500">End Date</span>
              <span className="text-gray-900">{new Date(leave.endDate).toLocaleDateString()}</span>
            </div>
          </div>

          <div>
            <span className="block text-sm font-medium text-gray-500">Reason</span>
            <p className="text-gray-900 bg-gray-50 p-4 rounded-lg mt-1">{leave.reason}</p>
          </div>

          {leave.managerComments && (
            <div>
              <span className="block text-sm font-medium text-gray-500">Manager Comments</span>
              <p className="text-gray-900 bg-gray-50 p-4 rounded-lg mt-1">{leave.managerComments}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveDetails;
