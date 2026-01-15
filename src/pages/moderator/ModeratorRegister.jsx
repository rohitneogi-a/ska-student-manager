import { useEffect, useState } from "react";
import { useHttp } from "../../components/hooks/useHttp"; // fixed import path
import { ListRestart, Plus, X, Eye, EyeOff } from "lucide-react";

const defaultModerator = {
  fullName: "",
  email: "",
  phoneNo: "",
  address: "",
  password: "",
};

export default function ModeratorRegisterModal({ isOpen, onClose }) {
  const { post } = useHttp();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(defaultModerator);
  const [focusedField, setFocusedField] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


const handleSaveChanges = async () => {
  let { fullName, email, phoneNo, address, password } = formData;

  // Add +91 if not present
  if (!phoneNo.startsWith("+91")) {
    phoneNo = "+91" + phoneNo.replace(/^0+/, ""); // Remove leading zeros if any
  }

  if (!fullName || !email || !phoneNo || !address || !password) {
    setError("All fields are required.");
    return;
  }

  try {
    setSubmitting(true);
    setError(null);
    const res = await post("/api/moderator/register", {
      ...formData,
      phoneNo, 
    });
    if (res?.success) {
      resetForm();
      onClose(res.data?.user || res.data);
    } else {
      setError(res?.message || "Failed to register moderator");
    }
  } catch (err) {
    setError("Something went wrong while registering moderator.");
  } finally {
    setSubmitting(false);
  }
};


  const resetForm = () => {
    setFormData(defaultModerator);
    setError(null);
    setFocusedField(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40 backdrop-blur">
      <div className="bg-white rounded-lg w-full max-w-md shadow-lg overflow-hidden p-6 font-page-title">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-lg font-semibold text-gray-900 text-center cursor-pointer flex-1">
            Register New Moderator
          </h2>
          <button
            onClick={() => onClose(null)}
            className="text-gray-500 hover:text-white hover:bg-red-300 rounded-full w-8 h-8 flex items-center justify-center transition btn-primary"
          >
            <X />
          </button>
        </div>

        {/* Form Fields */}
        <div className="mt-4 space-y-4">
          {[
            { name: "fullName", label: "Full Name", type: "text" },
            { name: "email", label: "Email", type: "email" },
            { name: "phoneNo", label: "Phone Number", type: "text" },
            { name: "address", label: "Address", type: "text" },
          ].map(({ name, label, type }) => (
            <div key={name}>
              <label
                className={`text-sm block mb-1 ${
                  focusedField === name
                    ? "text-teal-600 font-medium"
                    : "text-gray-600"
                }`}
              >
                {label}
              </label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                onFocus={() => setFocusedField(name)}
                onBlur={() => setFocusedField(null)}
                className={`w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 ${
                  focusedField === name
                    ? "border-teal-500 ring-teal-500"
                    : "border-gray-300"
                }`}
              />
            </div>
          ))}

          {/* Password field with show/hide */}
          <div>
            <label
              className={`text-sm block mb-1 ${
                focusedField === "password"
                  ? "text-teal-600 font-medium"
                  : "text-gray-600"
              }`}
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                className={`w-full border rounded-xl px-3 py-2 pr-10 focus:outline-none focus:ring-2 ${
                  focusedField === "password"
                    ? "border-teal-500 ring-teal-500"
                    : "border-gray-300"
                }`}
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 btn-primary"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="mt-6 space-y-3">
          <button
            onClick={handleSaveChanges}
            disabled={submitting}
            className={`w-full flex items-center justify-center gap-2
    bg-teal-600 text-white py-3 px-4 rounded-lg font-medium transition btn-primary
    ${
      submitting
        ? "opacity-50 cursor-not-allowed"
        : "hover:bg-teal-700 cursor-pointer"
    }`}
          >
            <Plus className="w-5 h-5" />
            {submitting ? "Registering..." : "Register"}
          </button>

          <button
            onClick={resetForm}
            disabled={submitting}
            className="w-full flex items-center justify-center bg-gray-200 text-black font-medium py-3 px-4 rounded-lg hover:bg-gray-300 transition disabled:opacity-50 btn-primary"
          >
            <ListRestart className="w-5 h-5 mr-2" />
            Reset Form
          </button>
        </div>
      </div>
    </div>
  );
}
