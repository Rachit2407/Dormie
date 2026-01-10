"use client";


import React, { useState, useEffect } from 'react';

import { useRouter } from "next/navigation";
import { Home, AlertCircle, Smile, Sparkles, CheckCircle, ChevronRight, Award, Users, Moon, Sun, Coffee, Music, Book, Utensils, Wind } from 'lucide-react';

export default function SurveyPage() {
  const router = useRouter();
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (!loggedIn) {
      router.push("/login");
    }
  }, []);
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    major: '',
    sleepSchedule: '',
    callsFrequency: '',
    cleanlinessLevel: '',
    sharingPersonalItems: '',
    sharingHouseholdItems: '',
    dietaryHabits: '',
    smoke: '',
    drink: '',
    studyEnvironment: '',
    airFresheners: '',
    socialType: '',
    hobbies: []
  });

  const sections = [
    { name: 'Personal Info', icon: Users, color: 'from-blue-500 to-cyan-500' },
    { name: 'Schedule & Sleep', icon: Moon, color: 'from-indigo-500 to-purple-500' },
    { name: 'Cleanliness', icon: Sparkles, color: 'from-purple-500 to-pink-500' },
    { name: 'Habits', icon: Coffee, color: 'from-pink-500 to-rose-500' },
    { name: 'Study', icon: Book, color: 'from-orange-500 to-amber-500' },
    { name: 'Hobbies', icon: Music, color: 'from-green-500 to-emerald-500' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (hobby) => {
    setFormData(prev => ({
      ...prev,
      hobbies: prev.hobbies.includes(hobby)
        ? prev.hobbies.filter(h => h !== hobby)
        : [...prev.hobbies, hobby]
    }));
  };

  const progress = ((currentSection + 1) / sections.length) * 100;
  const CurrentIcon = sections[currentSection].icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob top-0 -left-20"></div>
        <div className="absolute w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 top-0 right-0"></div>
        <div className="absolute w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 bottom-0 left-20"></div>
      </div>

      <div className="absolute inset-0 pointer-events-none opacity-10">
        <Users className="absolute w-16 h-16 text-blue-500 animate-float-slow" style={{ top: '10%', left: '5%' }} />
        <Moon className="absolute w-12 h-12 text-indigo-500 animate-float-delayed" style={{ top: '20%', right: '10%' }} />
        <Sparkles className="absolute w-14 h-14 text-purple-500 animate-float-slow" style={{ top: '60%', left: '15%' }} />
        <Coffee className="absolute w-10 h-10 text-pink-500 animate-float-delayed" style={{ top: '70%', right: '20%' }} />
      </div>

      <nav className="relative z-10 backdrop-blur-md bg-white/80 border-b border-white/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative">
                <Home className="w-7 h-7 text-blue-600 relative transform group-hover:scale-110 transition-all duration-300" />
                <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-yellow-400 animate-pulse" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Roommate Finder
              </span>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in-down">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Award className="w-4 h-4 text-yellow-500 animate-pulse" />
              Progress
            </span>
            <span className="text-sm font-semibold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="h-4 bg-white/50 backdrop-blur-sm rounded-full overflow-hidden shadow-inner relative">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center animate-bounce-slow">
                <Sparkles className="w-3 h-3 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex overflow-x-auto pb-4 mb-6 space-x-2 scrollbar-hide animate-fade-in">
          {sections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <button
                key={idx}
                onClick={() => setCurrentSection(idx)}
                className={`flex-shrink-0 px-4 py-3 rounded-2xl font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
                  currentSection === idx
                    ? `bg-gradient-to-r ${section.color} text-white shadow-xl scale-110`
                    : currentSection > idx
                    ? 'bg-green-100 text-green-700'
                    : 'bg-white/70 text-gray-600'
                }`}
              >
                {currentSection > idx && <CheckCircle className="w-4 h-4" />}
                {currentSection === idx && <Icon className="w-4 h-4 animate-pulse" />}
                <span>{section.name}</span>
              </button>
            );
          })}
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50 animate-fade-in-up relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-200 to-purple-300 opacity-10 rounded-full blur-3xl"></div>

          <div className="text-center mb-8 relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-3xl mb-4 animate-bounce-slow shadow-2xl relative">
              <CurrentIcon className="w-10 h-10 text-white relative z-10" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
              Dorm Mate Survey
            </h1>
            <p className="text-gray-600 flex items-center justify-center gap-2">
              <Smile className="w-5 h-5 text-yellow-500 animate-bounce" />
              Answer honestly for best matches!
            </p>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-300 rounded-2xl p-4 mb-8 flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 animate-pulse" />
            <p className="text-sm text-orange-800 font-medium">
              You must be logged in to create or edit a profile.
            </p>
          </div>

          <div className="space-y-6 relative z-10">
            {currentSection === 0 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <span className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl flex items-center justify-center text-sm">1</span>
                  Personal Info
                </h2>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Your Name"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    placeholder="Age"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
                  />
                  <input
                    type="text"
                    value={formData.major}
                    onChange={(e) => handleInputChange('major', e.target.value)}
                    placeholder="Major"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all"
                  />
                </div>
              </div>
            )}

            {currentSection === 1 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <span className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl flex items-center justify-center text-sm">2</span>
                  Schedule & Sleep
                </h2>
                <div>
                  <label className="block text-gray-700 font-semibold mb-3">Sleep Schedule</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Before 10 PM', '10 PM - 12 AM', 'After 12 AM', 'Flexible'].map((option) => (
                      <label key={option} className={`flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.sleepSchedule === option ? 'border-indigo-500 bg-indigo-50 shadow-lg' : 'border-gray-200 hover:border-gray-300'}`}>
                        <input
                          type="radio"
                          name="sleepSchedule"
                          value={option}
                          checked={formData.sleepSchedule === option}
                          onChange={(e) => handleInputChange('sleepSchedule', e.target.value)}
                          className="w-5 h-5 text-indigo-600"
                        />
                        <span className="font-medium">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentSection === 2 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <span className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl flex items-center justify-center text-sm">3</span>
                  Cleanliness
                </h2>
                <select
                  value={formData.cleanlinessLevel}
                  onChange={(e) => handleInputChange('cleanlinessLevel', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
                >
                  <option value="">Select cleanliness level</option>
                  <option value="Very Clean">Very Clean</option>
                  <option value="Moderately Clean">Moderately Clean</option>
                  <option value="Casual">Casual</option>
                </select>
              </div>
            )}

            {currentSection === 3 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <span className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl flex items-center justify-center text-sm">4</span>
                  Habits
                </h2>
                <select
                  value={formData.dietaryHabits}
                  onChange={(e) => handleInputChange('dietaryHabits', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all"
                >
                  <option value="">Dietary Habits</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                </select>
              </div>
            )}

            {currentSection === 4 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <span className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl flex items-center justify-center text-sm">5</span>
                  Study Preferences
                </h2>
                <div className="space-y-3">
                  {['Completely quiet', 'Soft music', "Doesn't matter"].map((option) => (
                    <label key={option} className={`flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.studyEnvironment === option ? 'border-orange-500 bg-orange-50 shadow-lg' : 'border-gray-200'}`}>
                      <input
                        type="radio"
                        name="studyEnvironment"
                        value={option}
                        checked={formData.studyEnvironment === option}
                        onChange={(e) => handleInputChange('studyEnvironment', e.target.value)}
                        className="w-5 h-5 text-orange-600"
                      />
                      <span className="font-medium">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {currentSection === 5 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <span className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl flex items-center justify-center text-sm">6</span>
                  Hobbies
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {['Music', 'Gaming', 'Reading', 'Exercise', 'Cooking', 'Movies'].map((hobby) => (
                    <label key={hobby} className={`flex items-center space-x-2 p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.hobbies.includes(hobby) ? 'border-green-500 bg-green-50 shadow-lg' : 'border-gray-200'}`}>
                      <input
                        type="checkbox"
                        checked={formData.hobbies.includes(hobby)}
                        onChange={() => handleCheckboxChange(hobby)}
                        className="w-5 h-5 text-green-600 rounded"
                      />
                      <span className="font-medium">{hobby}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
              disabled={currentSection === 0}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${currentSection === 0 ? 'bg-gray-100 text-gray-400' : 'bg-white border-2 border-gray-300 hover:shadow-lg transform hover:scale-105'}`}
            >
              ← Previous
            </button>
            
            {currentSection < sections.length - 1 ? (
              <button
                onClick={() => setCurrentSection(currentSection + 1)}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
              >
                <span>Next</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
              onClick={() => {
                localStorage.setItem("surveyCompleted", "true");
                localStorage.setItem("surveyData", JSON.stringify(formData));
                router.push("/dashboard");
              }}
              
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Submit</span>
              </button>
            )}
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
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(10deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-25px); }
        }
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-fade-in-down { animation: fade-in-down 0.6s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out; }
        .animate-fade-in { animation: fade-in 0.4s ease-out; }
        .animate-bounce-slow { animation: bounce-slow 3s infinite; }
        .animate-float-slow { animation: float-slow 8s infinite; }
        .animate-float-delayed { animation: float-delayed 10s infinite; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}