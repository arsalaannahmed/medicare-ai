import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { nagpurHospitals } from '../data/hospitals';
import {
  Lock, Building2, Info, List, Plus, Edit3, Trash2, Save, X, LogOut, Shield
} from 'lucide-react';
import type { Hospital, HealthSuggestion, AboutContent } from '../context/AppContext';

export default function Admin() {
  const navigate = useNavigate();
  const {
    hospitals, setHospitals,
    healthSuggestions, setHealthSuggestions,
    aboutContent, setAboutContent,
    isAdminLoggedIn, setIsAdminLoggedIn,
  } = useApp();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'hospitals' | 'about' | 'suggestions'>('hospitals');

  // Hospital editing state
  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);
  const [showHospitalForm, setShowHospitalForm] = useState(false);
  const [hospitalForm, setHospitalForm] = useState<Partial<Hospital>>({});

  // About editing state
  const [aboutForm, setAboutForm] = useState<AboutContent>(aboutContent);

  // Suggestion editing state
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);
  const [suggestionForm, setSuggestionForm] = useState({ name: '', category: '' });

  useEffect(() => {
    if (hospitals.length === 0) {
      setHospitals(nagpurHospitals);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'addu17' && password === 'addu@17') {
      setIsAdminLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  // Hospital CRUD
  const saveHospital = () => {
    if (!hospitalForm.name) return;
    if (editingHospital) {
      setHospitals(hospitals.map(h => h.id === editingHospital.id ? { ...h, ...hospitalForm } as Hospital : h));
    } else {
      const newHospital: Hospital = {
        id: `h${Date.now()}`,
        name: hospitalForm.name || '',
        type: (hospitalForm.type as Hospital['type']) || 'Private',
        specialization: hospitalForm.specialization || '',
        conditions: hospitalForm.conditions || [],
        rating: hospitalForm.rating || 3.5,
        address: hospitalForm.address || '',
        lat: hospitalForm.lat || 21.1450,
        lng: hospitalForm.lng || 79.0800,
        osmLink: hospitalForm.osmLink || `https://www.openstreetmap.org/search?query=${encodeURIComponent(hospitalForm.name || '')}`,
      };
      setHospitals([...hospitals, newHospital]);
    }
    setShowHospitalForm(false);
    setEditingHospital(null);
    setHospitalForm({});
  };

  const deleteHospital = (id: string) => {
    setHospitals(hospitals.filter(h => h.id !== id));
  };

  // About save
  const saveAbout = () => {
    setAboutContent(aboutForm);
  };

  // Suggestion CRUD
  const addSuggestion = () => {
    if (!suggestionForm.name.trim()) return;
    const newSuggestion: HealthSuggestion = {
      id: `s${Date.now()}`,
      name: suggestionForm.name.trim(),
      category: suggestionForm.category || 'General',
    };
    setHealthSuggestions([...healthSuggestions, newSuggestion]);
    setSuggestionForm({ name: '', category: '' });
    setShowSuggestionForm(false);
  };

  const deleteSuggestion = (id: string) => {
    setHealthSuggestions(healthSuggestions.filter(s => s.id !== id));
  };

  // Login Screen
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl border border-gray-200 p-8 w-full max-w-sm"
        >
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield size={24} className="text-gray-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-sm text-gray-500 mt-1">Restricted access</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {loginError && (
              <p className="text-sm text-red-500 text-center">{loginError}</p>
            )}
            <button
              type="submit"
              className="w-full py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              <Lock size={16} />
              Sign In
            </button>
          </form>

          <button
            onClick={() => navigate('/')}
            className="w-full mt-3 py-2.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Manage platform content and data</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
        {[
          { key: 'hospitals', label: 'Hospitals & Clinics', icon: Building2 },
          { key: 'about', label: 'About Section', icon: Info },
          { key: 'suggestions', label: 'Health Suggestions', icon: List },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon size={16} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Hospitals Tab */}
      <AnimatePresence mode="wait">
        {activeTab === 'hospitals' && (
          <motion.div
            key="hospitals"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">{hospitals.length} facilities</p>
              <button
                onClick={() => { setEditingHospital(null); setHospitalForm({}); setShowHospitalForm(true); }}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <Plus size={16} />
                Add Facility
              </button>
            </div>

            {/* Hospital Form Modal */}
            {showHospitalForm && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{editingHospital ? 'Edit Facility' : 'Add New Facility'}</h3>
                  <button onClick={() => { setShowHospitalForm(false); setEditingHospital(null); }} className="p-1 hover:bg-gray-100 rounded-lg">
                    <X size={18} className="text-gray-400" />
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                    <input
                      type="text"
                      value={hospitalForm.name || ''}
                      onChange={(e) => setHospitalForm({ ...hospitalForm, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
                    <select
                      value={hospitalForm.type || 'Private'}
                      onChange={(e) => setHospitalForm({ ...hospitalForm, type: e.target.value as Hospital['type'] })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Government">Government</option>
                      <option value="Private">Private</option>
                      <option value="Clinic">Clinic</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Specialization</label>
                    <input
                      type="text"
                      value={hospitalForm.specialization || ''}
                      onChange={(e) => setHospitalForm({ ...hospitalForm, specialization: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Rating</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={hospitalForm.rating || 3.5}
                      onChange={(e) => setHospitalForm({ ...hospitalForm, rating: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Address</label>
                    <input
                      type="text"
                      value={hospitalForm.address || ''}
                      onChange={(e) => setHospitalForm({ ...hospitalForm, address: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Conditions (comma-separated)</label>
                    <input
                      type="text"
                      value={(hospitalForm.conditions || []).join(', ')}
                      onChange={(e) => setHospitalForm({ ...hospitalForm, conditions: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <button
                  onClick={saveHospital}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <Save size={16} />
                  Save
                </button>
              </div>
            )}

            {/* Hospital List */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {hospitals.map(h => (
                <div key={h.id} className="bg-white rounded-lg border border-gray-100 p-4 flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-gray-900 truncate">{h.name}</p>
                    <p className="text-xs text-gray-500">{h.type} - {h.specialization}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 ml-3">
                    <button
                      onClick={() => { setEditingHospital(h); setHospitalForm(h); setShowHospitalForm(true); }}
                      className="p-2 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => deleteHospital(h.id)}
                      className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <motion.div
            key="about"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                <input
                  type="text"
                  value={aboutForm.title}
                  onChange={(e) => setAboutForm({ ...aboutForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                <textarea
                  value={aboutForm.description}
                  onChange={(e) => setAboutForm({ ...aboutForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Purpose</label>
                <textarea
                  value={aboutForm.purpose}
                  onChange={(e) => setAboutForm({ ...aboutForm, purpose: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Creator Name</label>
                  <input
                    type="text"
                    value={aboutForm.creator}
                    onChange={(e) => setAboutForm({ ...aboutForm, creator: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Course</label>
                  <input
                    type="text"
                    value={aboutForm.course}
                    onChange={(e) => setAboutForm({ ...aboutForm, course: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Semester</label>
                  <input
                    type="text"
                    value={aboutForm.semester}
                    onChange={(e) => setAboutForm({ ...aboutForm, semester: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Project</label>
                  <input
                    type="text"
                    value={aboutForm.project}
                    onChange={(e) => setAboutForm({ ...aboutForm, project: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <button
                onClick={saveAbout}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <Save size={16} />
                Save Changes
              </button>
            </div>
          </motion.div>
        )}

        {/* Suggestions Tab */}
        {activeTab === 'suggestions' && (
          <motion.div
            key="suggestions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">{healthSuggestions.length} suggestions</p>
              <button
                onClick={() => setShowSuggestionForm(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <Plus size={16} />
                Add Suggestion
              </button>
            </div>

            {showSuggestionForm && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Add Health Suggestion</h3>
                  <button onClick={() => setShowSuggestionForm(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                    <X size={18} className="text-gray-400" />
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                    <input
                      type="text"
                      value={suggestionForm.name}
                      onChange={(e) => setSuggestionForm({ ...suggestionForm, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                    <input
                      type="text"
                      value={suggestionForm.category}
                      onChange={(e) => setSuggestionForm({ ...suggestionForm, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <button
                  onClick={addSuggestion}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <Save size={16} />
                  Add
                </button>
              </div>
            )}

            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {healthSuggestions.map(s => (
                <div key={s.id} className="bg-white rounded-lg border border-gray-100 p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm text-gray-900">{s.name}</p>
                    <p className="text-xs text-gray-500">{s.category}</p>
                  </div>
                  <button
                    onClick={() => deleteSuggestion(s.id)}
                    className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
