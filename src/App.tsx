import { useState, useRef, createContext, useContext } from 'react';
import { MagneticVariationPanel } from '@/sections/MagneticVariationPanel';
import { CPAPanel } from '@/sections/CPAPanel';
import { ETAPanel } from '@/sections/ETAPanel';
import { WindCalculatorPanel } from '@/sections/WindCalculatorPanel';
import { SextantCalculatorPanel } from '@/sections/SextantCalculatorPanel';
import { COLREGPanel } from '@/sections/COLREGPanel';
import { DraftSurveyPanel } from '@/sections/DraftSurveyPanel';
import { PaintCalculatorPanel } from '@/sections/PaintCalculatorPanel';
import { AzimuthPanel } from '@/sections/AzimuthPanel';
import { CompassAdjustmentPanel } from '@/sections/CompassAdjustmentPanel';
import { StarFinderPanel } from '@/sections/StarFinderPanel';
import { LogbookReferencePanel } from '@/sections/LogbookReferencePanel';
import { ToastContainer } from '@/components/ui/Toast';
import { FadeIn } from '@/components/AnimatedTransition';
import { useToast } from '@/hooks/useToast';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { type Language } from '@/lib/language';
import { 
  Compass, Anchor, Clock, Wind, Telescope, BookOpen, 
  Ship, Menu, X, Volume2, VolumeX, Home, Info, 
  Paintbrush, Sun, Globe, Moon, Sun as SunIcon
} from 'lucide-react';

// Language Context
const LanguageContext = createContext<{
  lang: Language;
  setLang: (lang: Language) => void;
}>({ lang: 'en', setLang: () => {} });

// Theme Context
const ThemeContext = createContext<{
  isDark: boolean;
  toggleTheme: () => void;
}>({ isDark: true, toggleTheme: () => {} });

export const useLanguage = () => useContext(LanguageContext);
export const useTheme = () => useContext(ThemeContext);

type Page = 'home' | 'magvar' | 'cpa' | 'eta' | 'wind' | 'sextant' | 'colreg' | 'draft' | 
            'paint' | 'azimuth' | 'compass' | 'star' | 'logbook';

