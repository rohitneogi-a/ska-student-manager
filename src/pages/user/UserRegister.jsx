import React, { useState } from "react";
import { Moon, Sun, UserPlus, User } from "lucide-react";

export default function UserRegister() {
  const [lightMode, setLightMode] = useState(false);
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    strength: 0,
    text: "Password strength",
    color: "",
  });
  const toggleTheme = () => {
    setLightMode(!lightMode);
  };
  const togglePassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (name === "password") checkPasswordStrength(value);
  };
  const checkPasswordStrength = (pwd) => {
    let strength = 0;
    const hasLength = pwd.length >= 8;
    const hasUppercase = /[A-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);

    if (hasLength) strength++;
    if (hasUppercase) strength++;
    if (hasNumber) strength++;
    if (hasSpecial) strength++;

    const colors = ["#e76f51", "#e9c46a", "#2a9d8f", "#2a9d8f"];
    const texts = ["Weak", "Fair", "Good", "Strong"];

    setPasswordStrength({
      strength,
      text:
        pwd.length > 0
          ? texts[strength - 1] || "Very Weak"
          : "Password strength",
      color: pwd.length > 0 ? colors[strength - 1] : "",
    });

    // Optional: Update requirement indicators
    setRequirementStatus({
      length: hasLength,
      uppercase: hasUppercase,
      number: hasNumber,
    });
  };
  const [requirementStatus, setRequirementStatus] = useState({
    length: false,
    uppercase: false,
    number: false,
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    let isValid = true;

    // Validate full name
    if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Please enter your full name";
      isValid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Validate password
    const { password, confirmPassword } = formData;
    const hasLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!hasLength || !hasUppercase || !hasNumber) {
      newErrors.password = "Password does not meet requirements";
      isValid = false;
    }

    // Confirm password
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    // Terms
    if (!formData.terms) {
      alert("Please accept the Terms of Service and Privacy Policy");
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      alert("Account created successfully! (Demo)");
      // Send data to server here
    }
  };
  return (
    <div
      className={`${
        lightMode ? "light-mode" : ""
      } gradient-bg min-h-screen flex items-center justify-center p-4`}
    >
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 glass-card p-3 rounded-2xl text-white hover:scale-110 transition-all duration-300 z-10"
      >
        {lightMode ? <Moon /> : <Sun />}
      </button>

      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8 logo-animate font-page-title">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl glass-card mb-4">
            <UserPlus className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 font-page-title">
            Create Account
          </h1>
          <p className="text-white/80 font-page-title">
            Join us and start your journey today
          </p>
        </div>
        {/* Registration Card */}
        <div className="glass-card rounded-3xl p-8 card-animate">
          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="mb-5">
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`input-field w-full pl-12 pr-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2a9d8f] ${
                    errors.fullName ? "error" : ""
                  }`}
                  placeholder="John Doe"
                />
              </div>
              <p
                className={`mt-1 text-xs text-gray-400 ${
                  errors.fullName ? "" : "hidden"
                } error-text`}
                id="fullNameError"
              >
                {errors.fullName}
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


