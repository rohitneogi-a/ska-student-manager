import React from 'react'
import StatusDot from "../../components/common/StatusDot";



function formatDate(dateString) {
  const d = new Date(dateString);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}
function ViewModal({ selectedUser, setIsModalOpen, getStatusDotColor, getStatusColor }) {
  if (!selectedUser) return null;

  return (


      <div className="fixed inset-0 bg-black/50 z-2000 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                Student Details
              </h2>
              {selectedUser && (
                <div className="flex flex-wrap gap-5 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg flex-1 min-w-55">
                    <p className="text-xs text-gray-500 mb-1">Full Name</p>
                    <p className="text-slate-800 font-medium">
                      {selectedUser.name}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg flex-1 min-w-55">
                    <p className="text-xs text-gray-500 mb-1">Guardian Name</p>
                    <p className="text-slate-800 font-medium">
                      {selectedUser.guardian}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg flex-1 min-w-55">
                    <p className="text-xs text-gray-500 mb-1">Phone</p>
                    <p className="text-slate-800 font-medium">
                      {selectedUser.phone}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg flex-1 min-w-55">
                    <p className="text-xs text-gray-500 mb-1">Subject</p>
                    <p className="text-slate-800 font-medium">
                      {selectedUser.subject}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg flex-1 min-w-55">
                    <p className="text-xs text-gray-500 mb-1">Date of Birth</p>
                    <p className="text-slate-800 font-medium">
                      {selectedUser.dob ? formatDate(selectedUser.dob) : "N/A"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg flex-1 min-w-55">
                    <p className="text-xs text-gray-500 mb-1">Address</p>
                    <p className="text-slate-800 font-medium">
                      {selectedUser.address}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg flex-1 min-w-55">
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <div className="flex items-center gap-2">
                      <StatusDot
                        pingColor={getStatusDotColor(selectedUser.status)}
                        dotColor={getStatusDotColor(selectedUser.status)}
                      />
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          selectedUser.status
                        )}`}
                      >
                        {selectedUser.status
                          ? selectedUser.status.toUpperCase()
                          : "ACTIVE"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-semibold transition-all btn-primary"
              >
                Close
              </button>
            </div>
          </div>
  )
}

export default ViewModal
