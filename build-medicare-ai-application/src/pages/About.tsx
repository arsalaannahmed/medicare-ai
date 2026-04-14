import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Info, User, GraduationCap, BookOpen, Target, Shield, Brain, MapPin, Bell } from 'lucide-react';

export default function About() {
  const { aboutContent } = useApp();
  const [clickCount, setClickCount] = useState(0);
  const [lastClick, setLastClick] = useState(0);

  const handleCreatorClick = () => {
    const now = Date.now();
    if (now - lastClick > 2000) {
      setClickCount(1);
    } else {
      setClickCount(prev => prev + 1);
    }
    setLastClick(now);

    if (clickCount + 1 >= 8) {
      window.location.hash = '#admin';
      setClickCount(0);
    }
  };

  const features = [
    { icon: Brain, title: 'AI Health Analysis', desc: 'Get structured medical insights powered by advanced AI for preliminary health assessment.' },
    { icon: MapPin, title: 'Hospital Locator', desc: 'Find 150+ real medical facilities in Nagpur with ratings, specializations, and directions.' },
    { icon: Bell, title: 'Smart Reminders', desc: 'Never miss a dose with browser-based medicine and appointment notifications.' },
    { icon: Shield, title: 'Privacy First', desc: 'Your health data stays on your device. No personal information is stored on servers.' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{aboutContent.title}</h1>
        <p className="text-gray-500 leading-relaxed">{aboutContent.description}</p>
      </motion.div>

      {/* Purpose */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl border border-gray-100 p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Target size={20} className="text-blue-500" />
          Platform Purpose
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">{aboutContent.purpose}</p>
      </motion.div>

      {/* Creator Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl border border-gray-100 p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User size={20} className="text-blue-500" />
          Created By
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <User size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p 
                  className="font-semibold text-gray-900 cursor-default select-none"
                  onClick={handleCreatorClick}
                >
                  {aboutContent.creator}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <GraduationCap size={18} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Course</p>
                <p className="font-semibold text-gray-900">{aboutContent.course}</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <BookOpen size={18} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Semester</p>
                <p className="font-semibold text-gray-900">{aboutContent.semester}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Info size={18} className="text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Project</p>
                <p className="font-semibold text-gray-900">{aboutContent.project}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i + 0.3 }}
              className="bg-white rounded-xl border border-gray-100 p-5"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <f.icon size={18} className="text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-50 border border-gray-200 rounded-xl p-4"
      >
        <p className="text-xs text-gray-500 leading-relaxed">
          Disclaimer: MediCare AI is designed for informational and educational purposes only. The AI-generated health assessments should not be considered as professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider with any questions regarding a medical condition.
        </p>
      </motion.div>
    </div>
  );
}
