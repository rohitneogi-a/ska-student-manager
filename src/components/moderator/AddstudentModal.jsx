import { Eye, EyeOff, UserPlus, X } from "lucide-react";
import { useEffect } from "react";

function inputCls(error) {
  return `w-full px-3 py-2 border-2 rounded-lg text-sm text-gray-900 focus:outline-none transition ${
    error
      ? "border-red-400 focus:border-red-500 bg-red-50"
      : "border-gray-200 focus:border-teal-500 bg-white"
  }`;
}

function FormField({ label, error, required, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export default function AddStudentModal({
  show,
  onClose,
  form,
  formErrors,
  showPassword,
  setShowPassword,
  adding,
  onFormChange,
  onSubmit,
}) {
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-slideUp font-alert-card">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-linear-to-r from-teal-600 to-teal-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Add New Student</h2>
              <p className="text-teal-100 text-xs">Fill in the student details below</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto space-y-4">

          <FormField label="Full Name" error={formErrors.fullName} required>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => onFormChange("fullName", e.target.value)}
              placeholder="e.g. Sneha Kapoor"
              className={inputCls(formErrors.fullName)}
            />
          </FormField>

          <FormField label="Guardian Name" error={formErrors.guardianName} required>
            <input
              type="text"
              value={form.guardianName}
              onChange={(e) => onFormChange("guardianName", e.target.value)}
              placeholder="e.g. Vikram Kapoor"
              className={inputCls(formErrors.guardianName)}
            />
          </FormField>

          <FormField label="Phone Number" error={formErrors.phoneNo} required>
            <input
              type="tel"
              value={form.phoneNo}
              onChange={(e) => onFormChange("phoneNo", e.target.value)}
              placeholder="e.g. 9345678123"
              maxLength={10}
              className={inputCls(formErrors.phoneNo)}
            />
          </FormField>

          <FormField label="Password" error={formErrors.password} required>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => onFormChange("password", e.target.value)}
                placeholder="Min 6 characters"
                className={inputCls(formErrors.password) + " pr-10"}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-600 transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </FormField>

          <FormField label="Date of Birth" error={formErrors.dob} required>
            <input
              type="date"
              value={form.dob}
              onChange={(e) => onFormChange("dob", e.target.value)}
              className={inputCls(formErrors.dob)}
            />
          </FormField>

          <FormField label="Subject" error={formErrors.subject} required>
            <input
              type="text"
              value={form.subject}
              onChange={(e) => onFormChange("subject", e.target.value)}
              placeholder="e.g. Chemistry"
              className={inputCls(formErrors.subject)}
            />
          </FormField>

          <FormField label="Address" error={formErrors.address} required>
            <input
              type="text"
              value={form.address}
              onChange={(e) => onFormChange("address", e.target.value)}
              placeholder="e.g. Chandigarh"
              className={inputCls(formErrors.address)}
            />
          </FormField>

          <FormField label="Gender" error={formErrors.gender} required>
            <select
              value={form.gender}
              onChange={(e) => onFormChange("gender", e.target.value)}
              className={inputCls(formErrors.gender)}
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </FormField>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl font-semibold text-sm border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={adding}
            className="flex-1 py-2.5 rounded-xl font-semibold text-sm bg-teal-600 hover:bg-teal-700 text-white transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {adding ? (
              <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <UserPlus className="w-4 h-4" />
            )}
            {adding ? "Adding..." : "Add Student"}
          </button>
        </div>
      </div>
    </div>
  );
}