import { useState } from "react";
import { AtSign, Eye, EyeOff, Lock, LockIcon, Smartphone } from "lucide-react";
import Footer from "../../components/common/Footer.jsx";
import { useNavigate } from "react-router-dom";
import { useHttp } from "../../components/hooks/useHttp.jsx";
import toast from "react-hot-toast";
import { useLogin } from "../../contexts/LoginContext.jsx";

export default function SignInForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNo, setPhoneNo] = useState("");
  const [password, setPassword] = useState("");
  const { post } = useHttp();
  const { refreshRole } = useLogin();

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Signing in...");

    const result = await post("/api/user/login", {
      phoneNo,
      password,
    });

    toast.dismiss(toastId);

    if (result?.success) {
      if (result.data?.accessToken) {
        // Save token to localStorage
        localStorage.setItem("Token", result.data.accessToken);

        // Refresh role in context (this also sets it in localStorage)
        refreshRole();
      }

      toast.success("Login successful!");
      setPhoneNo("");
      setPassword("");
      navigate("/dashboard");
    } else {
      toast.error(result?.message || "Login failed.");
    }
  };

  return (
    <div>
      <div className="gradient-bg min-h-screen flex items-center justify-center p-4 font-page-title">
        <div className="w-full max-w-md">
          {/* Logo Section */}
          <div className="text-center mb-8 logo-animate">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl glass-card mb-4">
              <Lock className="w-10 h-10 text-white" strokeWidth={2} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-300">Sign in to continue to your account</p>
          </div>

          {/* Sign In Card */}
          <div className="glass-card rounded-3xl p-8 card-animate">
            <form onSubmit={handleSubmit}>
              {/* Phone Number Input */}
              <div className="mb-6">
                <label
                  htmlFor="phoneNo"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <Smartphone 
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10"
                    strokeWidth={2}
                  />
                  <input
                    type="tel"
                    id="phoneNo"
                    value={phoneNo}
                    onChange={(e) =>
                      setPhoneNo(e.target.value.replace(/\D/g, ""))
                    }
                    required
                    pattern="[0-9]*"
                    inputMode="numeric"
                    className="input-field w-full pl-12 pr-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-teal-400 relative z-0"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <LockIcon
                      className="w-5 h-5 text-gray-400"
                      strokeWidth={2}
                    />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="input-field w-full pl-12 pr-12 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-teal-400 relative z-0"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={togglePassword}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 cursor-pointer transition-colors z-10 "
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" strokeWidth={2} />
                    ) : (
                      <Eye className="w-5 h-5" strokeWidth={2} />
                    )}
                  </button>
                </div>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                className="btn-primary w-full py-3 px-6 rounded-2xl text-white font-semibold shadow-lg cursor-pointer hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#2a9d8f" }}
              >
                Sign In
              </button>

              {/* Sign Up Link */}
              <div className="text-center mt-6">
                <span className="text-gray-400 text-sm">
                  Don't have an account?
                </span>
                <a
                  href="/register"
                  className="ml-1 font-semibold hover:underline transition-all"
                  style={{ color: "#e9c46a" }}
                >
                  Create Account
                </a>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="mt-8">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}