// Toast Context for global access
export const ToastContext = createContext<{
  success: (message: string, duration?: number) => string;
  error: (message: string, duration?: number) => string;
  warning: (message: string, duration?: number) => string;
  info: (message: string, duration?: number) => string;
}>({
  success: () => '',
  error: () => '',
  warning: () => '',
  info: () => ''
});

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [lang, setLang] = useLocalStorage<Language>('app_language', 'en');
  const [isDark, setIsDark] = useLocalStorage<boolean>('app_dark_mode', true);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const { toasts, removeToast, success, error, warning, info } = useToast();

  const toggleAudio = () => {
    if (audioRef.current) {
      if (audioPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {});
      }
      setAudioPlaying(!audioPlaying);
    }
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    info(isDark ? 'Light mode activated' : 'Dark mode activated', 2000);
  };

  const getMenuItems = () => [
    { id: 'home' as Page, label: getMenuLabel('home', lang), icon: Home },
    { id: 'magvar' as Page, label: getMenuLabel('magvar', lang), icon: Compass },
    { id: 'cpa' as Page, label: getMenuLabel('cpa', lang), icon: Anchor },
    { id: 'eta' as Page, label: getMenuLabel('eta', lang), icon: Clock },
    { id: 'wind' as Page, label: getMenuLabel('wind', lang), icon: Wind },
    { id: 'sextant' as Page, label: getMenuLabel('sextant', lang), icon: Telescope },
    { id: 'colreg' as Page, label: getMenuLabel('colreg', lang), icon: BookOpen },
    { id: 'draft' as Page, label: getMenuLabel('draft', lang), icon: Ship },
    { id: 'paint' as Page, label: getMenuLabel('paint', lang), icon: Paintbrush },
    { id: 'azimuth' as Page, label: getMenuLabel('azimuth', lang), icon: Sun },
    { id: 'compass' as Page, label: getMenuLabel('compass', lang), icon: Compass },
    { id: 'star' as Page, label: getMenuLabel('star', lang), icon: Sun },
    { id: 'logbook' as Page, label: getMenuLabel('logbook', lang), icon: BookOpen },
  ];

  const menuItems = getMenuItems();

  const handlePageChange = (page: Page) => {
    setCurrentPage(page);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handlePageChange} />;
      case 'magvar':
        return <MagneticVariationPanel />;
      case 'cpa':
        return <CPAPanel />;
      case 'eta':
        return <ETAPanel />;
      case 'wind':
        return <WindCalculatorPanel />;
      case 'sextant':
        return <SextantCalculatorPanel />;
      case 'colreg':
        return <COLREGPanel />;
      case 'draft':
        return <DraftSurveyPanel />;
      case 'paint':
        return <PaintCalculatorPanel />;
      case 'azimuth':
        return <AzimuthPanel />;
      case 'compass':
        return <CompassAdjustmentPanel />;
      case 'star':
        return <StarFinderPanel />;
      case 'logbook':
        return <LogbookReferencePanel />;
      default:
        return <HomePage onNavigate={handlePageChange} />;
    }
  };

  const themeClasses = isDark 
    ? 'bg-gradient-to-b from-[#03121c] to-[#000814] text-white'
    : 'bg-gradient-to-b from-[#f0f4f8] to-[#e2e8f0] text-gray-900';

  const headerBg = isDark ? 'bg-[#021019]/90' : 'bg-white/90';
  const borderColor = isDark ? 'border-[#00eaff33]' : 'border-gray-200';
  const buttonBg = isDark ? 'bg-[#0a2a3a]' : 'bg-gray-100';
  const buttonHover = isDark ? 'hover:bg-[#0d3a4d]' : 'hover:bg-gray-200';
  const textColor = isDark ? 'text-[#9fe9ff]' : 'text-gray-700';
  const titleColor = isDark ? 'text-[#00eaff]' : 'text-blue-600';

  const getAboutTitle = () => {
    if (lang === 'id') return 'Tentang';
    if (lang === 'zh') return '关于';
    return 'About';
  };

  const getSettingsTitle = () => {
    if (lang === 'id') return 'Pengaturan';
    if (lang === 'zh') return '设置';
    return 'Settings';
  };

  const getLanguageLabel = () => {
    if (lang === 'id') return 'Bahasa';
    if (lang === 'zh') return '语言';
    return 'Language';
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      <ThemeContext.Provider value={{ isDark, toggleTheme }}>
        <ToastContext.Provider value={{ success, error, warning, info }}>
          <div className={`min-h-screen ${themeClasses} font-['Orbitron',sans-serif] transition-colors duration-300`}>
            {/* Toast Container */}
            <ToastContainer toasts={toasts} onRemove={removeToast} />

            {/* Audio */}
            <audio ref={audioRef} loop>
              <source src="https://raw.githubusercontent.com/wahid7ark/wahid7ark.github.io/main/audio.mp3" type="audio/mpeg" />
            </audio>

            {/* Header */}
            <header className={`sticky top-0 z-50 ${headerBg} backdrop-blur-md border-b ${borderColor} transition-colors duration-300`}>
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setMenuOpen(!menuOpen)}
                    className={`p-2 rounded-lg ${buttonBg} ${textColor} ${buttonHover} transition-colors`}
                  >
                    {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
                  <h1 className={`text-lg md:text-xl font-semibold tracking-wider ${titleColor}`}>
                    ASISTEN OFFICER
                  </h1>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={toggleTheme}
                    className={`p-2 rounded-lg ${buttonBg} ${textColor} ${buttonHover} transition-colors`}
                    title="Toggle Theme"
                  >
                    {isDark ? <SunIcon className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                  <button 
                    onClick={() => setSettingsOpen(true)}
                    className={`p-2 rounded-lg ${buttonBg} ${textColor} ${buttonHover} transition-colors`}
                    title="Settings"
                  >
                    <Globe className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setAboutOpen(true)}
                    className={`p-2 rounded-lg ${buttonBg} ${textColor} ${buttonHover} transition-colors`}
                    title="About"
                  >
                    <Info className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={toggleAudio}
                    className={`p-2 rounded-lg ${buttonBg} ${textColor} ${buttonHover} transition-colors`}
                  >
                    {audioPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </header>

            {/* Navigation Menu */}
            {menuOpen && (
              <nav className={`fixed inset-0 z-40 ${isDark ? 'bg-[#000c]/95' : 'bg-white/95'} backdrop-blur-sm pt-16 animate-in slide-in-from-left duration-300`}>
                <div className="p-4 space-y-2 max-h-[80vh] overflow-y-auto">
                  {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handlePageChange(item.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all animate-in slide-in-from-left fade-in duration-300`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className={`p-2 rounded-lg ${isActive 
                          ? (isDark ? 'bg-[#00eaff22] border border-[#00eaff55]' : 'bg-blue-100 border border-blue-300')
                          : (isDark ? 'bg-[#021019] border border-[#00eaff22]' : 'bg-gray-100 border border-gray-200')
                        }`}>
                          <Icon className={`w-6 h-6 ${isActive 
                            ? (isDark ? 'text-[#00eaff]' : 'text-blue-600')
                            : (isDark ? 'text-[#9fe9ff]' : 'text-gray-600')
                          }`} />
                        </div>
                        <span className={`text-base font-medium ${isActive 
                          ? (isDark ? 'text-[#00eaff]' : 'text-blue-600')
                          : (isDark ? 'text-[#9fe9ff]' : 'text-gray-700')
                        }`}>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </nav>
            )}

            {/* Settings Modal */}
            {settingsOpen && (
              <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isDark ? 'bg-black/80' : 'bg-gray-900/50'} backdrop-blur-sm animate-in fade-in duration-200`}>
                <div className={`${isDark ? 'bg-gradient-to-br from-[#021019] to-[#000814]' : 'bg-white'} rounded-2xl border ${isDark ? 'border-[#00eaff55]' : 'border-gray-200'} shadow-[0_0_50px_#00eaff33] max-w-sm w-full animate-in zoom-in-95 duration-200`}>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className={`text-xl font-bold ${titleColor}`}>{getSettingsTitle()}</h2>
                      <button 
                        onClick={() => setSettingsOpen(false)}
                        className={`p-2 rounded-lg ${buttonBg} ${textColor} ${buttonHover} transition-colors`}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="space-y-6">
                      {/* Theme Toggle */}
                      <div>
                        <label className={`text-sm block mb-3 ${isDark ? 'text-[#7feaff]' : 'text-gray-600'}`}>Theme</label>
                        <button
                          onClick={toggleTheme}
                          className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                            isDark 
                              ? 'bg-[#021019] border-[#00eaff33] text-[#9fe9ff] hover:bg-[#0a2a3a]'
                              : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {isDark ? <Moon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
                            <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
                          </div>
                          <div className={`w-12 h-6 rounded-full relative transition-colors ${isDark ? 'bg-[#00eaff]' : 'bg-gray-300'}`}>
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${isDark ? 'translate-x-7' : 'translate-x-1'}`} />
                          </div>
                        </button>
                      </div>

                      {/* Language Selection */}
                      <div>
                        <label className={`text-sm block mb-3 ${isDark ? 'text-[#7feaff]' : 'text-gray-600'}`}>{getLanguageLabel()}</label>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() => { setLang('id'); info('Bahasa Indonesia dipilih', 2000); }}
                            className={`p-3 rounded-xl border transition-all ${
                              lang === 'id' 
                                ? (isDark ? 'bg-[#00eaff22] border-[#00eaff] text-[#00eaff]' : 'bg-blue-100 border-blue-500 text-blue-600')
                                : (isDark ? 'bg-[#021019] border-[#00eaff33] text-[#9fe9ff] hover:bg-[#0a2a3a]' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100')
                            }`}
                          >
                            <div className="text-2xl mb-1">🇮🇩</div>
                            <div className="text-xs">Bahasa</div>
                          </button>
                          <button
                            onClick={() => { setLang('en'); info('English selected', 2000); }}
                            className={`p-3 rounded-xl border transition-all ${
                              lang === 'en' 
                                ? (isDark ? 'bg-[#00eaff22] border-[#00eaff] text-[#00eaff]' : 'bg-blue-100 border-blue-500 text-blue-600')
                                : (isDark ? 'bg-[#021019] border-[#00eaff33] text-[#9fe9ff] hover:bg-[#0a2a3a]' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100')
                            }`}
                          >
                            <div className="text-2xl mb-1">🇬🇧</div>
                            <div className="text-xs">English</div>
                          </button>
                          <button
                            onClick={() => { setLang('zh'); info('中文已选择', 2000); }}
                            className={`p-3 rounded-xl border transition-all ${
                              lang === 'zh' 
                                ? (isDark ? 'bg-[#00eaff22] border-[#00eaff] text-[#00eaff]' : 'bg-blue-100 border-blue-500 text-blue-600')
                                : (isDark ? 'bg-[#021019] border-[#00eaff33] text-[#9fe9ff] hover:bg-[#0a2a3a]' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100')
                            }`}
                          >
                            <div className="text-2xl mb-1">🇨🇳</div>
                            <div className="text-xs">中文</div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* About Modal */}
            {aboutOpen && (
              <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isDark ? 'bg-black/80' : 'bg-gray-900/50'} backdrop-blur-sm animate-in fade-in duration-200`}>
                <div className={`${isDark ? 'bg-gradient-to-br from-[#021019] to-[#000814]' : 'bg-white'} rounded-2xl border ${isDark ? 'border-[#00eaff55]' : 'border-gray-200'} shadow-[0_0_50px_#00eaff33] max-w-md w-full max-h-[80vh] overflow-y-auto animate-in zoom-in-95 duration-200`}>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className={`text-xl font-bold ${titleColor}`}>{getAboutTitle()}</h2>
                      <button 
                        onClick={() => setAboutOpen(false)}
                        className={`p-2 rounded-lg ${buttonBg} ${textColor} ${buttonHover} transition-colors`}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <FadeIn>
                      <div className="space-y-4">
                        <div className="text-center">
                          <h3 className={`text-lg font-semibold ${titleColor}`}>ASISTEN OFFICER</h3>
                          <p className={`text-sm ${isDark ? 'text-[#7feaff]' : 'text-gray-500'}`}>Marine Navigation Toolkit</p>
                        </div>
                        
                        <p className={`text-sm leading-relaxed ${isDark ? 'text-[#9fe9ff]' : 'text-gray-600'}`}>
                          Complete maritime navigation toolkit with accurate calculations. Designed to assist officers on board.
                        </p>
                        
                        <div className={`space-y-2 text-xs ${isDark ? 'text-[#7feaff]' : 'text-gray-500'}`}>
                          {[
                            { icon: Compass, text: 'WMM2025 Magnetic Variation - NOAA Compliant' },
                            { icon: Anchor, text: 'CPA/TCPA Calculator with Status Indicator' },
                            { icon: Wind, text: 'Wind Calculator - Apparent ↔ True' },
                            { icon: Telescope, text: 'Sextant Altitude Corrections' },
                            { icon: BookOpen, text: 'COLREG Quick Reference' },
                            { icon: Ship, text: 'Draft Survey Calculator' },
                            { icon: Paintbrush, text: 'Paint Consumption Calculator' },
                            { icon: Sun, text: 'True Azimuth Calculator' },
                            { icon: Compass, text: 'Compass Adjustment Tool' },
                            { icon: Sun, text: 'Star Finder (Celestial Nav)' },
                            { icon: BookOpen, text: 'Logbook Reference (Sea State & Weather)' },
                          ].map(({ icon: Icon, text }, index) => (
                            <div key={index} className="flex items-center gap-2 animate-in slide-in-from-left fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                              <Icon className={`w-4 h-4 ${isDark ? 'text-[#00eaff]' : 'text-blue-500'}`} />
                              <span>{text}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className={`pt-4 border-t ${isDark ? 'border-[#00eaff33]' : 'border-gray-200'}`}>
                          <p className={`text-xs text-center ${isDark ? 'text-[#666]' : 'text-gray-400'}`}>
                            Version 3.1 | WMM2025 | Offline<br />
                            Developer: Mr. Wahid © {new Date().getFullYear()}
                          </p>
                        </div>
                      </div>
                    </FadeIn>
                  </div>
                </div>
              </div>
            )}

            {/* Main Content */}
            <main className="p-4 pb-20">
              <FadeIn key={currentPage} duration={300}>
                {renderPage()}
              </FadeIn>
            </main>

            {/* Footer */}
            <footer className={`fixed bottom-0 left-0 right-0 ${isDark ? 'bg-[#021019]/95' : 'bg-white/95'} backdrop-blur-md border-t ${borderColor} py-3 px-4 transition-colors duration-300`}>
              <div className="flex items-center justify-center gap-4 text-xs">
                <span className={isDark ? 'text-[#7feaff]' : 'text-gray-500'}>Developer: Mr. Wahid</span>
                <span className="text-[#00ff7b]">©</span>
                <span className={isDark ? 'text-[#999]' : 'text-gray-400'}>{new Date().getFullYear()}</span>
              </div>
            </footer>
          </div>
        </ToastContext.Provider>
      </ThemeContext.Provider>
    </LanguageContext.Provider>
  );
}

// Helper function for menu labels
function getMenuLabel(key: string, lang: Language): string {
  const labels: Record<string, Record<Language, string>> = {
    home: { id: 'Beranda', en: 'Home', zh: '首页' },
    magvar: { id: 'Variasi Magnetik', en: 'Magnetic Var', zh: '磁差' },
    cpa: { id: 'CPA / TCPA', en: 'CPA / TCPA', zh: 'CPA / TCPA' },
    eta: { id: 'Kalkulator ETA', en: 'ETA Calc', zh: 'ETA计算器' },
    wind: { id: 'Kalkulator Angin', en: 'Wind Calc', zh: '风力计算器' },
    sextant: { id: 'Sekstan', en: 'Sextant', zh: '六分仪' },
    colreg: { id: 'COLREG', en: 'COLREG', zh: 'COLREG' },
    draft: { id: 'Draft Survey', en: 'Draft Survey', zh: '吃水测量' },
    paint: { id: 'Kalkulator Cat', en: 'Paint Calc', zh: '油漆计算器' },
    azimuth: { id: 'Azimut Matahari', en: 'True Azimuth', zh: '真方位' },
    compass: { id: 'Kalibrasi Kompas', en: 'Compass Adj', zh: '罗盘校准' },
    star: { id: 'Pencari Bintang', en: 'Star Finder', zh: '星图' },
    logbook: { id: 'Referensi Logbook', en: 'Logbook Ref', zh: '日志参考' },
  };
  return labels[key]?.[lang] || key;
}

// Home Page Component
function HomePage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { lang } = useLanguage();
  const { isDark } = useTheme();
  
  const menuItems = [
    { id: 'magvar' as Page, label: getMenuLabel('magvar', lang), icon: Compass },
    { id: 'cpa' as Page, label: getMenuLabel('cpa', lang), icon: Anchor },
    { id: 'eta' as Page, label: getMenuLabel('eta', lang), icon: Clock },
    { id: 'wind' as Page, label: getMenuLabel('wind', lang), icon: Wind },
    { id: 'sextant' as Page, label: getMenuLabel('sextant', lang), icon: Telescope },
    { id: 'colreg' as Page, label: getMenuLabel('colreg', lang), icon: BookOpen },
    { id: 'draft' as Page, label: getMenuLabel('draft', lang), icon: Ship },
    { id: 'paint' as Page, label: getMenuLabel('paint', lang), icon: Paintbrush },
    { id: 'azimuth' as Page, label: getMenuLabel('azimuth', lang), icon: Sun },
    { id: 'compass' as Page, label: getMenuLabel('compass', lang), icon: Compass },
    { id: 'star' as Page, label: getMenuLabel('star', lang), icon: Sun },
    { id: 'logbook' as Page, label: getMenuLabel('logbook', lang), icon: BookOpen },
  ];

  const getHomeTitle = () => {
    if (lang === 'id') return 'NAVIGASI MARITIM';
    if (lang === 'zh') return '航海导航';
    return 'MARINE NAVIGATION';
  };

  const getHomeSubtitle = () => {
    if (lang === 'id') return 'Toolkit Navigasi Terintegrasi';
    if (lang === 'zh') return '综合导航工具包';
    return 'Integrated Navigation Toolkit';
  };

  const getVersionText = () => {
    if (lang === 'id') return 'Versi 3.1 | WMM2025 | Offline';
    if (lang === 'zh') return '版本 3.1 | WMM2025 | 离线';
    return 'Version 3.1 | WMM2025 | Offline';
  };

  return (
    <div className="space-y-6">
      {/* Hero Image */}
      <FadeIn>
        <div className="relative">
          <div className="relative w-full max-w-md mx-auto">
            <img 
              src="/compass.jpg" 
              alt="Compass Rose"
              className="w-full rounded-2xl opacity-80"
              style={{ 
                filter: 'drop-shadow(0 0 20px rgba(0, 234, 255, 0.3))',
                mixBlendMode: isDark ? 'screen' : 'multiply'
              }}
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-[#000814]' : 'from-[#f0f4f8]'} via-transparent to-transparent rounded-2xl`} />
          </div>
        </div>
      </FadeIn>

      {/* Title */}
      <FadeIn delay={100}>
        <div className="text-center space-y-2">
          <h2 className={`text-2xl md:text-3xl font-bold tracking-wider ${isDark ? 'text-[#00eaff]' : 'text-blue-600'}`}>
            {getHomeTitle()}
          </h2>
          <p className={`text-sm md:text-base ${isDark ? 'text-[#7feaff]' : 'text-gray-500'}`}>
            {getHomeSubtitle()}
          </p>
        </div>
      </FadeIn>

      {/* Feature Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <FadeIn key={item.id} delay={150 + index * 50}>
              <button
                onClick={() => onNavigate(item.id)}
                className={`w-full p-4 rounded-xl border transition-all group hover:scale-105 active:scale-95 ${
                  isDark 
                    ? 'bg-[#021019] border-[#00eaff33] shadow-[0_0_15px_#00ffd533_inset] hover:bg-[#0a2a3a] hover:border-[#00eaff55]'
                    : 'bg-white border-gray-200 shadow-md hover:bg-gray-50 hover:border-blue-300'
                }`}
              >
                <Icon className={`w-8 h-8 mx-auto mb-2 transition-transform group-hover:scale-110 ${isDark ? 'text-[#00eaff]' : 'text-blue-500'}`} />
                <span className={`text-xs ${isDark ? 'text-[#9fe9ff]' : 'text-gray-600'}`}>{item.label}</span>
              </button>
            </FadeIn>
          );
        })}
      </div>

      {/* Version Info */}
      <FadeIn delay={800}>
        <div className={`text-center text-xs ${isDark ? 'text-[#666]' : 'text-gray-400'}`}>
          <p>{getVersionText()}</p>
        </div>
      </FadeIn>
    </div>
  );
}

export default App;
