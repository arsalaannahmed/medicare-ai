import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Reminder {
  id: string;
  type: 'medicine' | 'appointment';
  title: string;
  time: string;
  enabled: boolean;
  createdAt: string;
}

export interface Hospital {
  id: string;
  name: string;
  type: 'Government' | 'Private' | 'Clinic';
  specialization: string;
  conditions: string[];
  rating: number;
  address: string;
  lat: number;
  lng: number;
  osmLink: string;
}

export interface HealthSuggestion {
  id: string;
  name: string;
  category: string;
}

export interface AboutContent {
  title: string;
  description: string;
  creator: string;
  course: string;
  semester: string;
  department: string;
  project: string;
  purpose: string;
}

interface AppContextType {
  reminders: Reminder[];
  addReminder: (reminder: Omit<Reminder, 'id' | 'createdAt'>) => void;
  removeReminder: (id: string) => void;
  toggleReminder: (id: string) => void;
  hospitals: Hospital[];
  setHospitals: (hospitals: Hospital[]) => void;
  healthSuggestions: HealthSuggestion[];
  setHealthSuggestions: (suggestions: HealthSuggestion[]) => void;
  aboutContent: AboutContent;
  setAboutContent: (content: AboutContent) => void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (v: boolean) => void;
}

const defaultAbout: AboutContent = {
  title: 'About MediCare AI',
  description: 'MediCare AI is an intelligent health platform designed to provide AI-powered health assessments, locate nearby medical facilities, and help manage your healthcare routine with smart reminders.',
  creator: 'ARSALAAN AHMED',
  course: 'BSc Computer Science',
  semester: 'SEM 4',
  department: 'Computer Science',
  project: 'CEP (Community Engagement Project)',
  purpose: 'This platform aims to bridge the gap between healthcare information and accessibility by leveraging artificial intelligence to provide preliminary health assessments, connecting users with real medical facilities in Nagpur, and helping patients manage their medication and appointment schedules effectively.',
};

const defaultSuggestions: HealthSuggestion[] = [
  { id: '1', name: 'Headache', category: 'Neurological' },
  { id: '2', name: 'Fever', category: 'General' },
  { id: '3', name: 'Cough', category: 'Respiratory' },
  { id: '4', name: 'Back Pain', category: 'Musculoskeletal' },
  { id: '5', name: 'Stomach Pain', category: 'Gastrointestinal' },
  { id: '6', name: 'Skin Rash', category: 'Dermatological' },
  { id: '7', name: 'Joint Pain', category: 'Musculoskeletal' },
  { id: '8', name: 'Chest Pain', category: 'Cardiac' },
  { id: '9', name: 'Dizziness', category: 'Neurological' },
  { id: '10', name: 'Fatigue', category: 'General' },
  { id: '11', name: 'Sore Throat', category: 'Respiratory' },
  { id: '12', name: 'Nausea', category: 'Gastrointestinal' },
  { id: '13', name: 'Insomnia', category: 'Neurological' },
  { id: '14', name: 'Anxiety', category: 'Mental Health' },
  { id: '15', name: 'Allergy', category: 'Immunological' },
  { id: '16', name: 'Diabetes', category: 'Endocrine' },
  { id: '17', name: 'Hypertension', category: 'Cardiac' },
  { id: '18', name: 'Asthma', category: 'Respiratory' },
  { id: '19', name: 'Migraine', category: 'Neurological' },
  { id: '20', name: 'Acne', category: 'Dermatological' },
];

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [healthSuggestions, setHealthSuggestions] = useState<HealthSuggestion[]>(defaultSuggestions);
  const [aboutContent, setAboutContent] = useState<AboutContent>(defaultAbout);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('medicare_reminders');
    if (saved) setReminders(JSON.parse(saved));
    
    const savedHospitals = localStorage.getItem('medicare_hospitals');
    if (savedHospitals) setHospitals(JSON.parse(savedHospitals));
    
    const savedSuggestions = localStorage.getItem('medicare_suggestions');
    if (savedSuggestions) setHealthSuggestions(JSON.parse(savedSuggestions));
    
    const savedAbout = localStorage.getItem('medicare_about');
    if (savedAbout) setAboutContent(JSON.parse(savedAbout));
  }, []);

  useEffect(() => {
    localStorage.setItem('medicare_reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem('medicare_hospitals', JSON.stringify(hospitals));
  }, [hospitals]);

  useEffect(() => {
    localStorage.setItem('medicare_suggestions', JSON.stringify(healthSuggestions));
  }, [healthSuggestions]);

  useEffect(() => {
    localStorage.setItem('medicare_about', JSON.stringify(aboutContent));
  }, [aboutContent]);

  const addReminder = (reminder: Omit<Reminder, 'id' | 'createdAt'>) => {
    const newReminder: Reminder = {
      ...reminder,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setReminders(prev => [...prev, newReminder]);
  };

  const removeReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const toggleReminder = (id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  return (
    <AppContext.Provider value={{
      reminders, addReminder, removeReminder, toggleReminder,
      hospitals, setHospitals,
      healthSuggestions, setHealthSuggestions,
      aboutContent, setAboutContent,
      isAdminLoggedIn, setIsAdminLoggedIn,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
