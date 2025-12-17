"use client";


import React, { useState } from 'react';
import { useRouter } from "next/navigation";

import { Home, Eye, EyeOff, Sparkles, Users, Shield, Star, Zap, Heart, TrendingUp } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const handleLogin = () => {
    if (!username || !password) {
      alert("Please enter username and password");
      return;
    }
  
    localStorage.setItem("isLoggedIn", "true");
    router.push("/survey");
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-800 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob top-0 -left-4"></div>
        <div className="absolute w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 top-0 right-4"></div>
        <div className="absolute w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 bottom-8 left-20"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full opacity-20"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          ></div>
        ))}
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <Heart className="absolute text-pink-300 opacity-20 w-16 h-16 animate-float-slow" style={{ top: '10%', left: '10%' }} />
        <Users className="absolute text-blue-300 opacity-20 w-20 h-20 animate-float-delayed" style={{ top: '20%', right: '15%' }} />
        <Star className="absolute text-yellow-300 opacity-20 w-12 h-12 animate-float-slow" style={{ bottom: '20%', left: '20%' }} />
        <Zap className="absolute text-purple-300 opacity-20 w-14 h-14 animate-float-delayed" style={{ bottom: '30%', right: '10%' }} />
      </div>

      {/* Navigation Bar */}
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
          <div className="hidden md:flex space-x-6">
            <a href="#" className="relative group">
              <span className="hover:text-blue-300 transition-all duration-300 hover:scale-105 font-medium">Login</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#" className="relative group">
              <span className="hover:text-purple-300 transition-all duration-300 hover:scale-105 font-medium">Profile</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#" className="relative group">
              <span className="hover:text-pink-300 transition-all duration-300 hover:scale-105 font-medium">Home</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-400 group-hover:w-full transition-all duration-300"></span>
            </a>
          </div>
        </div>
      </nav>

      {/* Login Form */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-72px)] px-4 py-12">
        <div className="w-full max-w-md">
          {/* Floating Badge */}
          <div className="text-center mb-8 animate-fade-in-down">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-white mb-4 hover:bg-white/20 transition-all duration-300 cursor-pointer group">
              <Shield className="w-4 h-4 text-green-400 animate-pulse" />
              <span className="text-sm">Secure & Private Platform</span>
              <Star className="w-3 h-3 text-yellow-400 group-hover:rotate-180 transition-transform duration-500" />
            </div>
          </div>

          <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 transform hover:scale-[1.02] transition-all duration-300 animate-fade-in-up border border-white/20">
            {/* Decorative corner elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-600 opacity-10 rounded-bl-full"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-pink-400 to-purple-600 opacity-10 rounded-tr-full"></div>
            
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-2xl mb-4 animate-bounce-slow relative shadow-2xl">
                <Users className="w-10 h-10 text-white relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-2xl blur-lg opacity-75 animate-pulse"></div>
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 animate-gradient">
                Welcome Back
              </h1>
              <p className="text-gray-600 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-500 animate-spin-slow" />
                Find your perfect roommate match
                <Sparkles className="w-4 h-4 text-yellow-500 animate-spin-slow" />
              </p>
            </div>

            <div className="space-y-6 relative z-10">
              <div className="group">
                <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 group-hover:border-gray-300 group-hover:shadow-md"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-5 rounded-xl transition-opacity pointer-events-none"></div>
                </div>
              </div>

              <div className="group relative">
                <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-500" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 group-hover:border-gray-300 group-hover:shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-all duration-300 hover:scale-110"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 opacity-0 group-hover:opacity-5 rounded-xl transition-opacity pointer-events-none"></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <div className="relative">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all" />
                    <div className="absolute inset-0 bg-blue-500 rounded opacity-0 group-hover:opacity-10 transition-opacity"></div>
                  </div>
                  <span className="text-gray-600 group-hover:text-gray-800 transition-colors">Remember me</span>
                </label>
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium transition-all duration-300 hover:scale-105 relative group">
                  Forgot password?
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                </a>
              </div>

              <button
                onClick={handleLogin}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="relative w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold overflow-hidden group shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <span>Login to Continue</span>
                  {isHovered && <Sparkles className="w-5 h-5 animate-spin" />}
                  <Zap className={`w-5 h-5 ${isHovered ? 'animate-bounce' : ''}`} />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 animate-shimmer"></div>
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="relative flex items-center justify-center space-x-2 border-2 border-gray-200 rounded-xl py-3 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 hover:border-blue-300 transition-all duration-300 transform hover:scale-105 group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full group-hover:animate-pulse relative z-10"></div>
                  <span className="font-medium text-gray-700 relative z-10">Google</span>
                </button>
                <button className="relative flex items-center justify-center space-x-2 border-2 border-gray-200 rounded-xl py-3 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 hover:border-purple-300 transition-all duration-300 transform hover:scale-105 group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full group-hover:animate-pulse relative z-10"></div>
                  <span className="font-medium text-gray-700 relative z-10">College ID</span>
                </button>
              </div>

              <p className="text-center text-gray-700 mt-6">
                Don't have an account?{' '}
                <a href="#" className="relative text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text font-bold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 group inline-flex items-center gap-1">
                  Sign Up Now 
                  <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mt-8 animate-fade-in-up animation-delay-300">
            {[
              { label: '10K+', subtitle: 'Students', icon: Users, color: 'from-blue-500 to-blue-600' },
              { label: '5K+', subtitle: 'Matches', icon: Heart, color: 'from-purple-500 to-purple-600' },
              { label: '98%', subtitle: 'Satisfied', icon: TrendingUp, color: 'from-pink-500 to-pink-600' }
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-110 group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity" style={{ backgroundImage: `linear-gradient(to bottom right, ${stat.color})` }}></div>
                  <Icon className={`w-6 h-6 mx-auto mb-2 opacity-80 group-hover:scale-110 transition-transform bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                  <div className="text-3xl font-bold mb-1 group-hover:scale-110 transition-transform">{stat.label}</div>
                  <div className="text-xs opacity-80">{stat.subtitle}</div>
                  <div className="absolute inset-0 rounded-2xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              );
            })}
          </div>

          {/* Testimonial Carousel */}
          <div className="mt-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white animate-fade-in-up animation-delay-600">
            <div className="flex items-center space-x-3 mb-3">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                ))}
              </div>
            </div>
            <p className="text-sm italic mb-3">"Found my perfect roommate in just 2 days! The compatibility matching is incredibly accurate."</p>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center font-bold">A</div>
              <div>
                <div className="font-semibold text-sm">Aarav Sharma</div>
                <div className="text-xs opacity-80">IIT Delhi, 2nd Year</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); opacity: 0.2; }
          50% { transform: translateY(-20px); opacity: 0.5; }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(10deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(-10deg); }
        }
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        .animate-fade-in-down { animation: fade-in-down 0.6s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out; }
        .animate-bounce-slow { animation: bounce-slow 3s infinite; }
        .animate-float-slow { animation: float-slow 8s infinite; }
        .animate-float-delayed { animation: float-delayed 10s infinite; }
        .animate-gradient { 
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animate-spin-slow { animation: spin-slow 3s linear infinite; }
        .animate-shimmer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}