import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, AlertCircle, Pill, Stethoscope, Home as HomeIcon, Building2, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { checkHealth, HealthResponse } from '../utils/api';

export default function HealthChecker() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HealthResponse | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState('');
  const { healthSuggestions } = useApp();
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const filteredSuggestions = healthSuggestions.filter(s =>
    s.name.toLowerCase().includes(query.toLowerCase()) && query.length > 0
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    setShowSuggestions(false);
    setQuery(searchQuery);

    try {
      const response = await checkHealth(searchQuery);
      setResult(response);
    } catch (err) {
      setError('Failed to get health analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectSuggestion = (name: string) => {
    setQuery(name);
    setShowSuggestions(false);
    handleSearch(name);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">AI Health Checker</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Describe your symptoms or health concern. Our AI will provide a structured medical analysis with guidance.
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative max-w-2xl mx-auto"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(query); }}
            placeholder="Describe your symptoms or health concern..."
            className="w-full pl-12 pr-24 py-4 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base shadow-sm"
          />
          <button
            onClick={() => handleSearch(query)}
            disabled={loading || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            {loading ? 'Analyzing' : 'Check'}
          </button>
        </div>

        {/* Suggestions Dropdown */}
        <AnimatePresence>
          {showSuggestions && filteredSuggestions.length > 0 && (
            <motion.div
              ref={suggestionsRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-lg z-50 max-h-64 overflow-y-auto"
            >
              {filteredSuggestions.slice(0, 8).map(s => (
                <button
                  key={s.id}
                  onClick={() => selectSuggestion(s.name)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between transition-colors"
                >
                  <span className="text-gray-900 font-medium">{s.name}</span>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{s.category}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Quick Select Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-2xl mx-auto"
      >
        <div className="flex items-center gap-2 mb-3">
          <ChevronDown size={16} className="text-gray-400" />
          <span className="text-sm text-gray-500 font-medium">Common health concerns</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {healthSuggestions.slice(0, 12).map(s => (
            <button
              key={s.id}
              onClick={() => selectSuggestion(s.name)}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
            >
              {s.name}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16"
        >
          <Loader2 size={40} className="text-blue-600 animate-spin mb-4" />
          <p className="text-gray-500 font-medium">Analyzing your symptoms...</p>
          <p className="text-gray-400 text-sm mt-1">This may take a moment</p>
        </motion.div>
      )}

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3"
        >
          <AlertCircle size={20} className="text-red-500 mt-0.5 shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </motion.div>
      )}

      {/* Results */}
      <AnimatePresence>
        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6 max-w-4xl mx-auto"
          >
            {/* Problem Header */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Stethoscope size={20} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{result.problem}</h2>
                  <p className="text-sm text-gray-500">AI Health Analysis</p>
                </div>
              </div>
            </div>

            {/* Symptoms */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle size={18} className="text-amber-500" />
                Symptoms
              </h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {result.symptoms.map((s, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-amber-50">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 shrink-0" />
                    <span className="text-sm text-gray-700">{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Causes & Effects */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Causes</h3>
                <ul className="space-y-2">
                  {result.causes.map((c, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0" />
                      <span className="text-sm text-gray-600">{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Effects on Body</h3>
                <ul className="space-y-2">
                  {result.effects.map((e, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 shrink-0" />
                      <span className="text-sm text-gray-600">{e}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Risks */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle size={18} className="text-red-500" />
                Future Risks
              </h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {result.risks.map((r, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-red-50">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 shrink-0" />
                    <span className="text-sm text-gray-700">{r}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Doctor Type */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-base font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Stethoscope size={18} />
                Recommended Doctor
              </h3>
              <p className="text-blue-800 font-medium">{result.doctor_type}</p>
              <p className="text-blue-600 text-sm mt-1">Consult this specialist for proper diagnosis and treatment.</p>
            </div>

            {/* Remedies & Medicines */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <HomeIcon size={18} className="text-emerald-500" />
                  Home Remedies
                </h3>
                <ul className="space-y-2">
                  {result.remedies.map((r, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 shrink-0" />
                      <span className="text-sm text-gray-600">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Pill size={18} className="text-blue-500" />
                  Safe Medicines (OTC)
                </h3>
                <ul className="space-y-2">
                  {result.medicines.map((m, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0" />
                      <span className="text-sm text-gray-600">{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Hospitals */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 size={18} className="text-blue-500" />
                Suggested Hospitals
              </h3>
              <ul className="space-y-2">
                {result.hospitals.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 p-3 rounded-lg bg-gray-50">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0" />
                    <span className="text-sm text-gray-700">{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Disclaimer */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle size={18} className="text-gray-400 mt-0.5 shrink-0" />
              <p className="text-xs text-gray-500">
                Disclaimer: This AI-generated analysis is for informational purposes only and should not replace professional medical advice. Always consult a qualified healthcare provider for diagnosis and treatment.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
