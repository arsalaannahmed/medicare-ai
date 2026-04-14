import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Building2, Bell, Info, ArrowRight, Shield, Brain, MapPin } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: 'AI Health Checker',
      description: 'Get instant AI-powered health assessments. Describe your symptoms and receive structured medical guidance.',
      path: '/health-check',
      color: 'bg-blue-600',
    },
    {
      icon: MapPin,
      title: 'Hospital Finder',
      description: 'Locate real hospitals and clinics in Nagpur with detailed information, ratings, and directions.',
      path: '/hospitals',
      color: 'bg-emerald-600',
    },
    {
      icon: Bell,
      title: 'Smart Reminders',
      description: 'Set medicine and appointment reminders with browser notifications to never miss a dose.',
      path: '/reminders',
      color: 'bg-amber-600',
    },
    {
      icon: Info,
      title: 'About MediCare',
      description: 'Learn about the platform, its purpose, and the team behind this community engagement project.',
      path: '/about',
      color: 'bg-purple-600',
    },
  ];

  const stats = [
    { value: '150+', label: 'Medical Facilities' },
    { value: 'AI', label: 'Powered Analysis' },
    { value: '24/7', label: 'Health Assessment' },
    { value: '100%', label: 'Free to Use' },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 sm:p-12 text-white"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/4" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={16} className="text-blue-200" />
            <span className="text-sm font-medium text-blue-200">AI-Powered Health Platform</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            Your Intelligent Health Companion
          </h1>
          <p className="text-blue-100 text-lg mb-8 leading-relaxed">
            Get AI-powered health assessments, find real medical facilities in Nagpur, and manage your healthcare routine with smart reminders.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/health-check')}
              className="flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
            >
              <Activity size={18} />
              Start Health Check
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate('/hospitals')}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-colors"
            >
              <Building2 size={18} />
              Find Hospitals
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-6 border border-gray-100 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Platform Features</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * i }}
              className="group bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg hover:border-gray-200 transition-all cursor-pointer"
              onClick={() => navigate(feature.path)}
            >
              <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                <feature.icon size={22} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">{feature.description}</p>
              <div className="flex items-center gap-1 text-blue-600 text-sm font-medium group-hover:gap-2 transition-all">
                Explore <ArrowRight size={14} />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white rounded-xl border border-gray-100 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate('/health-check')}
            className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
          >
            Check Symptoms
          </button>
          <button
            onClick={() => navigate('/hospitals')}
            className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors"
          >
            Find Nearby Hospital
          </button>
          <button
            onClick={() => navigate('/reminders')}
            className="px-4 py-2 bg-amber-50 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-100 transition-colors"
          >
            Set Medicine Reminder
          </button>
        </div>
      </motion.div>
    </div>
  );
}
