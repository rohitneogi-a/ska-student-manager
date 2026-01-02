import { useState, forwardRef } from "react";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  CheckCircle2,
  X,
  UserPlus,
  Smartphone,
  Calendar,
  MapPinHouse,
} from "lucide-react";
import { RiParentLine } from "react-icons/ri";
import { MdOutlineDraw } from "react-icons/md";
import { useHttp } from "../../components/hooks/useHttp";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parse } from "date-fns";

const passwordRequirements = {
  length: (password) => password.length >= 8,
  uppercase: (password) => /[A-Z]/.test(password),
  number: (password) => /[0-9]/.test(password),
};

// Helper functions
const formatToDisplay = (isoDate) => {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("-");
  return `${day}-${month}-${year}`;
};

const formatToISO = (displayDate) => {
  if (!displayDate) return "";
  const [day, month, year] = displayDate.split("-");
  return `${year}-${month}-${day}`;
};

const DateInput = forwardRef(
  ({ value, onClick, onChange, placeholder, error }, ref) => (
    <div className="relative w-full">
      <Calendar
        size={20}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
      />
      <input
        type="text"
        readOnly
        ref={ref}
        value={value}
        onClick={onClick}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full pl-12 pr-4 py-3 rounded-2xl outline-none transition-all focus:ring-2 bg-white border border-slate-200 text-slate-900 placeholder-gray-500 focus:ring-teal-500/50 focus:border-teal-500 ${
          error ? "border-red-500" : ""
        }`}
      />
    </div>
  )
);

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    guardianName: "",
    phoneNo: "",
    dob: null,
    subject: "",
    address: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [errors, setErrors] = useState({});
  const { post, loading } = useHttp();

  const [passwordTouched, setPasswordTouched] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      password: value,
    }));

    setPasswordTouched(true);

    const requirements = {
      length: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      number: /[0-9]/.test(value),
    };

    const metRequirements = Object.values(requirements).filter(Boolean).length;
    setPasswordStrength(metRequirements);
  };

  // For calendar, store dob as yyyy-mm-dd in state
  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      dob: date,
    }));
    if (errors.dob) {
      setErrors((prev) => ({
        ...prev,
        dob: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.guardianName.trim()) {
      newErrors.guardianName = "Guardian name is required";
    }

    if (!formData.phoneNo.trim()) {
      newErrors.phoneNo = "Phone number is required";
    } else if (!/^\d{10,15}$/.test(formData.phoneNo)) {
      newErrors.phoneNo = "Enter a valid phone number";
    }

    if (!formData.dob) {
      newErrors.dob = "Date of birth is required";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Password must contain an uppercase letter";
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "Password must contain a number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.terms) {
      newErrors.terms = "You must agree to the terms";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const {
        fullName,
        guardianName,
        phoneNo,
        dob,
        subject,
        address,
        password,
      } = formData;

      // Convert dob to yyyy-mm-dd for API
      const body = {
        fullName,
        guardianName,
        phoneNo,
        dob: formData.dob ? format(formData.dob, "yyyy-MM-dd") : "",
        subject,
        address,
        password,
      };

      const toastId = toast.loading("Creating account...");

      const result = await post("/api/user/register", body);
      if (result && result.success) {
        toast.success("Account created successfully!", { id: toastId });
        // Reset form after successful registration
        setFormData({
          fullName: "",
          guardianName: "",
          phoneNo: "",
          dob: null,
          subject: "",
          address: "",
          password: "",
          confirmPassword: "",
          terms: false,
        });
        setErrors({});
        setPasswordStrength(0);
      } else {
        // Show API error message if available, else fallback
        const errorMsg =
          result?.message || "Registration failed. Please try again.";
        toast.error(errorMsg, { id: toastId });
      }
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength === 0) return "bg-white/20";
    if (passwordStrength === 1) return "bg-red-500";
    if (passwordStrength === 2) return "bg-yellow-500";
    return "bg-emerald-500";
  };

  const getStrengthText = () => {
    if (passwordStrength === 0) return "Password strength";
    if (passwordStrength === 1) return "Weak";
    if (passwordStrength === 2) return "Fair";
    return "Strong";
  };

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center p-4 transition-all duration-300 font-page-title gradient-bg font-page-title">
        <div className="w-full max-w-md">
          {/* Logo Section */}
          <div className="text-center mb-4 animate-in fade-in slide-in-from-top-10 duration-600 logo-animate">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-4 backdrop-blur-md transition-all glass-card  border border-black/10 ">
              <UserPlus size={40} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-white">
              Create Account
            </h1>
            <p className="text-white/80">
              Join us and start your journey today
            </p>
          </div>

          {/* Registration Card */}
          <div className="rounded-3xl p-8 backdrop-blur-md animate-in fade-in slide-in-from-bottom-10 duration-600 transition-all bg-white/70 border border-slate-200 card-animate  ">
            <form onSubmit={handleSubmit}>
              {/* Full Name Input */}
              <div className="mb-5">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium mb-2 text-gray-700"
                >
                  Full Name
                </label>
                <div className="relative">
                  <User
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-3 rounded-2xl outline-none transition-all focus:ring-2 bg-white border border-slate-200 text-slate-900 placeholder-gray-500 focus:ring-teal-500/50 focus:border-teal-500 ${
                      errors.fullName ? "border-red-500" : ""
                    }`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.fullName && (
                  <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
                )}
              </div>

              {/* Guardian Name Input */}
              <div className="mb-5">
                <label
                  htmlFor="guardianName"
                  className="block text-sm font-medium mb-2 text-gray-700"
                >
                  Guardian Name
                </label>
                <div className="relative">
                  <RiParentLine
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                  <input
                    type="text"
                    id="guardianName"
                    name="guardianName"
                    value={formData.guardianName}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-3 rounded-2xl outline-none transition-all focus:ring-2 bg-white border border-slate-200 text-slate-900 placeholder-gray-500 focus:ring-teal-500/50 focus:border-teal-500 ${
                      errors.guardianName ? "border-red-500" : ""
                    }`}
                    placeholder="Guardian Name"
                  />
                </div>
                {errors.guardianName && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.guardianName}
                  </p>
                )}
              </div>

              {/* Phone Number Input */}
              <div className="mb-5">
                <label
                  htmlFor="phoneNo"
                  className="block text-sm font-medium mb-2 text-gray-700"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <Smartphone
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                  <input
                    type="tel"
                    id="phoneNo"
                    name="phoneNo"
                    value={formData.phoneNo}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-3 rounded-2xl outline-none transition-all focus:ring-2 bg-white border border-slate-200 text-slate-900 placeholder-gray-500 focus:ring-teal-500/50 focus:border-teal-500 ${
                      errors.phoneNo ? "border-red-500" : ""
                    }`}
                    placeholder="Phone Number"
                  />
                </div>
                {errors.phoneNo && (
                  <p className="mt-1 text-xs text-red-500">{errors.phoneNo}</p>
                )}
              </div>

              {/* Date of Birth Input */}
              <div className="mb-5">
                <label
                  htmlFor="dob"
                  className="block text-sm font-medium mb-2 text-gray-700"
                >
                  Date of Birth
                </label>
                <div className="relative">
                  <DatePicker
                    id="dob"
                    selected={formData.dob}
                    onChange={handleDateChange}
                    dateFormat="dd-MM-yyyy"
                    maxDate={new Date()}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    customInput={<DateInput />}
                    className={`w-full pl-12 pr-4 py-3 rounded-2xl outline-none transition-all focus:ring-2 bg-white border border-slate-200 text-slate-900 placeholder-gray-500 focus:ring-teal-500/50 focus:border-teal-500 ${
                      errors.dob ? "border-red-500" : ""
                    }`}
                    placeholderText="dd-mm-yyyy"
                  />
                </div>
                {errors.dob && (
                  <p className="mt-1 text-xs text-red-500">{errors.dob}</p>
                )}
              </div>

              {/* Subject Input */}
              <div className="mb-5">
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium mb-2 text-gray-700"
                >
                  Subject
                </label>
                <div className="relative">
                <MdOutlineDraw   size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-3 rounded-2xl outline-none transition-all focus:ring-2 bg-white border border-slate-200 text-slate-900 placeholder-gray-500 focus:ring-teal-500/50 focus:border-teal-500 ${
                      errors.subject ? "border-red-500" : ""
                    }`}
                    placeholder="Subject"
                  />
                </div>
                {errors.subject && (
                  <p className="mt-1 text-xs text-red-500">{errors.subject}</p>
                )}
              </div>

              {/* Address Input */}
              <div className="mb-5">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium mb-2 text-gray-700"
                >
                  Address
                </label>
                <div className="relative">
                <MapPinHouse  size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-3 rounded-2xl outline-none transition-all focus:ring-2 bg-white border border-slate-200 text-slate-900 placeholder-gray-500 focus:ring-teal-500/50 focus:border-teal-500 ${
                      errors.address ? "border-red-500" : ""
                    }`}
                    placeholder="Address"
                  />
                </div>
                {errors.address && (
                  <p className="mt-1 text-xs text-red-500">{errors.address}</p>
                )}
              </div>

              {/* Password Input */}
              <div className="mb-5">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-2 text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handlePasswordChange}
                    className={`w-full pl-12 pr-12 py-3 rounded-2xl outline-none transition-all focus:ring-2 bg-white border border-slate-200 text-slate-900 placeholder-gray-500 focus:ring-teal-500/50 focus:border-teal-500 ${
                      errors.password ? "border-red-500" : ""
                    }`}
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          i < passwordStrength
                            ? getStrengthColor()
                            : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-gray-600">
                    {getStrengthText()}
                  </p>
                </div>

                {/* Password Requirements */}
                <div className="mt-3 space-y-1">
                  {Object.entries(passwordRequirements).map(([key, fn]) => {
                    const met = fn(formData.password);
                    let colorClass = "text-gray-400";
                    if (passwordTouched) {
                      colorClass = met ? "text-teal-600" : "text-red-600";
                    }
                    return (
                      <p
                        key={key}
                        className={`text-xs flex items-center transition-all ${colorClass}`}
                      >
                        {passwordTouched ? (
                          met ? (
                            <CheckCircle2 size={16} className="mr-1" />
                          ) : (
                            <X size={16} className="mr-1" />
                          )
                        ) : (
                          <X size={16} className="mr-1 opacity-50" />
                        )}
                        {key === "length"
                          ? "At least 8 characters"
                          : key === "uppercase"
                          ? "One uppercase letter"
                          : "One number"}
                      </p>
                    );
                  })}
                </div>

                {errors.password && (
                  <p className="mt-2 text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="mb-6">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium mb-2 text-gray-700"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-12 py-3 rounded-2xl outline-none transition-all focus:ring-2 bg-white border border-slate-200 text-slate-900 placeholder-gray-500 focus:ring-teal-500/50 focus:border-teal-500 ${
                      errors.confirmPassword ? "border-red-500" : ""
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms & Conditions */}
              <div className="mb-6">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    name="terms"
                    checked={formData.terms}
                    onChange={handleInputChange}
                    className="w-4 h-4 mt-1 rounded transition-all bg-white border-slate-300 accent-teal-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    I agree to the{" "}
                    <a
                      href="#"
                      className="hover:underline text-amber-400 transition-colors"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="hover:underline text-amber-400 transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </span>
                </label>
                {errors.terms && (
                  <p className="mt-1 text-xs text-red-500">{errors.terms}</p>
                )}
              </div>

              {/* Register Button */}
              <button
                type="submit"
                className="w-full py-3 px-6 rounded-2xl font-semibold shadow-lg mb-6 transition-all hover:shadow-xl hover:-translate-y-0.5  cursor-pointer active:translate-y-0 bg-teal-600 text-white hover:bg-teal-700"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Account"}
              </button>

              {/* Sign In Link */}
              <div className="text-center">
                <span className="text-sm text-gray-600">
                  Already have an account?
                </span>
                <a
                  href="#"
                  className="ml-1 font-semibold hover:underline transition-all text-amber-400"
                >
                  Sign In
                </a>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-sm text-white/80">
            <p>© 2026 Sreejoni Kala Academy. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
