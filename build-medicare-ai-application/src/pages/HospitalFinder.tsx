import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Building2, MapPin, Star, Filter, ExternalLink, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { nagpurHospitals } from '../data/hospitals';
import type { Hospital } from '../context/AppContext';

export default function HospitalFinder() {
  const { hospitals: customHospitals } = useApp();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [showMap, setShowMap] = useState(false);

  const allHospitals = useMemo(() => {
    if (customHospitals.length > 0) return customHospitals;
    return nagpurHospitals;
  }, [customHospitals]);

  const filtered = useMemo(() => {
    return allHospitals.filter(h => {
      const matchesSearch = h.name.toLowerCase().includes(search.toLowerCase()) ||
        h.specialization.toLowerCase().includes(search.toLowerCase()) ||
        h.conditions.some(c => c.toLowerCase().includes(search.toLowerCase()));
      const matchesType = typeFilter === 'All' || h.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [allHospitals, search, typeFilter]);

  const types = ['All', 'Government', 'Private', 'Clinic'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Hospital Finder</h1>
        <p className="text-gray-500">Find real hospitals and clinics in Nagpur with ratings and directions.</p>
      </motion.div>

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, specialization, or condition..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={16} className="text-gray-400" />
          {types.map(type => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                typeFilter === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {type}
            </button>
          ))}
          <span className="text-sm text-gray-400 ml-auto">{filtered.length} results</span>
        </div>
      </motion.div>

      {/* Hospital List */}
      <div className="grid gap-3">
        {filtered.map((hospital, i) => (
          <motion.div
            key={hospital.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.02, 0.5) }}
            className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-gray-200 transition-all cursor-pointer"
            onClick={() => { setSelectedHospital(hospital); setShowMap(false); }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold text-gray-900 truncate">{hospital.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    hospital.type === 'Government' ? 'bg-blue-100 text-blue-700' :
                    hospital.type === 'Private' ? 'bg-purple-100 text-purple-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {hospital.type}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-2">{hospital.specialization}</p>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {hospital.conditions.slice(0, 3).map(c => (
                    <span key={c} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">{c}</span>
                  ))}
                  {hospital.conditions.length > 3 && (
                    <span className="text-xs text-gray-400">+{hospital.conditions.length - 3} more</span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                    <span className="font-medium">{hospital.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    <span className="truncate">{hospital.address}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); window.open(hospital.osmLink, '_blank'); }}
                className="flex items-center gap-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors shrink-0"
              >
                <ExternalLink size={14} />
                <span className="hidden sm:inline">Map</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Building2 size={40} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No facilities found</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Hospital Detail Modal */}
      {selectedHospital && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setSelectedHospital(null)}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedHospital.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      selectedHospital.type === 'Government' ? 'bg-blue-100 text-blue-700' :
                      selectedHospital.type === 'Private' ? 'bg-purple-100 text-purple-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {selectedHospital.type}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-amber-400 fill-amber-400" />
                      <span className="text-sm font-medium text-gray-700">{selectedHospital.rating}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedHospital(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Specialization</h4>
                  <p className="text-sm text-gray-600">{selectedHospital.specialization}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Treated Conditions</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedHospital.conditions.map(c => (
                      <span key={c} className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md">{c}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Address</h4>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <MapPin size={14} className="text-gray-400" />
                    {selectedHospital.address}
                  </p>
                </div>

                {/* Map */}
                <div className="rounded-xl overflow-hidden border border-gray-200">
                  {showMap ? (
                    <iframe
                      title="map"
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedHospital.lng - 0.01},${selectedHospital.lat - 0.005},${selectedHospital.lng + 0.01},${selectedHospital.lat + 0.005}&layer=mapnik&marker=${selectedHospital.lat},${selectedHospital.lng}`}
                      className="w-full h-64"
                      style={{ border: 0 }}
                    />
                  ) : (
                    <button
                      onClick={() => setShowMap(true)}
                      className="w-full h-48 bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <div className="text-center">
                        <MapPin size={24} className="text-gray-400 mx-auto mb-2" />
                        <span className="text-sm text-gray-500 font-medium">Click to load map</span>
                      </div>
                    </button>
                  )}
                </div>

                <a
                  href={selectedHospital.osmLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  <ExternalLink size={16} />
                  Open in OpenStreetMap
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
