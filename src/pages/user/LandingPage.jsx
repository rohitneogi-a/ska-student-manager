
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  GraduationCap,
  Sun,
  Moon,
  Menu,
  LogIn,
  UserPlus,
  ChevronDown,
  ShieldCheck,
  FileText,
  Smartphone,
  Zap,
  CheckCircle,
  Calendar,
  Lock,
  Layout,
  Globe,
  Shield,
  UserCheck,
  Database,
  Check,
  CreditCard,
  User,
} from "lucide-react"

export default function LandingPage() {

  const navigate = useNavigate()

  const [isDarkMode, setIsDarkMode] = useState(true)

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <div className={isDarkMode ? "bg-gray-900 text-white" : "bg-linear-to-b from-gray-50 to-gray-100 text-gray-900"}>
      {/* Header */}
      <header
        className={`font-header-navbar fixed top-0 w-full z-50 ${isDarkMode ? "glass" : "bg-white/80 backdrop-blur-md border-b border-gray-200"}`}
      >
        <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${isDarkMode ? "gradient-accent" : "bg-linear-to-br from-teal-500 to-yellow-500"}`}
            >
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold">SKA Manager</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#about" className={`transition ${isDarkMode ? "hover:text-cyan-400" : "hover:text-cyan-600"}`}>
              About
            </a>
            <a href="#features" className={`transition ${isDarkMode ? "hover:text-cyan-400" : "hover:text-cyan-600"}`}>
              Features
            </a>
            <a href="#security" className={`transition ${isDarkMode ? "hover:text-cyan-400" : "hover:text-cyan-600"}`}>
              Security
            </a>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition ${isDarkMode ? "hover:bg-white/10" : "hover:bg-gray-200"}`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <a
              href="#login"
              className={`px-4 py-2 rounded-lg transition ${isDarkMode ? "hover:bg-white/10" : "hover:bg-gray-200"}`}
            >
              Login
            </a>
            <button
              onClick={() => navigate("/register")}
              className={`px-6 py-2 rounded-xl text-white font-semibold ${isDarkMode ? "gradient-accent" : "bg-linear-to-br from-teal-500 to-yellow-500"}`}
            >
              Register
            </button>
          </div>

          <button className="md:hidden">
            <Menu className="w-6 h-6" />
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
        <div className={`hero-gradient absolute inset-0 opacity-20`}></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className={`rounded-3xl p-12 card-hover ${isDarkMode ? "glass" : "bg-white shadow-xl"}`}>
              {/* <div className="inline-block mb-6">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold border ${isDarkMode ? "glass text-cyan-400 border-cyan-400/30" : "bg-cyan-50 text-cyan-600 border-cyan-200"}`}
                >
                  Academic Year 2025–26
                </span>
              </div> */}

              <h1 className="text-3xl md:text-[60px] font-bold mb-6 bg-clip-text text-transparent  font-long-text bg-linear-to-r from-cyan-400 to-yellow-400">
                SKA Student Manager
              </h1>

              <p
                className={`text-xl font-page-title  md:text-2xl mb-8 leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
              >
                A secure and user-friendly platform designed to help students view, track, and manage their payment
                records with complete transparency.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  className={` font-page-title cursor-pointer px-8 py-4 rounded-xl glow-hover font-semibold text-lg flex items-center justify-center space-x-2 text-white ${isDarkMode ? "gradient-bg" : "bg-linear-to-br from-slate-700 to-teal-600"}`}
                >
                  <LogIn className="w-5 h-5" />
                  <span>Login</span>
                </button>
                <button
                  className={ 
                    
                    `  font-page-title cursor-pointer px-8 py-4 rounded-xl glow-hover font-semibold text-lg flex items-center justify-center space-x-2 text-white ${isDarkMode ? "gradient-accent" : "bg-linear-to-br from-teal-500 to-yellow-500"}`
                  
                  }
                  onClick={() => navigate("/register")}
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Register Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-cyan-400" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 font-alert-card">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">About the Platform</h2>
              <p className={`text-lg leading-relaxed mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                SKA Student Manager 2025–26 is a web-based student management system that allows users to safely access
                their personal details and year-wise, month-wise payment information.
              </p>
              <p className={`text-lg leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                The system is built with strong security and role-based access to ensure your data remains private and
                protected.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 font-alert-card ">
              {[
                { icon: ShieldCheck, title: "Secure Access", desc: "Protected login system" },
                { icon: FileText, title: "Clear Records", desc: "Organized payment data" },
                { icon: Smartphone, title: "Mobile Ready", desc: "Access anywhere" },
                { icon: Zap, title: "Fast & Easy", desc: "Intuitive interface" },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl p-6 card-hover ${isDarkMode ? "glass glow-hover " : "bg-white border border-gray-200"}`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl  flex items-center justify-center mb-4 text-white ${idx < 2 ? (idx === 0 ? "gradient-bg" : "gradient-accent") : "bg-linear-to-br from-orange-500 to-red-500"}`}
                  >
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Use Section */}
      <section
        className={`font-alert-card py-20 ${isDarkMode ? "bg-linear-to-b from-transparent to-gray-800 to-transparent" : "bg-gray-50"}`}
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Use SKA Student Manager?</h2>
            <p className={`text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Everything you need to stay organized and informed
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              {
                icon: CheckCircle,
                title: "Easy Access",
                desc: "Quick payment history retrieval",
                gradient: "gradient-bg",
              },
              {
                icon: Calendar,
                title: "Clear Records",
                desc: "Year-wise and month-wise tracking",
                gradient: "gradient-accent",
              },
              {
                icon: Lock,
                title: "Secure Login",
                desc: "Protected authentication",
                gradient: "bg-linear-to-br from-orange-500 to-red-500",
              },
              {
                icon: Layout,
                title: "Simple Design",
                desc: "Responsive and intuitive",
                gradient: "bg-linear-to-br from-yellow-500 to-teal-500",
              },
              { icon: Globe, title: "Anytime Access", desc: "Available 24/7", gradient: "gradient-bg" },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-6 card-hover text-center ${isDarkMode ? "glass" : "bg-white border border-gray-200"}`}
              >
                <div
                  className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white ${item.gradient}`}
                >
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 font-alert-card">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Features for Students</h2>
            <p className={`text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Built with your needs in mind</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: "Secure User Access",
                items: ["Safe registration and login", "Personal account protection"],
              },
              {
                icon: CreditCard,
                title: "Payment Transparency",
                items: [
                  "View complete payment history",
                  "Organized by academic year and month",
                  "No confusion, no paperwork",
                ],
              },
              {
                icon: User,
                title: "Student-Centered Design",
                items: ["Simple navigation", "Mobile & desktop friendly", "Easy-to-understand interface"],
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className={`rounded-3xl p-8 card-hover ${isDarkMode ? "glass" : "bg-white border border-gray-200"}`}
              >
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-white ${idx === 0 ? "gradient-bg" : idx === 1 ? "gradient-accent" : "bg-linear-to-br from-orange-500 to-red-500"}`}
                >
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <ul className="space-y-3">
                  {feature.items.map((item, i) => (
                    <li key={i} className="flex items-start space-x-3">
                      <Check
                        className={`w-5 h-5 mt-1 shrink-0 ${idx === 0 ? "text-cyan-400" : idx === 1 ? "text-yellow-400" : "text-orange-400"}`}
                      />
                      <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        className={`font-alert-card  py-20 ${isDarkMode ? "bg-linear-to-b from-transparent to-gray-800 to-transparent" : "bg-gray-50"}`}
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className={`text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Get started in three simple steps
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="hidden md:flex items-center justify-between relative">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-yellow-400 to-orange-400 transform -translate-y-1/2 z-0"></div>

              {[
                { num: "1", title: "Register or Sign In", desc: "Create your account or log in securely" },
                { num: "2", title: "Access Your Info", desc: "View your personal information dashboard" },
                { num: "3", title: "View Records", desc: "Check payment history anytime" },
              ].map((step, idx) => (
                <div
                  key={idx}
                  className={`rounded-3xl p-8 card-hover text-center relative z-10 w-64 ${isDarkMode ? "glass bg-gray-900" : "bg-white border border-gray-200"}`}
                >
                  <div
                    className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white ${idx === 0 ? "gradient-bg" : idx === 1 ? "gradient-accent" : "bg-gradient-to-br from-orange-500 to-red-500"}`}
                  >
                    {step.num}
                  </div>
                  <h3 className="font-bold mb-2">{step.title}</h3>
                  <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{step.desc}</p>
                </div>
              ))}
            </div>

            <div className="md:hidden space-y-4">
              {[
                { num: "1", title: "Register or Sign In", desc: "Create your account or log in securely" },
                { num: "2", title: "Access Your Info", desc: "View your personal information dashboard" },
                { num: "3", title: "View Records", desc: "Check payment history anytime" },
              ].map((step, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl p-6 card-hover flex items-start space-x-4 ${isDarkMode ? "glass" : "bg-white border border-gray-200"}`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0 text-white ${idx === 0 ? "gradient-bg" : idx === 1 ? "gradient-accent" : "bg-gradient-to-br from-orange-500 to-red-500"}`}
                  >
                    {step.num}
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">{step.title}</h3>
                    <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20 font-alert-card">
        <div className="container mx-auto px-6">
          <div
            className={`max-w-4xl mx-auto rounded-3xl p-12 text-center ${isDarkMode ? "glass" : "bg-white border border-gray-200"}`}
          >
            <div className="w-20 h-20 rounded-full gradient-bg mx-auto mb-6 flex items-center justify-center">
              <Shield className="w-10 h-10 text-white" />
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6">Security You Can Trust</h2>
            <p className={`text-xl mb-8 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              Your information is protected using:
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                { icon: Lock, title: "Encrypted Authentication", desc: "Industry-standard encryption" },
                { icon: UserCheck, title: "Role-Based Access", desc: "Controlled permissions" },
                { icon: Database, title: "Secure Storage", desc: "Protected database systems" },
              ].map((item, idx) => (
                <div key={idx} className={`rounded-xl p-6 ${isDarkMode ? "bg-gray-800/50" : "bg-gray-50"}`}>
                  <item.icon
                    className={`w-8 h-8 mx-auto mb-3 ${idx === 0 ? "text-cyan-400" : idx === 1 ? "text-yellow-400" : "text-orange-400"}`}
                  />
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{item.desc}</p>
                </div>
              ))}
            </div>

            <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
              Only authorized users can access the system.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 relative overflow-hidden font-page-title">
        <div className="hero-gradient absolute inset-0 opacity-30"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-xl md:text-4xl font-bold mb-6">
              Stay informed and organized with SKA Student Manager 2025–26
            </h2>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <button
                className={`cursor-pointer px-10 py-4 rounded-xl glow-hover font-semibold text-lg flex items-center justify-center space-x-2 text-white ${isDarkMode ? "gradient-bg" : "bg-linear-to-br from-slate-700 to-teal-600"}`}
              >
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </button>
              <button
                className={`cursor-pointer px-10 py-4 rounded-xl glow-hover font-semibold text-lg flex items-center justify-center space-x-2 text-white ${isDarkMode ? "gradient-accent" : "bg-linear-to-br from-teal-500 to-yellow-500"}`}
                onClick={() => navigate("/register")}
              >
                <UserPlus className="w-5 h-5" />
                <span>Register</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-8 ${isDarkMode ? "glass" : "bg-gray-100 border-t border-gray-200"}`}>
        <div className="container mx-auto px-6 text-center">
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
            © 2025–26 SKA Student Manager. All rights reserved.
          </p>
          <p className={`text-sm mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Secure · Transparent · Student-Centered
          </p>
        </div>
      </footer>


    </div>
  )
}
