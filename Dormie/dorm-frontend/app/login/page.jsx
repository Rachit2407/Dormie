"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  Home,
  Eye,
  EyeOff,
  Sparkles,
  Users,
  Shield,
  Star,
  Zap,
  Heart,
  X,
  Mail,
  KeyRound,
  CheckCircle,
  RefreshCw,
  ArrowRight,
  ArrowLeft // Added ArrowLeft
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Hydration Fix
  const [isMounted, setIsMounted] = useState(false);

  // --- MAIN FORM STATES ---
  const [isSignup, setIsSignup] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // --- MODAL STATES ---
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false); 
  
  // --- FORGOT PASSWORD STATES (3-Step Flow) ---
  const [forgotStep, setForgotStep] = useState(1); // 1 = Email, 2 = Verify OTP, 3 = New Password
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [resetToken, setResetToken] = useState(""); 
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // Verify Account Field & Timer
  const [verifyOtp, setVerifyOtp] = useState("");
  const [otpTimer, setOtpTimer] = useState(0); 

  // UX / Loading
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // --- TIMER LOGIC ---
  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // --- VALIDATION ---
  const validateMainForm = () => {
    const newErrors = {};
    if (isSignup) {
      if (!name.trim()) newErrors.name = "Name is required";
      if (!email.trim()) newErrors.email = "Email is required";
      else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Enter a valid email";
      if (!password) newErrors.password = "Password is required";
      if (!confirmPassword) newErrors.confirmPassword = "Please confirm password";
      if (password && confirmPassword && password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    } else {
      if (!email.trim()) newErrors.email = "Email is required";
      if (!password) newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- API HANDLERS ---

  // 1. SEND OTP (Standalone for Signup Verification)
  const handleSendVerifyOtp = async (targetEmail) => {
    try {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: targetEmail }),
      };

      const res = await fetch(`${apiBase}/send_otp`, requestOptions);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to send OTP");
      }
      setOtpTimer(60); 
      return true;
    } catch (err) {
      setErrors((prev) => ({ ...prev, verifyForm: "Could not send OTP. Try again." }));
      return false;
    }
  };

  // 2. LOGIN & SIGNUP
  const handleSubmit = async () => {
    if (!validateMainForm()) return;

    setLoading(true);
    setErrors({});

    const endpoint = isSignup ? "/signup" : "/login";
    const url = `${apiBase}${endpoint}`;
    
    let requestOptions = {};

    if (isSignup) {
      requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: name.trim(), 
          username: email.trim(), 
          password: password 
        }),
      };
    } else {
      const formData = new URLSearchParams();
      formData.append("username", email.trim()); 
      formData.append("password", password);

      requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      };
    }

    try {
      const res = await fetch(url, requestOptions);
      const data = await res.json();

      if (!res.ok) {
        // Verification Check
        if (res.status === 400 && data.detail === 'The user is not verified') {
            await handleSendVerifyOtp(email.trim());
            setShowVerifyModal(true);
            setErrors({ verifyForm: "Account exists but is not verified. We sent a new code." });
            setLoading(false);
            return;
        }
        throw new Error(data.detail || data.message || "Authentication failed");
      }

      if (isSignup) {
        await handleSendVerifyOtp(email.trim());
        setLoading(false);
        setShowVerifyModal(true); 
      } else {
        const token = data.access_token || data.token;
        if (token) {
          localStorage.setItem("token", token);
          router.push("/survey");
        } else {
          throw new Error("Login successful but no token received.");
        }
      }
    } catch (err) {
      console.error("Auth Error:", err);
      setErrors({ form: err.message || "Network error" });
      setLoading(false);
    }
  };

  // 3. VERIFY ACCOUNT
  const handleVerifyAccount = async () => {
    if (!verifyOtp.trim()) return setErrors({ verifyForm: "Please enter the OTP" });
    
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/verify_email?username=${encodeURIComponent(email)}&otp=${encodeURIComponent(verifyOtp)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Verification failed");

      // Auto Login
      const formData = new URLSearchParams();
      formData.append("username", email.trim());
      formData.append("password", password);

      const loginRes = await fetch(`${apiBase}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });

      const loginData = await loginRes.json();

      if (loginRes.ok && (loginData.access_token || loginData.token)) {
        localStorage.setItem("token", loginData.access_token || loginData.token);
        setShowVerifyModal(false);
        router.push("/survey");
      } else {
        setShowVerifyModal(false);
        setIsSignup(false);
        setVerifyOtp("");
        setErrors({ form: "Verification successful! Please log in manually." });
      }

    } catch (err) {
      setErrors({ verifyForm: err.message });
    } finally {
      setLoading(false);
    }
  };

  // --- FORGOT PASSWORD FLOW ---

  // STEP 1
  const handleSendForgotOtp = async () => {
    if (!resetEmail.trim()) return setErrors({ resetForm: "Email is required" });

    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/forgot_password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: resetEmail }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to send OTP");

      setForgotStep(2); 
    } catch (err) {
      setErrors({ resetForm: err.message });
    } finally {
      setLoading(false);
    }
  };

  // STEP 2
  const handleVerifyResetOtp = async () => {
    if (!resetOtp.trim()) return setErrors({ resetForm: "OTP is required" });

    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/reset_password_verify_email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username: resetEmail, 
          otp: resetOtp 
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Invalid OTP");

      const token = data.token || data.reset_token; 
      if (!token) throw new Error("No reset token received");

      setResetToken(token); 
      setForgotStep(3); 
    } catch (err) {
      setErrors({ resetForm: err.message });
    } finally {
      setLoading(false);
    }
  };

  // STEP 3
  const handleFinalReset = async () => {
    if (!newPassword) return setErrors({ resetForm: "New password is required" });
    if (newPassword !== confirmNewPassword) return setErrors({ resetForm: "Passwords do not match" });

    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/reset_password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username: resetEmail, 
          token: resetToken, 
          new_password: newPassword 
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Reset failed");

      setShowForgotModal(false);
      setForgotStep(1);
      setResetEmail(""); setResetOtp(""); setResetToken(""); setNewPassword(""); setConfirmNewPassword("");
      setErrors({ form: "Password reset successful. You can now login." });
    } catch (err) {
      setErrors({ resetForm: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Helpers
  const handleNameChange = (v) => { setName(v); setErrors(p => ({ ...p, name: null, form: null })); };
  const handleEmailChange = (v) => { setEmail(v); setErrors(p => ({ ...p, email: null, form: null })); };
  const handlePasswordChange = (v) => { setPassword(v); setErrors(p => ({ ...p, password: null, form: null })); };
  const handleConfirmChange = (v) => { setConfirmPassword(v); setErrors(p => ({ ...p, confirmPassword: null, form: null })); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-800 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob top-0 -left-4"></div>
        <div className="absolute w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 top-0 right-4"></div>
        <div className="absolute w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 bottom-8 left-20"></div>
      </div>

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {isMounted && [...Array(30)].map((_, i) => (
          <div key={i} className="absolute bg-white rounded-full opacity-20"
            style={{
              width: `${Math.floor(Math.random() * 6) + 2}px`,
              height: `${Math.floor(Math.random() * 6) + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <Heart className="absolute text-pink-300 opacity-20 w-16 h-16 animate-float-slow" style={{ top: "10%", left: "10%" }} />
        <Users className="absolute text-blue-300 opacity-20 w-20 h-20 animate-float-delayed" style={{ top: "20%", right: "15%" }} />
        <Star className="absolute text-yellow-300 opacity-20 w-12 h-12 animate-float-slow" style={{ bottom: "20%", left: "20%" }} />
        <Zap className="absolute text-purple-300 opacity-20 w-14 h-14 animate-float-delayed" style={{ bottom: "30%", right: "10%" }} />
      </div>

      {/* Nav */}
      <nav className="relative z-10 backdrop-blur-md bg-white/10 border-b border-white/20 text-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <Home className="w-7 h-7 relative transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
              <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent animate-gradient">
              Roommate Finder
            </span>
          </div>
        </div>
      </nav>

      {/* --- VERIFY ACCOUNT MODAL --- */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-white/20">
             <button onClick={() => setShowVerifyModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
               <X className="w-6 h-6" />
             </button>

             <div className="text-center mb-6">
               <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
                 <CheckCircle className="w-8 h-8" />
               </div>
               <h2 className="text-2xl font-bold text-gray-800">Verify Account</h2>
               <p className="text-gray-500 text-sm mt-1">We sent a code to <span className="font-semibold text-blue-600">{email}</span></p>
             </div>

             {errors.verifyForm && (
               <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">{errors.verifyForm}</div>
             )}

             <div className="space-y-4">
                <div className="group">
                  <label className="block text-gray-700 font-medium mb-2 text-sm">OTP Code</label>
                  <input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={verifyOtp}
                    onChange={(e) => setVerifyOtp(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all text-black tracking-widest text-center font-mono"
                  />
                </div>
                
                <button
                   onClick={handleVerifyAccount}
                   disabled={loading}
                   className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-70"
                 >
                   {loading ? "Verifying..." : "Verify & Login"}
                </button>

                <div className="text-center mt-2">
                  {otpTimer > 0 ? (
                    <p className="text-gray-400 text-sm flex items-center justify-center gap-1">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      Resend code in <span className="font-semibold text-gray-600">{otpTimer}s</span>
                    </p>
                  ) : (
                    <button 
                      onClick={() => handleSendVerifyOtp(email)}
                      className="w-full py-2 text-gray-500 hover:text-gray-700 text-sm"
                    >
                      Resend OTP Code
                    </button>
                  )}
                </div>
             </div>
          </div>
        </div>
      )}

      {/* --- FORGOT PASSWORD MODAL --- */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-white/20">
             <button onClick={() => { setShowForgotModal(false); setForgotStep(1); setErrors({}); setResetToken(""); }} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
               <X className="w-6 h-6" />
             </button>

             <div className="text-center mb-6">
               <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
                 <KeyRound className="w-8 h-8" />
               </div>
               <h2 className="text-2xl font-bold text-gray-800">
                 {forgotStep === 1 ? "Forgot Password" : forgotStep === 2 ? "Verify Code" : "New Credentials"}
               </h2>
               <p className="text-gray-500 text-sm mt-1">
                 {forgotStep === 1 && "Enter your email to receive a reset OTP."}
                 {forgotStep === 2 && "Enter the OTP code sent to your email."}
                 {forgotStep === 3 && "Create a new strong password."}
               </p>
             </div>

             {errors.resetForm && (
               <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">{errors.resetForm}</div>
             )}

             {/* STEP 1: Email Input */}
             {forgotStep === 1 && (
               <div className="space-y-4">
                 <div className="group">
                    <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-500" />
                      Email Address
                    </label>
                    <input
                        type="email"
                        placeholder="name@example.com"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-black"
                    />
                 </div>
                 <button onClick={handleSendForgotOtp} disabled={loading} className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-70 flex items-center justify-center gap-2">
                   {loading ? "Sending..." : <>Send OTP <ArrowRight className="w-4 h-4" /></>}
                 </button>
               </div>
             )}

             {/* STEP 2: OTP Verification */}
             {forgotStep === 2 && (
               <div className="space-y-4">
                 <div className="group">
                    <label className="block text-gray-700 font-medium mb-2 text-sm">OTP Code</label>
                    <input
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={resetOtp}
                        onChange={(e) => setResetOtp(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all text-black tracking-widest text-center font-mono"
                    />
                 </div>
                 <button onClick={handleVerifyResetOtp} disabled={loading} className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-70">
                   {loading ? "Verifying..." : "Verify Code"}
                 </button>
                 <button onClick={() => setForgotStep(1)} className="w-full py-2 text-gray-500 hover:text-gray-700 text-sm">Change Email</button>
               </div>
             )}

             {/* STEP 3: New Password */}
             {forgotStep === 3 && (
               <div className="space-y-4">
                 <div className="group relative">
                    <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-2">
                      <Shield className="w-4 h-4 text-purple-500" /> New Password
                    </label>
                    <div className="relative">
                        <input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all text-black"
                        />
                        <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                 </div>

                 <div className="group relative">
                    <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-2">
                      <Shield className="w-4 h-4 text-purple-500" /> Confirm New Password
                    </label>
                    <div className="relative">
                        <input
                        type={showConfirmNewPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all text-black"
                        />
                        <button type="button" onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                        {showConfirmNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                 </div>

                 <button onClick={handleFinalReset} disabled={loading} className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-70">
                   {loading ? "Resetting..." : "Reset Password"}
                 </button>
               </div>
             )}
          </div>
        </div>
      )}

      {/* --- MAIN FORM --- */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-72px)] px-4 py-6">
        <div className="w-full max-w-md">
          <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 transform hover:scale-[1.02] transition-all duration-300 animate-fade-in-up border border-white/20">
            
            {/* Corner Blobs */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-600 opacity-10 rounded-bl-full"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-pink-400 to-purple-600 opacity-10 rounded-tr-full"></div>

            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-2xl mb-4 animate-bounce-slow relative shadow-2xl">
                <Users className="w-10 h-10 text-white relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-2xl blur-lg opacity-75 animate-pulse"></div>
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 animate-gradient">
                {isSignup ? "Create an account" : "Welcome Back"}
              </h1>
              <p className="text-gray-600 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-500 animate-spin-slow" />
                {isSignup ? "Sign up to find your ideal roommate." : "Find your perfect roommate match"}
                <Sparkles className="w-4 h-4 text-yellow-500 animate-spin-slow" />
              </p>
            </div>

            <div className="space-y-4 relative z-10">
              {errors.form && (
                <div className={`text-sm px-3 py-2 rounded-md ${!isSignup && errors.form.includes("Authentication") ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"}`}>
                  {errors.form}
                </div>
              )}

              {/* Main Form Inputs */}
              {isSignup && (
                <div className="group">
                  <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-500" /> Name
                  </label>
                  <input type="text" placeholder="Enter your full name" value={name} onChange={(e) => handleNameChange(e.target.value)} className={`w-full px-4 py-3 text-black rounded-xl focus:outline-none focus:ring-4 transition-all ${errors.name ? "border-2 border-red-500 focus:ring-red-200" : "border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-100"}`} />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
              )}

              <div className="group">
                <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" /> Email Address
                </label>
                <input type="email" placeholder="Enter your email address" value={email} onChange={(e) => handleEmailChange(e.target.value)} className={`w-full px-4 py-3 border-2 text-black rounded-xl focus:outline-none focus:ring-4 transition-all ${errors.email ? "border-red-500 focus:ring-red-200" : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"}`} />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div className="group relative">
                <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-500" /> Password
                </label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={(e) => handlePasswordChange(e.target.value)} className={`w-full px-4 py-3 border-2 text-black rounded-xl focus:outline-none focus:ring-4 transition-all ${errors.password ? "border-red-500 focus:ring-red-200" : "border-gray-200 focus:border-purple-500 focus:ring-purple-100"}`} />
                  <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 hover:scale-110 transition-transform">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              {isSignup && (
                <div className="group relative">
                  <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-2">
                    <Shield className="w-4 h-4 text-purple-500" /> Confirm Password
                  </label>
                  <div className="relative">
                    <input type={showConfirmPassword ? "text" : "password"} placeholder="Re-enter your password" value={confirmPassword} onChange={(e) => handleConfirmChange(e.target.value)} className={`w-full px-4 py-3 text-black rounded-xl focus:outline-none focus:ring-4 transition-all ${errors.confirmPassword ? "border-2 border-red-500 focus:ring-red-200" : "border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-100"}`} />
                    <button type="button" onClick={() => setShowConfirmPassword((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 hover:scale-110 transition-transform">
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all" />
                  <span className="text-gray-600 group-hover:text-gray-800 transition-colors">Remember me</span>
                </label>
                {/* CONDITIONAL: Forgot Password only shown on Login */}
                {!isSignup && (
                  <button type="button" onClick={() => setShowForgotModal(true)} className="text-blue-600 hover:text-blue-700 font-medium transition-all duration-300 hover:scale-105 relative group">
                    Forgot password?
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                  </button>
                )}
              </div>

              <button onClick={handleSubmit} disabled={loading} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className={`relative w-full ${loading ? "opacity-70 cursor-not-allowed" : ""} bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold overflow-hidden group shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]`}>
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <span>{loading ? "Processing..." : isSignup ? "Create Account" : "Login to Continue"}</span>
                  {!loading && isHovered && <Sparkles className="w-5 h-5 animate-spin" />}
                  {!loading && <Zap className={`w-5 h-5 ${isHovered ? "animate-bounce" : ""}`} />}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              {/* NEW STYLE TOGGLE BUTTON */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignup(!isSignup);
                    setErrors({});
                    setPassword("");
                    setConfirmPassword("");
                  }}
                  className="w-full py-3 border-2 border-gray-200/50 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  {isSignup ? (
                    <>
                      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                      Back to Login
                    </>
                  ) : (
                    <>
                      Create an Account
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
          <div className="h-4" />
        </div>
      </div>

      <style jsx global>{`
        @keyframes blob { 0%, 100% { transform: translate(0, 0) scale(1); } 25% { transform: translate(20px, -50px) scale(1.1); } 50% { transform: translate(-20px, 20px) scale(0.9); } 75% { transform: translate(50px, 50px) scale(1.05); } }
        @keyframes float { 0%, 100% { transform: translateY(0px); opacity: 0.2; } 50% { transform: translateY(-20px); opacity: 0.5; } }
        @keyframes float-slow { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-30px) rotate(10deg); } }
        @keyframes float-delayed { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-25px) rotate(-10deg); } }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        @keyframes gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out; }
        .animate-bounce-slow { animation: bounce-slow 3s infinite; }
        .animate-float-slow { animation: float-slow 8s infinite; }
        .animate-float-delayed { animation: float-delayed 10s infinite; }
        .animate-gradient { background-size: 200% 200%; animation: gradient 3s ease infinite; }
        .animate-spin-slow { animation: spin-slow 3s linear infinite; }
      `}</style>
    </div>
  );
}