
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Plus, 
  Trash2, 
  Send,
  ChevronDown,
  LogOut,
  MapPin,
  Globe,
  Phone,
  Edit2,
  MessageSquare,
  ShieldCheck,
  Star,
  ChevronRight,
  Eye,
  ExternalLink
} from 'lucide-react';
import { 
  POSITIVE_TEMPLATES, 
  NEUTRAL_TEMPLATES, 
  NEGATIVE_TEMPLATES, 
  HINDI_TEMPLATES, 
  HINGLISH_TEMPLATES, 
  MOOD_EMOJIS 
} from './constants';
import { PartnerData, Mood, Template, Language, ReviewLocation } from './types';

// --- Session Constants ---
const SESSION_KEY = 'dx_session_expiry';
const SESSION_DURATION = 15 * 24 * 60 * 60 * 1000; 

// Authorized Credentials
const AUTHORIZED_PASSWORDS = ['dx502skb'];

// --- Helper for Animated Placeholder ---
const useAnimatedPlaceholder = (suggestions: string[], speed: number = 100) => {
  const [placeholder, setPlaceholder] = useState('');
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentSuggestion = suggestions[suggestionIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting && charIndex < currentSuggestion.length) {
        setPlaceholder(prev => prev + currentSuggestion[charIndex]);
        setCharIndex(prev => prev + 1);
      } else if (isDeleting && charIndex > 0) {
        setPlaceholder(prev => prev.slice(0, -1));
        setCharIndex(prev => prev - 1);
      } else if (!isDeleting && charIndex === currentSuggestion.length) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setSuggestionIndex(prev => (prev + 1) % suggestions.length);
      }
    }, isDeleting ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, suggestionIndex, suggestions, speed]);

  return placeholder;
};

// --- Components ---

const HeaderLogo = ({ businessName, onEdit }: { businessName: string, onEdit: () => void }) => (
  <div className="flex flex-col items-center mb-6 w-full px-4 text-center">
    <motion.div 
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex gap-1.5 mb-4"
    >
      <Star className="w-5 h-5 sm:w-7 sm:h-7 text-[#4285F4] fill-current" />
      <Star className="w-5 h-5 sm:w-7 sm:h-7 text-[#EA4335] fill-current" />
      <Star className="w-5 h-5 sm:w-7 sm:h-7 text-[#FBBC05] fill-current" />
      <Star className="w-5 h-5 sm:w-7 sm:h-7 text-[#34A853] fill-current" />
    </motion.div>
    
    <div className="space-y-0">
      <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">
        Dhandha X
      </h1>
      <h2 className="text-base sm:text-xl font-bold text-blue-600 tracking-[0.3em] uppercase opacity-90">
        ReviewBooster
      </h2>
    </div>

    <motion.button 
      whileTap={{ scale: 0.96 }}
      onClick={onEdit}
      className="mt-6 flex items-center gap-2 px-5 py-2 bg-white border border-slate-200 text-slate-600 rounded-full text-[11px] sm:text-xs font-black shadow-sm hover:shadow-md transition-all active:bg-slate-50"
    >
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      Hi, <span className="text-blue-600 truncate max-w-[120px]">{businessName || 'Partner'}</span> 
      <Edit2 className="w-3 h-3 ml-0.5" />
    </motion.button>
  </div>
);

