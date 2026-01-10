"use client";


import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { Home, Search, User, MessageSquare, Settings, LogOut, Filter, Heart, X, MapPin, BookOpen, Calendar, Phone, Mail, Award, Sparkles, TrendingUp, Users, Zap } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    const surveyDone = localStorage.getItem("surveyCompleted");
  
    if (!loggedIn) {
      router.push("/login");
    } else if (!surveyDone) {
      router.push("/survey");
    }
  }, []);
  
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [likedProfiles, setLikedProfiles] = useState([]);

  const matches = [
    {
      id: 1,
      name: "Rahul Sharma",
      age: 20,
      major: "Computer Science",
      year: "2nd Year",
      compatibility: 95,
      budget: "₹8,000-10,000",
      location: "Near Campus Gate 2",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      preferences: {
        sleepSchedule: "10 PM - 12 AM",
        cleanliness: "Very Clean",
        studyEnvironment: "Completely quiet",
        smoke: "No",
        drink: "Occasionally",
        dietary: "Vegetarian"
      },
      hobbies: ["Gaming", "Coding", "Music"],
      contact: {
        phone: "+91 98765 43210",
        email: "rahul.sharma@college.edu"
      }
    },
    {
      id: 2,
      name: "Priya Patel",
      age: 19,
      major: "Mechanical Engineering",
      year: "1st Year",
      compatibility: 92,
      budget: "₹7,000-9,000",
      location: "Campus Hostel Block A",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      preferences: {
        sleepSchedule: "Before 10 PM",
        cleanliness: "Moderately Clean",
        studyEnvironment: "Soft background music",
        smoke: "No",
        drink: "No",
        dietary: "Vegetarian"
      },
      hobbies: ["Reading", "Cooking", "Exercise"],
      contact: {
        phone: "+91 98765 43211",
        email: "priya.patel@college.edu"
      }
    },
    {
      id: 3,
      name: "Arjun Singh",
      age: 21,
      major: "Electrical Engineering",
      year: "3rd Year",
      compatibility: 88,
      budget: "₹6,000-8,000",
      location: "Off-Campus Apartment",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      preferences: {
        sleepSchedule: "After 12 AM",
        cleanliness: "Casual",
        studyEnvironment: "Doesn't matter",
        smoke: "No",
        drink: "Yes",
        dietary: "Non-Vegetarian"
      },
      hobbies: ["Gaming", "Movies", "Exercise"],
      contact: {
        phone: "+91 98765 43212",
        email: "arjun.singh@college.edu"
      }
    },
    {
      id: 4,
      name: "Sneha Gupta",
      age: 20,
      major: "Biotechnology",
      year: "2nd Year",
      compatibility: 90,
      budget: "₹7,500-9,500",
      location: "Girls Hostel Block C",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      preferences: {
        sleepSchedule: "10 PM - 12 AM",
        cleanliness: "Very Clean",
        studyEnvironment: "Completely quiet",
        smoke: "No",
        drink: "No",
        dietary: "Vegetarian"
      },
      hobbies: ["Reading", "Music", "Cooking"],
      contact: {
        phone: "+91 98765 43213",
        email: "sneha.gupta@college.edu"
      }
    },
    {
      id: 5,
      name: "Vikram Reddy",
      age: 22,
      major: "MBA",
      year: "1st Year",
      compatibility: 85,
      budget: "₹9,000-12,000",
      location: "Premium Hostel",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
      preferences: {
        sleepSchedule: "After 12 AM",
        cleanliness: "Moderately Clean",
        studyEnvironment: "Soft background music",
        smoke: "Occasionally",
        drink: "Yes",
        dietary: "Non-Vegetarian"
      },
      hobbies: ["Exercise", "Movies", "Gaming"],
      contact: {
        phone: "+91 98765 43214",
        email: "vikram.reddy@college.edu"
      }
    },
    {
      id: 6,
      name: "Ananya Desai",
      age: 19,
      major: "Architecture",
      year: "1st Year",
      compatibility: 87,
      budget: "₹8,000-10,000",
      location: "Near Library",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
      preferences: {
        sleepSchedule: "Before 10 PM",
        cleanliness: "Very Clean",
        studyEnvironment: "Completely quiet",
        smoke: "No",
        drink: "Occasionally",
        dietary: "Vegetarian"
      },
      hobbies: ["Reading", "Music", "Exercise"],
      contact: {
        phone: "+91 98765 43215",
        email: "ananya.desai@college.edu"
      }
    }
  ];

  const toggleLike = (id) => {
    setLikedProfiles(prev => 
      prev.includes(id) ? prev.filter(profileId => profileId !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob top-0 -left-20"></div>
        <div className="absolute w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 top-0 right-0"></div>
        <div className="absolute w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 bottom-0 left-20"></div>
      </div>

      <nav className="relative z-50 backdrop-blur-md bg-white/80 border-b border-white/50 shadow-lg sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative">
                <Home className="w-7 h-7 text-blue-600 transform group-hover:scale-110 transition-transform duration-300" />
                <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-yellow-400 animate-pulse" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Roommate Finder
              </span>
            </div>
            
            <div className="hidden md:flex space-x-6">
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-all duration-300 hover:scale-105 font-medium flex items-center space-x-1">
                <Home className="w-4 h-4" />
                <span>Home</span>
              </a>
              <a href="#" className="text-gray-700 hover:text-purple-600 transition-all duration-300 hover:scale-105 font-medium flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>Profile</span>
              </a>
              <a href="#" className="text-gray-700 hover:text-pink-600 transition-all duration-300 hover:scale-105 font-medium flex items-center space-x-1">
                <MessageSquare className="w-4 h-4" />
                <span>Messages</span>
              </a>
            </div>

            <div className="flex items-center space-x-3">
              <button className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 transform hover:scale-110">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
              <button
  onClick={() => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("surveyCompleted");
    localStorage.removeItem("surveyData");
    router.push("/login");
  }}
  className="p-2 hover:bg-red-50 rounded-xl transition-all duration-300 transform hover:scale-110"
>
  <LogOut className="w-5 h-5 text-red-600" />
</button>

            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in-down">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Your Perfect Matches
              </h1>
              <p className="text-gray-600 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span>Based on your preferences & compatibility</span>
              </p>
            </div>
            <div className="hidden md:flex space-x-4">
              <div className="bg-white/80 backdrop-blur-md rounded-2xl px-6 py-3 shadow-lg border border-white/50">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {matches.length}
                </div>
                <div className="text-xs text-gray-600">Total Matches</div>
              </div>
              <div className="bg-white/80 backdrop-blur-md rounded-2xl px-6 py-3 shadow-lg border border-white/50">
                <div className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
                  {likedProfiles.length}
                </div>
                <div className="text-xs text-gray-600">Favorites</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-6 mb-6 border border-white/50 animate-fade-in">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex items-center border-2 border-gray-200 rounded-xl px-4 py-3 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 transition-all duration-300 hover:border-gray-300 group">
              <Search className="w-5 h-5 text-gray-400 mr-2 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Search by name, major, or location..."
                className="w-full outline-none bg-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Filter className="w-5 h-5" />
              <span className="font-semibold">Filters</span>
            </button>
          </div>

          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Budget Range</label>
                <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300">
                  <option>Any</option>
                  <option>₹5,000 - ₹7,000</option>
                  <option>₹7,000 - ₹9,000</option>
                  <option>₹9,000 - ₹12,000</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300">
                  <option>Any</option>
                  <option>Campus Hostel</option>
                  <option>Off-Campus</option>
                  <option>Near Campus</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Year</label>
                <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all duration-300">
                  <option>Any</option>
                  <option>1st Year</option>
                  <option>2nd Year</option>
                  <option>3rd Year</option>
                  <option>4th Year</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match, idx) => (
            <div
              key={match.id}
              className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer border border-white/50 group animate-fade-in-up"
              style={{ animationDelay: `${idx * 100}ms` }}
              onClick={() => setSelectedMatch(match)}
            >
              <div className="relative overflow-hidden">
                <img
                  src={match.image}
                  alt={match.name}
                  className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 right-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-1 shadow-lg animate-bounce-slow">
                  <Award className="w-4 h-4" />
                  <span>{match.compatibility}%</span>
                </div>
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-lg">
                  {match.year}
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">{match.name}</h3>
                  <p className="text-gray-600 text-sm">{match.age} years</p>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600 text-sm group/item">
                    <BookOpen className="w-4 h-4 mr-2 text-blue-500 group-hover/item:scale-110 transition-transform" />
                    <span>{match.major}</span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm group/item">
                    <MapPin className="w-4 h-4 mr-2 text-purple-500 group-hover/item:scale-110 transition-transform" />
                    <span>{match.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm group/item">
                    <Calendar className="w-4 h-4 mr-2 text-pink-500 group-hover/item:scale-110 transition-transform" />
                    <span className="font-semibold text-gray-800">{match.budget}/month</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {match.hobbies.slice(0, 3).map((hobby, idx) => (
                    <span
                      key={idx}
                      className="bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-200"
                    >
                      {hobby}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
                    View Profile
                  </button>
                  <button className="px-4 py-3 border-2 border-blue-500 text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-300 transform hover:scale-105">
                    <MessageSquare className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleLike(match.id); }}
                    className={`px-4 py-3 border-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                      likedProfiles.includes(match.id)
                        ? 'bg-red-500 border-red-500 text-white'
                        : 'border-red-500 text-red-500 hover:bg-red-50'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${likedProfiles.includes(match.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedMatch && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 flex justify-between items-center rounded-t-3xl">
              <h2 className="text-2xl font-bold">Profile Details</h2>
              <button
                onClick={() => setSelectedMatch(null)}
                className="p-2 hover:bg-white/20 rounded-full transition-all duration-300 transform hover:scale-110 hover:rotate-90"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8">
              <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="relative group">
                  <img
                    src={selectedMatch.image}
                    alt={selectedMatch.name}
                    className="w-64 h-64 object-cover rounded-2xl shadow-xl"
                  />
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 rounded-full font-bold flex items-center space-x-1 shadow-lg">
                    <Award className="w-5 h-5" />
                    <span>{selectedMatch.compatibility}% Match</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="mb-6">
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                      {selectedMatch.name}
                    </h3>
                    <p className="text-gray-600 text-lg">{selectedMatch.age} years • {selectedMatch.year}</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-700 p-3 bg-blue-50 rounded-xl">
                      <BookOpen className="w-5 h-5 mr-3 text-blue-600" />
                      <span className="font-medium">{selectedMatch.major}</span>
                    </div>
                    <div className="flex items-center text-gray-700 p-3 bg-purple-50 rounded-xl">
                      <MapPin className="w-5 h-5 mr-3 text-purple-600" />
                      <span className="font-medium">{selectedMatch.location}</span>
                    </div>
                    <div className="flex items-center text-gray-700 p-3 bg-pink-50 rounded-xl">
                      <Calendar className="w-5 h-5 mr-3 text-pink-600" />
                      <span className="font-semibold">{selectedMatch.budget}/month</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {selectedMatch.hobbies.map((hobby, idx) => (
                      <span
                        key={idx}
                        className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium border border-blue-300"
                      >
                        {hobby}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-8 mb-8">
                <h4 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <Zap className="w-6 h-6 mr-2 text-yellow-500" />
                  Preferences & Lifestyle
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries({
                    "Sleep Schedule": selectedMatch.preferences.sleepSchedule,
                    "Cleanliness": selectedMatch.preferences.cleanliness,
                    "Study Environment": selectedMatch.preferences.studyEnvironment,
                    "Dietary Habits": selectedMatch.preferences.dietary,
                    "Smoking": selectedMatch.preferences.smoke,
                    "Drinking": selectedMatch.preferences.drink
                  }).map(([key, value]) => (
                    <div key={key} className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300">
                      <p className="text-sm text-gray-600 mb-1 font-medium">{key}</p>
                      <p className="font-bold text-gray-800">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-8">
                <h4 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <Users className="w-6 h-6 mr-2 text-blue-500" />
                  Contact Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-700 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                    <Phone className="w-5 h-5 mr-3 text-blue-600" />
                    <span className="font-medium">{selectedMatch.contact.phone}</span>
                  </div>
                  <div className="flex items-center text-gray-700 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
                    <Mail className="w-5 h-5 mr-3 text-purple-600" />
                    <span className="font-medium">{selectedMatch.contact.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Send Message</span>
                </button>
                <button 
                  onClick={() => toggleLike(selectedMatch.id)}
                  className={`flex-1 py-4 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2 ${
                    likedProfiles.includes(selectedMatch.id)
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-gradient-to-r from-pink-500 to-red-500 text-white hover:from-pink-600 hover:to-red-600'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${likedProfiles.includes(selectedMatch.id) ? 'fill-current' : ''}`} />
                  <span>{likedProfiles.includes(selectedMatch.id) ? 'Remove from Favorites' : 'Add to Favorites'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-fade-in-down { animation: fade-in-down 0.6s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        .animate-scale-in { animation: scale-in 0.3s ease-out; }
        .animate-bounce-slow { animation: bounce-slow 2s infinite; }
      `}</style>
    </div>
  );
}