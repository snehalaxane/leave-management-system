import { useAuth } from "../context/AuthContext";

const EmployeeProfile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-4xl font-bold mx-auto mb-4">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
        <p className="text-gray-500 mb-6">{user?.role}</p>

        <div className="grid grid-cols-2 gap-4 text-left border-t border-gray-100 pt-6 mt-6">
          <div>
            <p className="text-sm text-gray-500">Employee Code</p>
            <p className="font-medium text-gray-900">{user?.employeeCode}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Department</p>
            <p className="font-medium text-gray-900">{user?.department || "N/A"}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-500">Email Address</p>
            <p className="font-medium text-gray-900">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
