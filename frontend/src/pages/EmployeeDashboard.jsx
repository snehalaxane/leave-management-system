import { useState, useEffect } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import { Calendar, CheckCircle, Clock, XCircle, FileText } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
    </div>
    <div className={`p-3 rounded-full ${colorClass}`}>
      <Icon size={24} />
    </div>
  </div>
);

const EmployeeDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await axios.get("/employees/dashboard");
        setData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch dashboard", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="text-center py-10">Loading dashboard...</div>;
  if (!data) return <div className="text-center py-10 text-red-500">Failed to load data.</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <Link
          to="/employee/apply"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Apply Leave
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Leaves"
          value={data.totalLeaves}
          icon={FileText}
          colorClass="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Approved"
          value={data.approvedLeaves}
          icon={CheckCircle}
          colorClass="bg-green-50 text-green-600"
        />
        <StatCard
          title="Pending"
          value={data.pendingLeaves}
          icon={Clock}
          colorClass="bg-yellow-50 text-yellow-600"
        />
        <StatCard
          title="Rejected"
          value={data.rejectedLeaves}
          icon={XCircle}
          colorClass="bg-red-50 text-red-600"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-8">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Recent Leave Requests</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {data.recentLeaves?.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No recent leave requests found.</div>
          ) : (
            data.recentLeaves?.map((leave) => (
              <div key={leave.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-50 p-3 rounded-lg text-indigo-600">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{leave.leaveType} Leave</h4>
                    <p className="text-sm text-gray-500">
                      {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    leave.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                    leave.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {leave.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