const TemplateSelectionModal = ({ 
  isOpen, 
  onClose, 
  templates, 
  onSelect, 
  businessName 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  templates: Template[], 
  onSelect: (idx: number) => void,
  businessName: string
}) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          onClick={onClose} 
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
        />
        <motion.div 
          initial={{ y: "100%" }} 
          animate={{ y: 0 }} 
          exit={{ y: "100%" }} 
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative bg-white w-full max-w-2xl rounded-t-3xl sm:rounded-3xl p-5 sm:p-10 shadow-2xl max-h-[85vh] flex flex-col will-change-transform"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Select Tone</h3>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-0.5 opacity-70">Pick a message style</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors active:scale-90">
              <X className="w-7 h-7 text-slate-400" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar pb-6">
            {templates.map((t, idx) => (
              <motion.button
                key={t.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onSelect(idx);
                  onClose();
                }}
                className="w-full text-left p-5 bg-slate-50 border border-slate-200 rounded-2xl hover:border-blue-400 hover:bg-blue-50 transition-all group relative overflow-hidden active:bg-blue-100"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest bg-blue-100 px-2.5 py-1 rounded-full">{t.name}</span>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                </div>
                <p className="text-sm font-bold text-slate-800 leading-relaxed italic">
                  "{t.text(businessName, "[Link]")}"
                </p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const ReviewBooster = ({ onLogout }: { onLogout: () => void }) => {
  const [partnerData, setPartnerData] = useState<PartnerData>(() => {
    const saved = localStorage.getItem('dx_partner_data');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Data migration for single location if needed
      if (Array.isArray(parsed.locations)) {
        return {
          businessName: parsed.businessName,
          location: parsed.locations.find((l: any) => l.id === parsed.activeLocationId) || parsed.locations[0] || null
        };
      }
      return parsed;
    }
    return { businessName: '', location: null };
  });

  const [showSetup, setShowSetup] = useState(!partnerData.businessName);
  const [showLinks, setShowLinks] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedMood, setSelectedMood] = useState<Mood>(5);
  const [language, setLanguage] = useState<Language>('english');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);

  const businessSuggestions = useMemo(() => [
    'DhandhaX Cafe',
    'DhandhaX Restaurant',
    'DhandhaX Properties',
    'DhandhaX Services',
    'DhandhaX Research',
    'DhandhaX Labs',
    'DhandhaX Banquet',
    'DhandhaX Interiors'
  ], []);

  const animatedPlaceholder = useAnimatedPlaceholder(businessSuggestions);

  useEffect(() => {
    localStorage.setItem('dx_partner_data', JSON.stringify(partnerData));
  }, [partnerData]);

  const activeLocation = partnerData.location;
  
  const templates = useMemo(() => {
    if (language === 'hindi') return HINDI_TEMPLATES;
    if (language === 'hinglish') return HINGLISH_TEMPLATES;
    if (selectedMood >= 4) return POSITIVE_TEMPLATES;
    if (selectedMood === 3) return NEUTRAL_TEMPLATES;
    return NEGATIVE_TEMPLATES;
  }, [language, selectedMood]);
  
  const handleSend = () => {
    if (!activeLocation || !phoneNumber) return;
    const template = templates[selectedTemplateIndex];
    const message = template.text(partnerData.businessName, activeLocation.url);
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const url = `https://wa.me/${countryCode.replace('+', '')}${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const setLocation = (name: string, url: string) => {
    setPartnerData(prev => ({
      ...prev,
      location: { id: 'single-branch', name, url }
    }));
    setShowLinks(false);
  };

  const deleteLocation = () => {
    setPartnerData(prev => ({
      ...prev,
      location: null
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center pt-8 pb-16 px-4 overflow-x-hidden">
      <HeaderLogo businessName={partnerData.businessName} onEdit={() => setShowSetup(true)} />

      <motion.main 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[500px] bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-5 sm:p-10 border border-white will-change-transform"
      >
        <div className="space-y-8">
          
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block px-1">
              Active Branch
            </label>
            
            {activeLocation ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-center justify-between group shadow-sm"
              >
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 mb-1">
                     <MapPin className="w-3.5 h-3.5 text-blue-500" />
                     <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Selected Location</p>
                  </div>
                  <p className="text-sm font-black text-slate-800 uppercase truncate">{activeLocation.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 truncate mt-0.5 opacity-70 italic">{activeLocation.url}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setShowLinks(true)}
                    className="p-2.5 bg-white text-blue-600 rounded-xl border border-blue-100 hover:bg-blue-50 active:scale-90 transition-all shadow-xs"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <a 
                    href={activeLocation.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-2.5 bg-blue-600 text-white rounded-xl shadow-md active:scale-90 transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            ) : (
              <button 
                onClick={() => setShowLinks(true)}
                className="w-full py-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-blue-400 hover:bg-white hover:text-blue-500 transition-all group"
              >
                <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest">Setup Branch Link</span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block px-1">
              Select Language
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['english', 'hindi', 'hinglish'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setLanguage(lang);
                    setSelectedTemplateIndex(0);
                  }}
                  className={`py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all active:scale-95 ${language === lang ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {language === 'english' && (
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block text-center">
                Review Tone
              </label>
              <div className="flex justify-between gap-2.5">
                {MOOD_EMOJIS.map((emoji, idx) => (
                  <motion.button
                    key={idx}
                    whileTap={{ scale: 0.85 }}
                    onClick={() => {
                      setSelectedMood((idx + 1) as Mood);
                      setSelectedTemplateIndex(0);
                    }}
                    className={`flex-1 aspect-square rounded-2xl text-2xl flex items-center justify-center transition-all shadow-sm ${selectedMood === (idx + 1) ? 'bg-white border-2 border-blue-500 ring-4 ring-blue-50' : 'bg-slate-50 border border-transparent active:bg-slate-100'}`}
                  >
                    <span className={selectedMood === (idx + 1) ? '' : 'grayscale opacity-30'}>
                      {emoji}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block px-1">
              Message Template
            </label>
            <div 
              onClick={() => setShowTemplateModal(true)}
              className="flex items-center gap-4 bg-white border border-slate-200 rounded-2xl px-5 py-5 hover:border-blue-400 transition-all cursor-pointer group active:bg-slate-50 shadow-sm"
            >
              <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                <MessageSquare className="w-6 h-6 text-blue-500" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-black text-slate-900 truncate tracking-tight uppercase">
                  {templates[selectedTemplateIndex]?.name || 'Select Template'}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 opacity-60">
                  Tap to view options
                </p>
              </div>
              <ChevronDown className="w-5 h-5 text-slate-300" />
            </div>
          </div>

          <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 min-h-[120px] max-h-[250px] overflow-y-auto custom-scrollbar relative shadow-inner">
            <Eye className="absolute top-4 right-4 w-4 h-4 text-slate-700" />
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">WhatsApp Preview</p>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line font-medium italic">
              {activeLocation ? templates[selectedTemplateIndex]?.text(partnerData.businessName, activeLocation.url) : 'Branch not configured...'}
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block px-1">
              Recipient Phone
            </label>
            <div className="flex gap-3">
              <div className="w-24 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-4 focus-within:border-blue-400 focus-within:bg-white transition-all shadow-sm">
                <Globe className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <input 
                  type="text" 
                  className="w-full bg-transparent text-sm font-black text-slate-800 focus:outline-none"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                />
              </div>
              <div className="flex-1 flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 focus-within:border-blue-400 focus-within:bg-white transition-all shadow-sm">
                <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <input 
                  type="tel" 
                  className="w-full bg-transparent text-sm font-black text-slate-800 focus:outline-none placeholder:text-slate-300"
                  placeholder="98765 43210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>
          </div>

          <motion.button 
            whileTap={{ scale: 0.96 }}
            disabled={!activeLocation || !phoneNumber}
            onClick={handleSend}
            className="w-full py-5 sm:py-6 bg-[#25D366] hover:bg-[#128C7E] disabled:opacity-40 text-white font-black text-lg sm:text-xl rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-green-100 uppercase tracking-widest active:bg-[#075E54] will-change-transform"
          >
            Request on WhatsApp
            <Send className="w-5 h-5 rotate-[-20deg]" />
          </motion.button>

        </div>
      </motion.main>

      <AnimatePresence>
        {showSetup && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }} className="relative bg-white w-full max-w-sm rounded-3xl p-8 sm:p-10 shadow-2xl border border-white">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-100">
                <Edit2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2 text-center">Brand Setup</h3>
              <p className="text-slate-500 text-[10px] font-bold text-center mb-8 uppercase tracking-widest opacity-60">Signature Customization</p>
              <div className="relative mb-8">
                 <input 
                  autoFocus
                  type="text" 
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:border-blue-500 focus:outline-none text-center text-lg shadow-inner z-10 relative bg-transparent"
                  placeholder=""
                  value={partnerData.businessName}
                  onChange={(e) => setPartnerData(prev => ({ ...prev, businessName: e.target.value }))}
                />
                {!partnerData.businessName && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-300 font-bold text-lg">
                    {animatedPlaceholder}
                  </div>
                )}
              </div>
              <button 
                disabled={!partnerData.businessName}
                onClick={() => setShowSetup(false)}
                className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl disabled:opacity-50 shadow-lg uppercase tracking-widest text-xs active:bg-black transition-colors"
              >
                PROCEED
              </button>
            </motion.div>
          </div>
        )}

        {showLinks && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowLinks(false)} className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }} className="relative bg-white w-full max-w-sm rounded-3xl p-8 sm:p-10 shadow-2xl border border-white">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Branch Link</h3>
                <button onClick={() => setShowLinks(false)} className="p-2 hover:bg-slate-100 rounded-full active:scale-90 transition-all"><X className="w-6 h-6 text-slate-400" /></button>
              </div>

              <div className="space-y-4 mb-2">
                <div className="space-y-1.5">
                   <label className="text-[10px] font-black text-slate-400 uppercase px-1">Branch Name</label>
                   <input id="loc-name" type="text" defaultValue={activeLocation?.name || ''} placeholder="e.g. Bandra East" className="w-full px-4 py-4 text-sm bg-slate-50 border border-slate-200 rounded-xl font-bold focus:border-blue-500 focus:outline-none shadow-inner" />
                </div>
                <div className="space-y-1.5">
                   <label className="text-[10px] font-black text-slate-400 uppercase px-1">Google Review Link</label>
                   <input id="loc-url" type="url" defaultValue={activeLocation?.url || ''} placeholder="https://g.page/r/..." className="w-full px-4 py-4 text-sm bg-slate-50 border border-slate-200 rounded-xl font-bold focus:border-blue-500 focus:outline-none shadow-inner" />
                </div>
                
                <div className="flex flex-col gap-3 pt-4">
                  <button 
                    onClick={() => {
                      const n = document.getElementById('loc-name') as HTMLInputElement;
                      const u = document.getElementById('loc-url') as HTMLInputElement;
                      if (n.value && u.value) {
                        setLocation(n.value, u.value);
                      }
                    }}
                    className="w-full bg-blue-600 text-white font-black py-4 rounded-xl text-xs uppercase tracking-widest shadow-md hover:bg-blue-700 active:bg-blue-800 transition-colors"
                  >
                    SAVE BRANCH
                  </button>
                  {activeLocation && (
                    <button 
                      onClick={() => {
                        deleteLocation();
                        setShowLinks(false);
                      }}
                      className="w-full bg-white text-red-500 border border-red-100 font-black py-4 rounded-xl text-xs uppercase tracking-widest hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" /> REMOVE BRANCH
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <TemplateSelectionModal 
        isOpen={showTemplateModal} 
        onClose={() => setShowTemplateModal(false)}
        templates={templates}
        onSelect={(idx) => setSelectedTemplateIndex(idx)}
        businessName={partnerData.businessName}
      />

      <motion.button 
        whileTap={{ scale: 0.95 }}
        onClick={onLogout} 
        className="mt-12 text-slate-400 hover:text-red-500 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] transition-colors py-4 px-8 active:bg-red-50 rounded-full"
      >
        <LogOut className="w-4 h-4" /> End Session
      </motion.button>
    </div>
  );
};

// --- Authentication & Session Manager ---

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    const expiry = localStorage.getItem(SESSION_KEY);
    if (expiry && parseInt(expiry) > Date.now()) {
      setIsUnlocked(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (AUTHORIZED_PASSWORDS.includes(password.trim())) {
      const expiry = Date.now() + SESSION_DURATION;
      localStorage.setItem(SESSION_KEY, expiry.toString());
      setIsUnlocked(true);
      setAuthError(false);
    } else {
      setAuthError(true);
      setTimeout(() => setAuthError(false), 2000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    setIsUnlocked(false);
    setPassword('');
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-5 sm:p-10 selection:bg-blue-100 overflow-hidden">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-sm text-center will-change-transform"
        >
          <div className="flex flex-col items-center mb-10">
            <div className="flex gap-2 mb-6">
              <Star className="w-7 h-7 sm:w-9 sm:h-9 text-[#4285F4] fill-current" />
              <Star className="w-7 h-7 sm:w-9 sm:h-9 text-[#EA4335] fill-current" />
              <Star className="w-7 h-7 sm:w-9 sm:h-9 text-[#FBBC05] fill-current" />
              <Star className="w-7 h-7 sm:w-9 sm:h-9 text-[#34A853] fill-current" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tighter uppercase mb-1 leading-none">
              Dhandha X
            </h1>
            <h2 className="text-sm sm:text-base font-bold text-blue-600 tracking-[0.4em] uppercase opacity-60">
              Partner Suite
            </h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-2xl shadow-slate-200/60 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-red-500 to-green-500" />
            
            <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-slate-100">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Partner Portal</h2>
            <p className="text-slate-400 font-bold text-[9px] uppercase tracking-[0.3em] mb-10">Secure Authentication</p>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative">
                <input 
                  autoFocus
                  type="password"
                  placeholder="••••••••"
                  className={`w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-xl text-center font-black tracking-[0.5em] text-lg focus:outline-none transition-all active:bg-white ${authError ? 'border-red-500 bg-red-50 ring-2 ring-red-100' : 'focus:border-blue-600 focus:bg-white shadow-inner'}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <AnimatePresence>
                  {authError && (
                    <motion.p 
                      initial={{ opacity: 0, y: 5 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0 }}
                      className="absolute -bottom-7 left-0 right-0 text-red-500 text-[9px] font-black uppercase tracking-[0.4em]"
                    >
                      Access Denied
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <button 
                type="submit"
                className="w-full py-5 bg-blue-600 text-white font-black rounded-xl hover:bg-slate-900 transition-all uppercase tracking-[0.4em] text-[10px] shadow-lg shadow-blue-50 mt-4 active:scale-95 will-change-transform"
              >
                UNLOCK SYSTEM
              </button>
            </form>
          </div>
          
          <p className="mt-12 text-[9px] font-black text-slate-300 uppercase tracking-[0.5em] opacity-50">
            PROTECTED BY DHANDHA X ENCRYPTION
          </p>
        </motion.div>
      </div>
    );
  }

  return <ReviewBooster onLogout={handleLogout} />;
}
